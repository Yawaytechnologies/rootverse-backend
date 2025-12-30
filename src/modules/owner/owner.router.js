import express from "express";
import { createOwner, verifyOwnerController, listOwners, getOwnerController, updateOwnerController } from "./owner.controller.js";
import { upload } from "../../shared/middlewares/upload.js";

const router = express.Router();

router.post("/owner", upload.any(), createOwner);
router.post("/owner/:id/verify", verifyOwnerController);

router.get("/owner", listOwners);
router.get("/owner/:id", getOwnerController);
router.put("/owner/:id", upload.any(), updateOwnerController);

export default router;
