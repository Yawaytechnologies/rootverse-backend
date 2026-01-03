import express from "express";
import {
  createVessel,
  getAllVessels,
  getVesselById,
  patchVessel,
  deleteVessel,
} from "./vesselreg.controller.js";

const router = express.Router();

// ✅ clean routes
router.post("/", createVessel);
router.get("/", getAllVessels);

// vesselId can be numeric id OR RV-VES-...
router.get("/:vesselId", getVesselById);
router.patch("/:vesselId", patchVessel);
router.delete("/:vesselId", deleteVessel);

export default router;
