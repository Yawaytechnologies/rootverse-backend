import db from "../../../shared/lib/db.js";

const TABLE = "aquaculture_quality_inspections";

const getExecutor = (trx) => trx || db;

const withInspectionDetails = (query) => {
  return query
    .leftJoin("aquaculture_qrs as aq", `${TABLE}.qr_code_id`, "aq.id")
    .leftJoin("farms as f", `${TABLE}.farm_id`, "f.id")
    .leftJoin("ponds as p", `${TABLE}.pond_id`, "p.id")
    .leftJoin("culture_cycles as cc", `${TABLE}.culture_id`, "cc.id")
    .leftJoin("aquaculture_harvests as ah", `${TABLE}.harvest_id`, "ah.id")
    .leftJoin("sampling as s", `${TABLE}.sampling_id`, "s.id")
    .leftJoin("rootverse_users as ru", `${TABLE}.user_id`, "ru.id")
    .leftJoin("quality_checker as qc", `${TABLE}.quality_checker_id`, "qc.id")
    .leftJoin("traders as t", `${TABLE}.trader_id`, "t.id")
    .select(
      `${TABLE}.*`,
      "aq.qrs_code as qr_code",
      "f.farm_id as farm_code",
      "f.farm_name",
      "p.pond_id as pond_code",
      "p.pond_name",
      "cc.culture_code",
      "ah.expected_size as harvest_expected_size",
      "ah.booking_status as harvest_booking_status",
      "s.sampling_date",
      "ru.username as farmer_name",
      "ru.phone_no as farmer_mobile",
      "ru.owner_id as farmer_owner_id",
      "qc.checker_name",
      "qc.checker_code",
      "qc.checker_phone",
      "t.trader_code",
      "t.trader_name",
      "t.mobile as trader_mobile"
    );
};

export const getScanContextByQrCode = async (qrCode, harvestId, trx) => {
  const executor = getExecutor(trx);

  const baseQuery = executor("aquaculture_qrs as aq")
    .innerJoin("ponds as p", "aq.pond_id", "p.id")
    .innerJoin("farms as f", "aq.farm_id", "f.id")
    .innerJoin("culture_cycles as cc", "p.id", "cc.pond_id")
    .innerJoin("rootverse_users as ru", "cc.user_id", "ru.id")
    .leftJoin("aquaculture_harvests as ah", function joinHarvest() {
      this.on("ah.culture_id", "=", "cc.id");
      if (harvestId) {
        this.andOn("ah.id", "=", db.raw("?", [harvestId]));
      }
    })
    .leftJoin("traders as t", "ah.trader_id", "t.id")
    .select(
      "aq.id as qr_code_id",
      "aq.qrs_code",
      "aq.type as qr_type",
      "aq.is_active as qr_is_active",
      "f.id as farm_id",
      "f.farm_id as farm_code",
      "f.farm_name",
      "f.address as farm_address",
      "f.farm_gate_latitude",
      "f.farm_gate_longitude",
      "p.id as pond_id",
      "p.pond_id as pond_code",
      "p.pond_name",
      "p.pond_status",
      "p.verification_status as pond_verification_status",
      "p.pond_gps",
      "cc.id as culture_id",
      "cc.culture_code",
      "cc.verification_status as culture_verification_status",
      "ru.id as user_id",
      "ru.username as farmer_name",
      "ru.phone_no as farmer_mobile",
      "ru.owner_id as farmer_owner_id",
      "ah.id as harvest_id",
      "ah.expected_size as harvest_expected_size",
      "ah.expected_biomass as harvest_expected_biomass",
      "ah.booking_status",
      "ah.trader_id",
      "t.trader_code",
      "t.trader_name",
      "t.mobile as trader_mobile"
    )
    .where("aq.qrs_code", qrCode)
    .where("cc.verification_status", "ACTIVE")
    .orderBy("ah.created_at", "desc")
    .orderBy("cc.created_at", "desc");

  return baseQuery.first();
};

export const getLatestSamplingByCultureId = async (cultureId, trx) => {
  return getExecutor(trx)("sampling")
    .where({ culture_id: cultureId })
    .orderBy("sampling_date", "desc")
    .orderBy("created_at", "desc")
    .first();
};

export const getQualityCheckerByIdentity = async ({ quality_checker_id, checker_code }, trx) => {
  const query = getExecutor(trx)("quality_checker").where({ is_active: true });

  if (quality_checker_id) {
    query.where({ id: quality_checker_id });
  } else {
    query.where({ checker_code });
  }

  return query.first();
};

export const createInspection = async (payload, trx) => {
  const [row] = await getExecutor(trx)(TABLE).insert(payload).returning("*");
  return row;
};

export const getInspectionById = async (id, trx) => {
  return withInspectionDetails(getExecutor(trx)(TABLE)).where(`${TABLE}.id`, id).first();
};

export const listInspections = async (filters = {}, trx) => {
  return withInspectionDetails(getExecutor(trx)(TABLE))
    .modify((query) => {
      if (filters.harvest_id) query.where(`${TABLE}.harvest_id`, filters.harvest_id);
      if (filters.pond_id) query.where(`${TABLE}.pond_id`, filters.pond_id);
      if (filters.qr_code_id) query.where(`${TABLE}.qr_code_id`, filters.qr_code_id);
      if (filters.quality_checker_id) query.where(`${TABLE}.quality_checker_id`, filters.quality_checker_id);
      if (filters.trader_id) query.where(`${TABLE}.trader_id`, filters.trader_id);
      if (filters.inspection_status) query.where(`${TABLE}.inspection_status`, filters.inspection_status);
    })
    .orderBy(`${TABLE}.created_at`, "desc");
};
