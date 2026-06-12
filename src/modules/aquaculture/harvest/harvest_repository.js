import db from "../../../shared/lib/db.js";

const TABLE = "aquaculture_harvests";

const getExecutor = (trx) => trx || db;

const withHarvestDetails = (query) => {
  return query
    .leftJoin("culture_cycles as cc", `${TABLE}.culture_id`, "cc.id")
    .leftJoin("rootverse_users as ru", `${TABLE}.user_id`, "ru.id")
    .leftJoin("farms as f", "cc.farm_id", "f.id")
    .leftJoin("ponds as p", "cc.pond_id", "p.id")
    .leftJoin("aquaculture_qrs as aq", `${TABLE}.qr_code_id`, "aq.id")
    .leftJoin("traders as t", `${TABLE}.trader_id`, "t.id")
    .select(
      `${TABLE}.*`,
      `${TABLE}.user_id`,
      "cc.user_id as culture_user_id",
      "cc.farm_id",
      "cc.pond_id",
      "ru.username as farmer_name",
      "ru.phone_no as farmer_phone",
      "ru.owner_id as farmer_owner_id",
      "f.farm_id as farm_code",
      "f.farm_name",
      "p.pond_id as pond_code",
      "p.pond_name",
      "cc.culture_code",
      "cc.verification_status as culture_verification_status",
      "aq.qrs_code as qr_code",
      "t.trader_code",
      "t.trader_name",
      "t.mobile as trader_mobile",
      "t.email as trader_email"
    );
};

export const createHarvestRecord = async (data, trx) => {
  const [row] = await getExecutor(trx)(TABLE).insert(data).returning("*");
  return row;
};

export const getAllHarvestRecords = async (trx) => {
  return withHarvestDetails(getExecutor(trx)(TABLE)).orderBy(`${TABLE}.created_at`, "desc");
};

export const getHarvestRecordById = async (id, trx) => {
  return withHarvestDetails(getExecutor(trx)(TABLE)).where(`${TABLE}.id`, id).first();
};

export const getHarvestRecordsByFarmId = async (farmId, trx) => {
  return withHarvestDetails(getExecutor(trx)(TABLE))
    .where("cc.farm_id", farmId)
    .orderBy(`${TABLE}.created_at`, "desc");
};

export const getHarvestRecordsByPondId = async (pondId, trx) => {
  return withHarvestDetails(getExecutor(trx)(TABLE))
    .where("cc.pond_id", pondId)
    .orderBy(`${TABLE}.created_at`, "desc");
};

export const getHarvestRecordsByQrCodeId = async (qrCodeId, trx) => {
  return withHarvestDetails(getExecutor(trx)(TABLE))
    .where(`${TABLE}.qr_code_id`, qrCodeId)
    .orderBy(`${TABLE}.created_at`, "desc");
};

export const getHarvestRecordsByQrCode = async (qrCode, trx) => {
  return withHarvestDetails(getExecutor(trx)(TABLE))
    .where("aq.qrs_code", qrCode)
    .orderBy(`${TABLE}.created_at`, "desc");
};

export const getHarvestRecordsByTraderId = async (traderId, trx) => {
  return withHarvestDetails(getExecutor(trx)(TABLE))
    .where(`${TABLE}.trader_id`, traderId)
    .orderBy(`${TABLE}.created_at`, "desc");
};

export const getHarvestRecordsByUserId = async (userId, trx) => {
  return withHarvestDetails(getExecutor(trx)(TABLE))
    .where(`${TABLE}.user_id`, userId)
    .orderBy(`${TABLE}.created_at`, "desc");
};

export const updateHarvestRecord = async (id, data, trx) => {
  const [row] = await getExecutor(trx)(TABLE)
    .where({ id })
    .update({
      ...data,
      updated_at: new Date(),
    })
    .returning("*");

  return row;
};

export const deleteHarvestRecord = async (id, trx) => {
  return getExecutor(trx)(TABLE).where({ id }).del();
};

export const getHarvestPrerequisites = async ({ culture_id, qr_code_id }, trx) => {
  return getExecutor(trx)("culture_cycles as cc")
    .innerJoin("ponds as p", "cc.pond_id", "p.id")
    .innerJoin("aquaculture_qrs as aq", function joinQr() {
      this.on("aq.id", "=", db.raw("?", [qr_code_id]));
    })
    .leftJoin("pond_stocking as ps", "cc.id", "ps.culturecycle_id")
    .select(
      "cc.id as culture_id",
      "cc.user_id as culture_user_id",
      "cc.farm_id as culture_farm_id",
      "cc.pond_id as culture_pond_id",
      "cc.verification_status as culture_verification_status",
      "p.pond_status",
      "p.verification_status as pond_verification_status",
      "aq.id as qr_code_id",
      "aq.type as qr_type",
      "aq.pond_id as qr_pond_id",
      "aq.is_active as qr_is_active",
      "ps.id as pond_stocking_id",
      "ps.species as stocked_species",
      "ps.stocking_date as stocked_date"
    )
    .where("cc.id", culture_id)
    .first();
};

export const getLatestSamplingForHarvest = async ({ culture_id }, trx) => {
  return getExecutor(trx)("sampling")
    .where({
      culture_id,
    })
    .orderBy("sampling_date", "desc")
    .orderBy("created_at", "desc")
    .first();
};

export const findTraderById = async (traderId, trx) => {
  return getExecutor(trx)("traders").where({ id: traderId }).first();
};

export const getHarvestRelatedDetails = async (harvest, trx) => {
  const executor = getExecutor(trx);

  const [sampling, pondStocking, images, cultureCycle] = await Promise.all([
    executor("sampling")
      .where({
        culture_id: harvest.culture_id,
      })
      .orderBy("sampling_date", "desc")
      .orderBy("created_at", "desc"),
    executor("pond_stocking").where({ culturecycle_id: harvest.culture_id }).first(),
    executor("aquaculture_image").where({ culture_cycle_id: harvest.culture_id }).orderBy("created_at", "desc"),
    executor("culture_cycles").where({ id: harvest.culture_id }).first(),
  ]);

  const farmer = cultureCycle?.user_id
    ? await executor("aquaculture_farmers").where({ user_id: cultureCycle.user_id }).first()
    : null;

  return {
    sampling_details: sampling,
    pond_stocking: pondStocking || null,
    image_uploads: images,
    farmer_detail: farmer || null,
    culture_cycle: cultureCycle || null,
  };
};
