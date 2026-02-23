import { createAdminController, loginAdminController, getAdminDetailsController, getAllAdminsController, updateAdminController, deleteAdminController } from "./admin.controller.js";
import express from "express";
import { requireAuth } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", createAdminController);
router.post("/login", loginAdminController);
router.get("/me", requireAuth, getAdminDetailsController);
router.get("/", requireAuth, getAllAdminsController);
router.put("/:id", requireAuth, updateAdminController);
router.delete("/:id", requireAuth, deleteAdminController);


export default router;