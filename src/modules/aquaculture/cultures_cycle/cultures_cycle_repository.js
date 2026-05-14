import db from "../../../shared/lib/db.js";

const TABLE_NAME = "culture_cycles";

const getExecutor = (trx) => trx || db;

export const getUserLocationHierarchy = async (userId, trx) => {
  return getExecutor(trx)("rootverse_users as ru")
    .leftJoin("locations as l", "ru.location_id", "l.id")
    .leftJoin("districts as d", function joinDistrict() {
      this.on("d.id", "=", "l.district_id").orOn("d.id", "=", "ru.district_id");
    })
    .leftJoin("states as s", function joinState() {
      this.on("s.id", "=", "d.state_id").orOn("s.id", "=", "ru.state_id");
    })
    .leftJoin("country as c", "c.id", "s.country_id")
    .select(
      "ru.id",
      "ru.rootverse_type",
      "ru.location_id",
      "ru.district_id as user_district_id",
      "ru.state_id as user_state_id",
      "l.name as location_name",
      "l.location_code",
      "d.id as district_id",
      "d.name as district_name",
      "d.district_code",
      "s.id as state_id",
      "s.name as state_name",
      "s.state_code",
      "c.id as country_id",
      "c.name as country_name",
      "c.code as country_code"
    )
    .where("ru.id", userId)
    .first();
};

export const getFarmById = async (farmId, trx) => {
  return getExecutor(trx)("farms").where({ id: farmId }).first();
};

export const getPondById = async (pondId, trx) => {
  return getExecutor(trx)("ponds").where({ id: pondId }).first();
};

export const getLastCultureCycleByPrefix = async (prefix, trx) => {
  return getExecutor(trx)(TABLE_NAME)
    .where("culture_code", "like", `${prefix}-%`)
    .orderBy("culture_code", "desc")
    .first();
};

export const createCultureCycle = async (data, trx) => {
  const executor = getExecutor(trx);
  const [cultureCycle] = await executor(TABLE_NAME)
    .insert({
      user_id: data.user_id,
      culture_code: data.culture_code,
      farm_id: data.farm_id,
      pond_id: data.pond_id,
      verification_status: data.verification_status,
      start_date: data.start_date,
      end_date: data.end_date,
    })
    .returning("*");

  return cultureCycle;
};

export const getCultureCycleById = async (id, trx) => {
  return getExecutor(trx)(`${TABLE_NAME} as cc`)
    .leftJoin("farms as f", "cc.farm_id", "f.id")
    .leftJoin("ponds as p", "cc.pond_id", "p.id")
    .leftJoin("aquaculture_qrs as farm_qr", function joinFarmQr() {
      this.on("farm_qr.farm_id", "=", "f.id")
        .andOn("farm_qr.type", "=", db.raw("?", ["farm"]))
        .andOn("farm_qr.is_active", "=", db.raw("?", [true]));
    })
    .leftJoin("aquaculture_qrs as pond_qr", function joinPondQr() {
      this.on("pond_qr.pond_id", "=", "p.id")
        .andOn("pond_qr.type", "=", db.raw("?", ["pond"]))
        .andOn("pond_qr.is_active", "=", db.raw("?", [true]));
    })
    .select(
      "cc.*",
      "f.farm_id as farm_code",
      "f.farm_name",
      "p.pond_id as pond_code",
      "p.pond_name",
      "farm_qr.qrs_code as farm_qr_code",
      "pond_qr.qrs_code as pond_qr_code"
    )
    .where("cc.id", id)
    .first();
};

const getCultureCyclesWithDetailsQuery = (trx) => {
  return getExecutor(trx)(`${TABLE_NAME} as cc`)
    .leftJoin("farms as f", "cc.farm_id", "f.id")
    .leftJoin("ponds as p", "cc.pond_id", "p.id")
    .leftJoin("rootverse_users as ru", "cc.user_id", "ru.id")
    .leftJoin("aquaculture_qrs as farm_qr", function joinFarmQr() {
      this.on("farm_qr.farm_id", "=", "f.id")
        .andOn("farm_qr.type", "=", db.raw("?", ["farm"]))
        .andOn("farm_qr.is_active", "=", db.raw("?", [true]));
    })
    .leftJoin("aquaculture_qrs as pond_qr", function joinPondQr() {
      this.on("pond_qr.pond_id", "=", "p.id")
        .andOn("pond_qr.type", "=", db.raw("?", ["pond"]))
        .andOn("pond_qr.is_active", "=", db.raw("?", [true]));
    })
    .select(
      "cc.*",
      "f.farm_id as farm_code",
      "f.farm_name",
      "p.pond_id as pond_code",
      "p.pond_name",
      "f.id as nested_farm_id",
      "f.farm_id as nested_farm_code",
      "f.farm_name as nested_farm_name",
      "f.address as nested_farm_address",
      "f.farm_gate_latitude as nested_farm_gate_latitude",
      "f.farm_gate_longitude as nested_farm_gate_longitude",
      "f.water_source as nested_farm_water_source",
      "f.farm_area_acres as nested_farm_area_acres",
      "farm_qr.qrs_code as nested_farm_qr_code",
      "f.created_at as nested_farm_created_at",
      "f.updated_at as nested_farm_updated_at",
      "p.id as nested_pond_id",
      "p.farm_id as nested_pond_farm_id",
      "p.pond_id as nested_pond_code",
      "p.pond_name as nested_pond_name",
      "p.pond_type as nested_pond_type",
      "p.water_spread_area_acres as nested_pond_water_spread_area_acres",
      "p.volume as nested_pond_volume",
      "p.pond_gps as nested_pond_gps",
      "p.pond_status as nested_pond_status",
      "p.verification_status as nested_pond_verification_status",
      "pond_qr.qrs_code as nested_pond_qr_code",
      "p.created_at as nested_pond_created_at",
      "p.updated_at as nested_pond_updated_at",
      "ru.id as nested_user_id",
      "ru.owner_id as nested_user_owner_id",
      "ru.username as nested_user_username",
      "ru.phone_no as nested_user_phone_no",
      "ru.address as nested_user_address",
      "ru.rootverse_type as nested_user_rootverse_type",
      "ru.verification_status as nested_user_verification_status",
      "ru.profile_picture_url as nested_user_profile_picture_url",
      "ru.profile_picture_key as nested_user_profile_picture_key",
      "ru.location_id as nested_user_location_id",
      "ru.district_id as nested_user_district_id",
      "ru.state_id as nested_user_state_id",
      "ru.created_at as nested_user_created_at",
      "ru.updated_at as nested_user_updated_at"
    );
};

export const getAllCultureCycles = async (trx) => {
  return getCultureCyclesWithDetailsQuery(trx)
    .orderBy("cc.created_at", "desc");
};

export const getCultureCyclesByUserId = async (userId, trx) => {
  return getCultureCyclesWithDetailsQuery(trx)
    .where("cc.user_id", userId)
    .orderBy("cc.created_at", "desc");
};

export const getCultureCyclesByFarmId = async (farmId, trx) => {
  return getCultureCyclesWithDetailsQuery(trx)
    .where("cc.farm_id", farmId)
    .orderBy("cc.created_at", "desc");
};

export const getCultureCyclesByFarmIdAndPondId = async (farmId, pondId, trx) => {
  return getCultureCyclesWithDetailsQuery(trx)
    .where("cc.farm_id", farmId)
    .where("cc.pond_id", pondId)
    .orderBy("cc.created_at", "desc");
};

export const getAquacultureImagesByCultureCycleIds = async (cultureCycleIds, trx) => {
  if (!cultureCycleIds.length) {
    return [];
  }

  return getExecutor(trx)("aquaculture_image")
    .whereIn("culture_cycle_id", cultureCycleIds)
    .select("*")
    .orderBy("created_at", "desc");
};

export const getCultureCycleByfarmId = async (farmId, trx) => {
  return getExecutor(trx)(TABLE_NAME)
    .where("farm_id", farmId)
    .orderBy("created_at", "desc")
    .first();
};

export const getCultureCycleBypondId = async (pondId, trx) => {
  return getExecutor(trx)(TABLE_NAME)
    .where("pond_id", pondId)
    .orderBy("created_at", "desc")
    .first();
};

export const getBlockingCultureCycleByPondId = async (pondId, completedBeforeDate, trx) => {
  return getExecutor(trx)(TABLE_NAME)
    .where("pond_id", pondId)
    .andWhere(function blockingCycle() {
      this.whereNot("verification_status", "CLOSED").orWhere("end_date", ">=", completedBeforeDate);
    })
    .orderBy("created_at", "desc")
    .first();
};

export const getCultureCyclesByVerificationStatus = async (verificationStatus, trx) => {
  return getCultureCyclesWithDetailsQuery(trx)
    .where("cc.verification_status", verificationStatus)
    .orderBy("cc.created_at", "desc");
};


export const updateVerificationStatus = async (cultureCycleId, verificationStatus, remarks, trx) => {
  const executor = getExecutor(trx);
  await executor(TABLE_NAME)
    .where("id", cultureCycleId)
    .update({
      verification_status: verificationStatus,
      updated_at: new Date(),
    });
};
