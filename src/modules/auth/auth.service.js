import db from "../../config/db.js";
import { signToken } from "../auth/utils/token.js";

export const loginService = async (req) => {
  const cleanPhone = String(req.body?.phone_no || "").trim();
  if (!cleanPhone) throw new Error("phone_no is required");

  const user = await db("rootverse_users")
    .select("id", "rootverse_type", "verification_status", "phone_no")
    .where({ phone_no: cleanPhone })
    .first();

  if (!user) throw new Error("User not found");
  if (user.verification_status !== "VERIFIED") throw new Error("User not verified");

  const token = signToken({
    user_id: user.id,
    role: user.rootverse_type,
  });

  return token;
};
