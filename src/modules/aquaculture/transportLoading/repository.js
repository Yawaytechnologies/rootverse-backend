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
      "email",
      "mobile",
      "route_name",
      "vehicle_type",
      "trader_id",
      "is_active",
      "created_at",
      "updated_at"
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
      "email",
      "mobile",
      "route_name",
      "vehicle_type",
      "trader_id",
      "is_active",
      "created_at",
      "updated_at"
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

export const getTransportOperatorActivity = async (operatorId, filters, pagination, trx) => {
  const executor = getExecutor(trx);
  const applyFilters = (query) => query
    .where("atl.transport_operator_id", operatorId)
    .modify((builder) => {
      if (filters.harvest_id) builder.where("atl.harvest_id", filters.harvest_id);
      if (filters.date_from) builder.where("atl.loaded_at", ">=", filters.date_from);
      if (filters.date_to) builder.where("atl.loaded_at", "<=", filters.date_to);
    });

  const details = applyFilters(executor("aquaculture_transport_loadings as atl"))
    .innerJoin("aquaculture_crate_packings as acp", "atl.crate_packing_id", "acp.id")
    .leftJoin("aquaculture_harvests as ah", "atl.harvest_id", "ah.id")
    .leftJoin("aquaculture_quality_inspections as qi", "acp.quality_inspection_id", "qi.id")
    .leftJoin("ponds as p", "acp.pond_id", "p.id")
    .leftJoin("farms as f", "p.farm_id", "f.id")
    .leftJoin("traders as t", "atl.trader_id", "t.id")
    .select("atl.*", "acp.pond_id", "acp.pond_qr_code", "acp.species", "acp.size_count_kg", "acp.weight_kg", "acp.grade", "acp.packed_at", "ah.culture_id", "ah.expected_size as harvest_expected_size", "ah.expected_biomass as harvest_expected_biomass", "ah.booking_status", "qi.id as quality_inspection_id", "qi.inspection_status", "qi.inspected_at", "p.pond_id as pond_code", "p.pond_name", "f.farm_id as farm_code", "f.farm_name", "t.trader_code", "t.trader_name", "t.mobile as trader_mobile");

  const [records, aggregate] = await Promise.all([
    details.orderBy("atl.loaded_at", "desc").limit(pagination.page_size).offset((pagination.page - 1) * pagination.page_size),
    applyFilters(executor("aquaculture_transport_loadings as atl"))
      .innerJoin("aquaculture_crate_packings as acp", "atl.crate_packing_id", "acp.id")
      .count("atl.id as total_transported")
      .countDistinct("atl.harvest_id as total_harvests")
      .countDistinct("atl.vehicle_number as total_vehicles")
      .sum("acp.weight_kg as total_weight_kg")
      .first(),
  ]);
  return { records, aggregate };
};
