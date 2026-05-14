import db from "../../../shared/lib/db.js";
import {
  createCultureCycle,
  getAllCultureCycles,
  getCultureCycleById,
  getFarmById,
  getLastCultureCycleByPrefix,
  getPondById,
  getBlockingCultureCycleByPondId,
  getUserLocationHierarchy,
  getCultureCyclesByUserId,
  getCultureCyclesByFarmId,
  getCultureCyclesByFarmIdAndPondId,
  getAquacultureImagesByCultureCycleIds,
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

const getTodayDateString = () => new Date().toISOString().slice(0, 10);

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

const groupImagesByCultureCycleId = (images) => {
  return images.reduce((acc, image) => {
    const cultureCycleId = Number(image.culture_cycle_id);

    if (!acc.has(cultureCycleId)) {
      acc.set(cultureCycleId, []);
    }

    acc.get(cultureCycleId).push(image);
    return acc;
  }, new Map());
};

const formatCultureCycleWithDetails = (row, images = []) => ({
  id: row.id,
  user_id: row.user_id,
  culture_code: row.culture_code,
  farm_id: row.farm_id,
  pond_id: row.pond_id,
  verification_status: row.verification_status,
  start_date: row.start_date,
  end_date: row.end_date,
  created_at: row.created_at,
  updated_at: row.updated_at,
  farm_code: row.farm_code,
  farm_name: row.farm_name,
  pond_code: row.pond_code,
  pond_name: row.pond_name,
  user: {
    id: row.nested_user_id,
    owner_id: row.nested_user_owner_id,
    username: row.nested_user_username,
    phone_no: row.nested_user_phone_no,
    address: row.nested_user_address,
    rootverse_type: row.nested_user_rootverse_type,
    verification_status: row.nested_user_verification_status,
    profile_picture_url: row.nested_user_profile_picture_url,
    profile_picture_key: row.nested_user_profile_picture_key,
    location_id: row.nested_user_location_id,
    district_id: row.nested_user_district_id,
    state_id: row.nested_user_state_id,
    created_at: row.nested_user_created_at,
    updated_at: row.nested_user_updated_at,
  },
  farm: {
    id: row.nested_farm_id,
    farm_id: row.nested_farm_code,
    farm_name: row.nested_farm_name,
    address: row.nested_farm_address,
    farm_gate_latitude: row.nested_farm_gate_latitude,
    farm_gate_longitude: row.nested_farm_gate_longitude,
    water_source: row.nested_farm_water_source,
    farm_area_acres: row.nested_farm_area_acres,
    qr_code: row.nested_farm_qr_code || null,
    created_at: row.nested_farm_created_at,
    updated_at: row.nested_farm_updated_at,
  },
  pond: {
    id: row.nested_pond_id,
    farm_id: row.nested_pond_farm_id,
    pond_id: row.nested_pond_code,
    pond_name: row.nested_pond_name,
    pond_type: row.nested_pond_type,
    water_spread_area_acres: row.nested_pond_water_spread_area_acres,
    volume: row.nested_pond_volume,
    pond_gps: row.nested_pond_gps,
    pond_status: row.nested_pond_status,
    verification_status: row.nested_pond_verification_status,
    qr_code: row.nested_pond_qr_code || null,
    created_at: row.nested_pond_created_at,
    updated_at: row.nested_pond_updated_at,
  },
  images,
});

const attachCultureCycleDetails = async (cultureCycles) => {
  const cultureCycleIds = cultureCycles.map((cultureCycle) => cultureCycle.id);
  const images = await getAquacultureImagesByCultureCycleIds(cultureCycleIds);
  const imagesByCultureCycleId = groupImagesByCultureCycleId(images);

  return cultureCycles.map((cultureCycle) =>
    formatCultureCycleWithDetails(
      cultureCycle,
      imagesByCultureCycleId.get(Number(cultureCycle.id)) || []
    )
  );
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

    const blockingCultureCycle = await getBlockingCultureCycleByPondId(
      data.pond_id,
      getTodayDateString(),
      trx
    );

    if (blockingCultureCycle) {
      throw createError(
        "pond_id is already used in a culture cycle. It can be reused only after the existing culture cycle end_date is completed and verification_status is CLOSED",
        400
      );
    }

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
  const cultureCycles = await getCultureCyclesByUserId(user_id);

  if (!cultureCycles || cultureCycles.length === 0) {
    throw createError("Culture cycle not found", 404);
  }

  return attachCultureCycleDetails(cultureCycles);
}

export const getAllCultureCyclesService = async () => {
  const cultureCycles = await getAllCultureCycles();

  if (!cultureCycles || cultureCycles.length === 0) {
    throw createError("Culture cycle not found", 404);
  }

  return attachCultureCycleDetails(cultureCycles);
}

export const getCultureCyclesByFarmIdService = async (farm_id) => {
  const farmId = Number(farm_id);

  if (!Number.isInteger(farmId) || farmId <= 0) {
    throw createError("Valid farm_id is required", 400);
  }

  const cultureCycles = await getCultureCyclesByFarmId(farmId);

  if (!cultureCycles || cultureCycles.length === 0) {
    throw createError("Culture cycle not found", 404);
  }

  return attachCultureCycleDetails(cultureCycles);
}

export const getCultureCyclesByFarmIdAndPondIdService = async (farm_id, pond_id) => {
  const farmId = Number(farm_id);
  const pondId = Number(pond_id);

  if (!Number.isInteger(farmId) || farmId <= 0) {
    throw createError("Valid farm_id is required", 400);
  }

  if (!Number.isInteger(pondId) || pondId <= 0) {
    throw createError("Valid pond_id is required", 400);
  }

  const cultureCycles = await getCultureCyclesByFarmIdAndPondId(farmId, pondId);

  if (!cultureCycles || cultureCycles.length === 0) {
    throw createError("Culture cycle not found", 404);
  }

  return attachCultureCycleDetails(cultureCycles);
}


export const getCultureCyclesByVerificationStatusService = async (verificationStatus) => {
  const cultureCycles = await getCultureCyclesByVerificationStatus(verificationStatus);
  if (!cultureCycles || cultureCycles.length === 0) {
    throw createError("No culture cycles found with the given verification status", 404);
  }
  return attachCultureCycleDetails(cultureCycles);
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
