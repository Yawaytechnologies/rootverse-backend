/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Something went wrong
 *
 *     SuccessMessage:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *
 *     # ── Auth ──────────────────────────────────────────────────────────────
 *     LoginRequest:
 *       type: object
 *       required: [phone_no]
 *       properties:
 *         phone_no:
 *           type: string
 *           example: "9876543210"
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     # ── Owner ─────────────────────────────────────────────────────────────
 *     Owner:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         owner_id:
 *           type: string
 *           example: OWN-0001
 *         name:
 *           type: string
 *         phone_no:
 *           type: string
 *         email:
 *           type: string
 *         rootverse_type:
 *           type: string
 *           enum: [WILD_CAPTURE, AQUACULTURE, MARICULTURE]
 *         verification_status:
 *           type: string
 *           enum: [PENDING, VERIFIED, REJECTED]
 *         owner_register_progress:
 *           type: string
 *         state_id:
 *           type: integer
 *         district_id:
 *           type: integer
 *         location_id:
 *           type: integer
 *         state_name:
 *           type: string
 *         district_name:
 *           type: string
 *         location_name:
 *           type: string
 *         profile_image_url:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     CreateOwnerRequest:
 *       type: object
 *       required: [name, phone_no, rootverse_type]
 *       properties:
 *         name:
 *           type: string
 *         phone_no:
 *           type: string
 *         email:
 *           type: string
 *         rootverse_type:
 *           type: string
 *           enum: [WILD_CAPTURE, AQUACULTURE, MARICULTURE]
 *         state_id:
 *           type: integer
 *         district_id:
 *           type: integer
 *         location_id:
 *           type: integer
 *         profileImage:
 *           type: string
 *           format: binary
 *
 *     # ── Country ───────────────────────────────────────────────────────────
 *     Country:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *           example: India
 *         code:
 *           type: string
 *           example: IN
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     # ── State ─────────────────────────────────────────────────────────────
 *     State:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *           example: Tamil Nadu
 *         country_id:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     # ── District ──────────────────────────────────────────────────────────
 *     District:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *           example: Chennai
 *         state_id:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     # ── Location ──────────────────────────────────────────────────────────
 *     Location:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         district_id:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     # ── Fish Type ─────────────────────────────────────────────────────────
 *     FishType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         fish_name:
 *           type: string
 *         fish_code:
 *           type: string
 *         fish_type_url:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     # ── Fishing Method ────────────────────────────────────────────────────
 *     FishingMethod:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         method_name:
 *           type: string
 *         method_code:
 *           type: string
 *         image_url:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     # ── Vessel ────────────────────────────────────────────────────────────
 *     Vessel:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         rv_vessel_id:
 *           type: string
 *           example: RV-VES-TN-000001
 *         owner_id:
 *           type: integer
 *         govt_registration_number:
 *           type: string
 *         local_identifier:
 *           type: string
 *         vessel_name:
 *           type: string
 *         home_port:
 *           type: string
 *         vessel_type:
 *           type: string
 *         fishing_license_no:
 *           type: string
 *         crew_capacity_max:
 *           type: integer
 *         storage_capacity_kg:
 *           type: number
 *         engine_power_hp:
 *           type: number
 *         fuel_type:
 *           type: string
 *         approval_status:
 *           type: string
 *           enum: [PENDING, APPROVED]
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     CreateVesselRequest:
 *       type: object
 *       required: [govt_registration_number, vessel_name, home_port, vessel_type]
 *       properties:
 *         owner_id:
 *           type: integer
 *         govt_registration_number:
 *           type: string
 *         local_identifier:
 *           type: string
 *         vessel_name:
 *           type: string
 *         home_port:
 *           type: string
 *         vessel_type:
 *           type: string
 *         fishing_license_no:
 *           type: string
 *         crew_capacity_max:
 *           type: integer
 *         storage_capacity_kg:
 *           type: number
 *         engine_power_hp:
 *           type: number
 *         fuel_type:
 *           type: string
 *         approval_status:
 *           type: string
 *           enum: [PENDING, APPROVED]
 *
 *     # ── Trip Plan ─────────────────────────────────────────────────────────
 *     TripPlan:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         trip_id:
 *           type: string
 *         owner_code:
 *           type: string
 *         vessel_id:
 *           type: integer
 *         location_id:
 *           type: integer
 *         fishing_method_id:
 *           type: integer
 *         fish_species:
 *           type: integer
 *         diesel:
 *           type: number
 *         ice:
 *           type: number
 *         qr_count:
 *           type: integer
 *         total:
 *           type: number
 *         approval_status:
 *           type: string
 *           enum: [pending, approved, complete]
 *         location_name:
 *           type: string
 *         method_name:
 *           type: string
 *         fish_name:
 *           type: string
 *         vessel_name:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     CreateTripRequest:
 *       type: object
 *       required: [owner_code, vessel_id, location_id, fishing_method_id, fish_species]
 *       properties:
 *         owner_code:
 *           type: string
 *         vessel_id:
 *           type: integer
 *         location_id:
 *           type: integer
 *         fishing_method_id:
 *           type: integer
 *         fish_species:
 *           type: integer
 *         diesel:
 *           type: number
 *         ice:
 *           type: number
 *         qr_count:
 *           type: integer
 *
 *     # ── QR Code ───────────────────────────────────────────────────────────
 *     QrCode:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         code:
 *           type: string
 *         type:
 *           type: string
 *           enum: [WILD_CAPTURE, AQUACULTURE, MARICULTURE]
 *         status:
 *           type: string
 *           enum: [NEW, FILLED]
 *         qc_status:
 *           type: string
 *           enum: [PENDING, CHECKED]
 *         owner_id:
 *           type: integer
 *         rv_vessel_id:
 *           type: string
 *         fish_id:
 *           type: integer
 *         trip_id:
 *           type: integer
 *         date:
 *           type: string
 *           format: date
 *         time:
 *           type: string
 *         latitude:
 *           type: number
 *         longitude:
 *           type: number
 *         weight:
 *           type: number
 *         qc_result:
 *           type: string
 *           enum: [PASS, HOLD, REJECT]
 *         quality_grade:
 *           type: string
 *           enum: [A, B, C, REJECTED]
 *         qc_score:
 *           type: integer
 *         temperature_c:
 *           type: number
 *         size:
 *           type: string
 *           enum: [SMALL, MEDIUM, LARGE]
 *         damage:
 *           type: string
 *           enum: [NONE, MINOR, MODERATE, SEVERE]
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     BulkReserveRequest:
 *       type: object
 *       required: [type, count]
 *       properties:
 *         type:
 *           type: string
 *           enum: [WILD_CAPTURE, AQUACULTURE, MARICULTURE]
 *         count:
 *           type: integer
 *           example: 10
 *         locationId:
 *           type: integer
 *         methodId:
 *           type: integer
 *
 *     # ── Quality Checker ───────────────────────────────────────────────────
 *     QualityChecker:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         checker_name:
 *           type: string
 *         checker_email:
 *           type: string
 *         checker_phone:
 *           type: string
 *         checker_code:
 *           type: string
 *         state_id:
 *           type: integer
 *         state_name:
 *           type: string
 *         district_id:
 *           type: integer
 *         district_name:
 *           type: string
 *         location_id:
 *           type: integer
 *         location_name:
 *           type: string
 *         is_active:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     CreateQualityCheckerRequest:
 *       type: object
 *       required: [checker_name, checker_phone, state_id, district_id, location_id]
 *       properties:
 *         checker_name:
 *           type: string
 *         checker_email:
 *           type: string
 *         checker_phone:
 *           type: string
 *         state_id:
 *           type: integer
 *         district_id:
 *           type: integer
 *         location_id:
 *           type: integer
 *         is_active:
 *           type: boolean
 *
 *     # ── Admin ─────────────────────────────────────────────────────────────
 *     Admin:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *         date_of_birth:
 *           type: string
 *           format: date
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     CreateAdminRequest:
 *       type: object
 *       required: [username, email, password]
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *         date_of_birth:
 *           type: string
 *           format: date
 *
 *     AdminLoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *
 *     # ── Crate QR ──────────────────────────────────────────────────────────
 *     CrateQr:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         code:
 *           type: string
 *         type:
 *           type: string
 *         district_id:
 *           type: integer
 *         status:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     CreateCrateQrBatchRequest:
 *       type: object
 *       required: [count, type]
 *       properties:
 *         count:
 *           type: integer
 *           example: 50
 *         type:
 *           type: string
 *           example: WILD_CAPTURE
 *         districtId:
 *           type: integer
 *
 *     # ── Crate Packer ──────────────────────────────────────────────────────
 *     CratePacker:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         code:
 *           type: string
 *         name:
 *           type: string
 *         phone:
 *           type: string
 *         location_id:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     CreateCratePackerRequest:
 *       type: object
 *       required: [name, phone]
 *       properties:
 *         name:
 *           type: string
 *         phone:
 *           type: string
 *         location_id:
 *           type: integer

 *
 *     # ── Farm ──────────────────────────────────────────────────────────────
 *     Farm:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         owner_id:
 *           type: integer
 *           example: 12
 *         owner_name:
 *           type: string
 *           example: Ravi Kumar
 *         name:
 *           type: string
 *           example: Green Aqua Farm
 *         location_id:
 *           type: integer
 *           example: 5
 *         district_id:
 *           type: integer
 *           example: 7
 *         state_id:
 *           type: integer
 *           example: 3
 *         country_id:
 *           type: integer
 *           example: 1
 *         location_code:
 *           type: string
 *           example: LOC-001
 *         district_code:
 *           type: string
 *           example: DIS-001
 *         state_code:
 *           type: string
 *           example: ST-001
 *         country_code:
 *           type: string
 *           example: IN
 *         farm_code:
 *           type: string
 *           nullable: true
 *           example: FARM-000001
 *         total_area:
 *           type: number
 *           format: float
 *           example: 12.5
 *         pond_count:
 *           type: integer
 *           example: 4
 *         water_source:
 *           type: string
 *           example: Borewell
 *         farm_address:
 *           type: string
 *           example: No.12, East Coast Road, Chennai
 *         latitude:
 *           type: number
 *           format: float
 *           example: 13.0827
 *         longitude:
 *           type: number
 *           format: float
 *           example: 80.2707
 *         image_url:
 *           type: string
 *           example: https://example.com/farms/farm1.jpg
 *         image_key:
 *           type: string
 *           example: farms/1710000000-farm.jpg
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           example: pending
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     CreateFarmRequest:
 *       type: object
 *       required:
 *         - name
 *         - location_id
 *         - owner_id
 *         - total_area
 *         - water_source
 *         - farm_address
 *         - country_id
 *         - state_id
 *         - district_id
 *         - pond_count
 *         - latitude
 *         - longitude
 *         - image
 *       properties:
 *         name:
 *           type: string
 *           example: Green Aqua Farm
 *         location_id:
 *           type: integer
 *           example: 5
 *         owner_id:
 *           type: integer
 *           example: 12
 *         total_area:
 *           type: number
 *           format: float
 *           example: 12.5
 *         water_source:
 *           type: string
 *           example: Borewell
 *         farm_address:
 *           type: string
 *           example: No.12, East Coast Road, Chennai
 *         country_id:
 *           type: integer
 *           example: 1
 *         state_id:
 *           type: integer
 *           example: 3
 *         district_id:
 *           type: integer
 *           example: 7
 *         pond_count:
 *           type: integer
 *           example: 4
 *         latitude:
 *           type: number
 *           format: float
 *           example: 13.0827
 *         longitude:
 *           type: number
 *           format: float
 *           example: 80.2707
 *         image:
 *           type: string
 *           format: binary
 *
 *     UpdateFarmRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         location_id:
 *           type: integer
 *         owner_id:
 *           type: integer
 *         total_area:
 *           type: number
 *           format: float
 *         water_source:
 *           type: string
 *         farm_address:
 *           type: string
 *         country_id:
 *           type: integer
 *         state_id:
 *           type: integer
 *         district_id:
 *           type: integer
 *         pond_count:
 *           type: integer
 *         latitude:
 *           type: number
 *           format: float
 *         longitude:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *
 *     # ── Pond ──────────────────────────────────────────────────────────────
 *     Pond:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         farm_id:
 *           type: integer
 *           example: 10
 *         species_id:
 *           type: integer
 *           example: 3
 *         name:
 *           type: string
 *           example: Pond A
 *         area:
 *           type: number
 *           format: float
 *           example: 2.5
 *         image_url:
 *           type: string
 *           example: https://example.com/ponds/pond-a.jpg
 *         image_key:
 *           type: string
 *           example: ponds/1710000000-pond-a.jpg
 *         pond_code:
 *           type: string
 *           nullable: true
 *           example: POND-000001
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           example: pending
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     CreatePondRequest:
 *       type: object
 *       required:
 *         - name
 *         - area
 *         - farm_id
 *         - species_id
 *         - image
 *       properties:
 *         name:
 *           type: string
 *           example: Pond A
 *         area:
 *           type: number
 *           format: float
 *           example: 2.5
 *         farm_id:
 *           type: integer
 *           example: 10
 *         species_id:
 *           type: integer
 *           example: 3
 *         image:
 *           type: string
 *           format: binary
 *
 *     UpdatePondRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         area:
 *           type: number
 *           format: float
 *         farm_id:
 *           type: integer
 *         species_id:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 */

// ════════════════════════════════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 *   - name: Users
 *     description: Authenticated user info
 *   - name: Owners
 *     description: Fishery owner management
 *   - name: Countries
 *     description: Country reference data
 *   - name: States
 *     description: State reference data
 *   - name: Districts
 *     description: District reference data
 *   - name: Locations
 *     description: Location reference data
 *   - name: Fish Types
 *     description: Fish type catalogue
 *   - name: Fishing Methods
 *     description: Fishing method catalogue
 *   - name: Vessels
 *     description: Wild-capture vessel registration
 *   - name: Trip Planning
 *     description: Fishing trip plans
 *   - name: QR Codes
 *     description: QR code generation and quality-check filling
 *   - name: Quality Checkers
 *     description: Quality checker management
 *   - name: Crate QRs
 *     description: Crate-level QR batch management
 *   - name: Crate Packers
 *     description: Crate packer management
 *   - name: Admins
 *     description: Admin account management
 *   - name: Super Admins
 *     description: Super-admin account management
 *   - name: Farms
 *     description: Farm management APIs
 *   - name: Ponds
 *     description: Pond management APIs
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with phone number
 *     description: >
 *       Authenticates an owner, quality checker, or crate packer by phone number
 *       and returns a signed JWT token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: JWT token returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid phone number or user not verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// ════════════════════════════════════════════════════════════════════════════
// USERS (me)
// ════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Get current authenticated user
 *     description: Returns the profile of the currently authenticated user derived from the JWT token.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Owner'
 *       401:
 *         description: Unauthorized – missing or invalid token
 */

// ════════════════════════════════════════════════════════════════════════════
// OWNERS
// ════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/owner:
 *   get:
 *     summary: List all owners
 *     tags: [Owners]
 *     responses:
 *       200:
 *         description: Array of owners with state/district/location names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Owner'
 *
 *   post:
 *     summary: Register a new owner
 *     description: Accepts multipart/form-data. Pass JSON fields inside a `data` key or as flat form fields, plus an optional `profileImage` file.
 *     tags: [Owners]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateOwnerRequest'
 *     responses:
 *       201:
 *         description: Owner created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Owner'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/owner/fetch/{id}:
 *   get:
 *     summary: Get a single owner by ID
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Owner's numeric database ID
 *     responses:
 *       200:
 *         description: Owner object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Owner'
 *       404:
 *         description: Owner not found
 */

/**
 * @swagger
 * /api/owner/location/{location_id}:
 *   get:
 *     summary: Get owners by location
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: location_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Array of owners in the given location
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Owner'
 */

/**
 * @swagger
 * /api/owner/{rootverse_type}:
 *   get:
 *     summary: Get owners filtered by rootverse type
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: rootverse_type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [WILD_CAPTURE, AQUACULTURE, MARICULTURE]
 *     responses:
 *       200:
 *         description: Array of owners with the given type
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Owner'
 *       400:
 *         description: Invalid rootverse_type
 */

/**
 * @swagger
 * /api/owner/{id}:
 *   put:
 *     summary: Update an owner
 *     description: Accepts multipart/form-data. Pass JSON fields inside a `data` key or as flat form fields.
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateOwnerRequest'
 *     responses:
 *       200:
 *         description: Updated owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Owner'
 *       400:
 *         description: Validation error
 *
 *   delete:
 *     summary: Delete an owner
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deletion result
 *       400:
 *         description: Error
 */

/**
 * @swagger
 * /api/owner/{id}/verify:
 *   post:
 *     summary: Verify or reject an owner (simple status update)
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [verification_status]
 *             properties:
 *               verification_status:
 *                 type: string
 *                 enum: [VERIFIED, REJECTED]
 *     responses:
 *       200:
 *         description: Updated owner object
 *
 *   put:
 *     summary: Update owner document verification fields
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Partial verification fields to update
 *     responses:
 *       200:
 *         description: Updated owner with formatted output
 */

// ════════════════════════════════════════════════════════════════════════════
// COUNTRIES
// ════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/country:
 *   get:
 *     summary: List all countries
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: Array of countries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Country'
 *
 *   post:
 *     summary: Create a country
 *     tags: [Countries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       201:
 *         description: Country created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 */

/**
 * @swagger
 * /api/country/{id}:
 *   get:
 *     summary: Get a country by ID
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Country object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 *
 *   put:
 *     summary: Update a country
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated country
 *
 *   delete:
 *     summary: Delete a country
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 */

// ════════════════════════════════════════════════════════════════════════════
// STATES
// ════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/states:
 *   get:
 *     summary: List all states
 *     tags: [States]
 *     responses:
 *       200:
 *         description: Array of states
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/State'
 *
 *   post:
 *     summary: Create a state
 *     tags: [States]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, country_id]
 *             properties:
 *               name:
 *                 type: string
 *               country_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: State created
 */

/**
 * @swagger
 * /api/states/country/{country_id}:
 *   get:
 *     summary: List states by country
 *     tags: [States]
 *     parameters:
 *       - in: path
 *         name: country_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Array of states for the given country
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/State'
 */

/**
 * @swagger
 * /api/states/{id}:
 *   get:
 *     summary: Get a state by ID
 *     tags: [States]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: State object
 *
 *   put:
 *     summary: Update a state
 *     tags: [States]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               country_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated state
 *
 *   delete:
 *     summary: Delete a state
 *     tags: [States]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 */

// ════════════════════════════════════════════════════════════════════════════
// DISTRICTS
// ════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/districts:
 *   get:
 *     summary: List all districts
 *     tags: [Districts]
 *     responses:
 *       200:
 *         description: Array of districts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/District'
 *
 *   post:
 *     summary: Create a district
 *     tags: [Districts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, state_id]
 *             properties:
 *               name:
 *                 type: string
 *               state_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: District created
 */

/**
 * @swagger
 * /api/states/{state_id}/districts:
 *   get:
 *     summary: List districts by state
 *     tags: [Districts]
 *     parameters:
 *       - in: path
 *         name: state_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Array of districts for the given state
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/District'
 */

/**
 * @swagger
 * /api/districts/{id}:
 *   get:
 *     summary: Get a district by ID
 *     tags: [Districts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: District object
 *
 *   put:
 *     summary: Update a district
 *     tags: [Districts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               state_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated district
 *
 *   delete:
 *     summary: Delete a district
 *     tags: [Districts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 */

// ════════════════════════════════════════════════════════════════════════════
// LOCATIONS
// ════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: List all locations
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: Array of locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 *
 *   post:
 *     summary: Create a location
 *     tags: [Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, district_id]
 *             properties:
 *               name:
 *                 type: string
 *               district_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Location created
 */

/**
 * @swagger
 * /api/locations/district/{district_id}:
 *   get:
 *     summary: Get locations by district
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: district_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Array of locations
 */

/**
 * @swagger
 * /api/locations/{id}:
 *   get:
 *     summary: Get a location by ID
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Location object
 *
 *   put:
 *     summary: Update a location
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               district_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated location
 *
 *   delete:
 *     summary: Delete a location
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 */

// ════════════════════════════════════════════════════════════════════════════
// FISH TYPES
// ════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/fish-types:
 *   get:
 *     summary: List all fish types
 *     tags: [Fish Types]
 *     responses:
 *       200:
 *         description: Array of fish types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FishType'
 *
 *   post:
 *     summary: Create a fish type (with optional image)
 *     tags: [Fish Types]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [fish_name]
 *             properties:
 *               fish_name:
 *                 type: string
 *               fish_code:
 *                 type: string
 *               fish_type_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Fish type created
 */

/**
 * @swagger
 * /api/fish-types/{id}:
 *   get:
 *     summary: Get fish type by ID
 *     tags: [Fish Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fish type object
 *
 *   put:
 *     summary: Update a fish type
 *     tags: [Fish Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fish_name:
 *                 type: string
 *               fish_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated fish type
 *
 *   delete:
 *     summary: Delete a fish type
 *     tags: [Fish Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 */

// ════════════════════════════════════════════════════════════════════════════
// FISHING METHODS
// ════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/fishing-methods:
 *   get:
 *     summary: List all fishing methods
 *     tags: [Fishing Methods]
 *     responses:
 *       200:
 *         description: Array of fishing methods
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FishingMethod'
 *
 *   post:
 *     summary: Create a fishing method (with optional image)
 *     tags: [Fishing Methods]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [method_name]
 *             properties:
 *               method_name:
 *                 type: string
 *               method_code:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Fishing method created
 */

/**
 * @swagger
 * /api/fishing-methods/{id}:
 *   put:
 *     summary: Update a fishing method
 *     tags: [Fishing Methods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               method_name:
 *                 type: string
 *               method_code:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updated fishing method
 *
 *   delete:
 *     summary: Delete a fishing method
 *     tags: [Fishing Methods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 */

// ════════════════════════════════════════════════════════════════════════════
// VESSELS
// ════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/vessels:
 *   get:
 *     summary: List all vessels
 *     tags: [Vessels]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search term (vessel name, registration number, port, etc.)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Array of vessels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vessel'
 *
 *   post:
 *     summary: Register a new vessel
 *     tags: [Vessels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVesselRequest'
 *     responses:
 *       201:
 *         description: Vessel created with auto-generated RV ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Vessel'
 */

/**
 * @swagger
 * /api/vessels/owner/{ownerId}:
 *   get:
 *     summary: Get vessels by owner ID
 *     tags: [Vessels]
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Array of vessels for this owner
 */

/**
 * @swagger
 * /api/vessels/{vesselId}:
 *   get:
 *     summary: Get a vessel by ID or RV code
 *     tags: [Vessels]
 *     parameters:
 *       - in: path
 *         name: vesselId
 *         required: true
 *         schema:
 *           type: string
 *         description: Numeric DB id or RV-VES-TN-XXXXXX code
 *     responses:
 *       200:
 *         description: Vessel object
 *       404:
 *         description: Not found
 *
 *   put:
 *     summary: Replace a vessel (full update)
 *     tags: [Vessels]
 *     parameters:
 *       - in: path
 *         name: vesselId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVesselRequest'
 *     responses:
 *       200:
 *         description: Updated vessel
 *       400:
 *         description: owner_id cannot be updated
 *
 *   patch:
 *     summary: Partially update a vessel
 *     tags: [Vessels]
 *     parameters:
 *       - in: path
 *         name: vesselId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Any subset of vessel fields (owner_id cannot be changed)
 *     responses:
 *       200:
 *         description: Updated vessel
 *
 *   delete:
 *     summary: Delete a vessel
 *     tags: [Vessels]
 *     parameters:
 *       - in: path
 *         name: vesselId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vessel deleted
 */

// ════════════════════════════════════════════════════════════════════════════
// TRIP PLANNING
// ════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/trip:
 *   get:
 *     summary: List all trip plans
 *     tags: [Trip Planning]
 *     responses:
 *       200:
 *         description: Array of trip plans (joined with location, method, fish, vessel)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TripPlan'
 *
 *   post:
 *     summary: Create a new trip plan
 *     tags: [Trip Planning]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTripRequest'
 *     responses:
 *       201:
 *         description: Trip plan created
 */

/**
 * @swagger
 * /api/trip/status/{status}:
 *   get:
 *     summary: List trip plans by approval status
 *     tags: [Trip Planning]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, approved, complete]
 *     responses:
 *       200:
 *         description: Filtered trip plans
 */

/**
 * @swagger
 * /api/trip/owner/{owner_code}:
 *   get:
 *     summary: Get trip plans by owner code
 *     tags: [Trip Planning]
 *     parameters:
 *       - in: path
 *         name: owner_code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of trip plans for this owner
 */

/**
 * @swagger
 * /api/trip/owner/{owner_code}/status/{approval_status}:
 *   get:
 *     summary: Get trip plans by owner code and approval status
 *     tags: [Trip Planning]
 *     parameters:
 *       - in: path
 *         name: owner_code
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: approval_status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, approved, complete]
 *     responses:
 *       200:
 *         description: Filtered trip plans
 */

/**
 * @swagger
 * /api/trip/vessel/{vessel_id}:
 *   get:
 *     summary: Get approved trip plans for a vessel
 *     tags: [Trip Planning]
 *     parameters:
 *       - in: path
 *         name: vessel_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Approved trip plans for vessel
 */

/**
 * @swagger
 * /api/trip/{id}:
 *   get:
 *     summary: Get a single trip plan by ID
 *     tags: [Trip Planning]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trip plan
 *
 *   put:
 *     summary: Update a trip plan
 *     tags: [Trip Planning]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTripRequest'
 *     responses:
 *       200:
 *         description: Updated trip plan
 *
 *   delete:
 *     summary: Delete a trip plan
 *     tags: [Trip Planning]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 */

/**
 * @swagger
 * /api/trip/{id}/approve:
 *   put:
 *     summary: Approve a trip plan
 *     tags: [Trip Planning]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trip plan approved (status → approved)
 */

/**
 * @swagger
 * /api/trip/{id}/complete:
 *   put:
 *     summary: Mark a trip plan as complete
 *     tags: [Trip Planning]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trip plan completed (status → complete)
 */

// ════════════════════════════════════════════════════════════════════════════
// QR CODES
// ════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/bulk-reserve:
 *   post:
 *     summary: Reserve a batch of QR codes
 *     tags: [QR Codes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkReserveRequest'
 *     responses:
 *       201:
 *         description: Batch of QR codes created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 qrs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QrCode'
 */

/**
 * @swagger
 * /api/qrs:
 *   get:
 *     summary: List QR codes with optional filters
 *     tags: [QR Codes]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [WILD_CAPTURE, AQUACULTURE, MARICULTURE]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [NEW, FILLED]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: populate
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Paginated QR code list
 */

/**
 * @swagger
 * /api/qrs/filled:
 *   get:
 *     summary: List QR codes with status FILLED
 *     tags: [QR Codes]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated filled QRs
 */

/**
 * @swagger
 * /api/filled/{code}:
 *   get:
 *     summary: Get a filled QR code by code string
 *     tags: [QR Codes]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: QR object with full details
 *       404:
 *         description: QR not found
 */

/**
 * @swagger
 * /api/qrs/status/{status}/code/{code}:
 *   get:
 *     summary: Get a QR code by status and code
 *     tags: [QR Codes]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: QR object
 *       404:
 *         description: Not found with that status and code
 */

/**
 * @swagger
 * /api/catchlogs:
 *   get:
 *     summary: Get all catch logs
 *     tags: [QR Codes]
 *     parameters:
 *       - in: query
 *         name: owner_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: trip_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Array of catch logs
 */

/**
 * @swagger
 * /api/qrs/{code}:
 *   put:
 *     summary: Upload images to a QR code (up to 3)
 *     description: Multipart form-data. Accepts up to 3 image files plus optional QR data fields.
 *     tags: [QR Codes]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 3
 *               rv_vessel_id:
 *                 type: string
 *               fish_id:
 *                 type: integer
 *               owner_id:
 *                 type: integer
 *               trip_id:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               status:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Images uploaded and QR updated
 *       400:
 *         description: No images or too many images provided
 */

/**
 * @swagger
 * /api/qrs/{code}/fill:
 *   put:
 *     summary: Fill a QR code with quality-check details
 *     description: >
 *       Multipart form-data. Requires `quality_checker_id`. Owner's
 *       `owner_register_progress` must be COMPLETED. Sets status → FILLED,
 *       qc_status → CHECKED.
 *     tags: [QR Codes]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [quality_checker_id]
 *             properties:
 *               quality_checker_id:
 *                 type: integer
 *               qc_result:
 *                 type: string
 *                 enum: [PASS, HOLD, REJECT]
 *               quality_grade:
 *                 type: string
 *                 enum: [A, B, C, REJECTED]
 *               qc_score:
 *                 type: integer
 *                 enum: [0, 10, 20, 30, 40]
 *               temperature_c:
 *                 type: number
 *               size:
 *                 type: string
 *                 enum: [SMALL, MEDIUM, LARGE]
 *               damage:
 *                 type: string
 *                 enum: [NONE, MINOR, MODERATE, SEVERE]
 *               water_temperature:
 *                 type: number
 *               ph_level:
 *                 type: number
 *               grade:
 *                 type: integer
 *                 enum: [30, 40]
 *               odor_score:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 5
 *               firmness_score:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 5
 *               is_damaged:
 *                 type: boolean
 *               reject_reason:
 *                 type: string
 *               weight:
 *                 type: number
 *               fish_images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 5
 *               pond_condition_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: QR code filled successfully
 *       400:
 *         description: Validation error or incomplete owner registration
 *       404:
 *         description: QR not found
 */

/**
 * @swagger
 * /api/qrs/update/{id}:
 *   put:
 *     summary: Update a QR code by numeric ID
 *     tags: [QR Codes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Any updatable QR fields
 *     responses:
 *       200:
 *         description: Updated QR code
 *       404:
 *         description: Not found
 */

// ════════════════════════════════════════════════════════════════════════════
// QUALITY CHECKERS
// ════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/quality-checker:
 *   get:
 *     summary: List all quality checkers
 *     tags: [Quality Checkers]
 *     responses:
 *       200:
 *         description: Array of quality checkers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/QualityChecker'
 *
 *   post:
 *     summary: Create a quality checker
 *     tags: [Quality Checkers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateQualityCheckerRequest'
 *     responses:
 *       201:
 *         description: Quality checker created
 */

/**
 * @swagger
 * /api/quality-checker/{checker_code}:
 *   get:
 *     summary: Get quality checker by checker code
 *     tags: [Quality Checkers]
 *     parameters:
 *       - in: path
 *         name: checker_code
 *         required: true
 *         schema:
 *           type: string
 *         example: QC-0001
 *     responses:
 *       200:
 *         description: Quality checker object
 */

/**
 * @swagger
 * /api/quality-checker/{id}:
 *   put:
 *     summary: Update a quality checker by ID
 *     tags: [Quality Checkers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateQualityCheckerRequest'
 *     responses:
 *       200:
 *         description: Updated quality checker
 *
 *   delete:
 *     summary: Delete a quality checker by ID
 *     tags: [Quality Checkers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 */

// ════════════════════════════════════════════════════════════════════════════
// CRATE QRs
// ════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/crate/create-batch:
 *   post:
 *     summary: Create a batch of crate QR codes
 *     tags: [Crate QRs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCrateQrBatchRequest'
 *     responses:
 *       201:
 *         description: Batch of crate QR codes created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 qrs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CrateQr'
 */

/**
 * @swagger
 * /api/crate:
 *   get:
 *     summary: List crate QR codes
 *     tags: [Crate QRs]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: district_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Array of crate QRs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 qrs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CrateQr'
 */

/**
 * @swagger
 * /api/crate/{code}:
 *   get:
 *     summary: Get a crate QR code by code
 *     tags: [Crate QRs]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Crate QR object
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /api/crate/{id}:
 *   put:
 *     summary: Update a crate QR code by ID
 *     tags: [Crate QRs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update on the crate QR
 *     responses:
 *       200:
 *         description: Updated crate QR
 *       404:
 *         description: Not found
 */

// ════════════════════════════════════════════════════════════════════════════
// CRATE PACKERS
// ════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/crate-packer:
 *   get:
 *     summary: List all crate packers
 *     tags: [Crate Packers]
 *     responses:
 *       200:
 *         description: Array of crate packers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CratePacker'
 *
 *   post:
 *     summary: Create a crate packer
 *     tags: [Crate Packers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCratePackerRequest'
 *     responses:
 *       201:
 *         description: Crate packer created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CratePacker'
 */

/**
 * @swagger
 * /api/crate-packer/{id}:
 *   get:
 *     summary: Get a crate packer by ID
 *     tags: [Crate Packers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Crate packer object
 *       404:
 *         description: Not found
 *
 *   put:
 *     summary: Update a crate packer
 *     tags: [Crate Packers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCratePackerRequest'
 *     responses:
 *       200:
 *         description: Updated crate packer
 *       404:
 *         description: Not found
 *
 *   delete:
 *     summary: Delete a crate packer
 *     tags: [Crate Packers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 */

// ════════════════════════════════════════════════════════════════════════════
// ADMINS
// ════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/admin:
 *   get:
 *     summary: List all admins
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Array of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Admin'
 *
 *   post:
 *     summary: Create a new admin
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAdminRequest'
 *     responses:
 *       201:
 *         description: Admin created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLoginRequest'
 *     responses:
 *       200:
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/admin/me:
 *   get:
 *     summary: Get currently authenticated admin
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/admin/{id}:
 *   put:
 *     summary: Update an admin
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAdminRequest'
 *     responses:
 *       200:
 *         description: Updated admin
 *
 *   delete:
 *     summary: Delete an admin
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Admin deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 */

// ════════════════════════════════════════════════════════════════════════════
// SUPER ADMINS
// ════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/super-admin:
 *   post:
 *     summary: Create a super admin
 *     tags: [Super Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAdminRequest'
 *     responses:
 *       201:
 *         description: Super admin created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 */

/**
 * @swagger
 * /api/super-admin/login:
 *   post:
 *     summary: Super admin login
 *     tags: [Super Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLoginRequest'
 *     responses:
 *       200:
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/super-admin/me:
 *   get:
 *     summary: Get currently authenticated super admin
 *     tags: [Super Admins]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Super admin profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/super-admins:
 *   get:
 *     summary: List all super admins
 *     tags: [Super Admins]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Array of super admins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Admin'
 */

/**
 * @swagger
 * /api/super-admin/{id}:
 *   put:
 *     summary: Update a super admin
 *     tags: [Super Admins]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAdminRequest'
 *     responses:
 *       200:
 *         description: Updated super admin
 *
 *   delete:
 *     summary: Delete a super admin
 *     tags: [Super Admins]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Super admin deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 */

export {};

// ════════════════════════════════════════════════════════════════════════════
// FARMS
// ════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/farms/register:
 *   post:
 *     summary: Register a new farm
 *     description: Accepts multipart/form-data with the farm image under the `image` field.
 *     tags: [Farms]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateFarmRequest'
 *     responses:
 *       201:
 *         description: Farm created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Farm'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/farms:
 *   get:
 *     summary: Get all farms with optional filters
 *     tags: [Farms]
 *     parameters:
 *       - in: query
 *         name: location_id
 *         schema:
 *           type: integer
 *         description: Filter by location id
 *       - in: query
 *         name: state_id
 *         schema:
 *           type: integer
 *         description: Filter by state id
 *       - in: query
 *         name: country_id
 *         schema:
 *           type: integer
 *         description: Filter by country id
 *       - in: query
 *         name: district_id
 *         schema:
 *           type: integer
 *         description: Filter by district id
 *       - in: query
 *         name: owner_id
 *         schema:
 *           type: integer
 *         description: Filter by owner id
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter by farm status
 *     responses:
 *       200:
 *         description: List of farms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Farm'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/farms/{id}:
 *   get:
 *     summary: Get farm by id
 *     tags: [Farms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Farm details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Farm'
 *       404:
 *         description: Farm not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update farm by id
 *     tags: [Farms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFarmRequest'
 *     responses:
 *       200:
 *         description: Farm updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Farm'
 *       400:
 *         description: Validation or update error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Farm not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete farm by id
 *     tags: [Farms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Farm deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       404:
 *         description: Farm not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/farms/code/{code}:
 *   get:
 *     summary: Get farm by farm code
 *     tags: [Farms]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         example: FARM-000001
 *     responses:
 *       200:
 *         description: Farm details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Farm'
 *       404:
 *         description: Farm not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// ════════════════════════════════════════════════════════════════════════════
// PONDS
// ════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/ponds/register:
 *   post:
 *     summary: Register a new pond
 *     description: Accepts multipart/form-data with the pond image under the `image` field.
 *     tags: [Ponds]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreatePondRequest'
 *     responses:
 *       201:
 *         description: Pond created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pond'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/ponds:
 *   get:
 *     summary: Get all ponds with optional filters
 *     tags: [Ponds]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter by pond status
 *       - in: query
 *         name: farm_id
 *         schema:
 *           type: integer
 *         description: Filter by farm id
 *     responses:
 *       200:
 *         description: List of ponds
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pond'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/ponds/{id}:
 *   get:
 *     summary: Get pond by id
 *     tags: [Ponds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pond details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pond'
 *       404:
 *         description: Pond not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update pond by id
 *     tags: [Ponds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePondRequest'
 *     responses:
 *       200:
 *         description: Pond updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pond'
 *       400:
 *         description: Validation or update error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Pond not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete pond by id
 *     tags: [Ponds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Pond deleted successfully
 *       400:
 *         description: Delete error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/ponds/code/{code}:
 *   get:
 *     summary: Get pond by pond code
 *     tags: [Ponds]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         example: POND-000001
 *     responses:
 *       200:
 *         description: Pond details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pond'
 *       404:
 *         description: Pond not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

