import express from "express";

import { createCultureCycleController, getCultureCycleByIdController, getCultureCycleByUserIdController, getCultureCyclesByVerificationStatusController, updateVerificationStatusController } from "./cultures_cycle_controller.js";

const router = express.Router();

router.post("/", createCultureCycleController);
router.get("/user/:user_id", getCultureCycleByUserIdController);
router.get("/:id", getCultureCycleByIdController);
router.get("/verification-status/:verification_status", getCultureCyclesByVerificationStatusController);
router.put("/:id/verification-status", updateVerificationStatusController);

export default router;
