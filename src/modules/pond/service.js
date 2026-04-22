import {
  getFarmById,
  getLastPondByPrefix,
  createPond,
  getAllPonds,
  getPondById,
  getPondsByFarmId,
  updatePondById,
  deletePondById,
} from "./repository.js";

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const VALID_POND_TYPES = ["Earthen", "HDPE", "Concrete"];

const generatePondId = async () => {
  const countryCode = "IN";
  const stateCode = "TN";
  const districtCode = "NA";
  const entityCode = "P";

  const currentYear = new Date().getFullYear().toString().slice(-2);

  const prefix = `${countryCode}-${stateCode}-${districtCode}-${entityCode}-${currentYear}`;

  const lastPond = await getLastPondByPrefix(prefix);

  let nextNumber = 1;

  if (lastPond?.pond_id) {
    const lastSerial = lastPond.pond_id.slice(-5);
    nextNumber = Number(lastSerial) + 1;
  }

  const serial = String(nextNumber).padStart(5, "0");

  return `${prefix}${serial}`;
};

const normalizePondPayload = (body) => {
  return {
    farm_id: Number(body.farm_id),
    pond_name: body.pond_name?.trim(),
    pond_type: body.pond_type?.trim(),
    water_spread_area_acres: Number(body.water_spread_area_acres),
    volume:
      body.volume === undefined || body.volume === null || body.volume === ""
        ? null
        : Number(body.volume),
    pond_gps: body.pond_gps?.trim(),
  };
};

const validatePondPayload = (data) => {
  if (!data.farm_id || Number.isNaN(data.farm_id)) {
    throw createError("Farm ID is required", 400);
  }

  if (!data.pond_name) {
    throw createError("Pond name is required", 400);
  }

  if (!data.pond_type) {
    throw createError("Pond type is required", 400);
  }

  if (!VALID_POND_TYPES.includes(data.pond_type)) {
    throw createError("Pond type must be Earthen, HDPE, or Concrete", 400);
  }

  if (
    Number.isNaN(data.water_spread_area_acres) ||
    data.water_spread_area_acres <= 0
  ) {
    throw createError("Valid water spread area in acres is required", 400);
  }

  if (data.volume !== null && (Number.isNaN(data.volume) || data.volume < 0)) {
    throw createError("Valid volume is required", 400);
  }

  if (!data.pond_gps) {
    throw createError("Pond GPS is required", 400);
  }
};

export const createPondService = async (body) => {
  const data = normalizePondPayload(body);

  validatePondPayload(data);

  const farm = await getFarmById(data.farm_id);

  if (!farm) {
    throw createError("Please give a valid farm id", 400);
  }

  const pond_id = await generatePondId();

  return await createPond({
    ...data,
    pond_id,
  });
};

export const getAllPondsService = async () => {
  return await getAllPonds();
};

export const getPondByIdService = async (id) => {
  const pond = await getPondById(id);

  if (!pond) {
    throw createError("Pond not found", 404);
  }

  return pond;
};

export const getPondsByFarmIdService = async (farm_id) => {
  const farm = await getFarmById(Number(farm_id));

  if (!farm) {
    throw createError("Please give a valid farm id", 400);
  }

  return await getPondsByFarmId(Number(farm_id));
};

export const updatePondService = async (id, body) => {
  const existingPond = await getPondById(id);

  if (!existingPond) {
    throw createError("Pond not found", 404);
  }

  const data = normalizePondPayload(body);

  validatePondPayload(data);

  const farm = await getFarmById(data.farm_id);

  if (!farm) {
    throw createError("Please give a valid farm id", 400);
  }

  return await updatePondById(id, data);
};

export const deletePondService = async (id) => {
  const existingPond = await getPondById(id);

  if (!existingPond) {
    throw createError("Pond not found", 404);
  }

  await deletePondById(id);

  return {
    message: "Pond deleted successfully",
  };
};