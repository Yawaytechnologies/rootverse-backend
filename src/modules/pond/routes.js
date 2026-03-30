import express from "express";
import upload from "../../shared/middlewares/upload.js";
import * as pondController from "./controller.js";

const router = express.Router();

router.post("/register", upload.single("image"), pondController.registerPond);
router.get("/code/:code", pondController.getPondsByCode); // must be before /:id
router.get("/", pondController.getAllPonds);
router.get("/:id", pondController.getPondById);
router.put("/:id", pondController.updatePond);
router.delete("/:id", pondController.deletePond);


const pondRoutes = router;
export default pondRoutes;
