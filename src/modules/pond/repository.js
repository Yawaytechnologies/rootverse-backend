import db from "../../shared/lib/db.js";

const TABLE = "ponds";

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
  return await db(TABLE)
    .leftJoin("farms", "ponds.farm_id", "farms.id")
    .select(
      "ponds.*",
      "farms.farm_id as farm_qr_id",
      "farms.farm_name as farm_name"
    )
    .orderBy("ponds.created_at", "desc");
};

export const getPondById = async (id) => {
  return await db(TABLE)
    .leftJoin("farms", "ponds.farm_id", "farms.id")
    .select(
      "ponds.*",
      "farms.farm_id as farm_qr_id",
      "farms.farm_name as farm_name"
    )
    .where("ponds.id", id)
    .first();
};

export const getPondByPondId = async (pond_id) => {
  return await db(TABLE).where({ pond_id }).first();
};

export const getPondsByFarmId = async (farm_id) => {
  return await db(TABLE)
    .where({ farm_id })
    .select("*")
    .orderBy("created_at", "desc");
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