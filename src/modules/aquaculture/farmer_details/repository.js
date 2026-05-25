import db from "../../../shared/lib/db.js";

const TABLE = "aquaculture_farmers";
const USERS_TABLE = "rootverse_users";

const rootverseUserColumns = [
  "id",
  "username",
  "phone_no",
  "address",
  "rootverse_type",
  "verification_status",
  "profile_picture_url",
  "profile_picture_key",
  "created_at",
  "updated_at",
  "state_id",
  "district_id",
  "owner_id",
  "owner_register_progress",
  "location_id",
];

const selectFarmerDetails = (query) => {
  return query
    .leftJoin(`${USERS_TABLE} as ru`, `${TABLE}.user_id`, "ru.id")
    .leftJoin("states as s", "ru.state_id", "s.id")
    .leftJoin("districts as d", "ru.district_id", "d.id")
    .leftJoin("locations as l", "ru.location_id", "l.id")
    .select(
      `${TABLE}.*`,
      ...rootverseUserColumns.map((column) => `ru.${column} as rootverse_user_${column}`),
      "s.name as rootverse_user_state_name",
      "d.name as rootverse_user_district_name",
      "l.name as rootverse_user_location_name"
    );
};

const mapFarmerDetails = (row) => {
  if (!row) {
    return row;
  }

  const farmer = { ...row };
  const rootverse_user = {};

  for (const key of Object.keys(row)) {
    if (key.startsWith("rootverse_user_")) {
      rootverse_user[key.replace("rootverse_user_", "")] = row[key];
      delete farmer[key];
    }
  }

  return {
    ...farmer,
    rootverse_user: rootverse_user.id ? rootverse_user : null,
  };
};

export const getRootverseUserById = async (user_id) => {
  return db(USERS_TABLE).where({ id: user_id }).first();
};

export const createFarmerDetails = async (data) => {
  const [farmer] = await db(TABLE).insert(data).returning("*");

  return getFarmerDetailsById(farmer.id);
};

export const getAllFarmerDetails = async () => {
  const rows = await selectFarmerDetails(db(TABLE)).orderBy(`${TABLE}.created_at`, "desc");

  return rows.map(mapFarmerDetails);
};

export const getFarmerDetailsById = async (id) => {
  const row = await selectFarmerDetails(db(TABLE)).where(`${TABLE}.id`, id).first();

  return mapFarmerDetails(row);
};

export const getFarmerDetailsByUserId = async (user_id) => {
  const row = await selectFarmerDetails(db(TABLE)).where(`${TABLE}.user_id`, user_id).first();

  return mapFarmerDetails(row);
};

export const updateFarmerDetailsByUserId = async (user_id, data) => {
  const [farmer] = await db(TABLE)
    .where({ user_id })
    .update({
      ...data,
      updated_at: db.fn.now(),
    })
    .returning("*");

  if (!farmer) {
    return null;
  }

  return getFarmerDetailsById(farmer.id);
};

export const deleteFarmerDetailsById = async (id) => {
  return db(TABLE).where({ id }).del();
};

export const deleteFarmerDetailsByUserId = async (user_id) => {
  return db(TABLE).where({ user_id }).del();
};
