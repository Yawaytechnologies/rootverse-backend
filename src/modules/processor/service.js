import db from "../../shared/lib/db.js";
import { signToken } from "../auth/utils/token.js";
import * as repo from "./repository.js";

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const requireFields = (payload, fields) => {
  for (const field of fields) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
      throw createError(`${field} is required`);
    }
  }
};

const normalizeText = (value, fieldName) => {
  const text = String(value ?? "").trim();
  if (!text) throw createError(`${fieldName} is required`);
  return text;
};

const normalizeOptionalNumber = (value, fieldName) => {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number)) throw createError(`Valid ${fieldName} is required`);
  return number;
};

const buildCode = (prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}`;

const validateProcessorId = (processorId) => {
  const id = Number(processorId);
  if (!Number.isInteger(id) || id <= 0) throw createError("processor_id is required");
  return id;
};

// ── Account management ──────────────────────────────────────────────────────
export async function registerProcessor(payload) {
  requireFields(payload, ["processor_name", "email", "mobile"]);

  const mobile = normalizeText(payload.mobile, "mobile");
  const email = normalizeText(payload.email, "email");

  if (await repo.findProcessorByMobile(mobile)) {
    throw createError("A processor with this mobile already exists", 409);
  }
  if (await repo.findProcessorByEmail(email)) {
    throw createError("A processor with this email already exists", 409);
  }

  const [processor] = await repo.createProcessor({
    processor_code: payload.processor_code || buildCode("PR"),
    processor_name: normalizeText(payload.processor_name, "processor_name"),
    contact_name: payload.contact_name || null,
    email,
    mobile,
    address: payload.address || null,
    state: payload.state || null,
    district: payload.district || null,
    gps_latitude: normalizeOptionalNumber(payload.gps_latitude ?? payload.gps_lat, "gps_latitude"),
    gps_longitude: normalizeOptionalNumber(payload.gps_longitude ?? payload.gps_lng, "gps_longitude"),
    license_no: payload.license_no || null,
    is_active: false,
  });

  return processor;
}

export async function loginProcessor(payload) {
  const mobile = String(payload?.mobile || payload?.phone_no || "").trim();
  if (!mobile) throw createError("mobile is required");

  const processor = await repo.findProcessorByMobile(mobile);
  if (!processor) throw createError("Processor not found", 404);
  if (!processor.is_active) throw createError("Processor account is inactive", 403);

  const tokenPayload = {
    id: processor.id,
    role: "PROCESSOR",
    processor_id: processor.id,
    processor_code: processor.processor_code,
  };

  return {
    access_token: signToken(tokenPayload),
    refresh_token: signToken({ ...tokenPayload, type: "refresh" }, "7d"),
    token_type: "Bearer",
    role: "PROCESSOR",
    user: {
      id: processor.id,
      processor_code: processor.processor_code,
      processor_name: processor.processor_name,
      mobile: processor.mobile,
      email: processor.email,
    },
  };
}

export async function getProcessorProfile(processorId) {
  const processor = await repo.findProcessorById(validateProcessorId(processorId));
  if (!processor) throw createError("Processor not found", 404);
  return processor;
}

export const listProcessors = (query) => repo.listProcessors(query);

export async function updateProcessorStatus(processorId, payload) {
  const rawStatus = payload?.status !== undefined ? String(payload.status).trim().toLowerCase() : undefined;
  let isActive = payload?.is_active;

  if (rawStatus !== undefined) {
    if (!["approved", "active", "pending", "rejected", "inactive"].includes(rawStatus)) {
      throw createError("status must be approved, active, pending, rejected, or inactive");
    }
    isActive = rawStatus === "approved" || rawStatus === "active";
  }

  if (isActive === undefined) throw createError("status or is_active is required");

  const normalized = isActive === true || String(isActive).trim().toLowerCase() === "true";
  const processor = await repo.updateProcessorStatus(validateProcessorId(processorId), normalized);
  if (!processor) throw createError("Processor not found", 404);
  return processor;
}

// ── Resolve the acting processor (from JWT for PROCESSOR, from param for admin)
const resolveProcessor = async (user, explicitProcessorId, trx) => {
  if (user?.role === "PROCESSOR") {
    const processor = await repo.findProcessorById(user.processor_id || user.id, trx);
    if (!processor) throw createError("Processor not found", 404);
    if (!processor.is_active) throw createError("Processor account is inactive", 403);
    return processor;
  }

  // ADMIN / SUPER_ADMIN acting on behalf of a processor must name it.
  const processor = await repo.findProcessorById(validateProcessorId(explicitProcessorId), trx);
  if (!processor) throw createError("Processor not found", 404);
  return processor;
};

const buildInventoryResponse = ({ processor, context, inventory }) => ({
  id: inventory.id,
  crate_code: inventory.crate_code,
  harvest_id: inventory.harvest_id,
  trader_id: inventory.trader_id,
  species: inventory.species,
  size_count_kg: inventory.size_count_kg,
  weight_kg: inventory.weight_kg,
  grade: inventory.grade,
  trader: {
    trader_code: context.trader_code,
    trader_name: context.trader_name,
    mobile: context.trader_mobile,
  },
  processor: {
    id: processor.id,
    processor_code: processor.processor_code,
    processor_name: processor.processor_name,
  },
  location: {
    gps_latitude: inventory.gps_latitude,
    gps_longitude: inventory.gps_longitude,
  },
  received_at: inventory.received_at,
  chain_of_custody_status: inventory.chain_of_custody_status,
  inventory_status: inventory.inventory_status,
});

// ── Receiving scan: the core of the module ──────────────────────────────────
export const scanReceiveCrate = async (body, user) =>
  db.transaction(async (trx) => {
    const crateCode = normalizeText(body.crate_qr || body.crate_code || body.crateCode, "crate_qr");

    const context = await repo.getLoadedCrateContextByCode(crateCode, trx);
    // Rule: Crate QR exists.
    if (!context) throw createError("Crate not found for scanned QR", 404);
    if (context.crate_qr_type !== "A") throw createError("Crate QR must be an aquaculture crate");

    // Rule: Crate has been loaded for transport.
    if (!context.transport_loading_id || context.packing_status !== "LOADED") {
      throw createError("Crate must be loaded for transport before processor receiving", 422);
    }

    // Rule: Crate has not already been received by another processor.
    const existing = await repo.getInventoryByCratePackingId(context.crate_packing_id, trx);
    if (existing) throw createError("Crate has already been received by a processor", 409);

    const processor = await resolveProcessor(user, body.processor_id, trx);

    const inventory = await repo.createInventoryRecord(
      {
        processor_id: processor.id,
        crate_packing_id: context.crate_packing_id,
        transport_loading_id: context.transport_loading_id,
        crate_qr_id: context.crate_qr_id,
        crate_code: context.crate_code,
        harvest_id: context.harvest_id,
        trader_id: context.trader_id,
        species: context.species,
        size_count_kg: context.size_count_kg,
        weight_kg: context.weight_kg,
        grade: context.grade,
        gps_latitude: normalizeOptionalNumber(body.gps_latitude ?? body.gps_lat, "gps_latitude"),
        gps_longitude: normalizeOptionalNumber(body.gps_longitude ?? body.gps_lng, "gps_longitude"),
        chain_of_custody_status: "RECEIVED_BY_PROCESSOR",
        inventory_status: "IN_INVENTORY",
        received_at: new Date(),
        remarks: body.remarks || null,
      },
      trx
    );

    // Advance crate custody state on the upstream records.
    await repo.updatePackingStatus(context.crate_packing_id, { packing_status: "RECEIVED_BY_PROCESSOR" }, trx);
    await repo.updateTransportLoadingCustody(
      context.transport_loading_id,
      { chain_of_custody_status: "RECEIVED_BY_PROCESSOR" },
      trx
    );

    // Append an immutable chain-of-custody event on the trader's progress log.
    await repo.insertProgressEvent(
      {
        trader_id: context.trader_id,
        entity_type: "PROCESSOR_RECEIVING",
        entity_id: String(inventory.id),
        from_status: "LOADED",
        to_status: "RECEIVED_BY_PROCESSOR",
        actor_role: "PROCESSOR",
        actor_id: String(processor.processor_code),
        remarks: body.remarks || null,
      },
      trx
    );

    return buildInventoryResponse({ processor, context, inventory });
  });

export const listInventory = async (user, query) => {
  const processor = await resolveProcessor(user, query.processor_id);
  const crates = await repo.listInventoryByProcessor(processor.id, query);
  const summary = await repo.getInventoryCountsByProcessor(processor.id);
  return {
    processor: {
      id: processor.id,
      processor_code: processor.processor_code,
      processor_name: processor.processor_name,
    },
    summary,
    crates,
  };
};

export const getInventoryItem = async (user, crateCode, explicitProcessorId) => {
  const processor = await resolveProcessor(user, explicitProcessorId);
  const code = normalizeText(crateCode, "crate_code");
  const item = await repo.getInventoryDetail(processor.id, code);
  if (!item) throw createError("Crate not found in this processor's inventory", 404);
  return item;
};

export const getDashboard = async (user, query) => {
  const processor = await resolveProcessor(user, query.processor_id);
  const summary = await repo.getInventoryCountsByProcessor(processor.id);
  return {
    processor: {
      id: processor.id,
      processor_code: processor.processor_code,
      processor_name: processor.processor_name,
    },
    inventory: summary,
  };
};
