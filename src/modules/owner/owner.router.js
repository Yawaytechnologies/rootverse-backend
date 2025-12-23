import express from "express";
import { createOwner } from "./owner.controller.js";
import { upload } from "../../shared/middlewares/upload.js";

const router = express.Router();

router.post("/owner", upload.any(), createOwner);


export default router;
