import express from "express";
import { requireRole } from "../../../shared/middlewares/auth.middleware.js";
import {
  getTransportLoadingProgressController,
  scanTransportLoadingController,
} from "./controller.js";

const router = express.Router();

const TRANSPORT_LOADING_SCAN = requireRole("TRANSPORT_OPERATOR");
const TRANSPORT_LOADING_VIEW = requireRole("TRANSPORT_OPERATOR", "TRADER_ADMIN", "ADMIN", "SUPER_ADMIN");

/**
 * @swagger
 * components:
 *   schemas:
 *     AquacultureTransportLoadingScanRequest:
 *       type: object
 *       required: [crate_qr, vehicle_number]
 *       properties:
 *         crate_qr:
 *           type: string
 *           description: Preprinted aquaculture crate QR code scanned during vehicle loading.
 *           example: IN-TN-A-260654568
 *         vehicle_number:
 *           type: string
 *           description: Vehicle selected by the transport operator.
 *           example: TN51AB4321
 *         gps_latitude:
 *           type: number
 *           nullable: true
 *           example: 13.0827
 *         gps_longitude:
 *           type: number
 *           nullable: true
 *           example: 80.2707
 *         loaded_at:
 *           type: string
 *           format: date-time
 *           description: Optional UTC loading timestamp. Defaults to current server time.
 *           example: 2026-07-10T07:30:00.000Z
 *         remarks:
 *           type: string
 *           nullable: true
 *           example: Loaded at harvest location
 *
 *     AquacultureTransportLoadingProgress:
 *       type: object
 *       properties:
 *         harvest_id:
 *           type: integer
 *           example: 31
 *         trader_id:
 *           type: integer
 *           example: 5
 *         vehicle_number:
 *           type: string
 *           nullable: true
 *           example: TN51AB4321
 *         transport_operator:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *               example: 9
 *             operator_rv_id:
 *               type: string
 *               example: RV-TR-009
 *             full_name:
 *               type: string
 *               example: Prakash Kumar
 *         total_packed_crates:
 *           type: integer
 *           example: 120
 *         loaded_crates:
 *           type: integer
 *           example: 95
 *         remaining_crates:
 *           type: integer
 *           example: 25
 *         loading_progress:
 *           type: integer
 *           description: Loading completion percentage.
 *           example: 79
 *         dispatch_status:
 *           type: string
 *           enum: [NO_PACKED_CRATES, LOADING_PENDING, LOADING_IN_PROGRESS, READY_FOR_DISPATCH]
 *           example: LOADING_IN_PROGRESS
 *
 *     AquacultureTransportLoading:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         crate_code:
 *           type: string
 *           example: IN-TN-A-260654568
 *         harvest_id:
 *           type: integer
 *           example: 31
 *         trader_id:
 *           type: integer
 *           example: 5
 *         trader:
 *           type: object
 *           properties:
 *             trader_code:
 *               type: string
 *               example: TR-260001
 *             trader_name:
 *               type: string
 *               example: Coastal Traders
 *             mobile:
 *               type: string
 *               example: "9876543210"
 *         transport_operator:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 9
 *             operator_rv_id:
 *               type: string
 *               example: RV-TR-009
 *             full_name:
 *               type: string
 *               example: Prakash Kumar
 *             transport_id:
 *               type: string
 *               example: TR-009
 *         vehicle_number:
 *           type: string
 *           example: TN51AB4321
 *         species:
 *           type: string
 *           example: Vannamei
 *         grade:
 *           type: string
 *           enum: [A, B, C, D]
 *           example: A
 *         weight_kg:
 *           type: number
 *           example: 18.75
 *         chain_of_custody_status:
 *           type: string
 *           example: LOADED
 *         loaded_at:
 *           type: string
 *           format: date-time
 *         progress:
 *           $ref: '#/components/schemas/AquacultureTransportLoadingProgress'
 *
 * /api/aquaculture/transport-loading/scan:
 *   post:
 *     summary: Scan aquaculture crate QR while loading transport vehicle
 *     description: >
 *       Transport operator scans a preprinted crate QR after crate packing is complete.
 *       The backend validates same-trader ownership, completed quality inspection,
 *       packed crate status, and duplicate loading before transferring custody to
 *       the authenticated transport operator.
 *     tags: [Aquaculture Transport Loading]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AquacultureTransportLoadingScanRequest'
 *           example:
 *             crate_qr: IN-TN-A-260654568
 *             vehicle_number: TN51AB4321
 *             gps_latitude: 13.0827
 *             gps_longitude: 80.2707
 *             remarks: Loaded at harvest location
 *     responses:
 *       201:
 *         description: Crate loaded successfully and custody transferred to transport operator
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Crate loaded successfully
 *                 data:
 *                   $ref: '#/components/schemas/AquacultureTransportLoading'
 *       400:
 *         description: Missing or invalid request fields
 *       401:
 *         description: Missing or invalid bearer token
 *       403:
 *         description: Transport operator does not belong to the harvest trader
 *       404:
 *         description: Packed crate or transport operator not found
 *       409:
 *         description: Crate has already been loaded
 *       422:
 *         description: Crate must be packed before transport loading
 *
 * /api/aquaculture/transport-loading/harvest/{harvest_id}/progress:
 *   get:
 *     summary: Get aquaculture transport loading progress for a harvest
 *     description: >
 *       Returns packed, loaded, and remaining crate counts for the harvest, along
 *       with loading percentage, dispatch status, vehicle/operator details, and
 *       individual crate loading state. Trader users and transport operators are
 *       restricted to their own trader records. Admins can view all records.
 *     tags: [Aquaculture Transport Loading]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: harvest_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 31
 *     responses:
 *       200:
 *         description: Transport loading progress fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Transport loading progress fetched successfully
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/AquacultureTransportLoadingProgress'
 *                     - type: object
 *                       properties:
 *                         crates:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               crate_packing_id:
 *                                 type: integer
 *                                 example: 44
 *                               crate_code:
 *                                 type: string
 *                                 example: IN-TN-A-260654568
 *                               species:
 *                                 type: string
 *                                 example: Vannamei
 *                               grade:
 *                                 type: string
 *                                 example: A
 *                               weight_kg:
 *                                 type: number
 *                                 example: 18.75
 *                               packing_status:
 *                                 type: string
 *                                 example: LOADED
 *                               loaded:
 *                                 type: boolean
 *                                 example: true
 *                               loaded_at:
 *                                 type: string
 *                                 format: date-time
 *                               vehicle_number:
 *                                 type: string
 *                                 example: TN51AB4321
 *                               transport_operator_rv_id:
 *                                 type: string
 *                                 example: RV-TR-009
 *                               transport_operator_name:
 *                                 type: string
 *                                 example: Prakash Kumar
 *                               chain_of_custody_status:
 *                                 type: string
 *                                 example: LOADED
 *       401:
 *         description: Missing or invalid bearer token
 *       403:
 *         description: User cannot access another trader's transport loading details
 *       404:
 *         description: No packed crates found for harvest
 */
router.post("/scan", TRANSPORT_LOADING_SCAN, scanTransportLoadingController);
router.get("/harvest/:harvest_id/progress", TRANSPORT_LOADING_VIEW, getTransportLoadingProgressController);

export default router;
