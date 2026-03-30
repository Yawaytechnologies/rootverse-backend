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
 *         username:
 *           type: string
 *         phone_no:
 *           type: string
 *         address:
 *           type: string
 *         rootverse_type:
 *           type: string
 *           enum: [WILD_CAPTURE, AQUACULTURE, MARICULTURE]
 *         verification_status:
 *           type: string
 *           enum: [PENDING, VERIFIED, REJECTED]
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
 *         profile_picture_url:
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
 *       required: [username, phone_no, rootverse_type, address]
 *       properties:
 *         username:
 *           type: string
 *         phone_no:
 *           type: string
 *         address:
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
 *       required: [password]
 *       properties:
 *         login_id:
 *           type: string
 *           description: Email or phone number (also accepts legacy "email" field)
 *           example: admin@oneblue.com
 *         email:
 *           type: string
 *           description: Legacy field — use login_id instead
 *           example: admin@oneblue.com
 *         password:
 *           type: string
 *           example: Admin@123
 *
 *     AdminLoginResponse:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         refresh_token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         token_type:
 *           type: string
 *           example: Bearer
 *         role:
 *           type: string
 *           example: ADMIN
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             full_name:
 *               type: string
 *             email:
 *               type: string
 *
 *
 *     CollectionCentre:
 *       type: object
 *       properties:
 *         centre_id:
 *           type: string
 *           example: CC-000003
 *         centre_name:
 *           type: string
 *           example: Nagapattinam Main Collection Centre
 *         district:
 *           type: string
 *         state:
 *           type: string
 *         address_line_1:
 *           type: string
 *         address_line_2:
 *           type: string
 *         pincode:
 *           type: string
 *         gps_lat:
 *           type: number
 *         gps_lng:
 *           type: number
 *         cold_storage_capacity_kg:
 *           type: number
 *         contact_name:
 *           type: string
 *         contact_mobile:
 *           type: string
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *
 *     CrateStatusHistory:
 *       type: object
 *       properties:
 *         event_id:
 *           type: string
 *           format: uuid
 *         crate_id:
 *           type: integer
 *         from_status:
 *           type: string
 *         to_status:
 *           type: string
 *         actor_role:
 *           type: string
 *         actor_id:
 *           type: string
 *         event_at_utc:
 *           type: string
 *           format: date-time
 *         remarks:
 *           type: string
 *
 *     TemperatureLog:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         crate_id:
 *           type: integer
 *         actor_role:
 *           type: string
 *         actor_id:
 *           type: string
 *         temperature_value:
 *           type: string
 *           example: 4°C
 *         recorded_at_utc:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
 *
 *     CrateAssignment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         crate_id:
 *           type: integer
 *         destination_name:
 *           type: string
 *         transport_operator_id:
 *           type: string
 *         driver_name:
 *           type: string
 *         vehicle_no:
 *           type: string
 *         scheduled_time_utc:
 *           type: string
 *           format: date-time
 *         picked_up_at_utc:
 *           type: string
 *           format: date-time
 *         delivered_at_utc:
 *           type: string
 *           format: date-time
 *
 *     CrateDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         code:
 *           type: string
 *           example: RV-CRATE-000121
 *         custody_status:
 *           type: string
 *           enum: [RECEIVED_AT_COLLECTION_CENTRE, SCHEDULED_FOR_DISPATCH, IN_TRANSIT, DELIVERED, HOLD, CANCELLED]
 *         production_category:
 *           type: string
 *           enum: [WILD_CAPTURE, AQUACULTURE, MARICULTURE]
 *         current_custodian_role:
 *           type: string
 *         current_custodian_id:
 *           type: string
 *         status_history:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CrateStatusHistory'
 *         dispatch_assignment:
 *           $ref: '#/components/schemas/CrateAssignment'
 *         temperature_logs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TemperatureLog'
 *
 *     OneBlueSuccess:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *         meta:
 *           type: object
 *           properties:
 *             server_time_utc:
 *               type: string
 *               format: date-time
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
 *       Authenticates any user by phone number and returns a signed JWT token.
 *       Supported roles: OWNER, QUALITY_CHECKER, CRATE_PACKER,
 *       COLLECTION_CENTRE_OPERATOR, TRANSPORT_OPERATOR.
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
 *     summary: Get owners filtered by rootverse type with progress summary
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
 *         description: Owners of the given type with verification progress summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rootverse_type:
 *                   type: string
 *                   enum: [WILD_CAPTURE, AQUACULTURE, MARICULTURE]
 *                 total:
 *                   type: integer
 *                 progress:
 *                   type: object
 *                   properties:
 *                     verified:
 *                       type: integer
 *                     pending:
 *                       type: integer
 *                     percentage_verified:
 *                       type: string
 *                       example: "75.00"
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Owner'
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
 *     summary: Admin login (accepts login_id or email + password)
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLoginRequest'
 *     responses:
 *       200:
 *         description: Access token + refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminLoginResponse'
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

// ═══════════════════════════════════════════════════════════════════════════
// AUTH — /me, /refresh, /logout
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile (all authenticated roles)
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile for the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Issue a new access token using a refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refresh_token]
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: New access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                     token_type:
 *                       type: string
 *       400:
 *         description: Missing or invalid token type
 *       401:
 *         description: Invalid or expired refresh token
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout current user (client should discard token)
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN — Collection Centre Management
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/admin/collection-centres:
 *   post:
 *     summary: Register a new collection centre
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [centre_id, centre_name, district, state, address_line_1]
 *             properties:
 *               centre_id:
 *                 type: string
 *                 example: CC-000003
 *               centre_name:
 *                 type: string
 *                 example: Nagapattinam Main Collection Centre
 *               district:
 *                 type: string
 *                 example: Nagapattinam
 *               state:
 *                 type: string
 *                 example: Tamil Nadu
 *               address_line_1:
 *                 type: string
 *                 example: Harbour Road
 *               address_line_2:
 *                 type: string
 *               pincode:
 *                 type: string
 *                 example: "611001"
 *               gps_lat:
 *                 type: number
 *                 example: 10.7672
 *               gps_lng:
 *                 type: number
 *                 example: 79.8449
 *               cold_storage_capacity_kg:
 *                 type: number
 *                 example: 5000
 *               contact_name:
 *                 type: string
 *               contact_mobile:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 default: ACTIVE
 *     responses:
 *       201:
 *         description: Collection centre registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CollectionCentre'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Centre ID already exists
 *   get:
 *     summary: List all collection centres
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of collection centres
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
 *                     $ref: '#/components/schemas/CollectionCentre'
 */

/**
 * @swagger
 * /api/admin/collection-centres/{centreId}:
 *   get:
 *     summary: Get a collection centre by ID
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: centreId
 *         required: true
 *         schema:
 *           type: string
 *         example: CC-000003
 *     responses:
 *       200:
 *         description: Collection centre details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CollectionCentre'
 *       404:
 *         description: Centre not found
 *   patch:
 *     summary: Update collection centre metadata
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: centreId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CollectionCentre'
 *     responses:
 *       200:
 *         description: Centre updated
 *       404:
 *         description: Centre not found
 */

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN — Operator Registration
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/admin/operators/collection-centre:
 *   post:
 *     summary: Register a collection centre operator
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [operator_rv_id, full_name, email, mobile, centre_id]
 *             properties:
 *               operator_rv_id:
 *                 type: string
 *                 example: RV-CC-001
 *               full_name:
 *                 type: string
 *                 example: Jana
 *               email:
 *                 type: string
 *                 example: jana@oneblue.com
 *               mobile:
 *                 type: string
 *                 example: "9876500001"
 *               centre_id:
 *                 type: string
 *                 example: CC-000003
 *               designation:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Operator registered
 *       400:
 *         description: Validation error or centre not found
 */

/**
 * @swagger
 * /api/admin/operators/transport:
 *   post:
 *     summary: Register a transport operator
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [operator_rv_id, full_name, email, mobile, transport_id, vehicle_no]
 *             properties:
 *               operator_rv_id:
 *                 type: string
 *                 example: RV-TR-009
 *               full_name:
 *                 type: string
 *                 example: Prakash
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               transport_id:
 *                 type: string
 *                 example: TR-009
 *               vehicle_no:
 *                 type: string
 *                 example: TN51AB4321
 *               route_name:
 *                 type: string
 *                 example: Nagapattinam Harbour
 *               vehicle_type:
 *                 type: string
 *                 example: Refrigerated van
 *               is_active:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Transport operator registered
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/admin/operators/{operatorId}/status:
 *   patch:
 *     summary: Activate, deactivate, or suspend an operator
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operatorId
 *         required: true
 *         schema:
 *           type: string
 *         example: RV-CC-001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *     responses:
 *       200:
 *         description: Operator status updated
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Operator not found
 */

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN — Monitoring
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/admin/dashboard/summary:
 *   get:
 *     summary: Top-level admin dashboard summary
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-03-20"
 *     responses:
 *       200:
 *         description: Summary counts for centres, operators, and crates
 */

/**
 * @swagger
 * /api/admin/crates:
 *   get:
 *     summary: List all crates with optional filters
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [RECEIVED_AT_COLLECTION_CENTRE, SCHEDULED_FOR_DISPATCH, IN_TRANSIT, DELIVERED, HOLD, CANCELLED]
 *       - in: query
 *         name: centre_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: transport_operator_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: destination_name
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Crate list
 */

/**
 * @swagger
 * /api/admin/crates/{crateId}:
 *   get:
 *     summary: Full crate timeline — status history, dispatch, temperature logs
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: crateId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Crate detail with full audit trail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CrateDetail'
 *       404:
 *         description: Crate not found
 *   patch:
 *     summary: Admin exception status override
 *     description: Requires reason_code and reason_text. Recorded in audit trail.
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: crateId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [new_status, reason_code, reason_text, admin_id]
 *             properties:
 *               new_status:
 *                 type: string
 *                 enum: [RECEIVED_AT_COLLECTION_CENTRE, SCHEDULED_FOR_DISPATCH, IN_TRANSIT, DELIVERED, HOLD, CANCELLED]
 *               reason_code:
 *                 type: string
 *                 enum: [MISMATCH, DAMAGE, DUPLICATE_SCAN, MANUAL_CORRECTION, HOLD, CANCEL]
 *               reason_text:
 *                 type: string
 *                 example: Crate physically damaged and held for inspection
 *               admin_id:
 *                 type: string
 *                 example: "1"
 *     responses:
 *       200:
 *         description: Status overridden and audit record created
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Crate not found
 */

/**
 * @swagger
 * /api/admin/assignments:
 *   get:
 *     summary: List all dispatch assignments
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: transport_operator_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Assignment list
 */

/**
 * @swagger
 * /api/admin/temperature-logs:
 *   get:
 *     summary: View centre and transport temperature logs
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [COLLECTION_CENTRE_OPERATOR, TRANSPORT_OPERATOR]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Temperature log list
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: List all registered admin and operator accounts
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [ADMIN, COLLECTION_CENTRE_OPERATOR, TRANSPORT_OPERATOR]
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User list
 */

// ═══════════════════════════════════════════════════════════════════════════
// COLLECTION CENTRE OPERATOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/collection-centre/auth/login:
 *   post:
 *     summary: "[REMOVED] Use POST /api/auth/login with phone_no instead"
 *     deprecated: true
 *     tags: [Collection Centre]
 *     description: >
 *       This endpoint no longer exists. Collection centre operators now log in
 *       via POST /api/auth/login using their registered mobile number as phone_no.
 *     responses:
 *       404:
 *         description: Route not found
 */

/**
 * @swagger
 * /api/collection-centre/dashboard:
 *   get:
 *     summary: Collection centre dashboard stats for the logged-in operator
 *     tags: [Collection Centre]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-03-20"
 *     responses:
 *       200:
 *         description: Dashboard counts — total, received, assigned, pending
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     selected_date:
 *                       type: string
 *                     centre:
 *                       type: object
 *                     stats:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         received:
 *                           type: integer
 *                         assigned:
 *                           type: integer
 *                         pending:
 *                           type: integer
 */

/**
 * @swagger
 * /api/collection-centre/crates:
 *   get:
 *     summary: List crates at this collection centre
 *     tags: [Collection Centre]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [RECEIVED_AT_COLLECTION_CENTRE, SCHEDULED_FOR_DISPATCH]
 *     responses:
 *       200:
 *         description: Crate list for this centre
 */

/**
 * @swagger
 * /api/collection-centre/crates/receive:
 *   post:
 *     summary: Receive a crate by QR scan
 *     tags: [Collection Centre]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [crate_qr, centre_id, operator_id]
 *             properties:
 *               crate_qr:
 *                 type: string
 *                 example: RV-CRATE-000121
 *               centre_id:
 *                 type: string
 *                 example: CC-000003
 *               operator_id:
 *                 type: string
 *                 example: RV-CC-001
 *               production_category:
 *                 type: string
 *                 enum: [WILD_CAPTURE, AQUACULTURE, MARICULTURE]
 *               gps_lat:
 *                 type: number
 *               gps_lng:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Crate received — status set to RECEIVED_AT_COLLECTION_CENTRE
 *       404:
 *         description: Unknown crate QR
 *       409:
 *         description: Crate cannot be received in its current status
 */

/**
 * @swagger
 * /api/collection-centre/crates/{crateId}:
 *   get:
 *     summary: View crate details — audit trail, dispatch info, temperature logs
 *     tags: [Collection Centre]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: crateId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Crate detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CrateDetail'
 *       404:
 *         description: Crate not found
 */

/**
 * @swagger
 * /api/collection-centre/crates/{crateId}/temperature:
 *   post:
 *     summary: Log cold-storage temperature for a crate
 *     description: Only allowed when crate is under this centre's custody.
 *     tags: [Collection Centre]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: crateId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [temperature_value, collection_centre_id, operator_id]
 *             properties:
 *               temperature_value:
 *                 type: string
 *                 example: 4°C
 *               collection_centre_id:
 *                 type: string
 *                 example: CC-000003
 *               operator_id:
 *                 type: string
 *                 example: RV-CC-001
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Temperature logged
 *       409:
 *         description: Crate not under this centre's custody
 */

/**
 * @swagger
 * /api/collection-centre/crates/{crateId}/assign-dispatch:
 *   post:
 *     summary: Assign a crate to a transport operator for dispatch
 *     description: Moves crate status to SCHEDULED_FOR_DISPATCH.
 *     tags: [Collection Centre]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: crateId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [destination_name, transport_operator_id, scheduled_time_utc, driver_name, vehicle_no]
 *             properties:
 *               destination_name:
 *                 type: string
 *                 example: Main Harbour Processing Unit
 *               transport_operator_id:
 *                 type: string
 *                 example: RV-TR-009
 *               transport_id:
 *                 type: string
 *                 example: TR-009
 *               scheduled_time_utc:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-03-20T10:30:00Z"
 *               assigned_to_label:
 *                 type: string
 *               driver_name:
 *                 type: string
 *                 example: Prakash
 *               vehicle_no:
 *                 type: string
 *                 example: TN51AB4321
 *               operator_id:
 *                 type: string
 *                 description: Overrides the JWT-derived operator ID. Defaults to the authenticated operator.
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Crate assigned for dispatch
 *       404:
 *         description: Crate or transport operator not found
 *       422:
 *         description: Crate must be in RECEIVED_AT_COLLECTION_CENTRE status
 */

// ═══════════════════════════════════════════════════════════════════════════
// TRANSPORT OPERATOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/transport/auth/login:
 *   post:
 *     summary: "[REMOVED] Use POST /api/auth/login with phone_no instead"
 *     deprecated: true
 *     tags: [Transport]
 *     description: >
 *       This endpoint no longer exists. Transport operators now log in
 *       via POST /api/auth/login using their registered mobile number as phone_no.
 *     responses:
 *       404:
 *         description: Route not found
 */

/**
 * @swagger
 * /api/transport/dashboard:
 *   get:
 *     summary: Transport operator dashboard — stats for assigned and in-transit crates
 *     tags: [Transport]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-03-20"
 *     responses:
 *       200:
 *         description: Dashboard stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     current_transport:
 *                       type: object
 *                     stats:
 *                       type: object
 *                       properties:
 *                         total_my_crates:
 *                           type: integer
 *                         assigned:
 *                           type: integer
 *                         in_transit:
 *                           type: integer
 */

/**
 * @swagger
 * /api/transport/assigned-crates:
 *   get:
 *     summary: List crates assigned to this transport operator (SCHEDULED_FOR_DISPATCH)
 *     tags: [Transport]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Assigned crate list
 */

/**
 * @swagger
 * /api/transport/in-transit:
 *   get:
 *     summary: List crates currently in transit for this operator
 *     tags: [Transport]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: In-transit crate list
 */

/**
 * @swagger
 * /api/transport/crates/scan-pickup:
 *   post:
 *     summary: Scan crate QR to accept custody — moves crate to IN_TRANSIT
 *     tags: [Transport]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [crate_qr]
 *             properties:
 *               crate_qr:
 *                 type: string
 *                 example: RV-CRATE-000121
 *               transport_operator_id:
 *                 type: string
 *                 example: RV-TR-009
 *               transport_id:
 *                 type: string
 *                 example: TR-009
 *               vehicle_no:
 *                 type: string
 *                 example: TN51AB4321
 *               gps_lat:
 *                 type: number
 *               gps_lng:
 *                 type: number
 *     responses:
 *       201:
 *         description: Crate accepted — status IN_TRANSIT
 *       404:
 *         description: Unknown crate QR or no assignment found
 *       409:
 *         description: Crate not assigned to this transport
 *       422:
 *         description: Crate must be in SCHEDULED_FOR_DISPATCH status
 */

/**
 * @swagger
 * /api/transport/crates/{crateId}/temperature:
 *   post:
 *     summary: Log in-transit temperature
 *     tags: [Transport]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: crateId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [temperature_value]
 *             properties:
 *               temperature_value:
 *                 type: string
 *                 example: 5.1°C
 *               transport_id:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Temperature logged
 *       409:
 *         description: Crate is not in transit
 */

/**
 * @swagger
 * /api/transport/crates/{crateId}/deliver:
 *   post:
 *     summary: Mark crate as delivered at destination
 *     tags: [Transport]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: crateId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               destination_entity_id:
 *                 type: string
 *               destination_entity_name:
 *                 type: string
 *               receiver_name:
 *                 type: string
 *               gps_lat:
 *                 type: number
 *               gps_lng:
 *                 type: number
 *               remarks:
 *                 type: string
 *     responses:
 *       201:
 *         description: Crate delivered — status DELIVERED
 *       404:
 *         description: Crate not found
 *       422:
 *         description: Crate must be IN_TRANSIT to deliver
 */

