import db from "../../shared/lib/db.js";


const TABLE = "ponds";

export const createPond = async (data) => {
    const [pond] = await db(TABLE).insert(data).returning("*");
    return pond;
};

export const getPondById = async (id) => {
  return await db(TABLE).where({ id }).first();
};

export const getAllPonds = async (filters) => {
  let query = db(TABLE);
  if (filters) {
    if (filters.status) {
      query = query.where("status", filters.status);
    }
    if (filters.farm_id) {
      query = query.where("farm_id", filters.farm_id);
    }
  }
  return await query;
};

export const getPondsByCode = async (code) => {
  return await db(TABLE).where({ pond_code: code }).first();
};
export const updatePond = async (id, data) => {
  const [updatedPond] = await db(TABLE)
    .where({ id })
    .update(data)
    .returning("*");
  return updatedPond;
};

export const deletePond = async (id) => {
    return await db(TABLE).where({ id }).del();
};

