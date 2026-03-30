import express from "express";
import { loginController } from "./auth.contoller.js";
import { getMeService } from "./auth.service.js";
import { requireAuth } from "../../shared/middlewares/auth.middleware.js";
import { verifyToken, signToken } from "./utils/token.js";

const router = express.Router();

// ── Existing phone-based login (owners, quality checkers, crate packers) ──────
router.post("/login", loginController);

// ── /me — returns profile for any authenticated role ──────────────────────────
router.get("/me", requireAuth, async (req, res) => {
  try {
    const profile = await getMeService(req.user);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

// ── /refresh — issue new access token from a refresh token ───────────────────
router.post("/refresh", (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) return res.status(400).json({ success: false, error: "refresh_token is required" });

  try {
    const decoded = verifyToken(refresh_token);
    if (decoded.type !== "refresh") return res.status(400).json({ success: false, error: "Invalid token type" });

    const access_token = signToken({ id: decoded.id, role: decoded.role });
    return res.status(200).json({ success: true, data: { access_token, token_type: "Bearer" } });
  } catch (e) {
    return res.status(401).json({ success: false, error: "Invalid or expired refresh token" });
  }
});

// ── /logout — stateless; client discards the token ───────────────────────────
router.post("/logout", requireAuth, (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

const loginRoutes = router;
export default loginRoutes;
