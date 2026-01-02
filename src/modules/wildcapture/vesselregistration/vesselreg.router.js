// src/modules/wildcapture/vesselreg/vesselreg.router.js
import express from "express";
import {
  createVessel,
  getAllVessels,
  getVesselById,
  patchVessel,
  deleteVessel,
} from "./vesselreg.controller.js";

const router = express.Router();

router.post("/", createVessel);
router.post("vessel", createVessel); // support both / and /vessel for creation
router.get("/", getAllVessels);
router.get("/:vesselId", getVesselById);
router.patch("/:vesselId", patchVessel);
router.delete("/:vesselId", deleteVessel);

export default router;
