import express from "express";
import upload from "../../../shared/middlewares/upload.js";
import {
  createQualityInspectionController,
  getQualityInspectionByIdController,
  getQualityInspectionPrefillController,
  getQualityInspectionsByStatusController,
  listQualityInspectionsController,
  getQualityCheckerActivityController,
} from "./qualityInspection_controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/aquaculture/quality-inspection/checker/{quality_checker_id}/activity:
 *   get:
 *     summary: Get a quality checker's inspection history and totals by ID
 *     tags: [Aquaculture Quality Inspection]
 *     parameters:
 *       - { in: path, name: quality_checker_id, required: true, schema: { type: integer } }
 *       - { in: query, name: harvest_id, schema: { type: integer } }
 *       - { in: query, name: date_from, schema: { type: string, format: date } }
 *       - { in: query, name: date_to, schema: { type: string, format: date } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: page_size, schema: { type: integer, default: 20, maximum: 100 } }
 *     responses:
 *       200: { description: Quality checker profile, totals, and full inspection records }
 *       404: { description: Quality checker not found }
 */
router.get("/checker/:quality_checker_id/activity", getQualityCheckerActivityController);
router.get("/scan/:qr_code", getQualityInspectionPrefillController);
router.post("/", upload.array("shrimp_images", 5), createQualityInspectionController);
router.get("/", listQualityInspectionsController);
router.get("/inspection-status/:inspection_status", getQualityInspectionsByStatusController);
router.get("/:id", getQualityInspectionByIdController);

export default router;
