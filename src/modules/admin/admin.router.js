import express from "express";
import { requireAuth } from "../../shared/middlewares/auth.middleware.js";
import {
  createAdminController, loginAdminController, getAdminDetailsController,
  getAllAdminsController, updateAdminController, deleteAdminController,
  createCentreController, listCentresController, getCentreController, updateCentreController,
  createCCOperatorController, createTransportOperatorController, updateOperatorStatusController,
  getDashboardSummaryController, listAllCratesController, getCrateDetailController,
  overrideCrateStatusController, listAssignmentsController, listTemperatureLogsController,
  listAllUsersController,
} from "./admin.controller.js";

const router = express.Router();

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post("/", createAdminController);          // register admin
router.post("/login", loginAdminController);       // admin login (supports login_id or email)

// ── Admin profile (protected) ─────────────────────────────────────────────────
router.get("/me", requireAuth, getAdminDetailsController);
router.get("/", requireAuth, getAllAdminsController);
router.put("/:id", requireAuth, updateAdminController);
router.delete("/:id", requireAuth, deleteAdminController);

// ── Collection centre management (protected) ──────────────────────────────────
router.post("/collection-centres", requireAuth, createCentreController);
router.get("/collection-centres", requireAuth, listCentresController);
router.get("/collection-centres/:centreId", requireAuth, getCentreController);
router.patch("/collection-centres/:centreId", requireAuth, updateCentreController);

// ── Operator registration (protected) ─────────────────────────────────────────
router.post("/operators/collection-centre", requireAuth, createCCOperatorController);
router.post("/operators/transport", requireAuth, createTransportOperatorController);
router.patch("/operators/:operatorId/status", requireAuth, updateOperatorStatusController);

// ── Monitoring (protected) ────────────────────────────────────────────────────
router.get("/dashboard/summary", requireAuth, getDashboardSummaryController);
router.get("/crates", requireAuth, listAllCratesController);
router.get("/crates/:crateId", requireAuth, getCrateDetailController);
router.patch("/crates/:crateId/status", requireAuth, overrideCrateStatusController);
router.get("/assignments", requireAuth, listAssignmentsController);
router.get("/temperature-logs", requireAuth, listTemperatureLogsController);
router.get("/users", requireAuth, listAllUsersController);

export default router;
