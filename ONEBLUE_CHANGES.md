# OneBlue Backend — Changes & Implementation Document

**Branch:** `SCRUM-36-Login-authentication-for-Rootverse`
**Date:** March 2026
**Scope:** Fisheries supply chain (OneBlue) extension added to the existing RootVerse backend

---

## 1. Overview

The existing RootVerse backend (owner/farm/pond/vessel management) was extended to support the **OneBlue fisheries supply chain** workflow. This adds two new operator roles, a full crate custody tracking system, and admin monitoring tools — all integrated into the existing modules without creating a separate API version.

### New Roles Added
| Role | Description |
|---|---|
| `COLLECTION_CENTRE_OPERATOR` | Receives crates, logs temperature, schedules dispatch |
| `TRANSPORT_OPERATOR` | Picks up crates, logs temperature in transit, records delivery |

### Crate Custody Status Flow
```
(no status)
    ↓  receive at centre
RECEIVED_AT_COLLECTION_CENTRE
    ↓  assign dispatch
SCHEDULED_FOR_DISPATCH
    ↓  transport picks up
IN_TRANSIT
    ↓  transport delivers
DELIVERED

Exceptions (admin override): HOLD | CANCELLED
```

---

## 2. Database Migrations (7 new, batch 51)

### `20260320000001_create_collection_centres`
New table for physical collection centres.

| Column | Type | Notes |
|---|---|---|
| `id` | increments (PK) | |
| `centre_id` | string UNIQUE | e.g. `CC-001` |
| `centre_name` | string | |
| `district` | string | |
| `state` | string | |
| `address_line_1` | string | |
| `address_line_2` | string nullable | |
| `pincode` | string nullable | |
| `gps_lat` / `gps_lng` | decimal(10,7) nullable | |
| `cold_storage_capacity_kg` | float nullable | |
| `contact_name` / `contact_mobile` | string nullable | |
| `status` | enum `ACTIVE\|INACTIVE` | default `ACTIVE` |
| `created_at` / `updated_at` | timestamps | |

---

### `20260320000002_create_collection_centre_operators`
Operator accounts for collection centres.

| Column | Type | Notes |
|---|---|---|
| `id` | increments (PK) | |
| `operator_rv_id` | string UNIQUE | e.g. `RV-CC-001` |
| `full_name` | string | |
| `email` | string | |
| `mobile` | string | |
| `password_hash` | string | bcrypt hashed |
| `centre_id` | string FK → `collection_centres.centre_id` | |
| `designation` | string nullable | |
| `is_active` | boolean | default `true` |
| `created_at` / `updated_at` | timestamps | |

---

### `20260320000003_create_transport_operators`
Operator accounts for transport vehicles.

| Column | Type | Notes |
|---|---|---|
| `id` | increments (PK) | |
| `operator_rv_id` | string UNIQUE | e.g. `RV-TR-001` |
| `full_name` | string | |
| `email` | string | |
| `mobile` | string | |
| `password_hash` | string | bcrypt hashed |
| `transport_id` | string | vehicle/fleet ID |
| `vehicle_no` | string | registration number |
| `route_name` | string nullable | |
| `vehicle_type` | string nullable | |
| `is_active` | boolean | default `true` |
| `created_at` / `updated_at` | timestamps | |

---

### `20260320000004_alter_crate_qrs_oneblue`
New columns added to existing `crate_qrs` table.

| Column | Type | Notes |
|---|---|---|
| `custody_status` | string nullable | The status flow value |
| `production_category` | string nullable | `WILD_CAPTURE\|AQUACULTURE\|MARICULTURE` — resolved from crate `type` at receive time (W→WILD_CAPTURE, A→AQUACULTURE, M→MARICULTURE) |
| `current_custodian_role` | string nullable | Role of whoever currently holds the crate |
| `current_custodian_id` | string nullable | ID of the current custodian (centre_id or transport_id) |
| `received_centre_id` | string nullable | Centre that first received the crate (persists after pickup) |

---

### `20260320000005_create_crate_status_history`
**Immutable audit trail** — every status change appended, never overwritten.

| Column | Type | Notes |
|---|---|---|
| `event_id` | uuid PK | `gen_random_uuid()` |
| `crate_id` | bigint FK → `crate_qrs.id` | CASCADE delete |
| `crate_qr_code` | text nullable | |
| `from_status` | string nullable | null on first receive |
| `to_status` | string | |
| `actor_role` | string | `ADMIN\|COLLECTION_CENTRE_OPERATOR\|TRANSPORT_OPERATOR` |
| `actor_id` | string | operator_rv_id or admin id |
| `centre_or_transport_id` | string nullable | |
| `gps_lat` / `gps_lng` | decimal(10,7) nullable | |
| `event_at_utc` | timestamptz | default now() |
| `remarks` | text nullable | |

Index: `(crate_id, event_at_utc)`

---

### `20260320000006_create_crate_assignments`
Dispatch records — one per dispatch event.

| Column | Type | Notes |
|---|---|---|
| `id` | increments (PK) | |
| `crate_id` | bigint FK → `crate_qrs.id` | |
| `destination_name` | string | |
| `transport_operator_id` | string | operator_rv_id |
| `transport_id` | string nullable | |
| `scheduled_time_utc` | timestamptz | |
| `assigned_to_label` | string nullable | |
| `driver_name` | string | |
| `vehicle_no` | string | |
| `notes` | text nullable | |
| `assigned_by_operator_id` | string | CC operator who created the dispatch |
| `centre_id` | string | originating centre |
| `picked_up_at_utc` | timestamptz nullable | set on scan-pickup |
| `pickup_gps_lat` / `pickup_gps_lng` | decimal(10,7) nullable | |
| `delivered_at_utc` | timestamptz nullable | set on delivery |
| `created_at` / `updated_at` | timestamps | |

Index: `(transport_operator_id, scheduled_time_utc)`

---

### `20260320000007_create_temperature_logs`
Cold chain temperature records.

| Column | Type | Notes |
|---|---|---|
| `id` | increments (PK) | |
| `crate_id` | bigint FK → `crate_qrs.id` | |
| `actor_role` | string | `COLLECTION_CENTRE_OPERATOR\|TRANSPORT_OPERATOR` |
| `actor_id` | string | operator_rv_id |
| `temperature_value` | string | stored as string to preserve units/precision |
| `centre_or_transport_id` | string nullable | |
| `recorded_at_utc` | timestamptz | default now() |
| `notes` | text nullable | |

Index: `(crate_id, recorded_at_utc)`

---

## 3. New Modules

### `src/modules/collection_centre/`

**Files:** `routes.js`, `controller.js`, `service.js`, `repository.js`
**Mounted at:** `/api/collection-centre`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/dashboard` | CC_OP | Summary stats for the operator's centre (total, received, scheduled, in_transit, delivered) |
| GET | `/crates` | CC_OP | List crates belonging to this centre. Query: `?date=`, `?status=` |
| POST | `/crates/receive` | CC_OP | Receive a crate by QR code. Body: `crate_qr`, optional `production_category`, `gps_lat/lng`, `notes`. `centre_id` and `operator_id` auto-injected from JWT |
| GET | `/crates/:crateId` | CC_OP | Full crate detail with status history, assignment, temperature logs |
| POST | `/crates/:crateId/temperature` | CC_OP | Log a temperature reading. Body: `temperature_value`, optional `notes`. `collection_centre_id` and `operator_id` auto-injected from JWT |
| POST | `/crates/:crateId/assign-dispatch` | CC_OP | Assign crate to a transport operator. Body: `destination_name`, `transport_operator_id`, `scheduled_time_utc`, `driver_name`, `vehicle_no`, optional `transport_id`, `notes`. Validates crate is `RECEIVED_AT_COLLECTION_CENTRE` and transport operator exists |

> **Login:** Use `POST /api/auth/login` with `{ "phone_no": "<mobile>" }` — same as all other roles. No password required.

**Business rules enforced:**
- Cannot receive a crate that is `IN_TRANSIT` or `DELIVERED`
- Cannot dispatch a crate that is not `RECEIVED_AT_COLLECTION_CENTRE`
- Can only dispatch crates that belong to this centre (403 if custodian mismatch)
- `production_category` auto-resolved from crate `type` field (W/A/M) if not provided

---

### `src/modules/transport_operator/`

**Files:** `routes.js`, `controller.js`, `service.js`, `repository.js`
**Mounted at:** `/api/transport`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/dashboard` | TR_OP | Summary stats for the operator (assigned, in_transit, delivered counts) |
| GET | `/assigned-crates` | TR_OP | Crates assigned to this operator in `SCHEDULED_FOR_DISPATCH` status |
| GET | `/in-transit` | TR_OP | Crates currently `IN_TRANSIT` with this operator |
| POST | `/crates/scan-pickup` | TR_OP | Scan crate QR to accept pickup. Body: `crate_qr`. Validates crate is `SCHEDULED_FOR_DISPATCH` and assigned to this operator (409 if not) |
| POST | `/crates/:crateId/temperature` | TR_OP | Log temperature in transit. Body: `temperature_value`, optional `notes`. Validates crate is `IN_TRANSIT` |
| POST | `/crates/:crateId/deliver` | TR_OP | Mark crate as delivered. Body: optional `gps_lat/lng`, `receiver_name`, `remarks`. Validates crate is `IN_TRANSIT` |

> **Login:** Use `POST /api/auth/login` with `{ "phone_no": "<mobile>" }` — same as all other roles. No password required.

**Business rules enforced:**
- Can only scan pickup crates assigned to this specific operator (409 otherwise)
- Can only log temperature for `IN_TRANSIT` crates
- Can only deliver `IN_TRANSIT` crates

---

## 4. Modified Existing Modules

### `src/modules/auth/`

**`auth.service.js`**
- `loginService`: Unified login for all roles via `phone_no`. Lookup order:
  1. `rootverse_users` (OWNER) — requires `verification_status = VERIFIED`
  2. `quality_checker` (QUALITY_CHECKER)
  3. `crate_packer` (CRATE_PACKER)
  4. `collection_centre_operators` by `mobile` (COLLECTION_CENTRE_OPERATOR) — checks `is_active`
  5. `transport_operators` by `mobile` (TRANSPORT_OPERATOR) — checks `is_active`
- `getMeService`: Handles all roles including COLLECTION_CENTRE_OPERATOR and TRANSPORT_OPERATOR

**`auth.routes.js`**
- Added `GET /api/auth/me` — returns profile for any authenticated role
- Added `POST /api/auth/refresh` — issues new access token from a valid refresh token
- Added `POST /api/auth/logout` — stateless logout (client discards token)

**`auth/utils/token.js`**
- `signToken(payload, expiresIn)` — added optional `expiresIn` parameter (default `30d`) to support refresh tokens with shorter TTL

---

### `src/modules/admin/`

**`admin.service.js` + `admin.controller.js` + `admin.router.js` + `admin.model.js`**

Extended with 14 new endpoints:

**Collection Centre Management** (`/api/admin/collection-centres`)
| Method | Path | Description |
|---|---|---|
| POST | `/collection-centres` | Create a new collection centre |
| GET | `/collection-centres` | List all centres (paginated, `?page=`, `?page_size=`) |
| GET | `/collection-centres/:centreId` | Get centre detail |
| PATCH | `/collection-centres/:centreId` | Update centre fields |

**Operator Registration** (`/api/admin/operators`)
| Method | Path | Description |
|---|---|---|
| POST | `/operators/collection-centre` | Register a CC operator (hashes password) |
| POST | `/operators/transport` | Register a transport operator (hashes password) |
| PATCH | `/operators/:operatorId/status` | Activate/deactivate an operator (`status: active\|inactive`) |

**Monitoring** (`/api/admin/...`)
| Method | Path | Description |
|---|---|---|
| GET | `/dashboard/summary` | Total counts for centres, operators, crate status breakdown. Query: `?date=` |
| GET | `/crates` | All crates with filters (`?status=`, `?date=`, `?centre_id=`, `?transport_operator_id=`) |
| GET | `/crates/:crateId` | Full crate detail (same as CC operator view) |
| PATCH | `/crates/:crateId/status` | Override any crate's status. Body: `new_status`, `reason_code`, `reason_text`, `admin_id` |
| GET | `/assignments` | All dispatch assignments. Filters: `?date=`, `?transport_operator_id=` |
| GET | `/temperature-logs` | All temperature logs. Filter: `?role=` |
| GET | `/users` | List operators. Filter: `?role=COLLECTION_CENTRE_OPERATOR\|TRANSPORT_OPERATOR` |

**Admin login updated:**
- Now accepts `login_id` (email or phone) OR legacy `email` field
- Returns full auth response: `{ access_token, refresh_token, token_type, role, user }`
- JWT payload now includes `role: "ADMIN"`

---

### `src/shared/middlewares/auth.middleware.js`

- Added `requireRole(...roles)` middleware export
  - Verifies Bearer JWT
  - Checks `decoded.role` is in the allowed roles list
  - Returns `{ error: "MISSING_OR_BAD_AUTH_HEADER" }` (401) or `{ error: "INSUFFICIENT_PERMISSIONS" }` (403)
  - Error format aligned with existing `requireAuth` middleware

---

### `src/modules/farm/routes.js` + `src/modules/pond/routes.js`

- **Bug fix:** Moved `GET /code/:code` registration before `GET /:id` in both files. Express was matching `/:id` first, making the code lookup route unreachable.

---

### `src/config/swagger.docs.js` + `src/config/swagger.js`

- API title updated to "RootVerse / OneBlue Backend API", version 2.0.0
- Added 28 new endpoint docs across 4 new tags: Auth (new endpoints), Collection Centre, Transport, Admins (extended)
- Added 12 new component schemas: `AdminLoginRequest`, `AdminLoginResponse`, `OperatorLoginRequest`, `OperatorLoginResponse`, `CollectionCentre`, `CrateStatusHistory`, `TemperatureLog`, `CrateAssignment`, `CrateDetail`, `OneBlueSuccess`
- Fixed existing schema mismatches:
  - `Owner` schema: corrected field names (`username` not `name`, `address` not `email`, `profile_picture_url` not `profile_image_url`)
  - `CreateOwnerRequest`: updated required fields to `[username, phone_no, rootverse_type, address]`
  - `GET /api/owner/{rootverse_type}`: corrected response schema to match actual wrapped response `{ rootverse_type, total, progress, users }`

---

## 5. Shared Utilities

### `src/shared/utils/response.js` *(new file)*
Response helper used by collection centre and transport operator controllers:

```js
ok(res, data, message, statusCode)   // 200 { success, message, data }
created(res, data, message)          // 201
fail(res, message, statusCode)       // error response
```

> **Note:** After pattern alignment with admin/super_admin style, controllers were rewritten to use inline `res.status().json()` instead of these helpers. The file remains for any future use.

---

## 6. API Summary — All New Endpoints

### Auth (`/api/auth`)
```
POST /api/auth/login        → login for ALL roles via { phone_no }. Returns { token }
GET  /api/auth/me           → profile for any authenticated user
POST /api/auth/refresh      → exchange refresh_token for new access_token
POST /api/auth/logout       → stateless logout
```

### Admin (`/api/admin`)
```
POST  /api/admin/collection-centres              → create centre
GET   /api/admin/collection-centres              → list centres
GET   /api/admin/collection-centres/:centreId    → get centre
PATCH /api/admin/collection-centres/:centreId    → update centre
POST  /api/admin/operators/collection-centre     → register CC operator (no password needed)
POST  /api/admin/operators/transport             → register transport operator (no password needed)
PATCH /api/admin/operators/:operatorId/status    → activate/deactivate operator
GET   /api/admin/dashboard/summary               → platform-wide stats
GET   /api/admin/crates                          → all crates (filtered)
GET   /api/admin/crates/:crateId                 → crate detail
PATCH /api/admin/crates/:crateId/status          → admin override crate status
GET   /api/admin/assignments                     → all dispatch assignments
GET   /api/admin/temperature-logs               → all temperature logs
GET   /api/admin/users                           → list all operators
```

### Collection Centre (`/api/collection-centre`)
```
GET  /api/collection-centre/dashboard                      → stats
GET  /api/collection-centre/crates                         → crates at this centre
POST /api/collection-centre/crates/receive                 → receive crate by QR
GET  /api/collection-centre/crates/:crateId                → crate detail
POST /api/collection-centre/crates/:crateId/temperature    → log temperature
POST /api/collection-centre/crates/:crateId/assign-dispatch → schedule dispatch
```

### Transport Operator (`/api/transport`)
```
GET  /api/transport/dashboard                   → stats
GET  /api/transport/assigned-crates             → assigned but not picked up
GET  /api/transport/in-transit                  → currently in transit
POST /api/transport/crates/scan-pickup          → confirm pickup by QR scan
POST /api/transport/crates/:crateId/temperature → log temperature in transit
POST /api/transport/crates/:crateId/deliver     → confirm delivery
```

---

## 7. JWT Token Payloads by Role

| Role | `id` field | Additional claims |
|---|---|---|
| `OWNER` | `owner_id` (e.g. OWN-0001) | — |
| `QUALITY_CHECKER` | `checker_code` | — |
| `CRATE_PACKER` | `code` | — |
| `ADMIN` | DB integer id | `role: "ADMIN"` |
| `COLLECTION_CENTRE_OPERATOR` | DB integer id | `role`, `centre_id`, `operator_rv_id` |
| `TRANSPORT_OPERATOR` | DB integer id | `role`, `transport_id`, `operator_rv_id` |

---

## 8. Swagger / OpenAPI

- **URL:** `http://localhost:5000/api-docs`
- **Spec JSON:** `http://localhost:5000/api-docs.json`
- **Total paths documented:** 97
- **Component schemas:** 42
- All `$ref` links validated — zero broken references

---

## 9. Bugs Fixed in Existing Code

| File | Bug | Fix |
|---|---|---|
| `auth/auth.service.js` | JWT tokens for OWNER, QUALITY_CHECKER, CRATE_PACKER had no `role` field — `/me` always threw "Profile not found" | Added `role` to each `signToken` call |
| `auth/auth.service.js` | `getMeService` had no handlers for OWNER, QUALITY_CHECKER, CRATE_PACKER | Added DB lookup for each role |
| `collection_centre/controller.js` | `centre_id` never injected from JWT in `receiveCrate`, `logTemperature`, `assignDispatch` — service always threw validation error | Inject `centre_id` from `req.user.centre_id` |
| `collection_centre/service.js` | No ownership check in `assignDispatch` — any centre could dispatch any crate | Added 403 if `body.centre_id !== crate.current_custodian_id` |
| `collection_centre/repository.js` | Dashboard `pending` stat double-counted `RECEIVED_AT_COLLECTION_CENTRE` crates | Replaced with accurate `scheduled_for_dispatch`, `in_transit`, `delivered` breakdown |
| `farm/routes.js` + `pond/routes.js` | `GET /code/:code` registered after `GET /:id` — Express matched `:id` first, code route unreachable | Moved specific routes before wildcard params |
| `swagger.docs.js` | Owner schema used wrong field names (`name`, `email`, `profile_image_url`) | Corrected to `username`, `address`, `profile_picture_url` |
