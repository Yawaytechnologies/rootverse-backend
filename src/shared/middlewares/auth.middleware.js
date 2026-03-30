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

/**
 * Role-aware auth middleware for /api/v1 routes.
 * Pass one or more allowed roles; JWT must carry one of them.
 */
export const requireRole = (...roles) =>
  (req, res, next) => {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "MISSING_OR_BAD_AUTH_HEADER" });
    }

    try {
      const decoded = verifyToken(token);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "INSUFFICIENT_PERMISSIONS" });
      }

      return next();
    } catch (e) {
      return res.status(401).json({ error: "INVALID_OR_EXPIRED_TOKEN" });
    }
  };
