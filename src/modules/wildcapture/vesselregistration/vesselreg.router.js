import express from "express";
import {
  createVessel,
  getAllVessels,
  getVesselById,
  getVesselsByOwnerIdHandler,
  patchVessel,
  updateVesselById,
  deleteVessel,
} from "./vesselreg.controller.js";

const router = express.Router();

//  clean routes
router.post("/", createVessel);
router.get("/", getAllVessels);

//  MUST come before "/:vesselId" (otherwise "owner" becomes vesselId)
router.get("/owner/:ownerId", getVesselsByOwnerIdHandler);

// vesselId can be numeric id OR RV-VES-...
router.get("/:vesselId", getVesselById);
router.patch("/:vesselId", patchVessel);
router.put("/:vesselId", updateVesselById);
router.delete("/:vesselId", deleteVessel);

export default router;
