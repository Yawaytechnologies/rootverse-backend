import express from "express";


import {
  createFarmController,
  getAllFarmsController,
  getFarmByIdController,
  getFarmByFarmIdController,
  updateFarmController,
  deleteFarmController,
} from "./controller.js";

const router = express.Router();

router.post("/", createFarmController);

router.get("/", getAllFarmsController);

router.get("/farm-id/:farm_id", getFarmByFarmIdController);

router.get("/:id", getFarmByIdController);

router.put("/:id", updateFarmController);

router.delete("/:id", deleteFarmController);

export default router;