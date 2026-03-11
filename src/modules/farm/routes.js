import express from "express";
import * as farmController from "./controller.js";
import upload from "../../shared/middlewares/upload.js";

const router = express.Router();

router.post("/register", upload.single("image"), farmController.registerFarm);
router.get("/:id", farmController.getFarmById);
router.get("/", farmController.getAllFarms);
router.get("/code/:code", farmController.getFarmsByCode);
router.put("/:id", farmController.updateFarm);
router.delete("/:id", farmController.deleteFarm);
router.get("/filter", farmController.getFarmsByFilter);

const farmRoutes = router;
export default farmRoutes;
