import db from "../../../shared/lib/db.js";
import { uploadFile } from "../../../shared/services/storage.service.js";
import { generateKey } from "../../../shared/utils/storageKey.js";
import {
  createInspection,
  getInspectionById,
  getLatestSamplingByCultureId,
  getQualityCheckerByIdentity,
  getScanContextByQrCode,
  listInspections,
} from "./qualityInspection_repository.js";

const GRADES = ["A", "B", "C", "D"];

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

const roundToTwoDecimals = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const normalizeQrCode = (value) => String(value || "").trim();

const normalizeBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "yes" || normalized === "true") return true;
    if (normalized === "no" || normalized === "false") return false;
  }

  return Boolean(value);
};

const normalizeDateTime = (value) => {
  if (!value) return new Date();

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw createError("Valid inspected_at is required");
  }

  return date;
};

const buildWatermarkMetadata = ({ context, body, inspectedAt }) => {
  return {
    farm_id: context.farm_code,
    pond_id: context.pond_code,
    harvest_id: context.harvest_id,
    gps: {
      farm_gate_latitude: context.farm_gate_latitude,
      farm_gate_longitude: context.farm_gate_longitude,
      pond_gps: context.pond_gps,
      inspection_latitude: body.inspection_latitude ?? body.latitude ?? null,
      inspection_longitude: body.inspection_longitude ?? body.longitude ?? null,
    },
    timestamp_utc: inspectedAt.toISOString(),
  };
};

const uploadShrimpImages = async (files, inspectionContext) => {
  if (!files?.length) return [];

  return Promise.all(
    files.map(async (file) => {
      const key = generateKey(
        `aquaculture_quality_inspections/${inspectionContext.harvest_id}/shrimp_images`,
        file.originalname
      );
      return uploadFile(file, key);
    })
  );
};

const validateScanContext = (context, harvestId) => {
  if (!context) {
    throw createError("Active pond QR, culture cycle, or harvest not found", 404);
  }

  if (context.qr_type !== "pond") {
    throw createError("QR code must be a pond QR");
  }

  if (context.qr_is_active !== true) {
    throw createError("QR code must be active");
  }

  if (context.culture_verification_status !== "ACTIVE") {
    throw createError("Culture cycle verification_status must be ACTIVE");
  }

  if (context.pond_status && context.pond_status !== "Active") {
    throw createError("Pond status must be Active");
  }

  if (context.pond_verification_status && context.pond_verification_status !== "Verified") {
    throw createError("Pond verification_status must be Verified");
  }

  if (harvestId && Number(context.harvest_id) !== Number(harvestId)) {
    throw createError("Harvest does not belong to the scanned pond QR", 404);
  }
};

const buildPrefill = (context, latestSampling, checker = null) => {
  return {
    pond_id: context.pond_id,
    pond_code: context.pond_code,
    pond_name: context.pond_name,
    pond_qr_scan: context.qrs_code,
    qr_code_id: context.qr_code_id,
    farm_id: context.farm_id,
    farm_code: context.farm_code,
    farm_name: context.farm_name,
    farm_address: context.farm_address,
    farm_gate_latitude: context.farm_gate_latitude,
    farm_gate_longitude: context.farm_gate_longitude,
    pond_gps: context.pond_gps,
    culture_id: context.culture_id,
    culture_code: context.culture_code,
    harvest_id: context.harvest_id,
    farmer: {
      user_id: context.user_id,
      name: context.farmer_name,
      owner_id: context.farmer_owner_id,
      mobile: context.farmer_mobile,
    },
    trader: {
      trader_id: context.trader_id,
      trader_code: context.trader_code,
      name: context.trader_name,
      mobile_number: context.trader_mobile,
    },
    latest_sampling: latestSampling
      ? {
          sampling_id: latestSampling.id,
          sampling_date: latestSampling.sampling_date,
          sample_count: latestSampling.sample_count,
          sample_weight: latestSampling.sample_weight,
          abw_g: latestSampling.ABW,
          size_count_kg: latestSampling.count_kg,
          expected_biomass: latestSampling.expected_biomass,
        }
      : null,
    inspector: checker
      ? {
          quality_checker_id: checker.id,
          checker_code: checker.checker_code,
          checker_name: checker.checker_name,
          checker_phone: checker.checker_phone,
          trader_id: checker.trader_id,
        }
      : null,
  };
};

export const getQualityInspectionPrefillService = async ({ qr_code, harvest_id, checker_code, quality_checker_id }) => {
  const qrCode = normalizeQrCode(qr_code);
  if (!qrCode) {
    throw createError("qr_code is required");
  }

  const harvestId = harvest_id ? validateId(harvest_id, "harvest_id") : null;
  const context = await getScanContextByQrCode(qrCode, harvestId);
  validateScanContext(context, harvestId);

  const [latestSampling, checker] = await Promise.all([
    getLatestSamplingByCultureId(context.culture_id),
    checker_code || quality_checker_id
      ? getQualityCheckerByIdentity({
          checker_code: checker_code ? String(checker_code).trim() : undefined,
          quality_checker_id: quality_checker_id ? validateId(quality_checker_id, "quality_checker_id") : undefined,
        })
      : null,
  ]);

  if (checker_code || quality_checker_id) {
    if (!checker) {
      throw createError("Active quality checker not found", 404);
    }

    if (context.trader_id && checker.trader_id && Number(context.trader_id) !== Number(checker.trader_id)) {
      throw createError("Quality checker does not belong to the harvest trader");
    }
  }

  return buildPrefill(context, latestSampling, checker);
};

export const createQualityInspectionService = async (body, shrimpImageFiles = []) => {
  return db.transaction(async (trx) => {
    const qrCode = normalizeQrCode(body.qr_code ?? body.pond_qr_scan);
    if (!qrCode) {
      throw createError("qr_code or pond_qr_scan is required");
    }

    const harvestId = validateId(body.harvest_id, "harvest_id");
    const context = await getScanContextByQrCode(qrCode, harvestId, trx);
    validateScanContext(context, harvestId);

    const checker = await getQualityCheckerByIdentity(
      {
        checker_code: body.checker_code ? String(body.checker_code).trim() : undefined,
        quality_checker_id: body.quality_checker_id ? validateId(body.quality_checker_id, "quality_checker_id") : undefined,
      },
      trx
    );

    if (!checker) {
      throw createError("Active quality checker not found", 404);
    }

    if (context.trader_id && checker.trader_id && Number(context.trader_id) !== Number(checker.trader_id)) {
      throw createError("Quality checker does not belong to the harvest trader");
    }

    const latestSampling = await getLatestSamplingByCultureId(context.culture_id, trx);
    if (!latestSampling) {
      throw createError("Sampling must be completed before quality inspection can be created");
    }

    const sampleCount = normalizeNumber(body.sample_count ?? latestSampling.sample_count);
    const sampleWeight = normalizeNumber(body.sample_weight ?? latestSampling.sample_weight);
    if (!Number.isFinite(sampleCount) || sampleCount <= 0) {
      throw createError("Valid sample_count is required");
    }
    if (!Number.isFinite(sampleWeight) || sampleWeight <= 0) {
      throw createError("Valid sample_weight is required");
    }

    const grade = String(body.grade || "").trim().toUpperCase();
    if (!GRADES.includes(grade)) {
      throw createError("grade must be A, B, C, or D");
    }

    const inspectedAt = normalizeDateTime(body.inspected_at);
    const abwG = roundToTwoDecimals(sampleWeight / sampleCount);
    const sizeCountKg = roundToTwoDecimals(1000 / abwG);
    if (!shrimpImageFiles.length && body.shrimp_images !== undefined && body.shrimp_images !== null && body.shrimp_images !== "") {
      throw createError("shrimp_images must be uploaded as file(s) using multipart/form-data");
    }

    const shrimpImages = await uploadShrimpImages(shrimpImageFiles, context);

    const created = await createInspection(
      {
        qr_code_id: context.qr_code_id,
        farm_id: context.farm_id,
        pond_id: context.pond_id,
        culture_id: context.culture_id,
        harvest_id: context.harvest_id,
        sampling_id: latestSampling.id,
        user_id: context.user_id,
        quality_checker_id: checker.id,
        trader_id: context.trader_id || checker.trader_id || null,
        pond_qr_scan: context.qrs_code,
        sample_count: sampleCount,
        sample_weight: sampleWeight,
        abw_g: abwG,
        size_count_kg: sizeCountKg,
        expected_biomass: normalizeNumber(latestSampling.expected_biomass),
        farm_address: context.farm_address,
        farm_gate_latitude: context.farm_gate_latitude,
        farm_gate_longitude: context.farm_gate_longitude,
        pond_gps: context.pond_gps,
        admin_mobile_number: context.trader_mobile || body.admin_mobile_number || null,
        grade,
        disease_observation: normalizeBoolean(body.disease_observation),
        disease_notes: body.disease_notes || null,
        shrimp_images: JSON.stringify(shrimpImages),
        watermark_metadata: JSON.stringify(buildWatermarkMetadata({ context, body, inspectedAt })),
        inspection_latitude: body.inspection_latitude ?? body.latitude ?? null,
        inspection_longitude: body.inspection_longitude ?? body.longitude ?? null,
        inspected_at: inspectedAt,
        remarks: body.remarks || null,
      },
      trx
    );

    return getInspectionById(created.id, trx);
  });
};

export const getQualityInspectionByIdService = async (id) => {
  const inspectionId = validateId(id);
  const inspection = await getInspectionById(inspectionId);

  if (!inspection) {
    throw createError("Quality inspection not found", 404);
  }

  return inspection;
};

export const listQualityInspectionsService = async (query) => {
  const filters = {};

  for (const field of ["harvest_id", "pond_id", "qr_code_id", "quality_checker_id", "trader_id"]) {
    if (query[field] !== undefined && query[field] !== null && query[field] !== "") {
      filters[field] = validateId(query[field], field);
    }
  }

  return listInspections(filters);
};
