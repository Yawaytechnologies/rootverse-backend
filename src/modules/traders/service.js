import bcrypt from "bcryptjs";
import { signToken } from "../auth/utils/token.js";
import * as repo from "./repository.js";

const CRATE_STATUSES = [
  "RECEIVED_AT_COLLECTION_CENTRE",
  "SCHEDULED_FOR_DISPATCH",
  "IN_TRANSIT",
  "DELIVERED",
  "HOLD",
  "CANCELLED",
];

const requireFields = (payload, fields) => {
  for (const field of fields) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
      throw new Error(`${field} is required`);
    }
  }
};

const buildCode = (prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}`;

export async function registerTrader(payload) {
  requireFields(payload, ["organization_name", "email", "mobile", "password"]);

  const password_hash = await bcrypt.hash(String(payload.password), 10);
  const [trader] = await repo.createTrader({
    trader_code: payload.trader_code || buildCode("TR"),
    organization_name: payload.organization_name,
    contact_name: payload.contact_name || null,
    email: payload.email,
    mobile: payload.mobile,
    password_hash,
    address: payload.address || null,
    state: payload.state || null,
    district: payload.district || null,
    organization_type: "TRADER",
    is_active: payload.is_active !== undefined ? payload.is_active : true,
  });

  return trader;
}

export async function loginTrader(payload) {
  const loginId = String(payload?.login_id || payload?.email || payload?.mobile || "").trim();
  const password = String(payload?.password || "").trim();
  if (!loginId) throw new Error("login_id is required");
  if (!password) throw new Error("password is required");

  const trader = await repo.findTraderByLoginId(loginId);
  if (!trader) throw new Error("Trader not found");
  if (!trader.is_active) throw new Error("Trader account is inactive");

  const valid = await bcrypt.compare(password, trader.password_hash);
  if (!valid) throw new Error("Invalid password");

  const tokenPayload = { id: trader.id, role: "TRADER_ADMIN", trader_id: trader.id, trader_code: trader.trader_code };
  return {
    access_token: signToken(tokenPayload),
    refresh_token: signToken({ ...tokenPayload, type: "refresh" }, "7d"),
    token_type: "Bearer",
    role: "TRADER_ADMIN",
    user: {
      id: trader.id,
      trader_code: trader.trader_code,
      organization_name: trader.organization_name,
      email: trader.email,
      mobile: trader.mobile,
    },
  };
}

export const getTraderProfile = (user) => repo.findTraderById(user.trader_id || user.id);

export const listTraders = (query) => repo.listTraders(query);

export async function createQualityChecker(traderId, payload) {
  requireFields(payload, ["checker_name", "checker_email", "checker_phone", "state_id", "district_id"]);

  const [checker] = await repo.insertQualityChecker({
    checker_name: payload.checker_name,
    checker_email: payload.checker_email,
    checker_phone: payload.checker_phone,
    state_id: payload.state_id,
    district_id: payload.district_id,
    location_id: payload.location_id || null,
    checker_code: payload.checker_code || buildCode("QC"),
    is_active: payload.is_active !== undefined ? payload.is_active : true,
    trader_id: traderId,
  });

  return checker;
}

export const listQualityCheckers = (traderId) => repo.listQualityCheckersByTrader(traderId);

export async function createCratePacker(traderId, payload) {
  requireFields(payload, ["name", "phone", "address", "email", "date_of_birth"]);

  const [packer] = await repo.insertCratePacker({
    name: payload.name,
    phone: payload.phone,
    address: payload.address,
    email: payload.email,
    date_of_birth: payload.date_of_birth,
    location_id: payload.location_id || null,
    status: payload.status || "active",
    trader_id: traderId,
  });

  return packer;
}

export const listCratePackers = (traderId) => repo.listCratePackersByTrader(traderId);

export async function createTransportOperator(traderId, payload) {
  requireFields(payload, ["full_name", "email", "mobile", "password", "transport_id", "vehicle_no"]);

  const password_hash = await bcrypt.hash(String(payload.password), 10);
  const [operator] = await repo.insertTransportOperator({
    operator_rv_id: payload.operator_rv_id || buildCode("TO"),
    full_name: payload.full_name,
    email: payload.email,
    mobile: payload.mobile,
    password_hash,
    transport_id: payload.transport_id,
    vehicle_no: payload.vehicle_no,
    route_name: payload.route_name || null,
    vehicle_type: payload.vehicle_type || null,
    is_active: payload.is_active !== undefined ? payload.is_active : true,
    trader_id: traderId,
  });

  return operator;
}

export const listTransportOperators = (traderId) => repo.listTransportOperatorsByTrader(traderId);

export const getDashboard = (traderId) => repo.getDashboardCounts(traderId);

export const listCrates = (traderId, query) => repo.listCratesByTrader(traderId, query);

export async function updateCrateProgress(traderId, crateId, payload, user) {
  requireFields(payload, ["status"]);
  if (!CRATE_STATUSES.includes(payload.status)) {
    throw new Error(`status must be one of: ${CRATE_STATUSES.join(", ")}`);
  }

  const crate = await repo.findTraderCrateById(traderId, crateId);
  if (!crate) throw new Error("Crate not found for this trader");

  const updated = await repo.updateCrateStatus(crateId, {
    custody_status: payload.status,
    current_custodian_role: payload.current_custodian_role || crate.current_custodian_role || "TRADER_ADMIN",
    current_custodian_id: payload.current_custodian_id || String(traderId),
    updated_at: new Date(),
  });

  await repo.insertProgressEvent({
    trader_id: traderId,
    entity_type: "CRATE",
    entity_id: String(crateId),
    from_status: crate.custody_status || null,
    to_status: payload.status,
    actor_role: user.role,
    actor_id: String(user.id),
    remarks: payload.remarks || null,
  });

  return updated;
}
