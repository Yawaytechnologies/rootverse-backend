import db from "../../shared/lib/db.js";
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
      role: "OWNER",
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
      role: "QUALITY_CHECKER",
    });
  }

  const cratePacker = await db("crate_packer")
    .select("code")
    .where({ phone: cleanPhone })
    .first();
  if (cratePacker) {
    return signToken({
      id: cratePacker.code,
      role: "CRATE_PACKER",
    });
  }

  const ccOperator = await db("collection_centre_operators")
    .select("id", "operator_rv_id", "centre_id", "is_active")
    .where({ mobile: cleanPhone })
    .first();
  if (ccOperator) {
    if (!ccOperator.is_active) throw new Error("Account is inactive");
    return signToken({
      id: ccOperator.id,
      role: "COLLECTION_CENTRE_OPERATOR",
      centre_id: ccOperator.centre_id,
      operator_rv_id: ccOperator.operator_rv_id,
    });
  }

  const transportOperator = await db("transport_operators")
    .select("id", "operator_rv_id", "transport_id", "is_active")
    .where({ mobile: cleanPhone })
    .first();
  if (transportOperator) {
    if (!transportOperator.is_active) throw new Error("Account is inactive");
    return signToken({
      id: transportOperator.id,
      role: "TRANSPORT_OPERATOR",
      transport_id: transportOperator.transport_id,
      operator_rv_id: transportOperator.operator_rv_id,
    });
  }

  throw new Error("User not found");
};

export const getMeService = async (user) => {
  const { id, role } = user;

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    const admin = await db("admin")
      .select("id", "username as full_name", "email", "phone as mobile", "created_at")
      .where({ id })
      .first();
    if (admin) return { ...admin, role: "ADMIN" };
  }

  if (role === "COLLECTION_CENTRE_OPERATOR") {
    const op = await db("collection_centre_operators")
      .select("id", "operator_rv_id", "full_name", "email", "mobile", "centre_id", "designation", "is_active", "created_at")
      .where({ id })
      .first();
    if (op) return { ...op, role: "COLLECTION_CENTRE_OPERATOR" };
  }

  if (role === "TRANSPORT_OPERATOR") {
    const op = await db("transport_operators")
      .select("id", "operator_rv_id", "full_name", "email", "mobile", "transport_id", "vehicle_no", "route_name", "is_active", "created_at")
      .where({ id })
      .first();
    if (op) return { ...op, role: "TRANSPORT_OPERATOR" };
  }

  if (role === "OWNER") {
    const owner = await db("rootverse_users")
      .select("id", "owner_id", "username", "phone_no", "address", "rootverse_type", "verification_status", "profile_picture_url", "created_at", "updated_at")
      .where({ owner_id: id })
      .first();
    if (owner) return { ...owner, role: "OWNER" };
  }

  if (role === "QUALITY_CHECKER") {
    const qc = await db("quality_checker")
      .select("id", "checker_code", "checker_name", "checker_phone", "rootverse_type", "state_id", "district_id", "location_id", "created_at")
      .where({ checker_code: id })
      .first();
    if (qc) return { ...qc, role: "QUALITY_CHECKER" };
  }

  if (role === "CRATE_PACKER") {
    const cp = await db("crate_packer")
      .select("id", "code", "name", "phone", "created_at")
      .where({ code: id })
      .first();
    if (cp) return { ...cp, role: "CRATE_PACKER" };
  }

  throw new Error("Profile not found");
};
