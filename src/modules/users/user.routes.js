import express from "express";
import * as userController from "./user.controller.js";
import { requireAuth } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

router.get("/profile", requireAuth, userController.getUserController);

const userRoutes = router;
export default userRoutes;