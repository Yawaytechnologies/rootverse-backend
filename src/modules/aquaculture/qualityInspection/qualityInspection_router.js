import express from "express";
import upload from "../../../shared/middlewares/upload.js";
import {
  createQualityInspectionController,
  getQualityInspectionByIdController,
  getQualityInspectionPrefillController,
  listQualityInspectionsController,
} from "./qualityInspection_controller.js";

const router = express.Router();

router.get("/scan/:qr_code", getQualityInspectionPrefillController);
router.post("/", upload.array("shrimp_images", 5), createQualityInspectionController);
router.get("/", listQualityInspectionsController);
router.get("/:id", getQualityInspectionByIdController);

export default router;
