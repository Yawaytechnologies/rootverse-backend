# Trader Portal Backend Changes

## Purpose

This update adds separate trader organization login and trader-controlled team/progress APIs. Existing quality checker, crate packer, and transport operator tables remain in use, but each record can now be linked to a trader through `trader_id`.

## Development Progress Modules

1. Authentication and Organization Setup
2. Trader Portal
3. Trader Team Management
4. Harvest Request Management
5. Quality Inspection Workflow
6. Crate Packing and QR Traceability
7. Transport Loading and Custody Transfer
8. Processor Portal
9. Processor Receiving Workflow
10. Raw Material Inventory
11. Processing Batch Creation
12. End-to-End Traceability Dashboard

## Database Changes

Migration added:

`migrations/20260601000100_create_traders_and_link_team.js`
`migrations/20260602000100_simplify_trader_details.js`

New table:

`traders`

Important fields:

- `trader_code`
- `profile_image_url`
- `company_logo_url`
- `trader_name`
- `trader_type`
- `mobile`
- `email`
- `address`
- `operational_districts`
- `years_of_experience`
- `markets`
- `is_active`

Linked existing tables:

- `quality_checker.trader_id`
- `crate_packer.trader_id`
- `transport_operators.trader_id`
- `crate_qrs.trader_id`

New progress audit table:

`trader_progress_events`

This records trader-side progress changes for entities such as crates:

- `trader_id`
- `entity_type`
- `entity_id`
- `from_status`
- `to_status`
- `actor_role`
- `actor_id`
- `remarks`

## Trader Portal Roles

### Trader Admin

- Manage trader organization profile
- Create quality inspectors
- Create crate packers
- Create transport operators
- View trader dashboard
- View trader-linked crates
- Update crate progress status
- View traceability/progress events through stored audit records

### Quality Inspector

- View assigned harvest
- Add inspection details
- Upload inspection images
- Update quality parameters
- Mark quality as verified or rejected

### Crate Packer

- View verified harvest
- Create crate records
- Add crate weight
- Add product grade
- Generate or scan crate QR

### Transport Operator

- View packed crates
- Scan crate QR during loading
- Start transport
- Update delivery status

## Status Flow

Concept status flow for the full trade workflow:

```text
HARVEST_REQUESTED
TRADER_ACCEPTED
QUALITY_INSPECTION_PENDING
QUALITY_VERIFIED / QUALITY_REJECTED
CRATE_PACKING_PENDING
CRATE_PACKED
TRANSPORT_LOADING_PENDING
LOADED_FOR_TRANSPORT
IN_TRANSIT
PROCESSOR_RECEIVING_PENDING
PROCESSOR_RECEIVED
INVENTORY_ALLOCATED
PROCESSING_BATCH_CREATED
```

Current crate APIs still use the existing `crate_qrs.custody_status` values:

```text
RECEIVED_AT_COLLECTION_CENTRE
SCHEDULED_FOR_DISPATCH
IN_TRANSIT
DELIVERED
HOLD
CANCELLED
```

## New API Files

New module:

`src/modules/traders`

Files added:

- `routes.js`
- `controller.js`
- `service.js`
- `repository.js`

Registered in:

- `src/app.js`

Auth profile support added in:

- `src/modules/auth/auth.service.js`

## Trader APIs

Base path:

`/api/traders`

### Trader signup

`POST /api/traders`

Auth:

None. Signup creates an inactive trader account until admin approval.

Body:

Use `multipart/form-data`.

Text fields:

- `trader_name`
- `trader_type`: `Individual`, `Company`, or `Partnership`
- `mobile`
- `email`
- `address`
- `operational_districts`: JSON array string or comma-separated text
- `years_of_experience`
- `markets`: `Export`, `Domestic`, or `Both`

File fields:

- `profile_image`
- `company_logo`

Images are uploaded to the configured Supabase bucket. Only the returned public URLs are stored in `profile_image_url` and `company_logo_url`.

### Admin lists traders

`GET /api/traders`

Auth:

`ADMIN` or `SUPER_ADMIN`

### Admin approves or deactivates trader

`PATCH /api/traders/:traderId/status`

Auth:

`ADMIN` or `SUPER_ADMIN`

Body:

```json
{
  "status": "approved"
}
```

Allowed status values: `approved`, `active`, `pending`, `rejected`, `inactive`.

### Trader login

`POST /api/traders/login`

Body:

```json
{
  "mobile": "9876543210"
}
```

Trader login uses mobile number only.

Returns:

- `access_token`
- `refresh_token`
- `role: TRADER_ADMIN`
- trader profile summary

### Trader profile

`GET /api/traders/me`

Auth:

`TRADER_ADMIN`

### Trader dashboard

`GET /api/traders/dashboard`

Auth:

`TRADER_ADMIN`

Returns counts for:

- quality checkers
- crate packers
- transport operators
- progress events
- trader-linked crate status summary

## Trader Team Management APIs

### Create quality checker

`POST /api/traders/quality-checkers`

Auth:

`TRADER_ADMIN`

Required body fields:

- `checker_name`
- `checker_email`
- `checker_phone`

Optional:

- `location_id`
- `checker_code`
- `is_active`

### List quality checkers

`GET /api/traders/quality-checkers`

Auth:

`TRADER_ADMIN`

### Create crate packer

`POST /api/traders/crate-packers`

Auth:

`TRADER_ADMIN`

Required body fields:

- `name`
- `phone`
- `address`
- `email`
- `date_of_birth`

Optional:

- `location_id`
- `status`

### List crate packers

`GET /api/traders/crate-packers`

Auth:

`TRADER_ADMIN`

### Create transport operator

`POST /api/traders/transport-operators`

Auth:

`TRADER_ADMIN`

Required body fields:

- `full_name`
- `email`
- `mobile`
- `transport_id`
- `vehicle_no`

Optional:

- `operator_rv_id`
- `route_name`
- `vehicle_type`
- `is_active`

### List transport operators

`GET /api/traders/transport-operators`

Auth:

`TRADER_ADMIN`

## Trader Progress APIs

### List trader crates

`GET /api/traders/crates`

Auth:

`TRADER_ADMIN`

Query filters:

- `status`
- `page`
- `page_size`

Only crates linked with `crate_qrs.trader_id` are returned.

### Update crate status

`PATCH /api/traders/crates/:crateId/status`

Auth:

`TRADER_ADMIN`

Body:

```json
{
  "status": "SCHEDULED_FOR_DISPATCH",
  "current_custodian_role": "TRADER_ADMIN",
  "current_custodian_id": "1",
  "remarks": "Ready for transport loading"
}
```

Allowed statuses:

- `RECEIVED_AT_COLLECTION_CENTRE`
- `SCHEDULED_FOR_DISPATCH`
- `IN_TRANSIT`
- `DELIVERED`
- `HOLD`
- `CANCELLED`

Every update inserts a row into `trader_progress_events`.

## Existing Auth Update

The existing phone login endpoint:

`POST /api/auth/login`

now also checks `traders.mobile` and returns a `TRADER_ADMIN` token when a trader is found.

For mobile login, use:

`POST /api/traders/login`

## Progress Order for Next Development

1. Run the new migration.
2. Sign up a trader through `POST /api/traders`.
3. Approve the trader through `PATCH /api/traders/:traderId/status`.
4. Login trader through `/api/traders/login`.
5. Create quality checkers under the trader.
6. Create crate packers under the trader.
7. Create transport operators under the trader.
8. Link newly created crate records to `crate_qrs.trader_id`.
9. Use trader crate status API to control progress.
10. Build trader dashboard screens from `/api/traders/dashboard`.
11. Add harvest request and processor modules using the full status flow.
