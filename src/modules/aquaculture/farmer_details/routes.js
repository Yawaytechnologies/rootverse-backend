import express from "express";
import {
  createFarmerDetailsController,
  deleteFarmerDetailsByIdController,
  deleteFarmerDetailsByUserIdController,
  getAllFarmerDetailsController,
  getFarmerDetailsByIdController,
  getFarmerDetailsByUserIdController,
  updateFarmerDetailsByUserIdController,
} from "./controller.js";

const router = express.Router();

router.post("/", createFarmerDetailsController);
router.get("/", getAllFarmerDetailsController);
router.get("/user/:user_id", getFarmerDetailsByUserIdController);
router.put("/user/:user_id", updateFarmerDetailsByUserIdController);
router.delete("/user/:user_id", deleteFarmerDetailsByUserIdController);
router.get("/:id", getFarmerDetailsByIdController);
router.delete("/:id", deleteFarmerDetailsByIdController);

export default router;
