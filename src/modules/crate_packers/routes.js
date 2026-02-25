import express from "express";
import * as controller from "./controller.js";

const router = express.Router();

router.post("/", controller.createCratePacker);
router.get("/:id", controller.getCratePackerById);
router.put("/:id", controller.updateCratePacker);
router.delete("/:id", controller.deleteCratePacker);
router.get("/", controller.listCratePackers);

const cratePackerRoutes = router;
export default cratePackerRoutes;
