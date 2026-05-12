import db from "../../shared/lib/db.js";

const TABLE = "ponds";

export const getRootverseUserById = async (user_id) => {
  return await db("rootverse_users").where({ id: user_id }).first();
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
      user_id: data.user_id,
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
      user_id: data.user_id,
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

export const updatePondStatusById = async (id, pond_status) => {
  const [pond] = await db("ponds")
    .where({ id })
    .update({
      pond_status,
      updated_at: new Date(),
    })
    .returning("*");

  return pond;
};

export const updatePondVerificationStatusById = async (
  id,
  verification_status
) => {
  const [pond] = await db("ponds")
    .where({ id })
    .update({
      verification_status,
      updated_at: new Date(),
    })
    .returning("*");

  return pond;
};

export const getActivePonds = async () => {
  return await db("ponds")
    .where({ pond_status: "Active" })
    .orderBy("id", "desc");
};

export const getVerifiedPonds = async () => {
  return await db("ponds")
    .where({ verification_status: "Verified" })
    .orderBy("id", "desc");
};