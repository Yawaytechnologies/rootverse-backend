import express from "express";
import upload from "../../shared/middlewares/upload.js";
import {
  createTraderController,
  loginTraderController,
  getMeController,
  getTraderDetailController,
  listTradersController,
  updateTraderStatusController,
  createQualityCheckerController,
  listQualityCheckersController,
  createCratePackerController,
  listCratePackersController,
  createTransportOperatorController,
  listTransportOperatorsController,
  getDashboardController,
  listCratesController,
  updateCrateProgressController,
} from "./controller.js";

const router = express.Router();

const traderSignupUpload = upload.fields([
  { name: "profile_image", maxCount: 1 },
  { name: "profileImage", maxCount: 1 },
  { name: "trader_profile_image", maxCount: 1 },
  { name: "company_logo", maxCount: 1 },
  { name: "companyLogo", maxCount: 1 },
]);

/**
 * @swagger
 * components:
 *   schemas:
 *     Trader:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         trader_code:
 *           type: string
 *           example: TR-MB123ABC
 *         profile_image_url:
 *           type: string
 *         company_logo_url:
 *           type: string
 *         trader_name:
 *           type: string
 *           example: Blue Coast Traders
 *         trader_type:
 *           type: string
 *           enum: [Individual, Company, Partnership]
 *         mobile:
 *           type: string
 *           example: "9876543210"
 *         email:
 *           type: string
 *           example: trader@example.com
 *         address:
 *           type: string
 *         operational_districts:
 *           type: array
 *           items:
 *             type: string
 *         years_of_experience:
 *           type: integer
 *         markets:
 *           type: string
 *           enum: [Export, Domestic, Both]
 *         is_active:
 *           type: boolean
 *     CreateTraderRequest:
 *       type: object
 *       required: [trader_name, trader_type, mobile, email, address, markets]
 *       properties:
 *         trader_name:
 *           type: string
 *         trader_type:
 *           type: string
 *           enum: [Individual, Company, Partnership]
 *         mobile:
 *           type: string
 *           description: Used for trader login
 *         email:
 *           type: string
 *           description: Trader email
 *         address:
 *           type: string
 *         operational_districts:
 *           type: array
 *           items:
 *             type: string
 *         years_of_experience:
 *           type: integer
 *         markets:
 *           type: string
 *           enum: [Export, Domestic, Both]
 *     TraderSignupMultipartRequest:
 *       allOf:
 *         - $ref: '#/components/schemas/CreateTraderRequest'
 *         - type: object
 *           properties:
 *             profile_image:
 *               type: string
 *               format: binary
 *               description: Trader profile image file. Uploaded to storage; only the public URL is saved.
 *             company_logo:
 *               type: string
 *               format: binary
 *               description: Company logo image file. Uploaded to storage; only the public URL is saved.
 *     TraderLoginRequest:
 *       type: object
 *       required: [mobile]
 *       properties:
 *         mobile:
 *           type: string
 *           description: Trader mobile number
 *           example: "9876543210"
 *     TraderTeamQualityCheckerRequest:
 *       type: object
 *       required: [trader_id, checker_name, checker_email, checker_phone]
 *       properties:
 *         trader_id:
 *           type: integer
 *           example: 8
 *         checker_name:
 *           type: string
 *         checker_email:
 *           type: string
 *         checker_phone:
 *           type: string
 *         location_id:
 *           type: integer
 *         checker_code:
 *           type: string
 *         is_active:
 *           type: boolean
 *     TraderTeamCratePackerRequest:
 *       type: object
 *       required: [trader_id, name, phone, address, email, date_of_birth]
 *       properties:
 *         trader_id:
 *           type: integer
 *           example: 8
 *         name:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *         email:
 *           type: string
 *         date_of_birth:
 *           type: string
 *         location_id:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *     TraderTeamTransportOperatorRequest:
 *       type: object
 *       required: [trader_id, full_name, email, mobile, transport_id, vehicle_no]
 *       properties:
 *         trader_id:
 *           type: integer
 *           example: 8
 *         operator_rv_id:
 *           type: string
 *         full_name:
 *           type: string
 *         email:
 *           type: string
 *         mobile:
 *           type: string
 *         transport_id:
 *           type: string
 *         vehicle_no:
 *           type: string
 *         route_name:
 *           type: string
 *         vehicle_type:
 *           type: string
 *         is_active:
 *           type: boolean
 *     TraderCrateStatusRequest:
 *       type: object
 *       required: [trader_id, status]
 *       properties:
 *         trader_id:
 *           type: integer
 *           example: 8
 *         status:
 *           type: string
 *           enum: [RECEIVED_AT_COLLECTION_CENTRE, SCHEDULED_FOR_DISPATCH, IN_TRANSIT, DELIVERED, HOLD, CANCELLED]
 *         current_custodian_role:
 *           type: string
 *           example: TRADER_ADMIN
 *         current_custodian_id:
 *           type: string
 *           example: "1"
 *         remarks:
 *           type: string
 */

/**
 * @swagger
 * /api/traders:
 *   post:
 *     summary: Trader organization signup
 *     tags: [Traders]
 *     description: Public trader signup. The account is inactive until an admin or super admin approves it.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/TraderSignupMultipartRequest'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTraderRequest'
 *     responses:
 *       201:
 *         description: Trader signup created and pending approval
 *       400:
 *         description: Invalid request
 *   get:
 *     summary: List trader organizations
 *     tags: [Traders]
 *     parameters:
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
 *         description: Trader list
 */
router.post("/", traderSignupUpload, createTraderController);
router.get("/", listTradersController);

/**
 * @swagger
 * /api/traders/{traderId}/status:
 *   patch:
 *     summary: Approve or deactivate a trader organization
 *     tags: [Traders]
 *     parameters:
 *       - in: path
 *         name: traderId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, active, pending, rejected, inactive]
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Trader status updated
 *       404:
 *         description: Trader not found
 */
router.patch("/:traderId/status", updateTraderStatusController);

/**
 * @swagger
 * /api/traders/login:
 *   post:
 *     summary: Trader mobile login
 *     tags: [Traders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TraderLoginRequest'
 *     responses:
 *       200:
 *         description: JWT tokens and trader profile summary
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", loginTraderController);

/**
 * @swagger
 * /api/traders/me:
 *   get:
 *     summary: Get trader profile by trader_id
 *     tags: [Traders]
 *     parameters:
 *       - in: query
 *         name: trader_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 8
 *     responses:
 *       200:
 *         description: Trader profile
 * /api/traders/dashboard:
 *   get:
 *     summary: Trader dashboard counts
 *     tags: [Traders]
 *     parameters:
 *       - in: query
 *         name: trader_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 8
 *     responses:
 *       200:
 *         description: Team counts, progress counts, and crate status summary
 */
router.get("/me", getMeController);
router.get("/dashboard", getDashboardController);

/**
 * @swagger
 * /api/traders/quality-checkers:
 *   post:
 *     summary: Create quality checker under a trader
 *     tags: [Traders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TraderTeamQualityCheckerRequest'
 *     responses:
 *       201:
 *         description: Quality checker created
 *   get:
 *     summary: List quality checkers for a trader
 *     tags: [Traders]
 *     parameters:
 *       - in: query
 *         name: trader_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 8
 *     responses:
 *       200:
 *         description: Quality checker list
 */
router.post("/quality-checkers", createQualityCheckerController);
router.get("/quality-checkers", listQualityCheckersController);

/**
 * @swagger
 * /api/traders/crate-packers:
 *   post:
 *     summary: Create crate packer under a trader
 *     tags: [Traders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TraderTeamCratePackerRequest'
 *     responses:
 *       201:
 *         description: Crate packer created
 *   get:
 *     summary: List crate packers for a trader
 *     tags: [Traders]
 *     parameters:
 *       - in: query
 *         name: trader_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 8
 *     responses:
 *       200:
 *         description: Crate packer list
 */
router.post("/crate-packers", createCratePackerController);
router.get("/crate-packers", listCratePackersController);

/**
 * @swagger
 * /api/traders/transport-operators:
 *   post:
 *     summary: Create transport operator under a trader
 *     tags: [Traders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TraderTeamTransportOperatorRequest'
 *     responses:
 *       201:
 *         description: Transport operator created
 *   get:
 *     summary: List transport operators for a trader
 *     tags: [Traders]
 *     parameters:
 *       - in: query
 *         name: trader_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 8
 *     responses:
 *       200:
 *         description: Transport operator list
 */
router.post("/transport-operators", createTransportOperatorController);
router.get("/transport-operators", listTransportOperatorsController);

/**
 * @swagger
 * /api/traders/crates:
 *   get:
 *     summary: List crates linked to a trader
 *     tags: [Traders]
 *     parameters:
 *       - in: query
 *         name: trader_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 8
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [RECEIVED_AT_COLLECTION_CENTRE, SCHEDULED_FOR_DISPATCH, IN_TRANSIT, DELIVERED, HOLD, CANCELLED]
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
 *         description: Trader crate list
 * /api/traders/crates/{crateId}/status:
 *   patch:
 *     summary: Update trader crate progress status
 *     tags: [Traders]
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
 *             $ref: '#/components/schemas/TraderCrateStatusRequest'
 *     responses:
 *       200:
 *         description: Crate status updated and progress event recorded
 *       404:
 *         description: Crate not found for this trader
 */
router.get("/crates", listCratesController);
router.patch("/crates/:crateId/status", updateCrateProgressController);

/**
 * @swagger
 * /api/traders/{traderId}:
 *   get:
 *     summary: Get trader detail with trader-created team members
 *     tags: [Traders]
 *     parameters:
 *       - in: path
 *         name: traderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trader profile with quality checkers, crate packers, and transport operators
 *       404:
 *         description: Trader not found
 */
router.get("/:traderId", getTraderDetailController);

export default router;
