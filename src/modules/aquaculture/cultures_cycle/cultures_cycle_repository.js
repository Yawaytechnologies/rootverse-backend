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
    .select(
      "cc.*",
      "f.farm_id as farm_code",
      "f.farm_name",
      "p.pond_id as pond_code",
      "p.pond_name"
    )
    .where("cc.id", id)
    .first();
};

export const getCultureCyclesByUserId = async (userId, trx) => {
  return getExecutor(trx)(`${TABLE_NAME} as cc`)
    .leftJoin("farms as f", "cc.farm_id", "f.id")
    .leftJoin("ponds as p", "cc.pond_id", "p.id")
    .select(
      "cc.*",
      "f.farm_id as farm_code",
      "f.farm_name",
      "p.pond_id as pond_code",
      "p.pond_name"
    )
    .where("cc.user_id", userId)
    .orderBy("cc.created_at", "desc");
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

export const getCultureCyclesByVerificationStatus = async (verificationStatus, trx) => {
  return getExecutor(trx)(TABLE_NAME)
    .where("verification_status", verificationStatus)
    .orderBy("created_at", "desc");
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
