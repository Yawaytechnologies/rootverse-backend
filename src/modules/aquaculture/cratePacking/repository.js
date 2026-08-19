import db from "../../../shared/lib/db.js";

const getExecutor = (trx) => trx || db;

export const getPackingContextByPondQr = async ({ pondQrCode, harvestId }, trx) => {
  const query = getExecutor(trx)("aquaculture_qrs as aq")
    .innerJoin("ponds as p", "aq.pond_id", "p.id")
    .innerJoin("farms as f", "aq.farm_id", "f.id")
    .innerJoin("culture_cycles as cc", "p.id", "cc.pond_id")
    .innerJoin("aquaculture_harvests as ah", "cc.id", "ah.culture_id")
    .leftJoin("aquaculture_quality_inspections as qi", "ah.id", "qi.harvest_id")
    .leftJoin("traders as t", "ah.trader_id", "t.id")
    .select(
      "aq.id as qr_code_id",
      "aq.qrs_code",
      "aq.type as qr_type",
      "aq.is_active as qr_is_active",
      "f.id as farm_id",
      "f.farm_id as farm_code",
      "f.farm_name",
      "p.id as pond_id",
      "p.pond_id as pond_code",
      "p.pond_name",
      "p.pond_status",
      "p.verification_status as pond_verification_status",
      "cc.id as culture_id",
      "cc.culture_code",
      "cc.verification_status as culture_verification_status",
      "ah.id as harvest_id",
      "ah.species",
      "ah.expected_size as harvest_expected_size",
      "ah.expected_biomass",
      "ah.booking_status",
      "ah.trader_id",
      "qi.id as quality_inspection_id",
      "qi.grade as quality_grade",
      "qi.size_count_kg",
      "qi.inspected_at",
      "t.trader_code",
      "t.trader_name",
      "t.mobile as trader_mobile"
    )
    .where("aq.qrs_code", pondQrCode)
    .where("cc.verification_status", "ACTIVE")
    .where("ah.booking_status", "booked")
    .whereNotNull("ah.trader_id")
    .orderBy("qi.inspected_at", "desc")
    .orderBy("ah.created_at", "desc");

  if (harvestId) {
    query.where("ah.id", harvestId);
  }

  return query.first();
};

export const getCratePackerByIdentity = async ({ id, code }, trx) => {
  const query = getExecutor(trx)("crate_packer").where({ status: "active" });
  if (id) query.where({ id });
  if (code) query.where({ code });
  return query.first();
};

export const getCrateByCode = async (crateCode, trx) => {
  return getExecutor(trx)("crate_qrs").where({ code: crateCode }).first();
};

export const getPackingByCrateQrId = async (crateQrId, trx) => {
  return getExecutor(trx)("aquaculture_crate_packings").where({ crate_qr_id: crateQrId }).first();
};

export const createPackingRecord = async (payload, trx) => {
  const [row] = await getExecutor(trx)("aquaculture_crate_packings").insert(payload).returning("*");

  return row;
};

export const insertProgressEvent = async (payload, trx) => {
  const [row] = await getExecutor(trx)("trader_progress_events").insert(payload).returning("*");
  return row;
};

export const listPackedCratesByHarvest = async (harvestId, trx) => {
  return getExecutor(trx)("aquaculture_crate_packings as acp")
    .innerJoin("crate_qrs as cq", "acp.crate_qr_id", "cq.id")
    .leftJoin("crate_packer as cp", "acp.crate_packer_id", "cp.id")
    .leftJoin("aquaculture_harvests as ah", "acp.harvest_id", "ah.id")
    .leftJoin("aquaculture_quality_inspections as qi", "acp.quality_inspection_id", "qi.id")
    .leftJoin("ponds as p", "acp.pond_id", "p.id")
    .leftJoin("aquaculture_qrs as aq", "acp.qr_code_id", "aq.id")
    .select(
      "acp.*",
      "cq.id as crate_qr_master_id",
      "cq.code as crate_qr_master_code",
      "cq.type as crate_qr_type",
      "cq.status as crate_qr_status",
      "cp.name as crate_packer_name",
      "cp.code as crate_packer_code",
      "ah.species as harvest_species",
      "ah.expected_size as harvest_expected_size",
      "qi.grade as inspection_grade",
      "qi.size_count_kg as inspection_size_count_kg",
      "p.pond_id as pond_code",
      "p.pond_name",
      "aq.qrs_code as pond_qr_code"
    )
    .where("acp.harvest_id", harvestId)
    .orderBy("acp.packed_at", "desc");
};

export const getCratePackerActivity = async (cratePackerId, filters, pagination, trx) => {
  const executor = getExecutor(trx);
  const applyFilters = (query) => query
    .where("acp.crate_packer_id", cratePackerId)
    .modify((builder) => {
      if (filters.harvest_id) builder.where("acp.harvest_id", filters.harvest_id);
      if (filters.date_from) builder.where("acp.packed_at", ">=", filters.date_from);
      if (filters.date_to) builder.where("acp.packed_at", "<=", filters.date_to);
    });

  const detailQuery = applyFilters(executor("aquaculture_crate_packings as acp"))
    .leftJoin("aquaculture_harvests as ah", "acp.harvest_id", "ah.id")
    .leftJoin("aquaculture_quality_inspections as qi", "acp.quality_inspection_id", "qi.id")
    .leftJoin("ponds as p", "acp.pond_id", "p.id")
    .leftJoin("farms as f", "p.farm_id", "f.id")
    .leftJoin("traders as t", "acp.trader_id", "t.id")
    .leftJoin("aquaculture_transport_loadings as atl", "acp.id", "atl.crate_packing_id")
    .select("acp.*", "ah.culture_id", "ah.expected_size as harvest_expected_size", "ah.expected_biomass as harvest_expected_biomass", "ah.booking_status", "qi.inspection_status", "qi.inspected_at", "p.pond_id as pond_code", "p.pond_name", "f.farm_id as farm_code", "f.farm_name", "t.trader_code", "t.trader_name", "t.mobile as trader_mobile", "atl.id as transport_loading_id", "atl.vehicle_number", "atl.loaded_at", "atl.chain_of_custody_status");

  const [records, aggregate] = await Promise.all([
    detailQuery.orderBy("acp.packed_at", "desc").limit(pagination.page_size).offset((pagination.page - 1) * pagination.page_size),
    applyFilters(executor("aquaculture_crate_packings as acp"))
      .count("acp.id as total_completed")
      .countDistinct("acp.harvest_id as total_harvests")
      .sum("acp.weight_kg as total_weight_kg")
      .first(),
  ]);
  return { records, aggregate };
};
