import express from "express";
import { createSuperAdminController, loginSuperAdminController, getSuperAdminDetailsController, getAllSuperAdminsController, deleteSuperAdminController, updateSuperAdminController } from "./super_admin_controller.js";
import { requireAuth } from "../../shared/middlewares/auth.middleware.js";


const router = express.Router();

router.post("/super-admin", createSuperAdminController);
router.post("/super-admin/login", loginSuperAdminController);
router.get("/super-admin/me", requireAuth, getSuperAdminDetailsController);
router.get("/super-admins", requireAuth, getAllSuperAdminsController);
router.put("/super-admin/:id", requireAuth, updateSuperAdminController);
router.delete("/super-admin/:id", requireAuth, deleteSuperAdminController);


export default router;
