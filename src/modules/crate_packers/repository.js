import db from "../../config/db.js";

const TABLE = "crate_packer";

export const createCratePacker = async (data) => {
    return db(TABLE).insert(data).returning("*");
};

export const getCratePackerById = async (id) => {
    return db(TABLE).where({ id }).first();
};

export const updateCratePacker = async (id, data) => {
  const rows = await db(TABLE)
    .where({ id })
    .update({ ...data, updated_at: db.fn.now() })
    .returning("*");

  return rows[0] || null;
};

export const deleteCratePacker = async (id) => {
    return db(TABLE).where({ id }).del();
};

export const listCratePackers = async () => {
    return db(TABLE).select("*");
};