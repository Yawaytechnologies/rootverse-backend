import express from "express";
import {
  createTripController,
  getTripPlanController,
  getalTripController,
  updateTipController,
  deleteTripController,
  approveTripPlanController,
  getByOwnerCodeController,
  getByOwnerCodeAndStatusController,
  getAllTripPlansByStatusController,
  getAlltripsByVesselIdController,
  completeTripPlanController
} from "./trip_plan_controller.js";

const router = express.Router();

router.post("/trip", createTripController);
router.get("/trip", getalTripController);
router.get("/trip/:id", getTripPlanController);
router.put("/trip/:id", updateTipController);
router.delete("/trip/:id", deleteTripController);
router.put("/trip/:id/approve", approveTripPlanController);
router.get("/trip/owner/:owner_code", getByOwnerCodeController);
router.get(
  "/trip/owner/:owner_code/status/:approval_status",
  getByOwnerCodeAndStatusController,
);
router.get("/trip/status/:status", getAllTripPlansByStatusController);
router.get("/trip/vessel/:vessel_id", getAlltripsByVesselIdController);
router.put("/trip/:id/complete", completeTripPlanController);

export default router;
