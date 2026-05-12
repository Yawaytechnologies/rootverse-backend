import express from "express";

import { createCultureCycleController, getAllCultureCyclesController, getCultureCycleByIdController, getCultureCycleByUserIdController, getCultureCyclesByFarmIdAndPondIdController, getCultureCyclesByFarmIdController, getCultureCyclesByVerificationStatusController, updateVerificationStatusController } from "./cultures_cycle_controller.js";

const router = express.Router();

router.post("/", createCultureCycleController);
router.get("/", getAllCultureCyclesController);
router.get("/user/:user_id", getCultureCycleByUserIdController);
router.get("/farm/:farm_id/pond/:pond_id", getCultureCyclesByFarmIdAndPondIdController);
router.get("/farm/:farm_id", getCultureCyclesByFarmIdController);
router.get("/verification-status/:verification_status", getCultureCyclesByVerificationStatusController);
router.get("/:id", getCultureCycleByIdController);
router.put("/:id/verification-status", updateVerificationStatusController);

export default router;
