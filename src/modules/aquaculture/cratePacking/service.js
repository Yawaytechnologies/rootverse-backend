import db from "../../../shared/lib/db.js";
import {
  createPackingRecord,
  getCrateByCode,
  getCratePackerByIdentity,
  getPackingByCrateQrId,
  getPackingContextByPondQr,
  insertProgressEvent,
  listPackedCratesByHarvest,
} from "./repository.js";

const GRADES = ["A", "B", "C", "D"];

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeNumber = (value) => {
  if (value === undefined || value === null || value === "") return NaN;
  return Number(value);
};

const validateId = (value, fieldName = "id") => {
  const id = normalizeNumber(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw createError(`Valid ${fieldName} is required`);
  }
  return id;
};

const normalizeQr = (value, fieldName) => {
  const code = String(value || "").trim();
  if (!code) throw createError(`${fieldName} is required`);
  return code;
};

const normalizeGrade = (value, fallback) => {
  const grade = String(value || fallback || "").trim().toUpperCase();
  if (!GRADES.includes(grade)) {
    throw createError("grade must be A, B, C, or D");
  }
  return grade;
};

const normalizeDateTime = (value) => {
  if (!value) return new Date();
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw createError("Valid packed_at is required");
  }
  return date;
};

const normalizeCrates = (body) => {
  const crates = Array.isArray(body.crates)
    ? body.crates
    : [
        {
          crate_qr: body.crate_qr ?? body.crate_code ?? body.crateCode,
          weight: body.weight ?? body.weight_kg ?? body.total_weight,
          grade: body.grade,
          size_count_kg: body.size_count_kg,
        },
      ];

  if (!crates.length) {
    throw createError("At least one crate is required");
  }

  const seen = new Set();
  return crates.map((crate, index) => {
    const crateCode = normalizeQr(crate.crate_qr ?? crate.crate_code ?? crate.crateCode, `crates[${index}].crate_qr`);
    if (seen.has(crateCode)) {
      throw createError(`Duplicate crate QR in request: ${crateCode}`);
    }
    seen.add(crateCode);

    const weight = normalizeNumber(crate.weight ?? crate.weight_kg ?? crate.total_weight);
    if (!Number.isFinite(weight) || weight <= 0) {
      throw createError(`Valid weight is required for crate ${crateCode}`);
    }

    return {
      crateCode,
      weight,
      grade: crate.grade,
      size_count_kg: crate.size_count_kg,
    };
  });
};

const validatePackingContext = (context) => {
  if (!context) {
    throw createError("Active pond QR, booked harvest, or quality inspection not found", 404);
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
  if (context.booking_status !== "booked") {
    throw createError("Harvest Request must be accepted before crate packing");
  }
  if (!context.trader_id) {
    throw createError("Harvest must be linked to an accepted trader");
  }
  if (!context.quality_inspection_id) {
    throw createError("Quality Inspection must be completed before crate packing");
  }
};

const resolvePacker = async ({ user, body }, trx) => {
  if (user?.role === "CRATE_PACKER") {
    const packer = await getCratePackerByIdentity({ code: user.id }, trx);
    if (!packer) throw createError("Active crate packer not found", 404);
    return packer;
  }

  const packerId = body.crate_packer_id ?? body.packer_id;
  const packerCode = body.crate_packer_code ?? body.packer_code;
  if (!packerId && !packerCode) {
    throw createError("crate_packer_id or crate_packer_code is required");
  }

  const packer = await getCratePackerByIdentity(
    {
      id: packerId ? validateId(packerId, "crate_packer_id") : undefined,
      code: packerCode ? String(packerCode).trim() : undefined,
    },
    trx
  );
  if (!packer) throw createError("Active crate packer not found", 404);
  return packer;
};

const ensureActorCanAccessTrader = (user, traderId, packer) => {
  if (user?.role === "TRADER_ADMIN" && Number(user.trader_id || user.id) !== Number(traderId)) {
    throw createError("Cannot access another trader's harvest", 403);
  }

  if (user?.role === "CRATE_PACKER" && Number(packer.trader_id) !== Number(traderId)) {
    throw createError("Crate packer does not belong to the harvest trader", 403);
  }

  if (packer.trader_id && Number(packer.trader_id) !== Number(traderId)) {
    throw createError("Crate packer does not belong to the harvest trader", 403);
  }
};

const buildPrefill = (context, packer = null) => ({
  pond_id: context.pond_id,
  pond_code: context.pond_code,
  pond_name: context.pond_name,
  pond_qr_scan: context.qrs_code,
  qr_code_id: context.qr_code_id,
  farm_id: context.farm_id,
  farm_code: context.farm_code,
  farm_name: context.farm_name,
  culture_id: context.culture_id,
  culture_code: context.culture_code,
  harvest_id: context.harvest_id,
  species: context.species,
  size_count_kg: context.size_count_kg,
  expected_size: context.harvest_expected_size,
  expected_biomass: context.expected_biomass,
  grade: context.quality_grade,
  quality_inspection_id: context.quality_inspection_id,
  trader: {
    trader_id: context.trader_id,
    trader_code: context.trader_code,
    trader_name: context.trader_name,
    mobile: context.trader_mobile,
  },
  crate_packer: packer
    ? {
        id: packer.id,
        code: packer.code,
        name: packer.name,
        trader_id: packer.trader_id,
      }
    : null,
});

export const getCratePackingPrefillService = async ({ pond_qr, harvest_id, user, body = {} }) => {
  const pondQrCode = normalizeQr(pond_qr, "pond_qr");
  const harvestId = harvest_id ? validateId(harvest_id, "harvest_id") : null;

  const [context, packer] = await db.transaction(async (trx) => {
    const resolvedContext = await getPackingContextByPondQr({ pondQrCode, harvestId }, trx);
    validatePackingContext(resolvedContext);

    const resolvedPacker =
      user?.role === "CRATE_PACKER" || body.crate_packer_id || body.crate_packer_code || body.packer_id || body.packer_code
        ? await resolvePacker({ user, body }, trx)
        : null;

    if (resolvedPacker) {
      ensureActorCanAccessTrader(user, resolvedContext.trader_id, resolvedPacker);
    } else if (user?.role === "TRADER_ADMIN" && Number(user.trader_id || user.id) !== Number(resolvedContext.trader_id)) {
      throw createError("Cannot access another trader's harvest", 403);
    }

    return [resolvedContext, resolvedPacker];
  });

  return buildPrefill(context, packer);
};

export const packCratesService = async (body, user) => {
  return db.transaction(async (trx) => {
    const pondQrCode = normalizeQr(body.pond_qr ?? body.pond_qr_scan ?? body.qr_code, "pond_qr");
    const harvestId = validateId(body.harvest_id, "harvest_id");
    const packedAt = normalizeDateTime(body.packed_at);
    const crates = normalizeCrates(body);

    const context = await getPackingContextByPondQr({ pondQrCode, harvestId }, trx);
    validatePackingContext(context);

    const packer = await resolvePacker({ user, body }, trx);
    ensureActorCanAccessTrader(user, context.trader_id, packer);

    const packedCrates = [];
    for (const crateInput of crates) {
      const crate = await getCrateByCode(crateInput.crateCode, trx);
      if (!crate) throw createError(`Unknown crate QR: ${crateInput.crateCode}`, 404);
      if (crate.type !== "A") throw createError(`Crate QR must be an aquaculture crate: ${crateInput.crateCode}`);
      const existingPacking = await getPackingByCrateQrId(crate.id, trx);
      if (existingPacking) {
        throw createError(`Crate QR is already assigned: ${crateInput.crateCode}`, 409);
      }

      const grade = normalizeGrade(crateInput.grade, context.quality_grade);
      const sizeCountKg = normalizeNumber(crateInput.size_count_kg ?? context.size_count_kg);

      const packing = await createPackingRecord(
        {
          crate_qr_id: crate.id,
          qr_code_id: context.qr_code_id,
          pond_id: context.pond_id,
          harvest_id: context.harvest_id,
          quality_inspection_id: context.quality_inspection_id,
          crate_packer_id: packer.id,
          trader_id: context.trader_id,
          crate_code: crate.code,
          pond_qr_code: context.qrs_code,
          species: context.species,
          size_count_kg: Number.isFinite(sizeCountKg) ? sizeCountKg : null,
          weight_kg: crateInput.weight,
          grade,
          gps_latitude: body.gps_latitude ?? body.latitude ?? null,
          gps_longitude: body.gps_longitude ?? body.longitude ?? null,
          packing_status: "CRATE_PACKED",
          remarks: body.remarks || null,
          packed_at: packedAt,
        },
        trx
      );

      await insertProgressEvent(
        {
          trader_id: context.trader_id,
          entity_type: "AQUACULTURE_CRATE_PACKING",
          entity_id: String(packing.id),
          from_status: null,
          to_status: "CRATE_PACKED",
          actor_role: user?.role || "CRATE_PACKER",
          actor_id: String(user?.id || packer.code || packer.id),
          remarks: body.remarks || null,
        },
        trx
      );

      packedCrates.push({
        ...packing,
        crate_qr: crate,
      });
    }

    return {
      ...buildPrefill(context, packer),
      crate_count: packedCrates.length,
      total_weight: packedCrates.reduce((sum, crate) => sum + Number(crate.weight_kg || 0), 0),
      crates: packedCrates,
    };
  });
};

export const listHarvestCratesService = async ({ harvest_id, user, trader_id }) => {
  const harvestId = validateId(harvest_id, "harvest_id");
  const crates = await listPackedCratesByHarvest(harvestId);

  if (user?.role === "TRADER_ADMIN") {
    const actorTraderId = Number(user.trader_id || user.id);
    return crates.filter((crate) => Number(crate.trader_id) === actorTraderId);
  }

  if (trader_id) {
    const traderId = validateId(trader_id, "trader_id");
    return crates.filter((crate) => Number(crate.trader_id) === traderId);
  }

  return crates;
};
