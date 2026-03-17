import express from "express";
import upload from "../../shared/middlewares/upload.js";
import * as pondController from "./controller.js";

const router = express.Router();

router.post("/register", upload.single("image"), pondController.registerPond);
router.get("/:id", pondController.getPondById);
router.get("/", pondController.getAllPonds);
router.put("/:id", pondController.updatePond);
router.delete("/:id", pondController.deletePond);
router.get("/code/:code", pondController.getPondsByCode);


const pondRoutes = router;
export default pondRoutes;
