import express from "express";
import {
  getDashboardController, listAssignedController,
  listInTransitController, scanPickupController,
  logTemperatureController, deliverController,
} from "./controller.js";
import { requireRole } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

const TR_OP = requireRole("TRANSPORT_OPERATOR");

// Protected - transport operator only
router.get("/dashboard", TR_OP, getDashboardController);
router.get("/assigned-crates", TR_OP, listAssignedController);
router.get("/in-transit", TR_OP, listInTransitController);
router.post("/crates/scan-pickup", TR_OP, scanPickupController);
router.post("/crates/:crateId/temperature", TR_OP, logTemperatureController);
router.post("/crates/:crateId/deliver", TR_OP, deliverController);

export default router;
