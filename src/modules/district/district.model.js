import db from "../../config/db.js";

const DISTRICT = "districts";
const STATE = "states";

/** ✅ Helper: always returns a district row with state_name */
export function getDistrictByIdPopulated(id) {
  return db.transaction(async (trx) => {
    return trx(`${DISTRICT} as d`)
      .join(`${STATE} as s`, "d.state_id", "s.id")
      .select(
        "d.id",
        "d.name",
        "d.state_id",
        "s.name as state_name",
        "d.created_at",
        "d.updated_at"
      )
      .where("d.id", id)
      .first();
  });
}

/** ✅ Create + return populated row */
export async function createDistrict(payload) {
  const [row] = await db(DISTRICT).insert(payload).returning(["id"]);
  const insertedId = row?.id; // safest shape for Postgres

  return getDistrictByIdPopulated(insertedId);
}

/** ✅ Populated single (you named it getDistrictById; keeping same name) */
export function getDistrictById(id) {
  return getDistrictByIdPopulated(id);
}

/** ✅ Populated list */
export function getAllDistricts() {
  return db(`${DISTRICT} as d`)
    .join(`${STATE} as s`, "d.state_id", "s.id")
    .select(
      "d.id",
      "d.name",
      "d.state_id",
      "s.name as state_name",
      "d.created_at",
      "d.updated_at"
    )
    .orderBy("d.name", "asc");
}

/** ✅ Update + return populated row */
export async function updateDistrict(id, updates) {
  await db(DISTRICT)
    .where({ id })
    .update({
      ...updates,
      updated_at: db.fn.now(), // keep timestamps correct
    });

  return getDistrictByIdPopulated(id);
}

/** ✅ Delete */
export function deleteDistrict(id) {
  return db(DISTRICT).where({ id }).del();
}

/** ✅ Populated filter by state */
export function getDistrictsByStateId(state_id) {
  return db.transaction(async (trx) => {
    return trx(`${DISTRICT} as d`)
      .join(`${STATE} as s`, "d.state_id", "s.id")
      .select(
        "d.id",
        "d.name",
        "d.state_id",
        "s.name as state_name",
        "d.created_at",
        "d.updated_at"
      )
      .where("d.state_id", state_id)
      .orderBy("d.name", "asc");
  });
}
