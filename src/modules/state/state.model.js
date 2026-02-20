import db from '../../config/db.js';

const TABLE = "states";
const COUNTRY = "country";

/** ✅ Helper: always returns a state row with country details */
export function getStateByIdPopulated(id) {
  return db.transaction(async (trx) => {
    return trx(`${TABLE} as st`)
      .leftJoin(`${COUNTRY} as c`, "st.country_id", "c.id")
      .select(
        "st.id",
        "st.name",
        "st.state_code",
        "st.country_id",
        "c.name as country_name",
        "c.code as country_code",
        "st.created_at",
        "st.updated_at"
      )
      .where("st.id", id)
      .first();
  });
}

/** ✅ Create + return populated row */
export async function createState(payload) {
  const result = await db(TABLE).insert(payload).returning("*");
  const row = Array.isArray(result) ? result[0] : result;
  const insertedId = row?.id;

  return getStateByIdPopulated(insertedId);
}

/** ✅ Populated single state (with country details) */
export function getStateById(id) {
  return getStateByIdPopulated(id);
}

/** ✅ Populated list - returns all states with country details */
export function getAllStates() {
  return db.transaction(async (trx) => {
    return trx(`${TABLE} as st`)
      .leftJoin(`${COUNTRY} as c`, "st.country_id", "c.id")
      .select(
        "st.id",
        "st.name",
        "st.state_code",
        "st.country_id",
        "c.name as country_name",
        "c.code as country_code",
        "st.created_at",
        "st.updated_at"
      )
      .orderBy("st.name", "asc");
  });
}

/** ✅ Update + return populated row */
export async function updateState(id, updates) {
  await db(TABLE)
    .where({ id })
    .update({
      ...updates,
      updated_at: db.fn.now(),
    });

  return getStateByIdPopulated(id);
}

/** ✅ Delete */
export function deleteState(id) {
  return db(TABLE).where({ id }).del();
}

export function getStatesByCountryId(country_id) {
  return db.transaction(async (trx) => {
    return trx(`${TABLE} as st`)
      .leftJoin(`${COUNTRY} as c`, "st.country_id", "c.id")
      .select(
        "st.id",
        "st.name",
        "st.state_code",
        "st.country_id",
        "c.name as country_name",
        "c.code as country_code",
        "st.created_at",
        "st.updated_at"
      )
      .where("st.country_id", country_id)
      .orderBy("st.name", "asc");
  });
}
