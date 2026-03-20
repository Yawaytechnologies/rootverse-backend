import express from "express";
import {
  loginController, getDashboardController, listCratesController,
  receiveCrateController, getCrateDetailController,
  logTemperatureController, assignDispatchController,
} from "./controller.js";
import { requireRole } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

const CC_OP = requireRole("COLLECTION_CENTRE_OPERATOR");

// Auth (public)
router.post("/auth/login", loginController);

// Protected - collection centre operator only
router.get("/dashboard", CC_OP, getDashboardController);
router.get("/crates", CC_OP, listCratesController);
router.post("/crates/receive", CC_OP, receiveCrateController);
router.get("/crates/:crateId", CC_OP, getCrateDetailController);
router.post("/crates/:crateId/temperature", CC_OP, logTemperatureController);
router.post("/crates/:crateId/assign-dispatch", CC_OP, assignDispatchController);

export default router;
