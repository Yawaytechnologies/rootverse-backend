import express from "express";
import { createOwner, verifyOwnerController } from "./owner.controller.js";
import { upload } from "../../shared/middlewares/upload.js";

const router = express.Router();

router.post("/owner", upload.any(), createOwner);
router.post("/owner/:id/verify", verifyOwnerController);


export default router;
