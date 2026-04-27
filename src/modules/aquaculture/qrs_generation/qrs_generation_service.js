import {
  createQrBatch,
  deactivateFarmQrs,
  deactivatePondQrs,
  getFarmById,
  getLastQrByPrefix,
  getLocationHierarchyById,
  getPondById,
  getQrByCode,
  getQrById,
  listQrs,
  updateQrById,
} from "./qrs_generation_repository.js";

const FARM_TYPE = "farm";
const POND_TYPE = "pond";

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeType = (type) => String(type || "").trim().toLowerCase();

const getYearPrefix = (year) => {
  return String(year).slice(-2);
};

const buildPrefix = ({ countryCode, stateCode, districtCode, type, year }) => {
  const normalizedYear = getYearPrefix(year);

  if (type === FARM_TYPE) {
    return `${countryCode}-${stateCode}-${districtCode}-${normalizedYear}`;
  }

  return `${countryCode}-${stateCode}-${districtCode}-P-${normalizedYear}`;
};

const getSerialLength = (type) => {
  return type === FARM_TYPE ? 4 : 5;
};

const validateGeneratePayload = (data) => {
  if (!data.location_id || Number.isNaN(data.location_id)) {
    throw createError("Valid location_id is required", 400);
  }

  if (data.type !== FARM_TYPE && data.type !== POND_TYPE) {
    throw createError("Type must be farm or pond", 400);
  }

  if (!Number.isInteger(data.year) || String(data.year).length !== 4) {
    throw createError("Valid 4-digit year is required", 400);
  }

  if (!Number.isInteger(data.qrs) || data.qrs <= 0) {
    throw createError("qrs must be a positive integer", 400);
  }
};

const normalizeGeneratePayload = (body) => {
  return {
    location_id: Number(body.location_id),
    type: normalizeType(body.type),
    year: Number(body.year),
    qrs: Number(body.qrs),
  };
};

const normalizeListFilters = (query) => {
  const filters = {};

  if (query.type) {
    filters.type = normalizeType(query.type);
  }

  if (query.is_active !== undefined) {
    filters.is_active = String(query.is_active).trim().toLowerCase() === "true";
  }

  return filters;
};

export const generateAquacultureQrService = async (body) => {
  const data = normalizeGeneratePayload(body);

  validateGeneratePayload(data);

  const location = await getLocationHierarchyById(data.location_id);

  if (!location) {
    throw createError("Location not found", 404);
  }

  if (!location.country_code || !location.state_code || !location.district_code) {
    throw createError(
      "Location is missing country, state, or district code configuration",
      400
    );
  }

  const prefix = buildPrefix({
    countryCode: location.country_code,
    stateCode: location.state_code,
    districtCode: location.district_code,
    type: data.type,
    year: data.year,
  });
  const serialLength = getSerialLength(data.type);
  const lastQr = await getLastQrByPrefix(prefix, data.type);

  let nextNumber = 1;

  if (lastQr?.qrs_code) {
    nextNumber = Number(lastQr.qrs_code.slice(-serialLength)) + 1;
  }

  const rows = Array.from({ length: data.qrs }, (_, index) => {
    const serial = String(nextNumber + index).padStart(serialLength, "0");

    return {
      qrs_code: `${prefix}${serial}`,
      type: data.type,
      farm_id: null,
      pond_id: null,
      is_active: false,
    };
  });

  return createQrBatch(rows);
};

export const activateFarmQrService = async (farmId, qrId) => {
  const farm = await getFarmById(Number(farmId));

  if (!farm) {
    throw createError("Farm not found", 404);
  }

  const qr = await getQrById(Number(qrId));

  if (!qr) {
    throw createError("QR not found", 404);
  }

  if (qr.type !== FARM_TYPE) {
    throw createError("This QR is not a farm QR", 400);
  }

  await deactivateFarmQrs(farm.id);

  return updateQrById(qr.id, {
    farm_id: farm.id,
    pond_id: null,
    is_active: true,
  });
};

export const activatePondQrService = async (pondId, qrId) => {
  const pond = await getPondById(Number(pondId));

  if (!pond) {
    throw createError("Pond not found", 404);
  }

  const qr = await getQrById(Number(qrId));

  if (!qr) {
    throw createError("QR not found", 404);
  }

  if (qr.type !== POND_TYPE) {
    throw createError("This QR is not a pond QR", 400);
  }

  await deactivatePondQrs(pond.id);

  return updateQrById(qr.id, {
    pond_id: pond.id,
    farm_id: pond.farm_id,
    is_active: true,
  });
};

export const getAquacultureQrByIdService = async (id) => {
  const qr = await getQrById(Number(id));

  if (!qr) {
    throw createError("QR not found", 404);
  }

  return qr;
};

export const getAquacultureQrByCodeService = async (code) => {
  const qr = await getQrByCode(code);

  if (!qr) {
    throw createError("QR not found", 404);
  }

  return qr;
};

export const listAquacultureQrsService = async (query) => {
  const filters = normalizeListFilters(query);

  if (
    filters.type !== undefined &&
    filters.type !== FARM_TYPE &&
    filters.type !== POND_TYPE
  ) {
    throw createError("Type must be farm or pond", 400);
  }

  return listQrs(filters);
};
