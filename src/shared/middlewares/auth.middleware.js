import { verifyToken } from "../../modules/auth/utils/token.js";

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "MISSING_OR_BAD_AUTH_HEADER" });
  }

  try {
    const decoded = verifyToken(token); 
    req.user = decoded;
    return next();
  } catch (e) {
    return res.status(401).json({ error: "INVALID_OR_EXPIRED_TOKEN" });
  }
};
