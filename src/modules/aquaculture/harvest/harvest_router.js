import express from "express";
import {
  createHarvestController,
  deleteHarvestController,
  getAllHarvestController,
  getHarvestByFarmIdController,
  getHarvestByIdController,
  getHarvestByPondIdController,
  getHarvestByQrCodeController,
  getHarvestByQrCodeIdController,
  getHarvestByTraderIdController,
  updateHarvestBookingStatusController,
  updateHarvestController,
} from "./harvest_controller.js";

const router = express.Router();

router.post("/", createHarvestController);
router.get("/", getAllHarvestController);
router.get("/farm/:farm_id", getHarvestByFarmIdController);
router.get("/pond/:pond_id", getHarvestByPondIdController);
router.get("/qrcode/:qr_code_id", getHarvestByQrCodeIdController);
router.get("/qr-code/:qr_code", getHarvestByQrCodeController);
router.get("/trader/:trader_id", getHarvestByTraderIdController);
router.get("/:id", getHarvestByIdController);
router.patch("/:id/booking", updateHarvestBookingStatusController);
router.put("/:id", updateHarvestController);
router.delete("/:id", deleteHarvestController);

export default router;
