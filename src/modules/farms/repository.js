import db from "../../shared/lib/db.js";

const TABLE = "farms";
 
/**
 * Get Rootverse User by ID
 */
export const getRootverseUserById = async (user_id) => {
  return await db("rootverse_users")
    .where({ id: user_id })
    .first();
};

const generateFarmId = async (prefix) => {
  if (!prefix) {
    throw new Error("farm_prefix is required");
  }

  const year = String(new Date().getFullYear()).slice(-2);

  // Example final prefix: IN-TN-NA-26
  const finalPrefix = `${prefix}-${year}`;

  // Get last farm with same prefix and year
  const lastFarm = await db(TABLE)
    .where("farm_id", "like", `${finalPrefix}%`)
    .orderBy("farm_id", "desc")
    .first();

  let nextNumber = 1;

  if (lastFarm) {
    // Example: IN-TN-NA-260001
    const lastSerial = lastFarm.farm_id.replace(finalPrefix, "");
    const lastNumber = parseInt(lastSerial, 10);

    if (!Number.isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  const paddedNumber = String(nextNumber).padStart(4, "0");

  return `${finalPrefix}${paddedNumber}`;
};

/**
 * Create Farm
 */
export const createFarm = async (data) => {
  const prefix = data.farm_prefix;

  const farm_id = await generateFarmId(prefix);

  const [farm] = await db(TABLE)
    .insert({
      farm_id,
      farm_name: data.farm_name,
      user_id: data.user_id,
      address: data.address,
      farm_gate_latitude: data.farm_gate_latitude,
      farm_gate_longitude: data.farm_gate_longitude,
      water_source: data.water_source,
      farm_area_acres: data.farm_area_acres,
    })
    .returning("*");

  return farm;
};

/**
 * Get All Farms
 */
export const getAllFarms = async () => {
  return await db(TABLE).select("*").orderBy("created_at", "desc");
};

/**
 * Get Farm by DB ID
 */
export const getFarmById = async (id) => {
  return await db(TABLE)
    .where({ id })
    .first();
};

/**
 * Get Farm by Custom Farm ID
 */
export const getFarmByFarmId = async (farm_id) => {
  return await db(TABLE)
    .where({ farm_id })
    .first();
};

/**
 * Update Farm
 */
export const updateFarmById = async (id, data) => {
  const [farm] = await db(TABLE)
    .where({ id })
    .update({
      farm_id: data.farm_id,
      farm_name: data.farm_name,
      user_id: data.user_id,
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

/**
 * Delete Farm
 */
export const deleteFarmById = async (id) => {
  return await db(TABLE)
    .where({ id })
    .del();
};
