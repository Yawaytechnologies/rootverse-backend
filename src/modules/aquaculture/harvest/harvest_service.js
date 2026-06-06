import db from "../../../shared/lib/db.js";
import {
  createHarvestRecord,
  deleteHarvestRecord,
  findTraderById,
  getAllHarvestRecords,
  getHarvestPrerequisites,
  getHarvestRecordById,
  getHarvestRecordsByFarmId,
  getHarvestRecordsByPondId,
  getHarvestRecordsByQrCode,
  getHarvestRecordsByQrCodeId,
  getHarvestRecordsByTraderId,
  getHarvestRelatedDetails,
  getLatestSamplingForHarvest,
  updateHarvestRecord,
} from "./harvest_repository.js";

const BOOKING_STATUSES = ["active", "booked"];
const HARVEST_METHODS = ["Partial", "Full"];

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return NaN;
  }

  return Number(value);
};

const validateId = (value, fieldName = "id") => {
  const id = normalizeNumber(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw createError(`Valid ${fieldName} is required`);
  }

  return id;
};

const normalizeDate = (value) => {
  if (!value) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).trim();
};

const normalizeDateTime = (value) => {
  if (!value) {
    return "";
  }

  return value instanceof Date ? value : String(value).trim();
};

const normalizeMethod = (value) => {
  const method = String(value || "").trim().toLowerCase();
  if (method === "partial") return "Partial";
  if (method === "full") return "Full";
  return value;
};

const requireRecords = (records, message = "Harvest records not found") => {
  if (!records || records.length === 0) {
    throw createError(message, 404);
  }

  return records;
};

const normalizeHarvestPayload = (body, fallback = {}) => {
  const cultureId = body.culture_cycle_id ?? body.culture_id ?? fallback.culture_id;
  const expectedBiomass =
    body.expected_biomass ?? body.exp_biomass ?? body.expectedBiomass ?? fallback.expected_biomass;
  const expectedSize = body.expected_size ?? body.exp_size ?? body.expectedSize ?? fallback.expected_size;
  const preferredHarvestTime =
    body.preferred_harvest_time ?? body.preferredHarvestTime ?? fallback.preferred_harvest_time;
  const doc = body.DOC ?? body.DoC ?? body.doc ?? fallback.DOC;

  return {
    culture_id: normalizeNumber(cultureId),
    qr_code_id: normalizeNumber(body.qr_code_id ?? body.qrcode_id ?? fallback.qr_code_id),
    DOC: normalizeNumber(doc),
    preferred_harvest_time: normalizeDateTime(preferredHarvestTime),
    expected_size: expectedSize === undefined || expectedSize === null ? "" : String(expectedSize).trim(),
    expected_biomass: normalizeNumber(expectedBiomass),
    harvest_method: normalizeMethod(body.harvest_method ?? body.harvestMethod ?? fallback.harvest_method),
    species: String(body.species ?? fallback.species ?? "").trim(),
    harvest_reason: body.harvest_reason ?? body.harvestReason ?? fallback.harvest_reason ?? null,
    stocking_date: normalizeDate(body.stocking_date ?? body.stockingDate ?? fallback.stocking_date),
    booking_status: body.booking_status ?? fallback.booking_status ?? "active",
  };
};

const applyDerivedHarvestFields = (data, prerequisites, latestSampling) => {
  const derived = { ...data };

  if (!Number.isFinite(derived.DOC) || derived.DOC <= 0) {
    derived.DOC = normalizeNumber(latestSampling?.DOC);
  }

  if (!derived.expected_size && latestSampling?.count_kg) {
    derived.expected_size = `${latestSampling.count_kg} Count/kg`;
  }

  if (!Number.isFinite(derived.expected_biomass) || derived.expected_biomass <= 0) {
    derived.expected_biomass = normalizeNumber(latestSampling?.expected_biomass);
  }

  if (!derived.species && prerequisites?.stocked_species) {
    derived.species = prerequisites.stocked_species;
  }

  if (!derived.stocking_date && prerequisites?.stocked_date) {
    derived.stocking_date = normalizeDate(prerequisites.stocked_date);
  }

  return derived;
};

const validateHarvestPayload = (data) => {
  const requiredNumberFields = ["culture_id", "qr_code_id", "DOC", "expected_biomass"];

  for (const field of requiredNumberFields) {
    if (!Number.isFinite(data[field]) || data[field] <= 0) {
      throw createError(`Valid ${field} is required`);
    }
  }

  if (!data.preferred_harvest_time || Number.isNaN(new Date(data.preferred_harvest_time).getTime())) {
    throw createError("Valid preferred_harvest_time is required");
  }

  if (!data.expected_size) {
    throw createError("expected_size is required");
  }

  if (!HARVEST_METHODS.includes(data.harvest_method)) {
    throw createError("harvest_method must be Partial or Full");
  }

  if (!data.species) {
    throw createError("species is required");
  }

  if (!data.stocking_date || Number.isNaN(new Date(data.stocking_date).getTime())) {
    throw createError("Valid stocking_date is required");
  }

  if (!BOOKING_STATUSES.includes(data.booking_status)) {
    throw createError("booking_status must be active or booked");
  }
};

const validateHarvestIdentityFields = (data) => {
  for (const field of ["culture_id", "qr_code_id"]) {
    if (!Number.isInteger(data[field]) || data[field] <= 0) {
      throw createError(`Valid ${field} is required`);
    }
  }
};

const validateHarvestPrerequisites = (data, prerequisites) => {
  if (!prerequisites) {
    throw createError("Culture cycle, pond, or QR code not found", 404);
  }

  if (prerequisites.culture_verification_status !== "ACTIVE") {
    throw createError("Culture cycle verification_status must be ACTIVE");
  }

  if (prerequisites.pond_status !== "Active") {
    throw createError("Pond status must be Active");
  }

  if (prerequisites.pond_verification_status !== "Verified") {
    throw createError("Pond verification_status must be Verified");
  }

  if (prerequisites.qr_type !== "pond") {
    throw createError("QR code must be a pond QR");
  }

  if (Number(prerequisites.qr_pond_id) !== Number(prerequisites.culture_pond_id)) {
    throw createError("qr_code_id does not belong to the culture cycle pond");
  }

  if (prerequisites.qr_is_active !== true) {
    throw createError("QR code must be active");
  }
};

const hydrateHarvest = async (harvest, trx) => {
  if (!harvest) {
    return harvest;
  }

  const details = await getHarvestRelatedDetails(harvest, trx);
  return { ...harvest, ...details };
};

const hydrateHarvestRecords = async (records, trx) => {
  return Promise.all(records.map((record) => hydrateHarvest(record, trx)));
};

export const createHarvestService = async (body) => {
  return db.transaction(async (trx) => {
    const initialData = normalizeHarvestPayload(body);
    validateHarvestIdentityFields(initialData);

    const prerequisites = await getHarvestPrerequisites(initialData, trx);

    validateHarvestPrerequisites(initialData, prerequisites);

    const latestSampling = await getLatestSamplingForHarvest(initialData, trx);
    if (!latestSampling) {
      throw createError("Sampling must be completed before harvest can be created");
    }

    const harvestData = applyDerivedHarvestFields(initialData, prerequisites, latestSampling);
    validateHarvestPayload(harvestData);

    const created = await createHarvestRecord(
      {
        ...harvestData,
        trader_id: null,
        booking_status: "active",
      },
      trx
    );

    return getHarvestRecordById(created.id, trx);
  });
};

export const getAllHarvestService = async () => {
  const records = await getAllHarvestRecords();
  return hydrateHarvestRecords(requireRecords(records));
};

export const getHarvestByIdService = async (id) => {
  const harvestId = validateId(id);
  const record = await getHarvestRecordById(harvestId);

  if (!record) {
    throw createError("Harvest record not found", 404);
  }

  return hydrateHarvest(record);
};

export const getHarvestByFarmIdService = async (farmId) => {
  const id = validateId(farmId, "farm_id");
  const records = requireRecords(await getHarvestRecordsByFarmId(id), "No harvest records found for this farm");
  return hydrateHarvestRecords(records);
};

export const getHarvestByPondIdService = async (pondId) => {
  const id = validateId(pondId, "pond_id");
  const records = requireRecords(await getHarvestRecordsByPondId(id), "No harvest records found for this pond");
  return hydrateHarvestRecords(records);
};

export const getHarvestByQrCodeIdService = async (qrCodeId) => {
  const id = validateId(qrCodeId, "qr_code_id");
  const records = requireRecords(await getHarvestRecordsByQrCodeId(id), "No harvest records found for this QR code");
  return hydrateHarvestRecords(records);
};

export const getHarvestByQrCodeService = async (qrCode) => {
  const code = String(qrCode || "").trim();
  if (!code) {
    throw createError("qr_code is required");
  }

  const records = requireRecords(await getHarvestRecordsByQrCode(code), "No harvest records found for this QR code");
  return hydrateHarvestRecords(records);
};

export const getHarvestByTraderIdService = async (traderId) => {
  const id = validateId(traderId, "trader_id");
  const records = requireRecords(await getHarvestRecordsByTraderId(id), "No harvest records found for this trader");
  return hydrateHarvestRecords(records);
};

export const updateHarvestService = async (id, body) => {
  const harvestId = validateId(id);

  return db.transaction(async (trx) => {
    const existingRecord = await getHarvestRecordById(harvestId, trx);

    if (!existingRecord) {
      throw createError("Harvest record not found", 404);
    }

    const initialData = normalizeHarvestPayload(body, existingRecord);
    validateHarvestIdentityFields(initialData);

    const prerequisites = await getHarvestPrerequisites(initialData, trx);

    validateHarvestPrerequisites(initialData, prerequisites);

    const latestSampling = await getLatestSamplingForHarvest(initialData, trx);
    if (!latestSampling) {
      throw createError("Sampling must be completed before harvest can be updated");
    }

    const harvestData = applyDerivedHarvestFields(initialData, prerequisites, latestSampling);
    validateHarvestPayload(harvestData);

    if (body.trader_id !== undefined && body.trader_id !== null && body.trader_id !== "") {
      const traderId = validateId(body.trader_id, "trader_id");
      const trader = await findTraderById(traderId, trx);
      if (!trader) {
        throw createError("Trader not found", 404);
      }
      harvestData.trader_id = traderId;
    } else {
      harvestData.trader_id = existingRecord.trader_id;
    }

    await updateHarvestRecord(harvestId, harvestData, trx);
    return getHarvestRecordById(harvestId, trx);
  });
};

export const updateHarvestBookingStatusService = async (id, body) => {
  const harvestId = validateId(id);
  const bookingStatus = body.booking_status || "booked";

  if (!BOOKING_STATUSES.includes(bookingStatus)) {
    throw createError("booking_status must be active or booked");
  }

  if (bookingStatus === "booked" && (body.trader_id === undefined || body.trader_id === null || body.trader_id === "")) {
    throw createError("trader_id is required when booking_status is booked");
  }

  return db.transaction(async (trx) => {
    const existingRecord = await getHarvestRecordById(harvestId, trx);

    if (!existingRecord) {
      throw createError("Harvest record not found", 404);
    }

    const traderId =
      body.trader_id === undefined || body.trader_id === null || body.trader_id === "" ? null : validateId(body.trader_id, "trader_id");

    if (traderId) {
      const trader = await findTraderById(traderId, trx);
      if (!trader) {
        throw createError("Trader not found", 404);
      }
    }

    await updateHarvestRecord(
      harvestId,
      {
        booking_status: bookingStatus,
        trader_id: traderId,
      },
      trx
    );

    return getHarvestRecordById(harvestId, trx);
  });
};

export const deleteHarvestService = async (id) => {
  const harvestId = validateId(id);
  const existingRecord = await getHarvestRecordById(harvestId);

  if (!existingRecord) {
    throw createError("Harvest record not found", 404);
  }

  await deleteHarvestRecord(harvestId);

  return { message: "Harvest record deleted successfully" };
};
