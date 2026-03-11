import db from "../../shared/lib/db.js";

const TABLE = "farms";

export const createFarm = async (data) => {
  const location = await db("locations")
    .where({ id: data.location_id })
    .first();
  const state = await db("states").where({ id: data.state_id }).first();
  const country = await db("country").where({ id: data.country_id }).first();
  const district = await db("districts")
    .where({ id: data.district_id })
    .first();

  const [farm] = await db(TABLE)
    .insert({
      ...data,
      location_code: location ? location.location_code : null,
      state_code: state ? state.state_code : null,
      country_code: country ? country.code : null,
      district_code: district ? district.district_code : null,
    })
    .returning("*");
  return farm;
};
export const getFarmById = async (id) => {
  return await db(TABLE)
    .where({ "farms.id":id })
    .leftJoin("rootverse_users", "farms.owner_id", "rootverse_users.id")
    .select("farms.*", "rootverse_users.username as owner_name")
    .first();
};

export const getAllFarms = async () => {
  return await db(TABLE).select("*");
};
export const getFarmsByCode = async (code) => {
  return await db(TABLE).where({ farm_code: code }).first();
};
export const updateFarm = async (id, data) => {
  const [updatedFarm] = await db(TABLE)
    .where({ id })
    .update(data)
    .returning("*");
  return updatedFarm;
};

export const deleteFarm = async (id) => {
  return await db(TABLE).where({ id }).del();
};

export const getFarmsByfilter = async (filters) => {
  let query = db(TABLE).select("*");
  if (filters.country_id) {
    query = query.where("country_id", filters.country_id);
  }
  if (filters.district_id) {
    query = query.where("district_id", filters.district_id);
  }
  if (filters.owner_id) {
    query = query.where("owner_id", filters.owner_id);
  }
  if (filters.status) {
    query = query.where("status", filters.status);
  }
  if (filters.location_id) {
    query = query.where("location_id", filters.location_id);
  }
  if (filters.state_id) {
    query = query.where("state_id", filters.state_id);
  }
  return await query;
};
