import db from "../../shared/lib/db.js";

const getExecutor = (trx) => trx || db;

export const PROCESSOR_FIELDS = [
  "id",
  "processor_code",
  "processor_name",
  "contact_name",
  "email",
  "mobile",
  "address",
  "state",
  "district",
  "gps_latitude",
  "gps_longitude",
  "license_no",
  "is_active",
  "created_at",
  "updated_at",
];

// ── Processor accounts ──────────────────────────────────────────────────────
export const createProcessor = (payload) =>
  db("processors").insert(payload).returning(PROCESSOR_FIELDS);

export const findProcessorByMobile = (mobile) =>
  db("processors").select(PROCESSOR_FIELDS).where({ mobile }).first();

export const findProcessorByEmail = (email) =>
  db("processors").select(PROCESSOR_FIELDS).where({ email }).first();

export const findProcessorById = (id, trx) =>
  getExecutor(trx)("processors").select(PROCESSOR_FIELDS).where({ id }).first();

export const listProcessors = ({ page = 1, page_size = 20 } = {}) =>
  db("processors")
    .select(PROCESSOR_FIELDS)
    .orderBy("created_at", "desc")
    .limit(Number(page_size))
    .offset((Number(page) - 1) * Number(page_size));

export const updateProcessorStatus = async (id, isActive) => {
  const rows = await db("processors")
    .where({ id })
    .update({ is_active: isActive, updated_at: db.fn.now() })
    .returning(PROCESSOR_FIELDS);
  return rows[0] || null;
};

// ── Receiving context ───────────────────────────────────────────────────────
// Resolves a scanned crate QR into everything needed to receive it: crate
// packing, the transport-loading record (proving it was loaded), harvest and
// trader details, plus all auto-fetch attributes.
export const getLoadedCrateContextByCode = (crateCode, trx) =>
  getExecutor(trx)("aquaculture_crate_packings as acp")
    .innerJoin("crate_qrs as cq", "acp.crate_qr_id", "cq.id")
    .innerJoin("aquaculture_harvests as ah", "acp.harvest_id", "ah.id")
    .leftJoin("aquaculture_transport_loadings as atl", "acp.id", "atl.crate_packing_id")
    .leftJoin("traders as t", "acp.trader_id", "t.id")
    .select(
      "acp.id as crate_packing_id",
      "acp.crate_qr_id",
      "acp.crate_code",
      "acp.harvest_id",
      "acp.trader_id",
      "acp.species",
      "acp.size_count_kg",
      "acp.weight_kg",
      "acp.grade",
      "acp.packing_status",
      "cq.type as crate_qr_type",
      "atl.id as transport_loading_id",
      "atl.transport_operator_id",
      "atl.transport_operator_rv_id",
      "atl.vehicle_number",
      "atl.chain_of_custody_status as loading_custody_status",
      "atl.loaded_at",
      "t.trader_code",
      "t.trader_name",
      "t.mobile as trader_mobile"
    )
    .where("acp.crate_code", crateCode)
    .first();

export const getInventoryByCratePackingId = (cratePackingId, trx) =>
  getExecutor(trx)("processor_inventory").where({ crate_packing_id: cratePackingId }).first();

export const createInventoryRecord = async (payload, trx) => {
  const [row] = await getExecutor(trx)("processor_inventory").insert(payload).returning("*");
  return row;
};

export const updatePackingStatus = (cratePackingId, payload, trx) =>
  getExecutor(trx)("aquaculture_crate_packings")
    .where({ id: cratePackingId })
    .update({ ...payload, updated_at: getExecutor(trx).fn.now() });

export const updateTransportLoadingCustody = (transportLoadingId, payload, trx) =>
  getExecutor(trx)("aquaculture_transport_loadings")
    .where({ id: transportLoadingId })
    .update({ ...payload, updated_at: getExecutor(trx).fn.now() });

export const insertProgressEvent = async (payload, trx) => {
  const [row] = await getExecutor(trx)("trader_progress_events").insert(payload).returning("*");
  return row;
};

// ── Inventory reads (scoped to one processor) ───────────────────────────────
export const listInventoryByProcessor = (processorId, { status, page = 1, page_size = 20 } = {}) => {
  const query = db("processor_inventory as pi")
    .leftJoin("aquaculture_harvests as ah", "pi.harvest_id", "ah.id")
    .leftJoin("traders as t", "pi.trader_id", "t.id")
    .select(
      "pi.id",
      "pi.crate_code",
      "pi.harvest_id",
      "pi.trader_id",
      "pi.species",
      "pi.size_count_kg",
      "pi.weight_kg",
      "pi.grade",
      "pi.gps_latitude",
      "pi.gps_longitude",
      "pi.received_at",
      "pi.chain_of_custody_status",
      "pi.inventory_status",
      "t.trader_code",
      "t.trader_name"
    )
    .where("pi.processor_id", processorId)
    .orderBy("pi.received_at", "desc")
    .limit(Number(page_size))
    .offset((Number(page) - 1) * Number(page_size));

  if (status) query.andWhere("pi.inventory_status", status);
  return query;
};

export const getInventoryDetail = (processorId, crateCode) =>
  db("processor_inventory as pi")
    .leftJoin("aquaculture_harvests as ah", "pi.harvest_id", "ah.id")
    .leftJoin("traders as t", "pi.trader_id", "t.id")
    .leftJoin("transport_operators as top", "pi.transport_loading_id", "top.id")
    .select(
      "pi.*",
      "t.trader_code",
      "t.trader_name",
      "t.mobile as trader_mobile"
    )
    .where("pi.processor_id", processorId)
    .andWhere("pi.crate_code", crateCode)
    .first();

export const getInventoryCountsByProcessor = async (processorId) => {
  const rows = await db("processor_inventory")
    .where({ processor_id: processorId })
    .select("inventory_status", "weight_kg");

  const totalWeight = rows.reduce((sum, row) => sum + Number(row.weight_kg || 0), 0);
  return {
    total_crates: rows.length,
    in_inventory: rows.filter((r) => r.inventory_status === "IN_INVENTORY").length,
    total_weight_kg: Math.round(totalWeight * 1000) / 1000,
  };
};
