import express from "express";
import * as farmController from "./controller.js";
import upload from "../../shared/middlewares/upload.js";

const router = express.Router();

router.post("/register", upload.single("image"), farmController.registerFarm);
router.get("/code/:code", farmController.getFarmsByCode); // must be before /:id
router.get("/", farmController.getAllFarms);
router.get("/:id", farmController.getFarmById);
router.put("/:id", farmController.updateFarm);
router.delete("/:id", farmController.deleteFarm);


const farmRoutes = router;
export default farmRoutes;
