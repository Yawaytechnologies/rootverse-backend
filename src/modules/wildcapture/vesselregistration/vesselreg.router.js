// src/modules/wildcapture/vesselreg/vesselreg.router.js
import express from "express";
import vesselRouter from "./vesselreg.router.js";
import {
  createVessel,
  getAllVessels,
  getVesselById,
  patchVessel,
} from "./vesselreg.controller.js";

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Vessel
 *     description: Wild-capture vessel registry
 *
 * components:
 *   schemas:
 *     Vessel:
 *       type: object
 *       properties:
 *         rv_vessel_id: { type: string, example: "RV-VES-TN-000001" }
 *         govt_registration_number: { type: string, example: "TN-WC-00123" }
 *         local_identifier: { type: string, example: "LOCAL-22", nullable: true }
 *         vessel_name: { type: string, example: "Sea Queen" }
 *         home_port: { type: string, example: "Thoothukudi" }
 *         vessel_type: { type: string, example: "Trawler" }
 *         allowed_fishing_methods:
 *           type: array
 *           items: { type: string }
 *           example: ["Trawl", "Gillnet"]
 *
 *     VesselCreate:
 *       type: object
 *       required: [govt_registration_number, vessel_name, home_port, vessel_type]
 *       properties:
 *         state_code: { type: string, example: "TN" }
 *         govt_registration_number: { type: string, example: "TN-WC-00123" }
 *         local_identifier: { type: string, example: "LOCAL-22" }
 *         vessel_name: { type: string, example: "Sea Queen" }
 *         home_port: { type: string, example: "Thoothukudi" }
 *         vessel_type: { type: string, example: "Trawler" }
 *         allowed_fishing_methods:
 *           type: array
 *           items: { type: string }
 *           example: ["Trawl", "Gillnet"]
 */

/**
 * @openapi
 * /api/vessels:
 *   post:
 *     summary: Register vessel
 *     tags: [Vessel]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/VesselCreate' }
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", createVessel);

/**
 * @openapi
 * /api/vessels:
 *   get:
 *     summary: List vessels
 *     tags: [Vessel]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 20 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, example: 0 }
 *       - in: query
 *         name: q
 *         schema: { type: string, example: "Sea" }
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", getAllVessels);

/**
 * @openapi
 * /api/vessels/{vesselId}:
 *   get:
 *     summary: Get vessel by RV Vessel ID
 *     tags: [Vessel]
 *     parameters:
 *       - in: path
 *         name: vesselId
 *         required: true
 *         schema: { type: string, example: "RV-VES-TN-000001" }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
router.get("/:vesselId", getVesselById);

/**
 * @openapi
 * /api/vessels/{vesselId}:
 *   patch:
 *     summary: Update vessel (partial)
 *     tags: [Vessel]
 *     parameters:
 *       - in: path
 *         name: vesselId
 *         required: true
 *         schema: { type: string, example: "RV-VES-TN-000001" }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200: { description: Updated }
 *       404: { description: Not found }
 */
router.patch("/:vesselId", patchVessel);

export default router;
