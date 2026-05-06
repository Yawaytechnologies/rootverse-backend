import {
  getFarmById,
  getLastPondByPrefix,
  createPond,
  getAllPonds,
  getPondById,
  getPondsByFarmId,
  updatePondById,
  deletePondById,
  updatePondStatusById,
  updatePondVerificationStatusById,
  getActivePonds,
  getVerifiedPonds,
} from "./repository.js";

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const VALID_POND_TYPES = ["Earthen", "HDPE", "Concrete"];
const VALID_POND_STATUS = ["Active", "Inactive"];
const VALID_VERIFICATION_STATUS = ["Verified", "Unverified"];

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

const normalizePondStatus = (status) => {
  if (!status || typeof status !== "string") {
    return null;
  }

  const cleanStatus = status.trim().toLowerCase();

  if (cleanStatus === "active") return "Active";
  if (cleanStatus === "inactive") return "Inactive";

  return status.trim();
};

const normalizeVerificationStatus = (status) => {
  if (!status || typeof status !== "string") {
    return null;
  }

  const cleanStatus = status.trim().toLowerCase();

  if (cleanStatus === "verified") return "Verified";
  if (cleanStatus === "unverified") return "Unverified";

  return status.trim();
};

export const createPondService = async (body) => {
  const data = normalizePondPayload(body);

  validatePondPayload(data);

  const farm = await getFarmById(data.farm_id);

  if (!farm) {
    throw createError("Please give a valid farm id", 400);
  }

  if (!farm.user_id) {
    throw createError("Selected farm does not have user_id", 400);
  }

  const pond_id = await generatePondId();

  return await createPond({
    ...data,
    user_id: farm.user_id,
    pond_id,
    pond_status: "Active",
    verification_status: "Unverified",
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
  const farmId = Number(farm_id);

  if (!farmId || Number.isNaN(farmId)) {
    throw createError("Valid farm id is required", 400);
  }

  const farm = await getFarmById(farmId);

  if (!farm) {
    throw createError("Please give a valid farm id", 400);
  }

  return await getPondsByFarmId(farmId);
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

export const updatePondStatusService = async (id, pond_status) => {
  const existingPond = await getPondById(id);

  if (!existingPond) {
    throw createError("Pond not found", 404);
  }

  const normalizedStatus = normalizePondStatus(pond_status);

  if (!normalizedStatus) {
    throw createError("Pond status is required", 400);
  }

  if (!VALID_POND_STATUS.includes(normalizedStatus)) {
    throw createError("Pond status must be Active or Inactive", 400);
  }

  return await updatePondStatusById(id, normalizedStatus);
};

export const updatePondVerificationStatusService = async (
  id,
  verification_status
) => {
  const existingPond = await getPondById(id);

  if (!existingPond) {
    throw createError("Pond not found", 404);
  }

  const normalizedStatus = normalizeVerificationStatus(verification_status);

  if (!normalizedStatus) {
    throw createError("Verification status is required", 400);
  }

  if (!VALID_VERIFICATION_STATUS.includes(normalizedStatus)) {
    throw createError(
      "Verification status must be Verified or Unverified",
      400
    );
  }

  return await updatePondVerificationStatusById(id, normalizedStatus);
};

export const getActivePondsService = async () => {
  return await getActivePonds();
};

export const getVerifiedPondsService = async () => {
  return await getVerifiedPonds();
};