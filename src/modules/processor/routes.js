import express from "express";
import { requireRole } from "../../shared/middlewares/auth.middleware.js";
import {
  createProcessorController,
  loginProcessorController,
  listProcessorsController,
  updateProcessorStatusController,
  getMeController,
  getDashboardController,
  scanReceiveController,
  listInventoryController,
  getInventoryItemController,
} from "./controller.js";

const router = express.Router();

const ADMIN = requireRole("ADMIN", "SUPER_ADMIN");
const PROCESSOR = requireRole("PROCESSOR");
const PROCESSOR_OR_ADMIN = requireRole("PROCESSOR", "ADMIN", "SUPER_ADMIN");

/**
 * @swagger
 * components:
 *   schemas:
 *     Processor:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         processor_code:
 *           type: string
 *           example: PR-MB123ABC
 *         processor_name:
 *           type: string
 *           example: Blue Ocean Seafoods
 *         contact_name:
 *           type: string
 *         email:
 *           type: string
 *           example: processor@example.com
 *         mobile:
 *           type: string
 *           example: "9876543210"
 *         address:
 *           type: string
 *         state:
 *           type: string
 *         district:
 *           type: string
 *         gps_latitude:
 *           type: number
 *           nullable: true
 *         gps_longitude:
 *           type: number
 *           nullable: true
 *         license_no:
 *           type: string
 *           nullable: true
 *         is_active:
 *           type: boolean
 *     CreateProcessorRequest:
 *       type: object
 *       required: [processor_name, email, mobile]
 *       properties:
 *         processor_name:
 *           type: string
 *         contact_name:
 *           type: string
 *         email:
 *           type: string
 *         mobile:
 *           type: string
 *           description: Used for processor login
 *         address:
 *           type: string
 *         state:
 *           type: string
 *         district:
 *           type: string
 *         gps_latitude:
 *           type: number
 *         gps_longitude:
 *           type: number
 *         license_no:
 *           type: string
 *     ProcessorLoginRequest:
 *       type: object
 *       required: [mobile]
 *       properties:
 *         mobile:
 *           type: string
 *           example: "9876543210"
 *     ProcessorScanRequest:
 *       type: object
 *       required: [crate_qr]
 *       properties:
 *         crate_qr:
 *           type: string
 *           description: Preprinted crate QR scanned on arrival at the processing facility.
 *           example: IN-TN-A-260654568
 *         gps_latitude:
 *           type: number
 *           nullable: true
 *           example: 13.0827
 *         gps_longitude:
 *           type: number
 *           nullable: true
 *           example: 80.2707
 *         remarks:
 *           type: string
 *           nullable: true
 *         processor_id:
 *           type: integer
 *           description: Required only when an ADMIN/SUPER_ADMIN scans on behalf of a processor. Ignored for PROCESSOR tokens.
 *     ProcessorInventoryItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         crate_code:
 *           type: string
 *           example: IN-TN-A-260654568
 *         harvest_id:
 *           type: integer
 *         trader_id:
 *           type: integer
 *         species:
 *           type: string
 *           example: Vannamei
 *         size_count_kg:
 *           type: number
 *           nullable: true
 *         weight_kg:
 *           type: number
 *           example: 18.75
 *         grade:
 *           type: string
 *           enum: [A, B, C, D]
 *         gps_latitude:
 *           type: number
 *           nullable: true
 *         gps_longitude:
 *           type: number
 *           nullable: true
 *         received_at:
 *           type: string
 *           format: date-time
 *         chain_of_custody_status:
 *           type: string
 *           example: RECEIVED_BY_PROCESSOR
 *         inventory_status:
 *           type: string
 *           example: IN_INVENTORY
 */

/**
 * @swagger
 * /api/processors:
 *   post:
 *     summary: Processor facility signup
 *     tags: [Processors]
 *     description: Public processor signup. The account is inactive until an admin approves it.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProcessorRequest'
 *     responses:
 *       201:
 *         description: Processor registered and pending approval
 *       400:
 *         description: Invalid request
 *       409:
 *         description: Mobile or email already registered
 *   get:
 *     summary: List processor facilities
 *     tags: [Processors]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: page_size
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Processor list
 */
router.post("/", createProcessorController);
router.get("/", ADMIN, listProcessorsController);

/**
 * @swagger
 * /api/processors/login:
 *   post:
 *     summary: Processor mobile login
 *     tags: [Processors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProcessorLoginRequest'
 *     responses:
 *       200:
 *         description: JWT tokens and processor profile summary
 *       403:
 *         description: Processor account inactive
 *       404:
 *         description: Processor not found
 */
router.post("/login", loginProcessorController);

/**
 * @swagger
 * /api/processors/me:
 *   get:
 *     summary: Get logged-in processor profile
 *     tags: [Processors]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Processor profile
 * /api/processors/dashboard:
 *   get:
 *     summary: Processor inventory dashboard counts
 *     tags: [Processors]
 *     description: PROCESSOR tokens use the logged-in processor automatically. ADMIN/SUPER_ADMIN tokens must pass processor_id.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: processor_id
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Inventory summary counts
 */
router.get("/me", PROCESSOR, getMeController);
router.get("/dashboard", PROCESSOR_OR_ADMIN, getDashboardController);

/**
 * @swagger
 * /api/processors/receiving/scan:
 *   post:
 *     summary: Scan a crate QR to receive it into the processor facility
 *     tags: [Processors]
 *     description: >
 *       The processor scans a preprinted crate QR on arrival. The system validates
 *       that the crate exists, was loaded for transport, and has not already been
 *       received by another processor, then transfers Chain of Custody to the
 *       processor and automatically adds the crate to the processor inventory.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProcessorScanRequest'
 *     responses:
 *       201:
 *         description: Crate received and added to processor inventory
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Crate received by processor }
 *                 data:
 *                   $ref: '#/components/schemas/ProcessorInventoryItem'
 *       404:
 *         description: Crate not found for scanned QR
 *       409:
 *         description: Crate already received by a processor
 *       422:
 *         description: Crate must be loaded for transport before receiving
 */
router.post("/receiving/scan", PROCESSOR_OR_ADMIN, scanReceiveController);

/**
 * @swagger
 * /api/processors/inventory:
 *   get:
 *     summary: List crates in the processor inventory
 *     tags: [Processors]
 *     description: PROCESSOR tokens see only their own inventory. ADMIN/SUPER_ADMIN tokens must pass processor_id.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: processor_id
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: page_size
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Processor inventory list
 * /api/processors/inventory/{crateCode}:
 *   get:
 *     summary: Get a single inventory crate with full detail
 *     tags: [Processors]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: crateCode
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: processor_id
 *         description: Required for ADMIN/SUPER_ADMIN tokens.
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Inventory crate detail
 *       404:
 *         description: Crate not found in this processor's inventory
 */
router.get("/inventory", PROCESSOR_OR_ADMIN, listInventoryController);
router.get("/inventory/:crateCode", PROCESSOR_OR_ADMIN, getInventoryItemController);

/**
 * @swagger
 * /api/processors/{processorId}/status:
 *   patch:
 *     summary: Approve or deactivate a processor facility
 *     tags: [Processors]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: processorId
 *         required: true
 *         schema: { type: integer }
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
 *         description: Processor status updated
 *       404:
 *         description: Processor not found
 */
router.patch("/:processorId/status", ADMIN, updateProcessorStatusController);

export default router;
