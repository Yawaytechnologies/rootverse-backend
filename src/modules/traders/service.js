import { signToken } from "../auth/utils/token.js";
import { uploadFile } from "../../shared/services/storage.service.js";
import { generateKey } from "../../shared/utils/storageKey.js";
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

const TRADER_TYPES = ["Individual", "Company", "Partnership"];
const MARKETS = ["Export", "Domestic", "Both"];

const normalizeChoice = (value, allowed, field) => {
  const normalized = allowed.find((item) => item.toLowerCase() === String(value || "").trim().toLowerCase());
  if (!normalized) throw new Error(`${field} must be one of: ${allowed.join(", ")}`);
  return normalized;
};

const normalizeDistricts = (value) => {
  if (value === undefined || value === null || value === "") return [];
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  const text = String(value).trim();
  if (text.startsWith("[") && text.endsWith("]")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim()).filter(Boolean);
    } catch {
      throw new Error("operational_districts must be an array or comma-separated string");
    }
  }
  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeYearsOfExperience = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const years = Number(value);
  if (!Number.isInteger(years) || years < 0) throw new Error("years_of_experience must be a non-negative integer");
  return years;
};

const uploadTraderImage = async (traderId, file, type) => {
  if (!file) return null;
  if (!file.mimetype?.startsWith("image/")) {
    throw new Error(`${type} must be an image file`);
  }

  const key = generateKey(`traders/${traderId}/${type}`, file.originalname);
  return uploadFile(file, key);
};

export async function registerTrader(payload, files = {}) {
  requireFields(payload, ["trader_name", "trader_type", "mobile", "email", "address", "markets"]);

  const [trader] = await repo.createTrader({
    trader_code: payload.trader_code || buildCode("TR"),
    profile_image_url: null,
    company_logo_url: null,
    trader_name: payload.trader_name,
    trader_type: normalizeChoice(payload.trader_type, TRADER_TYPES, "trader_type"),
    mobile: payload.mobile,
    email: payload.email,
    address: payload.address,
    operational_districts: normalizeDistricts(payload.operational_districts),
    years_of_experience: normalizeYearsOfExperience(payload.years_of_experience),
    markets: normalizeChoice(payload.markets, MARKETS, "markets"),
    is_active: false,
  });

  const imageUpdates = {};
  const profileImageUrl = await uploadTraderImage(trader.id, files.profileImage, "profile");
  const companyLogoUrl = await uploadTraderImage(trader.id, files.companyLogo, "company_logo");

  if (profileImageUrl) imageUpdates.profile_image_url = profileImageUrl;
  if (companyLogoUrl) imageUpdates.company_logo_url = companyLogoUrl;

  if (!Object.keys(imageUpdates).length) return trader;
  return repo.updateTraderImages(trader.id, imageUpdates);
}

export async function loginTrader(payload) {
  const mobile = String(payload?.mobile || payload?.phone_no || "").trim();
  if (!mobile) throw new Error("mobile is required");

  const trader = await repo.findTraderByMobile(mobile);
  if (!trader) throw new Error("Trader not found");
  if (!trader.is_active) throw new Error("Trader account is inactive");

  const tokenPayload = { id: trader.id, role: "TRADER_ADMIN", trader_id: trader.id, trader_code: trader.trader_code };
  return {
    access_token: signToken(tokenPayload),
    refresh_token: signToken({ ...tokenPayload, type: "refresh" }, "7d"),
    token_type: "Bearer",
    role: "TRADER_ADMIN",
    user: {
      id: trader.id,
      trader_code: trader.trader_code,
      trader_name: trader.trader_name,
      mobile: trader.mobile,
      email: trader.email,
    },
  };
}

export const getTraderProfile = (user) => repo.findTraderById(user.trader_id || user.id);

export const listTraders = (query) => repo.listTraders(query);

export async function updateTraderStatus(traderId, payload) {
  const rawStatus = payload?.status !== undefined ? String(payload.status).trim().toLowerCase() : undefined;
  let isActive = payload?.is_active;

  if (rawStatus !== undefined) {
    if (!["approved", "active", "pending", "rejected", "inactive"].includes(rawStatus)) {
      throw new Error("status must be approved, active, pending, rejected, or inactive");
    }
    isActive = rawStatus === "approved" || rawStatus === "active";
  }

  if (isActive === undefined) throw new Error("status or is_active is required");

  const normalized = isActive === true || String(isActive).trim().toLowerCase() === "true";
  const trader = await repo.updateTraderStatus(traderId, normalized);
  if (!trader) throw new Error("Trader not found");
  return trader;
}

export async function createQualityChecker(traderId, payload) {
  requireFields(payload, ["checker_name", "checker_email", "checker_phone"]);

  const [checker] = await repo.insertQualityChecker({
    checker_name: payload.checker_name,
    checker_email: payload.checker_email,
    checker_phone: payload.checker_phone,
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
  requireFields(payload, ["full_name", "email", "mobile", "transport_id", "vehicle_no"]);

  const [operator] = await repo.insertTransportOperator({
    operator_rv_id: payload.operator_rv_id || buildCode("TO"),
    full_name: payload.full_name,
    email: payload.email,
    mobile: payload.mobile,
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
