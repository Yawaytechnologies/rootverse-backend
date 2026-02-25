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

    if (!owner.owner_id) {
      throw new Error("Owner ID not found for user");
    }

    return signToken({
      id: owner.owner_id,
    });
  }

  const qualityChecker = await db("quality_checker")
    .select("id", "rootverse_type", "checker_code")
    .where({ checker_phone: cleanPhone })
    .first();

  if (qualityChecker) {
    if (!qualityChecker.checker_code) {
      throw new Error("Checker code not found for user");
    }

    return signToken({
      id: qualityChecker.checker_code,
    });
  }
  const cratePacker = await db("crate_packers")
    .select("code")
    .where({ phone: cleanPhone })
    .first(); 
  if (cratePacker) {
    return signToken({
      id: cratePacker.code,
    });
  }

  throw new Error("User not found");
};
