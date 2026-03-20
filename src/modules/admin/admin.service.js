import {
  createAdmin, getAllAdmins, deleteAdmin, updateAdmin, findAdminByLoginId,
  insertCentre, findCentreById, listCentres, updateCentre,
  insertCCOperator, insertTransportOperator, setOperatorStatus,
  listAllCrates, getCrateDetail, listAssignments, listTemperatureLogs,
  overrideCrateStatus, getDashboardSummary, listAllUsers,
} from "./admin.model.js";
import db from "../../shared/lib/db.js";
import { signToken } from "../auth/utils/token.js";
import bcrypt from "bcryptjs";

// ── Admin auth ────────────────────────────────────────────────────────────────

export async function registerAdmin(payload) {
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const admin = await createAdmin({ ...payload, password: hashedPassword });
  return admin;
}

export async function loginAdmin(req) {
  // Accept either legacy { email } or new { login_id }
  const loginId = String(req.body?.login_id || req.body?.email || "").trim();
  const password = String(req.body?.password || "").trim();
  if (!loginId) throw new Error("login_id is required");
  if (!password) throw new Error("password is required");

  const admin = await findAdminByLoginId(loginId);
  if (!admin) throw new Error("Admin not found");

  let valid = false;
  if (admin.password && admin.password.startsWith("$")) {
    valid = await bcrypt.compare(password, admin.password);
  } else {
    valid = password === admin.password;
  }
  if (!valid) throw new Error("Invalid password");

  const access_token = signToken({ id: admin.id, role: "ADMIN" });
  const refresh_token = signToken({ id: admin.id, role: "ADMIN", type: "refresh" }, "7d");

  return { access_token, refresh_token, token_type: "Bearer", role: "ADMIN", user: { id: admin.id, full_name: admin.username, email: admin.email } };
}

export async function getAdminById(id) {
  const admin = await db("admin")
    .select("id", "username", "email", "phone", "address", "date_of_birth", "created_at", "updated_at")
    .where({ id })
    .first();
  if (!admin) throw new Error("Admin not found");
  return admin;
}

export async function getAllAdminsService() {
  return getAllAdmins();
}

export async function deleteAdminService(id) {
  return deleteAdmin(id);
}

export async function updateAdminService(id, payload) {
  return updateAdmin(id, payload);
}

// ── Collection centres ────────────────────────────────────────────────────────

export async function createCentre(payload) {
  const required = ["centre_id", "centre_name", "district", "state", "address_line_1"];
  for (const f of required) {
    if (!payload[f]) throw new Error(`${f} is required`);
  }
  const existing = await findCentreById(payload.centre_id);
  if (existing) throw new Error(`Centre ${payload.centre_id} already exists`);

  const [centre] = await insertCentre({
    centre_id: payload.centre_id,
    centre_name: payload.centre_name,
    district: payload.district,
    state: payload.state,
    address_line_1: payload.address_line_1,
    address_line_2: payload.address_line_2 || null,
    pincode: payload.pincode || null,
    gps_lat: payload.gps_lat || null,
    gps_lng: payload.gps_lng || null,
    cold_storage_capacity_kg: payload.cold_storage_capacity_kg || null,
    contact_name: payload.contact_name || null,
    contact_mobile: payload.contact_mobile || null,
    status: payload.status || "ACTIVE",
  });
  return centre;
}

export function listCentresService(query) {
  return listCentres(query);
}

export async function getCentreService(centreId) {
  const centre = await findCentreById(centreId);
  if (!centre) throw new Error("Centre not found");
  return centre;
}

export async function updateCentreService(centreId, payload) {
  const rows = await updateCentre(centreId, payload);
  if (!rows.length) throw new Error("Centre not found");
  return rows[0];
}

// ── Operator registration ─────────────────────────────────────────────────────

export async function createCCOperator(payload) {
  const required = ["operator_rv_id", "full_name", "email", "mobile", "password", "centre_id"];
  for (const f of required) {
    if (!payload[f]) throw new Error(`${f} is required`);
  }
  const centre = await findCentreById(payload.centre_id);
  if (!centre) throw new Error("Collection centre not found");

  const password_hash = await bcrypt.hash(payload.password, 10);
  const [op] = await insertCCOperator({
    operator_rv_id: payload.operator_rv_id,
    full_name: payload.full_name,
    email: payload.email,
    mobile: payload.mobile,
    password_hash,
    centre_id: payload.centre_id,
    designation: payload.designation || null,
    is_active: payload.is_active !== undefined ? payload.is_active : true,
  });
  const { password_hash: _, ...safe } = op;
  return safe;
}

export async function createTransportOperator(payload) {
  const required = ["operator_rv_id", "full_name", "email", "mobile", "password", "transport_id", "vehicle_no"];
  for (const f of required) {
    if (!payload[f]) throw new Error(`${f} is required`);
  }
  const password_hash = await bcrypt.hash(payload.password, 10);
  const [op] = await insertTransportOperator({
    operator_rv_id: payload.operator_rv_id,
    full_name: payload.full_name,
    email: payload.email,
    mobile: payload.mobile,
    password_hash,
    transport_id: payload.transport_id,
    vehicle_no: payload.vehicle_no,
    route_name: payload.route_name || null,
    vehicle_type: payload.vehicle_type || null,
    is_active: payload.is_active !== undefined ? payload.is_active : true,
  });
  const { password_hash: _, ...safe } = op;
  return safe;
}

export async function updateOperatorStatusService(operatorId, { status }) {
  const validStatuses = ["active", "inactive", "suspended"];
  if (!validStatuses.includes(status))
    throw new Error("status must be active, inactive, or suspended");

  const result = await setOperatorStatus(operatorId, status === "active");
  if (!result) throw new Error("Operator not found");
  return result;
}

// ── Monitoring ────────────────────────────────────────────────────────────────

export function getDashboardSummaryService(query) {
  return getDashboardSummary(query.date);
}

export function listAllCratesService(query) {
  return listAllCrates(query);
}

export async function getCrateDetailService(crateId) {
  const detail = await getCrateDetail(crateId);
  if (!detail) throw new Error("Crate not found");
  return detail;
}

export function listAssignmentsService(query) {
  return listAssignments(query);
}

export function listTemperatureLogsService(query) {
  return listTemperatureLogs(query);
}

export async function overrideCrateStatusService(crateId, payload) {
  const required = ["new_status", "reason_code", "reason_text", "admin_id"];
  for (const f of required) {
    if (!payload[f]) throw new Error(`${f} is required`);
  }
  const updated = await overrideCrateStatus(crateId, payload);
  if (!updated) throw new Error("Crate not found");
  return updated;
}

export function listAllUsersService(query) {
  return listAllUsers(query);
}
