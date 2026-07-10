import db from "../../../shared/lib/db.js";

const getExecutor = (trx) => trx || db;

export const getTransportOperatorById = (id, trx) =>
  getExecutor(trx)("transport_operators")
    .select(
      "id",
      "operator_rv_id",
      "full_name",
      "transport_id",
      "vehicle_no",
      "trader_id",
      "is_active"
    )
    .where({ id })
    .first();

export const getTransportOperatorByRvId = (operatorRvId, trx) =>
  getExecutor(trx)("transport_operators")
    .select(
      "id",
      "operator_rv_id",
      "full_name",
      "transport_id",
      "vehicle_no",
      "trader_id",
      "is_active"
    )
    .where({ operator_rv_id: operatorRvId })
    .first();

export const getPackedCrateContextByCode = (crateCode, trx) =>
  getExecutor(trx)("aquaculture_crate_packings as acp")
    .innerJoin("crate_qrs as cq", "acp.crate_qr_id", "cq.id")
    .innerJoin("aquaculture_harvests as ah", "acp.harvest_id", "ah.id")
    .leftJoin("aquaculture_quality_inspections as qi", "acp.quality_inspection_id", "qi.id")
    .leftJoin("traders as t", "acp.trader_id", "t.id")
    .select(
      "acp.id as crate_packing_id",
      "acp.crate_qr_id",
      "acp.crate_code",
      "acp.harvest_id",
      "acp.trader_id",
      "acp.quality_inspection_id",
      "acp.species",
      "acp.grade",
      "acp.weight_kg",
      "acp.packing_status",
      "cq.code as crate_master_code",
      "cq.type as crate_qr_type",
      "ah.booking_status",
      "qi.id as inspection_id",
      "t.trader_code",
      "t.trader_name",
      "t.mobile as trader_mobile"
    )
    .where("acp.crate_code", crateCode)
    .first();

export const getLoadingByCratePackingId = (cratePackingId, trx) =>
  getExecutor(trx)("aquaculture_transport_loadings")
    .where({ crate_packing_id: cratePackingId })
    .first();

export const createTransportLoading = async (payload, trx) => {
  const [row] = await getExecutor(trx)("aquaculture_transport_loadings").insert(payload).returning("*");
  return row;
};

export const updatePackingStatus = (cratePackingId, payload, trx) =>
  getExecutor(trx)("aquaculture_crate_packings")
    .where({ id: cratePackingId })
    .update({ ...payload, updated_at: getExecutor(trx).fn.now() });

export const insertProgressEvent = async (payload, trx) => {
  const [row] = await getExecutor(trx)("trader_progress_events").insert(payload).returning("*");
  return row;
};

export const getHarvestLoadingRows = (harvestId, trx) =>
  getExecutor(trx)("aquaculture_crate_packings as acp")
    .leftJoin("aquaculture_transport_loadings as atl", "acp.id", "atl.crate_packing_id")
    .leftJoin("transport_operators as to", "atl.transport_operator_id", "to.id")
    .select(
      "acp.id as crate_packing_id",
      "acp.crate_code",
      "acp.harvest_id",
      "acp.trader_id",
      "acp.species",
      "acp.grade",
      "acp.weight_kg",
      "acp.packing_status",
      "atl.id as loading_id",
      "atl.vehicle_number",
      "atl.transport_operator_id",
      "atl.transport_operator_rv_id",
      "atl.chain_of_custody_status",
      "atl.loaded_at",
      "to.full_name as transport_operator_name"
    )
    .where("acp.harvest_id", harvestId)
    .orderBy("acp.packed_at", "asc");
