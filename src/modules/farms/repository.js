import db from "../../shared/lib/db.js";

const TABLE = "farms";

export const createFarm = async (data) => {
  const [farm] = await db(TABLE)
    .insert({
      farm_id: data.farm_id,
      farm_name: data.farm_name,
      address: data.address,
      farm_gate_latitude: data.farm_gate_latitude,
      farm_gate_longitude: data.farm_gate_longitude,
      water_source: data.water_source,
      farm_area_acres: data.farm_area_acres,
    })
    .returning("*");

  return farm;
};

export const getAllFarms = async () => {
  return await db(TABLE).select("*").orderBy("created_at", "desc");
};

export const getFarmById = async (id) => {
  return await db(TABLE).where({ id }).first();
};

export const getFarmByFarmId = async (farm_id) => {
  return await db(TABLE).where({ farm_id }).first();
};

export const updateFarmById = async (id, data) => {
  const [farm] = await db(TABLE)
    .where({ id })
    .update({
      farm_id: data.farm_id,
      farm_name: data.farm_name,
      address: data.address,
      farm_gate_latitude: data.farm_gate_latitude,
      farm_gate_longitude: data.farm_gate_longitude,
      water_source: data.water_source,
      farm_area_acres: data.farm_area_acres,
      updated_at: db.fn.now(),
    })
    .returning("*");

  return farm;
};

export const deleteFarmById = async (id) => {
  return await db(TABLE).where({ id }).del();
};