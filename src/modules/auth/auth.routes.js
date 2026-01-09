import { loginController } from "./auth.contoller.js";
import { requireAuth } from "../../shared/middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post("/login", loginController);

const loginRoutes = router;

export default loginRoutes;