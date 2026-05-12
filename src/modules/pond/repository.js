import db from "../../shared/lib/db.js";

const TABLE = "ponds";
const VERIFIED_STATUS = "Verified";

const removeQrForUnverifiedPond = (pond) => {
  if (!pond || pond.verification_status === VERIFIED_STATUS) {
    return pond;
  }

  const { qrs_code, ...pondWithoutQrCode } = pond;
  return pondWithoutQrCode;
};

const removeQrForUnverifiedPonds = (ponds) => {
  return ponds.map(removeQrForUnverifiedPond);
};

const withActivePondQr = (query) => {
  return query.leftJoin("aquaculture_qrs as aq", function () {
    this.on("aq.pond_id", "ponds.id")
      .andOn("aq.type", db.raw("?", ["pond"]))
      .andOn("aq.is_active", db.raw("?", [true]));
  });
};

export const getFarmById = async (farm_id) => {
  return await db("farms").where({ id: farm_id }).first();
};

export const getLastPondByPrefix = async (prefix) => {
  return await db(TABLE)
    .where("pond_id", "like", `${prefix}%`)
    .orderBy("pond_id", "desc")
    .first();
};

export const createPond = async (data) => {
  const [pond] = await db(TABLE)
    .insert({
      farm_id: data.farm_id,
      pond_id: data.pond_id,
      pond_name: data.pond_name,
      pond_type: data.pond_type,
      water_spread_area_acres: data.water_spread_area_acres,
      volume: data.volume,
      pond_gps: data.pond_gps,
    })
    .returning("*");

  return pond;
};

export const getAllPonds = async () => {
  const ponds = await withActivePondQr(
    db(TABLE).leftJoin("farms", "ponds.farm_id", "farms.id")
  )
    .select(
      "ponds.*",
      "farms.farm_id as farm_qr_id",
      "farms.farm_name as farm_name",
      "aq.qrs_code"
    )
    .orderBy("ponds.created_at", "desc");

  return removeQrForUnverifiedPonds(ponds);
};

export const getPondById = async (id) => {
  const pond = await withActivePondQr(
    db(TABLE).leftJoin("farms", "ponds.farm_id", "farms.id")
  )
    .select(
      "ponds.*",
      "farms.farm_id as farm_qr_id",
      "farms.farm_name as farm_name",
      "aq.qrs_code"
    )
    .where("ponds.id", id)
    .first();

  return removeQrForUnverifiedPond(pond);
};

export const getPondByPondId = async (pond_id) => {
  return await db(TABLE).where({ pond_id }).first();
};

export const getPondsByFarmId = async (farm_id) => {
  const ponds = await withActivePondQr(db(TABLE))
    .where("ponds.farm_id", farm_id)
    .select("ponds.*", "aq.qrs_code")
    .orderBy("ponds.created_at", "desc");

  return removeQrForUnverifiedPonds(ponds);
};

export const updatePondById = async (id, data) => {
  const [pond] = await db(TABLE)
    .where({ id })
    .update({
      farm_id: data.farm_id,
      pond_name: data.pond_name,
      pond_type: data.pond_type,
      water_spread_area_acres: data.water_spread_area_acres,
      volume: data.volume,
      pond_gps: data.pond_gps,
      updated_at: db.fn.now(),
    })
    .returning("*");

  return pond;
};

export const deletePondById = async (id) => {
  return await db(TABLE).where({ id }).del();
};
