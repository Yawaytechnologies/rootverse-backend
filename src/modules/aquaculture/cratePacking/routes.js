import express from "express";
import { requireRole } from "../../../shared/middlewares/auth.middleware.js";
import {
  getCratePackingPrefillController,
  listHarvestCratesController,
  packCratesController,
} from "./controller.js";

const router = express.Router();

const CRATE_PACKING_ACCESS = requireRole("CRATE_PACKER", "TRADER_ADMIN", "ADMIN", "SUPER_ADMIN");

/**
 * @swagger
 * components:
 *   schemas:
 *     AquacultureCratePackingPrefill:
 *       type: object
 *       properties:
 *         pond_id:
 *           type: integer
 *           example: 12
 *         pond_code:
 *           type: string
 *           example: PND-00012
 *         pond_name:
 *           type: string
 *           example: North Pond
 *         pond_qr_scan:
 *           type: string
 *           example: IN-TN-NA-P-2600001
 *         qr_code_id:
 *           type: integer
 *           example: 45
 *         farm_id:
 *           type: integer
 *           example: 8
 *         farm_code:
 *           type: string
 *           example: FARM-00008
 *         farm_name:
 *           type: string
 *           example: Blue Water Farm
 *         culture_id:
 *           type: integer
 *           example: 21
 *         culture_code:
 *           type: string
 *           example: CC-26001
 *         harvest_id:
 *           type: integer
 *           example: 31
 *         species:
 *           type: string
 *           example: Vannamei
 *         size_count_kg:
 *           type: number
 *           nullable: true
 *           example: 42.5
 *         expected_size:
 *           type: string
 *           example: 42.5 Count/kg
 *         expected_biomass:
 *           type: number
 *           example: 1200
 *         grade:
 *           type: string
 *           enum: [A, B, C, D]
 *           example: A
 *         quality_inspection_id:
 *           type: integer
 *           example: 14
 *         trader:
 *           type: object
 *           properties:
 *             trader_id:
 *               type: integer
 *               example: 5
 *             trader_code:
 *               type: string
 *               example: TR-260001
 *             trader_name:
 *               type: string
 *               example: Coastal Traders
 *             mobile:
 *               type: string
 *               example: "9876543210"
 *         crate_packer:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *               example: 3
 *             code:
 *               type: string
 *               example: CP-000003
 *             name:
 *               type: string
 *               example: Suresh D
 *             trader_id:
 *               type: integer
 *               example: 5
 *
 *     AquacultureCratePackingItemRequest:
 *       type: object
 *       required: [crate_qr, weight]
 *       properties:
 *         crate_qr:
 *           type: string
 *           description: Preprinted crate QR code scanned from the crate_qrs master table.
 *           example: IN-TN-A-260654568
 *         weight:
 *           type: number
 *           description: Crate weight in kg. Must be greater than zero.
 *           example: 18.75
 *         grade:
 *           type: string
 *           enum: [A, B, C, D]
 *           description: Optional override. Defaults from quality inspection.
 *           example: A
 *         size_count_kg:
 *           type: number
 *           description: Optional override. Defaults from quality inspection.
 *           example: 42.5
 *
 *     CreateAquacultureCratePackingRequest:
 *       type: object
 *       required: [pond_qr, harvest_id, crates]
 *       properties:
 *         pond_qr:
 *           type: string
 *           description: Pond QR scan used to auto-fetch harvest and quality inspection data.
 *           example: IN-TN-NA-P-2600001
 *         harvest_id:
 *           type: integer
 *           description: Accepted/booked harvest ID.
 *           example: 31
 *         crate_packer_id:
 *           type: integer
 *           description: Required for ADMIN, SUPER_ADMIN, or TRADER_ADMIN calls. CRATE_PACKER token resolves automatically.
 *           example: 3
 *         crate_packer_code:
 *           type: string
 *           description: Alternative to crate_packer_id.
 *           example: CP-000003
 *         gps_latitude:
 *           type: number
 *           example: 13.0827
 *         gps_longitude:
 *           type: number
 *           example: 80.2707
 *         packed_at:
 *           type: string
 *           format: date-time
 *           description: Optional UTC timestamp. Defaults to current server time.
 *           example: 2026-06-20T10:30:00.000Z
 *         remarks:
 *           type: string
 *           example: Packed at farm gate
 *         crates:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AquacultureCratePackingItemRequest'
 *
 *     AquacultureCratePacking:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         crate_qr_id:
 *           type: integer
 *           example: 101
 *         crate_code:
 *           type: string
 *           example: IN-TN-A-260654568
 *         pond_qr_code:
 *           type: string
 *           example: IN-TN-NA-P-2600001
 *         harvest_id:
 *           type: integer
 *           example: 31
 *         quality_inspection_id:
 *           type: integer
 *           example: 14
 *         species:
 *           type: string
 *           example: Vannamei
 *         size_count_kg:
 *           type: number
 *           nullable: true
 *           example: 42.5
 *         weight_kg:
 *           type: number
 *           example: 18.75
 *         grade:
 *           type: string
 *           enum: [A, B, C, D]
 *           example: A
 *         crate_packer_id:
 *           type: integer
 *           example: 3
 *         trader_id:
 *           type: integer
 *           example: 5
 *         gps_latitude:
 *           type: number
 *           nullable: true
 *           example: 13.0827
 *         gps_longitude:
 *           type: number
 *           nullable: true
 *           example: 80.2707
 *         packing_status:
 *           type: string
 *           example: CRATE_PACKED
 *         packed_at:
 *           type: string
 *           format: date-time
 *
 *     AquacultureCratePackingResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Crates packed successfully
 *         data:
 *           allOf:
 *             - $ref: '#/components/schemas/AquacultureCratePackingPrefill'
 *             - type: object
 *               properties:
 *                 crate_count:
 *                   type: integer
 *                   example: 3
 *                 total_weight:
 *                   type: number
 *                   example: 56.25
 *                 crates:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AquacultureCratePacking'
 *
 * /api/aquaculture/crate-packing/scan/{pond_qr}:
 *   get:
 *     summary: Scan pond QR for crate packing prefill
 *     description: >
 *       Auto-fetches the accepted harvest, completed quality inspection, species,
 *       size count/kg, grade, trader, and optional crate packer details. The backend
 *       validates that the harvest is booked, linked to a trader, and quality inspection is completed.
 *     tags: [Aquaculture Crate Packing]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pond_qr
 *         required: true
 *         schema:
 *           type: string
 *         example: IN-TN-NA-P-2600001
 *       - in: query
 *         name: harvest_id
 *         schema:
 *           type: integer
 *         description: Optional accepted harvest ID to bind the scan.
 *       - in: query
 *         name: crate_packer_id
 *         schema:
 *           type: integer
 *         description: Optional for admin/trader calls. CRATE_PACKER token resolves automatically.
 *       - in: query
 *         name: crate_packer_code
 *         schema:
 *           type: string
 *         description: Alternative to crate_packer_id.
 *     responses:
 *       200:
 *         description: Crate packing prefill fetched successfully
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
 *                   example: Crate packing prefill fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/AquacultureCratePackingPrefill'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid bearer token
 *       403:
 *         description: Trader or crate packer cannot access this harvest
 *       404:
 *         description: Active pond QR, booked harvest, quality inspection, or crate packer not found
 *
 * /api/aquaculture/crate-packing:
 *   post:
 *     summary: Pack one or more aquaculture crates
 *     description: >
 *       Stores crate packing details in aquaculture_crate_packings while using crate_qrs
 *       only as the preprinted crate QR master. Validates harvest ID, completed quality inspection,
 *       crate QR existence, unique unassigned crate code, positive weight, authenticated crate packer,
 *       and trader linkage.
 *     tags: [Aquaculture Crate Packing]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAquacultureCratePackingRequest'
 *           example:
 *             pond_qr: IN-TN-NA-P-2600001
 *             harvest_id: 31
 *             crate_packer_id: 3
 *             gps_latitude: 13.0827
 *             gps_longitude: 80.2707
 *             crates:
 *               - crate_qr: IN-TN-A-260654568
 *                 weight: 18.75
 *               - crate_qr: IN-TN-A-260654569
 *                 weight: 19.2
 *                 grade: A
 *     responses:
 *       201:
 *         description: Crates packed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AquacultureCratePackingResponse'
 *       400:
 *         description: Validation error, including weight less than or equal to zero
 *       401:
 *         description: Missing or invalid bearer token
 *       403:
 *         description: Trader or crate packer cannot access this harvest
 *       404:
 *         description: Harvest, quality inspection, crate QR, or crate packer not found
 *       409:
 *         description: Crate QR already assigned
 *
 * /api/aquaculture/crate-packing/harvest/{harvest_id}/crates:
 *   get:
 *     summary: List packed crates for an aquaculture harvest
 *     tags: [Aquaculture Crate Packing]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: harvest_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 31
 *       - in: query
 *         name: trader_id
 *         schema:
 *           type: integer
 *         description: Optional for ADMIN or SUPER_ADMIN. TRADER_ADMIN token is restricted to its own trader.
 *     responses:
 *       200:
 *         description: Harvest crates fetched successfully
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
 *                   example: Harvest crates fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AquacultureCratePacking'
 *       401:
 *         description: Missing or invalid bearer token
 *       403:
 *         description: Trader cannot access another trader's crates
 */
router.get("/scan/:pond_qr", CRATE_PACKING_ACCESS, getCratePackingPrefillController);
router.post("/", CRATE_PACKING_ACCESS, packCratesController);
router.get("/harvest/:harvest_id/crates", CRATE_PACKING_ACCESS, listHarvestCratesController);

export default router;
