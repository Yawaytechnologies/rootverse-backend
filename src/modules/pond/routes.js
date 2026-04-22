import express from "express";

import {
  createPondController,
  getAllPondsController,
  getPondByIdController,
  getPondsByFarmIdController,
  updatePondController,
  deletePondController,
} from "./controller.js";

const router = express.Router();

router.post("/", createPondController);

router.get("/", getAllPondsController);

router.get("/farm/:farm_id", getPondsByFarmIdController);

router.get("/:id", getPondByIdController);

router.put("/:id", updatePondController);

router.delete("/:id", deletePondController);

export default router;