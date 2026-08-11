# Processor Receiving & Inventory Onboarding — Changes Document

## Purpose

Implements the **Processor Receiving Module** from the OneBlue requirements. Seafood
processors receive crates delivered by traders' transport operators, transfer Chain of
Custody to the processor, and onboard each crate into the processor's inventory in real
time. This is the step directly after **Transport Loading** in the aquaculture supply
chain:

```
Harvest → Quality Inspection → Crate Packing → Transport Loading → Processor Receiving → Processor Inventory
```

## New Role

| Role | Login | Description |
|---|---|---|
| `PROCESSOR` | mobile number (no password) | Scans incoming crate QRs, receives them, owns the resulting inventory |

Login works two ways (same as traders):
- `POST /api/processors/login` with `{ "mobile": "<number>" }`
- `POST /api/auth/login` with `{ "phone_no": "<number>" }` (unified login also detects processors)

JWT payload: `{ id, role: "PROCESSOR", processor_id, processor_code }`.

## Database Migrations (batch 75)

### `20260715000100_create_processors`
Processor facility accounts.

| Column | Type | Notes |
|---|---|---|
| `id` | increments PK | |
| `processor_code` | string UNIQUE | e.g. `PR-XXXX` |
| `processor_name` | string | |
| `contact_name` | string nullable | |
| `email` | string UNIQUE | |
| `mobile` | string UNIQUE | login identifier |
| `address` / `state` / `district` | string nullable | |
| `gps_latitude` / `gps_longitude` | decimal nullable | facility location |
| `license_no` | string nullable | |
| `is_active` | boolean default `false` | admin approves before login works |
| `created_at` / `updated_at` | timestamps | |

### `20260715000200_create_processor_inventory`
One row per received crate — serves as both the receiving record ("Data Stored") and
the inventory item ("Inventory records").

| Column | Type | Notes |
|---|---|---|
| `id` | increments PK | |
| `processor_id` | FK → `processors.id` | |
| `crate_packing_id` | FK → `aquaculture_crate_packings.id`, **UNIQUE** | prevents double-receiving |
| `transport_loading_id` | FK → `aquaculture_transport_loadings.id` nullable | proves the crate was loaded |
| `crate_qr_id` | FK → `crate_qrs.id`, UNIQUE | |
| `crate_code` | text UNIQUE | |
| `harvest_id` | FK → `aquaculture_harvests.id` | auto-fetch |
| `trader_id` | FK → `traders.id` | auto-fetch |
| `species` | text | auto-fetch |
| `size_count_kg` | double nullable | auto-fetch |
| `weight_kg` | decimal(12,3) | auto-fetch |
| `grade` | enum A/B/C/D | auto-fetch |
| `gps_latitude` / `gps_longitude` | decimal nullable | captured at scan time |
| `received_at` | timestamptz default now() | UTC receiving timestamp |
| `chain_of_custody_status` | string default `RECEIVED_BY_PROCESSOR` | |
| `inventory_status` | string default `IN_INVENTORY` | |
| `remarks` | text nullable | |
| `created_at` / `updated_at` | timestamps | |

## New Module — `src/modules/processor/`

Files: `routes.js`, `controller.js`, `service.js`, `repository.js`
Mounted at: `/api/processors`

### Account endpoints
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/processors` | public | Processor signup (inactive until approval) |
| GET | `/api/processors` | ADMIN / SUPER_ADMIN | List processors (paginated) |
| PATCH | `/api/processors/:processorId/status` | ADMIN / SUPER_ADMIN | Approve / deactivate |
| POST | `/api/processors/login` | public | Mobile login |
| GET | `/api/processors/me` | PROCESSOR | Own profile |
| GET | `/api/processors/dashboard` | PROCESSOR (or ADMIN w/ `processor_id`) | Inventory summary counts |

### Receiving & inventory endpoints
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/processors/receiving/scan` | PROCESSOR (or ADMIN w/ `processor_id`) | Scan crate QR → receive + add to inventory |
| GET | `/api/processors/inventory` | PROCESSOR (or ADMIN w/ `processor_id`) | List own inventory (`?status=`, `?page=`, `?page_size=`) |
| GET | `/api/processors/inventory/:crateCode` | PROCESSOR (or ADMIN w/ `processor_id`) | Single crate detail |

## Scan Flow & Validation Rules

`POST /api/processors/receiving/scan` body: `{ crate_qr, gps_latitude?, gps_longitude?, remarks? }`

Validations enforced (spec §9), all inside a DB transaction:
1. **Crate QR exists** — resolved from `aquaculture_crate_packings` by `crate_code` → 404 if missing.
2. Crate QR is an aquaculture crate (`crate_qrs.type === 'A'`).
3. **Crate has been loaded for transport** — a transport-loading record exists and
   `packing_status === 'LOADED'` → 422 otherwise.
4. **Not already received by another processor** — no existing `processor_inventory`
   row for the crate → 409 otherwise.

On success:
- Inserts the `processor_inventory` row (auto-fetched crate fields + captured GPS + UTC `received_at`).
- Sets `aquaculture_crate_packings.packing_status = 'RECEIVED_BY_PROCESSOR'`.
- Sets `aquaculture_transport_loadings.chain_of_custody_status = 'RECEIVED_BY_PROCESSOR'`.
- Appends a Chain-of-Custody event to `trader_progress_events`
  (`entity_type = 'PROCESSOR_RECEIVING'`, `from_status = 'LOADED'`, `to_status = 'RECEIVED_BY_PROCESSOR'`, `actor_role = 'PROCESSOR'`).

## Access Control (spec §3)

- A `PROCESSOR` token only ever reads/writes its own inventory — `processor_id` is taken
  from the JWT and can never be overridden by a processor.
- `ADMIN` / `SUPER_ADMIN` have full visibility and act on behalf of a processor by passing
  `processor_id` (query for reads, body for the scan).
- No manual crate entry — inventory is only created through a successful QR scan.

## Modified Existing Files

- `src/modules/auth/auth.service.js` — `loginService` now detects `processors.mobile`
  (returns a `PROCESSOR` token); `getMeService` handles the `PROCESSOR` role.
- `src/app.js` — imports and mounts `processorRoutes` at `/api/processors`.

## Verification

- All new/modified files pass `node --check`.
- `import('./src/app.js')` resolves cleanly; Swagger builds (163 paths).
- `npx knex migrate:latest` ran both migrations (batch 75); table columns verified.
