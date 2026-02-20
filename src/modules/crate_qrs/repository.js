import db from "../../config/db.js";

const TABLE = "crate_qrs";
export const createQrBatch = async (count, type, districtId) => {
  return db.transaction(async (trx) => {
    const district = await trx("districts").where({ id: districtId }).first();
    if (!district) {
      throw new Error("District not found");
    }

    const rows = Array.from({ length: count }, () => ({
      type,
      district_id: districtId,
      district_code: district.district_code,
      status: "OPEN",
    }));

    return trx(TABLE).insert(rows).returning(["code", "id", "status"]);
  });
};

export const getQrByCode = async (code) => {
  return db(TABLE).where({ code }).first();
};

export const updateQr = async (id, updates) => {
  return db(TABLE).where({ id }).update(updates).returning("*");
};

export const listQrs = async (filters) => {
  const query = db(TABLE).modify((qb) => {
    if (filters.type) qb.where({ type: filters.type });
    if (filters.districtId) qb.where({ district_id: filters.districtId });
    if (filters.status) qb.where({ status: filters.status });
  });
  return query.select("*").limit(20).offset(filters.offset || 0);
};



