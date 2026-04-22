import {
  createFarm,
  getAllFarms,
  getFarmById,
  getFarmByFarmId,
  updateFarmById,
  deleteFarmById,
} from "./repository.js";

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const parseGps = (gps) => {
  if (!gps || typeof gps !== "string") {
    return null;
  }

  const parts = gps.split(",").map((value) => value.trim());

  if (parts.length !== 2) {
    return null;
  }

  const latitude = Number(parts[0]);
  const longitude = Number(parts[1]);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
};

const normalizeFarmPayload = (body) => {
  let latitude = body.farm_gate_latitude;
  let longitude = body.farm_gate_longitude;

  
  // farm_gate_gps: "10.765532, 79.849121"
  if ((!latitude || !longitude) && body.farm_gate_gps) {
    const gps = parseGps(body.farm_gate_gps);

    if (gps) {
      latitude = gps.latitude;
      longitude = gps.longitude;
    }
  }

  return {
    farm_id: body.farm_id?.trim(),
    farm_name: body.farm_name?.trim(),
    address: body.address?.trim(),
    farm_gate_latitude: Number(latitude),
    farm_gate_longitude: Number(longitude),
    water_source: body.water_source?.trim(),
    farm_area_acres: Number(body.farm_area_acres),
  };
};

const validateFarmPayload = (data) => {
  if (!data.farm_id) {
    throw createError("Farm ID is required", 400);
  }

  if (!data.farm_name) {
    throw createError("Farm name is required", 400);
  }

  if (!data.address) {
    throw createError("Address is required", 400);
  }

  if (
    Number.isNaN(data.farm_gate_latitude) ||
    data.farm_gate_latitude < -90 ||
    data.farm_gate_latitude > 90
  ) {
    throw createError("Valid farm gate latitude is required", 400);
  }

  if (
    Number.isNaN(data.farm_gate_longitude) ||
    data.farm_gate_longitude < -180 ||
    data.farm_gate_longitude > 180
  ) {
    throw createError("Valid farm gate longitude is required", 400);
  }

  if (!data.water_source) {
    throw createError("Water source is required", 400);
  }

  if (Number.isNaN(data.farm_area_acres) || data.farm_area_acres <= 0) {
    throw createError("Valid farm area in acres is required", 400);
  }
};

export const createFarmService = async (body) => {
  const data = normalizeFarmPayload(body);

  validateFarmPayload(data);

  const existingFarm = await getFarmByFarmId(data.farm_id);

  if (existingFarm) {
    throw createError("This Farm ID is already registered", 409);
  }

  return await createFarm(data);
};

export const getAllFarmsService = async () => {
  return await getAllFarms();
};

export const getFarmByIdService = async (id) => {
  const farm = await getFarmById(id);

  if (!farm) {
    throw createError("Farm not found", 404);
  }

  return farm;
};

export const getFarmByFarmIdService = async (farm_id) => {
  const farm = await getFarmByFarmId(farm_id);

  if (!farm) {
    throw createError("Farm not found", 404);
  }

  return farm;
};

export const updateFarmService = async (id, body) => {
  const existingFarm = await getFarmById(id);

  if (!existingFarm) {
    throw createError("Farm not found", 404);
  }

  const data = normalizeFarmPayload(body);

  validateFarmPayload(data);

  const farmWithSameFarmId = await getFarmByFarmId(data.farm_id);

  if (farmWithSameFarmId && farmWithSameFarmId.id !== id) {
    throw createError("This Farm ID is already used by another farm", 409);
  }

  return await updateFarmById(id, data);
};

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