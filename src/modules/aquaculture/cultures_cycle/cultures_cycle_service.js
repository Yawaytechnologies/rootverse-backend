import db from "../../../shared/lib/db.js";
import {
  createCultureCycle,
  getCultureCycleById,
  getFarmById,
  getLastCultureCycleByPrefix,
  getPondById,
  getUserLocationHierarchy,
  getCultureCyclesByVerificationStatus,
  updateVerificationStatus,
} from "./cultures_cycle_repository.js";

const CULTURE_ENTITY_CODE = "CC";
const SERIAL_LENGTH = 5;
const VALID_STATUSES = [
  "PENDING",
  "ACTIVE",
  "STOCKED",
  "IN_PROGRESS",
  "HARVESTED",
  "CLOSED",
];

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeCodePart = (value) => String(value || "").trim().toUpperCase();

const normalizePayload = (body) => {
  const rawStatus = String(body.verification_status || "PENDING")
    .trim()
    .toUpperCase();

  return {
    user_id: Number(body.user_id),
    farm_id: Number(body.farm_id),
    pond_id: Number(body.pond_id),
    verification_status: rawStatus,
    start_date: body.start_date ? String(body.start_date).trim() : "",
    end_date: body.end_date ? String(body.end_date).trim() : "",
  };
};

const validatePayload = (data) => {
  if (!Number.isInteger(data.user_id) || data.user_id <= 0) {
    throw createError("Valid user_id is required", 400);
  }

  if (!Number.isInteger(data.farm_id) || data.farm_id <= 0) {
    throw createError("Valid farm_id is required", 400);
  }

  if (!Number.isInteger(data.pond_id) || data.pond_id <= 0) {
    throw createError("Valid pond_id is required", 400);
  }

  if (!data.start_date) {
    throw createError("start_date is required", 400);
  }

  if (!data.end_date) {
    throw createError("end_date is required", 400);
  }

  if (Number.isNaN(new Date(data.start_date).getTime())) {
    throw createError("Valid start_date is required", 400);
  }

  if (Number.isNaN(new Date(data.end_date).getTime())) {
    throw createError("Valid end_date is required", 400);
  }

  if (new Date(data.end_date) < new Date(data.start_date)) {
    throw createError("end_date must be greater than or equal to start_date", 400);
  }

  if (!VALID_STATUSES.includes(data.verification_status)) {
    throw createError(
      `verification_status must be one of ${VALID_STATUSES.join(", ")}`,
      400
    );
  }
};

const buildCulturePrefix = ({ country_code, state_code, district_code }) => {
  const countryCode = normalizeCodePart(country_code);
  const stateCode = normalizeCodePart(state_code);
  const districtCode = normalizeCodePart(district_code);

  if (!countryCode || !stateCode || !districtCode) {
    throw createError(
      "User location is missing country_code, state_code, or district_code",
      400
    );
  }

  return `${countryCode}-${stateCode}-${districtCode}-${CULTURE_ENTITY_CODE}`;
};

const getNextCultureCode = async (user, trx) => {
  const prefix = buildCulturePrefix(user);
  const lastCultureCycle = await getLastCultureCycleByPrefix(prefix, trx);

  let nextNumber = 1;

  if (lastCultureCycle?.culture_code) {
    const lastSerial = lastCultureCycle.culture_code.split("-").pop();
    nextNumber = Number(lastSerial) + 1;
  }

  if (!Number.isInteger(nextNumber) || nextNumber <= 0) {
    throw createError("Unable to generate next culture_code", 500);
  }

  return `${prefix}-${String(nextNumber).padStart(SERIAL_LENGTH, "0")}`;
};

export const createCultureCycleService = async (body) => {
  const data = normalizePayload(body);

  validatePayload(data);

  return db.transaction(async (trx) => {
    const user = await getUserLocationHierarchy(data.user_id, trx);

    if (!user) {
      throw createError("User not found", 404);
    }

    const farm = await getFarmById(data.farm_id, trx);

    if (!farm) {
      throw createError("Farm not found", 404);
    }

    const pond = await getPondById(data.pond_id, trx);

    if (!pond) {
      throw createError("Pond not found", 404);
    }

    if (Number(pond.farm_id) !== Number(farm.id)) {
      throw createError("pond_id does not belong to the given farm_id", 400);
    }

    await trx.raw(`LOCK TABLE culture_cycles IN EXCLUSIVE MODE`);

    const culture_code = await getNextCultureCode(user, trx);

    const createdCycle = await createCultureCycle(
      {
        ...data,
        culture_code,
      },
      trx
    );

    return getCultureCycleById(createdCycle.id, trx);
  });
};


export const getCultureCycleByidService = async (id) => {
  const cultureCycle = await getCultureCycleById(id);

  if (!cultureCycle) {
    throw createError("Culture cycle not found", 404);
  }
  
  return cultureCycle;
};


export const getCultureCycleByuserIdService = async (user_id) => {
    const cultureCycle = await getCultureCycleByUserId(user_id);
    if (!cultureCycle) {
        throw createError("Culture cycle not found", 404);
        }
    return cultureCycle;
}


export const getCultureCyclesByVerificationStatusService = async (verificationStatus) => {
  const cultureCycles = await getCultureCyclesByVerificationStatus(verificationStatus);
  if (!cultureCycles || cultureCycles.length === 0) {
    throw createError("No culture cycles found with the given verification status", 404);
  }
  return cultureCycles;
};


export const updateVerificationStatusService = async (cultureCycleId, newStatus, remarks) => {
  if (!VALID_STATUSES.includes(newStatus)) {
    throw createError(
      `verification_status must be one of ${VALID_STATUSES.join(", ")}`,
      400
    );
  }

  const cultureCycle = await getCultureCycleById(cultureCycleId);

  if (!cultureCycle) {
    throw createError("Culture cycle not found", 404);
  }

  await updateVerificationStatus(cultureCycleId, newStatus, remarks);

  return getCultureCycleById(cultureCycleId);
};
