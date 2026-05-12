import {
  createFarm,
  getAllFarms,
  getFarmById,
  getFarmByFarmId,
  updateFarmById,
  deleteFarmById,
  getRootverseUserById,
} from "./repository.js";

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * Create Farm Service
 */
export const createFarmService = async (data) => {
  const {
    user_id,
    farm_prefix,
    farm_name,
    address,
    farm_gate_latitude,
    farm_gate_longitude,
    water_source,
    farm_area_acres,
  } = data;

  if (!user_id) {
    throw createError("user_id is required", 400);
  }

  const user = await getRootverseUserById(user_id);

  if (!user) {
    throw createError("Invalid user_id. User not found", 404);
  }

  if (!farm_prefix) {
    throw createError("farm_prefix is required", 400);
  }

  if (!farm_name) {
    throw createError("farm_name is required", 400);
  }

  if (!address) {
    throw createError("address is required", 400);
  }

  if (!farm_gate_latitude) {
    throw createError("farm_gate_latitude is required", 400);
  }

  if (!farm_gate_longitude) {
    throw createError("farm_gate_longitude is required", 400);
  }

  if (!water_source) {
    throw createError("water_source is required", 400);
  }

  if (!farm_area_acres) {
    throw createError("farm_area_acres is required", 400);
  }

  return await createFarm({
    user_id,
    farm_prefix,
    farm_name,
    address,
    farm_gate_latitude,
    farm_gate_longitude,
    water_source,
    farm_area_acres,
  });
};

/**
 * Get All Farms Service
 */
export const getAllFarmsService = async () => {
  return await getAllFarms();
};

/**
 * Get Farm by DB ID Service
 */
export const getFarmByIdService = async (id) => {
  const farm = await getFarmById(id);

  if (!farm) {
    throw createError("Farm not found", 404);
  }

  return farm;
};

/**
 * Get Farm by Custom Farm ID Service
 */
export const getFarmByFarmIdService = async (farm_id) => {
  const farm = await getFarmByFarmId(farm_id);

  if (!farm) {
    throw createError("Farm not found", 404);
  }

  return farm;
};

/**
 * Update Farm Service
 */
export const updateFarmService = async (id, data) => {
  const existingFarm = await getFarmById(id);

  if (!existingFarm) {
    throw createError("Farm not found", 404);
  }

  if (data.user_id) {
    const user = await getRootverseUserById(data.user_id);

    if (!user) {
      throw createError("Invalid user_id. User not found", 404);
    }
  }

  const updatedFarm = await updateFarmById(id, data);

  return updatedFarm;
};

/**
 * Delete Farm Service
 */
export const deleteFarmService = async (id) => {
  const existingFarm = await getFarmById(id);

  if (!existingFarm) {
    throw createError("Farm not found", 404);
  }

  await deleteFarmById(id);

  return {
    message: "Farm deleted successfully",
  };
};