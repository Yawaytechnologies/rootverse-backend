import * as controller from "./controller.js";
import express from "express";

const router = express.Router();

router.post("/create-batch", controller.createQrBatch);
router.get("/:code", controller.getQrByCode);
router.put("/:id", controller.updateQr);
router.get("/", controller.listQrs);


const crateQrRoutes = router;
export default crateQrRoutes;