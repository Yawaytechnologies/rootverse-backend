import express from "express";

import {
  activateFarmQrController,
  activatePondQrController,
  generateAquacultureQrController,
  getAquacultureQrByCodeController,
  getAquacultureQrByIdController,
  listAquacultureQrsController,
} from "./qrs_generation_controller.js";

const router = express.Router();

router.get("/", listAquacultureQrsController);
router.get("/code/:code", getAquacultureQrByCodeController);
router.get("/:id", getAquacultureQrByIdController);
router.post("/generate", generateAquacultureQrController);
router.patch("/farm/:farm_id/activate/:qr_id", activateFarmQrController);
router.patch("/pond/:pond_id/activate/:qr_id", activatePondQrController);

export default router;
