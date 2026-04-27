import db from "../../../shared/lib/db.js";

const TABLE = "aquaculture_qrs";

export const getFarmById = async (id) => {
  return db("farms").where({ id }).first();
};

export const getPondById = async (id) => {
  return db("ponds").where({ id }).first();
};

export const getLocationHierarchyById = async (id) => {
  return db("locations as l")
    .join("districts as d", "l.district_id", "d.id")
    .join("states as s", "d.state_id", "s.id")
    .join("country as c", "s.country_id", "c.id")
    .select(
      "l.id",
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
    .where("l.id", id)
    .first();
};

export const getQrById = async (id) => {
  return db(TABLE).where({ id }).first();
};

export const getQrByCode = async (qrs_code) => {
  return db(TABLE).where({ qrs_code }).first();
};

export const getLastQrByPrefix = async (prefix, type) => {
  return db(TABLE)
    .where({ type })
    .where("qrs_code", "like", `${prefix}%`)
    .orderBy("qrs_code", "desc")
    .first();
};

export const createQr = async (data) => {
  const [qr] = await db(TABLE)
    .insert({
      qrs_code: data.qrs_code,
      type: data.type,
      farm_id: data.farm_id ?? null,
      pond_id: data.pond_id ?? null,
      is_active: data.is_active ?? false,
    })
    .returning("*");

  return qr;
};

export const createQrBatch = async (rows) => {
  return db(TABLE).insert(rows).returning("*");
};

export const deactivateFarmQrs = async (farm_id) => {
  return db(TABLE)
    .where({ type: "farm", farm_id, is_active: true })
    .update({ is_active: false, updated_at: db.fn.now() });
};

export const deactivatePondQrs = async (pond_id) => {
  return db(TABLE)
    .where({ type: "pond", pond_id, is_active: true })
    .update({ is_active: false, updated_at: db.fn.now() });
};

export const updateQrById = async (id, data) => {
  const [qr] = await db(TABLE)
    .where({ id })
    .update({
      ...data,
      updated_at: db.fn.now(),
    })
    .returning("*");

  return qr;
};

export const listQrs = async (filters = {}) => {
  return db(`${TABLE} as aq`)
    .leftJoin("farms as f", "aq.farm_id", "f.id")
    .leftJoin("ponds as p", "aq.pond_id", "p.id")
    .modify((query) => {
      if (filters.type) {
        query.where("aq.type", filters.type);
      }

      if (filters.is_active !== undefined) {
        query.where("aq.is_active", filters.is_active);
      }
    })
    .select(
      "aq.*",
      "f.farm_name",
      "f.farm_id as farm_code",
      "p.pond_name",
      "p.pond_id as pond_code"
    )
    .orderBy("aq.created_at", "desc");
};
