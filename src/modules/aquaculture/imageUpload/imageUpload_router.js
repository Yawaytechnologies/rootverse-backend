import { uploadAquacultureImageController, getAquacultureImagesController
 } from "./imageUpload_controller.js";
import express from "express";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/:cultureCycleId/images", upload.single("image"), uploadAquacultureImageController);
router.get("/:cultureCycleId/images", getAquacultureImagesController);

export default router;