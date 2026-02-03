import { createLocationController, getLocationController, getLocationsByDistrictController, updateLocationController, getAllLocationsController, deleteLocationController } from "./location_controller.js";

import express from "express";

const router = express.Router();

router.post("/", createLocationController);
router.get("/", getAllLocationsController);
router.get("/:id", getLocationController);
router.get("/district/:district_id", getLocationsByDistrictController);
router.put("/:id", updateLocationController);
router.delete("/:id", deleteLocationController);



export default router;


