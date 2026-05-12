import express from "express";

import {
  createPondController,
  getAllPondsController,
  getPondByIdController,
  getPondsByFarmIdController,
  updatePondController,
  deletePondController,
  updatePondStatusController,
  updatePondVerificationStatusController,
  getActivePondsController,
  getVerifiedPondsController,
} from "./controller.js";

const router = express.Router();

router.post("/", createPondController);

router.get("/", getAllPondsController);

// Must come before "/:id"
router.get("/active", getActivePondsController);
router.get("/verified", getVerifiedPondsController);
router.get("/farm/:farm_id", getPondsByFarmIdController);

// Must come after fixed routes
router.get("/:id", getPondByIdController);

router.put("/:id", updatePondController);
router.delete("/:id", deletePondController);

router.put("/:id/status", updatePondStatusController);
router.put("/:id/verification-status", updatePondVerificationStatusController);

export default router;