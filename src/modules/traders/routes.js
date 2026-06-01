import express from "express";
import { requireRole } from "../../shared/middlewares/auth.middleware.js";
import {
  createTraderController,
  loginTraderController,
  getMeController,
  listTradersController,
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

const ADMIN = requireRole("ADMIN", "SUPER_ADMIN");
const TRADER = requireRole("TRADER_ADMIN");

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
 *         organization_name:
 *           type: string
 *           example: Blue Coast Traders
 *         contact_name:
 *           type: string
 *           example: Trader Admin
 *         email:
 *           type: string
 *           example: trader@example.com
 *         mobile:
 *           type: string
 *           example: "9876543210"
 *         address:
 *           type: string
 *         state:
 *           type: string
 *         district:
 *           type: string
 *         organization_type:
 *           type: string
 *           example: TRADER
 *         is_active:
 *           type: boolean
 *     CreateTraderRequest:
 *       type: object
 *       required: [organization_name, email, mobile, password]
 *       properties:
 *         trader_code:
 *           type: string
 *         organization_name:
 *           type: string
 *         contact_name:
 *           type: string
 *         email:
 *           type: string
 *         mobile:
 *           type: string
 *         password:
 *           type: string
 *         address:
 *           type: string
 *         state:
 *           type: string
 *         district:
 *           type: string
 *     TraderLoginRequest:
 *       type: object
 *       required: [login_id, password]
 *       properties:
 *         login_id:
 *           type: string
 *           description: Trader code, email, or mobile
 *           example: trader@example.com
 *         password:
 *           type: string
 *           example: secret123
 *     TraderTeamQualityCheckerRequest:
 *       type: object
 *       required: [checker_name, checker_email, checker_phone, state_id, district_id]
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
 *         checker_code:
 *           type: string
 *         is_active:
 *           type: boolean
 *     TraderTeamCratePackerRequest:
 *       type: object
 *       required: [name, phone, address, email, date_of_birth]
 *       properties:
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
 *       required: [full_name, email, mobile, password, transport_id, vehicle_no]
 *       properties:
 *         operator_rv_id:
 *           type: string
 *         full_name:
 *           type: string
 *         email:
 *           type: string
 *         mobile:
 *           type: string
 *         password:
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
 *       required: [status]
 *       properties:
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
 *     summary: Create a trader organization
 *     tags: [Traders]
 *     security:
 *       - BearerAuth: []
 *     description: Admin or super admin creates a trader account for separate trader portal login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTraderRequest'
 *     responses:
 *       201:
 *         description: Trader created
 *       400:
 *         description: Invalid request
 *   get:
 *     summary: List trader organizations
 *     tags: [Traders]
 *     security:
 *       - BearerAuth: []
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
router.post("/", ADMIN, createTraderController);
router.get("/", ADMIN, listTradersController);

/**
 * @swagger
 * /api/traders/login:
 *   post:
 *     summary: Trader password login
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
 *     summary: Get logged-in trader profile
 *     tags: [Traders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Trader profile
 * /api/traders/dashboard:
 *   get:
 *     summary: Trader dashboard counts
 *     tags: [Traders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Team counts, progress counts, and crate status summary
 */
router.get("/me", TRADER, getMeController);
router.get("/dashboard", TRADER, getDashboardController);

/**
 * @swagger
 * /api/traders/quality-checkers:
 *   post:
 *     summary: Create quality checker under logged-in trader
 *     tags: [Traders]
 *     security:
 *       - BearerAuth: []
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
 *     summary: List quality checkers for logged-in trader
 *     tags: [Traders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Quality checker list
 */
router.post("/quality-checkers", TRADER, createQualityCheckerController);
router.get("/quality-checkers", TRADER, listQualityCheckersController);

/**
 * @swagger
 * /api/traders/crate-packers:
 *   post:
 *     summary: Create crate packer under logged-in trader
 *     tags: [Traders]
 *     security:
 *       - BearerAuth: []
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
 *     summary: List crate packers for logged-in trader
 *     tags: [Traders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Crate packer list
 */
router.post("/crate-packers", TRADER, createCratePackerController);
router.get("/crate-packers", TRADER, listCratePackersController);

/**
 * @swagger
 * /api/traders/transport-operators:
 *   post:
 *     summary: Create transport operator under logged-in trader
 *     tags: [Traders]
 *     security:
 *       - BearerAuth: []
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
 *     summary: List transport operators for logged-in trader
 *     tags: [Traders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Transport operator list
 */
router.post("/transport-operators", TRADER, createTransportOperatorController);
router.get("/transport-operators", TRADER, listTransportOperatorsController);

/**
 * @swagger
 * /api/traders/crates:
 *   get:
 *     summary: List crates linked to logged-in trader
 *     tags: [Traders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
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
 *             $ref: '#/components/schemas/TraderCrateStatusRequest'
 *     responses:
 *       200:
 *         description: Crate status updated and progress event recorded
 *       404:
 *         description: Crate not found for this trader
 */
router.get("/crates", TRADER, listCratesController);
router.patch("/crates/:crateId/status", TRADER, updateCrateProgressController);

export default router;
