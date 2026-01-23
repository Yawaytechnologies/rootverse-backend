import db from "../../config/db.js";
import { signToken } from "../auth/utils/token.js";

export const loginService = async (req) => {
  const cleanPhone = String(req.body?.phone_no || "").trim();
  if (!cleanPhone) throw new Error("phone_no is required");

  const owner = await db("rootverse_users")
    .select("id", "rootverse_type", "verification_status", "owner_id")
    .where({ phone_no: cleanPhone })
    .first();

  if (owner) {
    if (owner.verification_status !== "VERIFIED")
      throw new Error("User not verified");

    return signToken({
      id: owner.owner_id,
    });
  }

  const qualityChecker = await db("quality_checker")
    .select("id", "rootverse_type", "checker_code")
    .where({ checker_phone: cleanPhone })
    .first();

  if (qualityChecker) {
    return signToken({
      id: qualityChecker.checker_code,
    });
  }

  throw new Error("User not found");
};
