import db from "../../../shared/lib/db.js";
import {
  createTransportLoading,
  getHarvestLoadingRows,
  getLoadingByCratePackingId,
  getPackedCrateContextByCode,
  getTransportOperatorById,
  getTransportOperatorByRvId,
  insertProgressEvent,
  updatePackingStatus,
} from "./repository.js";

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeId = (value, fieldName) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw createError(`Valid ${fieldName} is required`);
  }
  return id;
};

const normalizeText = (value, fieldName) => {
  const text = String(value || "").trim();
  if (!text) throw createError(`${fieldName} is required`);
  return text;
};

const normalizeOptionalNumber = (value, fieldName) => {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number)) throw createError(`Valid ${fieldName} is required`);
  return number;
};

const normalizeDateTime = (value, fieldName) => {
  if (!value) return new Date();
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw createError(`Valid ${fieldName} is required`);
  return date;
};

const resolveOperator = async (user, body, trx) => {
  if (user?.role === "TRANSPORT_OPERATOR") {
    const operator = user.operator_rv_id
      ? await getTransportOperatorByRvId(user.operator_rv_id, trx)
      : await getTransportOperatorById(user.id, trx);
    if (!operator) throw createError("Transport operator not found", 404);
    if (!operator.is_active) throw createError("Transport operator is inactive", 403);
    return operator;
  }

  const operatorId = body.transport_operator_id;
  const operatorRvId = body.transport_operator_rv_id || body.operator_rv_id;
  if (!operatorId && !operatorRvId) {
    throw createError("transport_operator_id or transport_operator_rv_id is required");
  }

  const operator = operatorId
    ? await getTransportOperatorById(normalizeId(operatorId, "transport_operator_id"), trx)
    : await getTransportOperatorByRvId(normalizeText(operatorRvId, "transport_operator_rv_id"), trx);
  if (!operator) throw createError("Transport operator not found", 404);
  if (!operator.is_active) throw createError("Transport operator is inactive", 403);
  return operator;
};

const assertActorCanAccessTrader = (user, traderId, operator = null) => {
  if (user?.role === "TRADER_ADMIN" && Number(user.trader_id || user.id) !== Number(traderId)) {
    throw createError("Cannot access another trader's transport loading details", 403);
  }

  if (user?.role === "TRANSPORT_OPERATOR") {
    const userTraderId = operator?.trader_id ?? user.trader_id;
    if (!userTraderId || Number(userTraderId) !== Number(traderId)) {
      throw createError("Transport operator does not belong to the harvest trader", 403);
    }
  }

  if (operator?.trader_id && Number(operator.trader_id) !== Number(traderId)) {
    throw createError("Transport operator does not belong to the harvest trader", 403);
  }
};

const buildLoadingResponse = ({ context, operator, loading, progress }) => ({
  id: loading.id,
  crate_code: loading.crate_code,
  harvest_id: loading.harvest_id,
  trader_id: loading.trader_id,
  trader: {
    trader_code: context.trader_code,
    trader_name: context.trader_name,
    mobile: context.trader_mobile,
  },
  transport_operator: {
    id: operator.id,
    operator_rv_id: operator.operator_rv_id,
    full_name: operator.full_name,
    transport_id: operator.transport_id,
  },
  vehicle_number: loading.vehicle_number,
  species: context.species,
  grade: context.grade,
  weight_kg: context.weight_kg,
  chain_of_custody_status: loading.chain_of_custody_status,
  loaded_at: loading.loaded_at,
  progress,
});

const summarizeRows = (rows) => {
  const totalPackedCrates = rows.length;
  const loadedCrates = rows.filter((row) => row.loading_id).length;
  const remainingCrates = Math.max(totalPackedCrates - loadedCrates, 0);

  return {
    harvest_id: rows[0]?.harvest_id || null,
    trader_id: rows[0]?.trader_id || null,
    vehicle_number: rows.find((row) => row.vehicle_number)?.vehicle_number || null,
    transport_operator: rows.find((row) => row.transport_operator_id)
      ? {
          id: rows.find((row) => row.transport_operator_id).transport_operator_id,
          operator_rv_id: rows.find((row) => row.transport_operator_id).transport_operator_rv_id,
          full_name: rows.find((row) => row.transport_operator_id).transport_operator_name,
        }
      : null,
    total_packed_crates: totalPackedCrates,
    loaded_crates: loadedCrates,
    remaining_crates: remainingCrates,
    loading_progress: totalPackedCrates ? Math.round((loadedCrates / totalPackedCrates) * 100) : 0,
    dispatch_status:
      totalPackedCrates === 0
        ? "NO_PACKED_CRATES"
        : remainingCrates === 0
          ? "READY_FOR_DISPATCH"
          : loadedCrates > 0
            ? "LOADING_IN_PROGRESS"
            : "LOADING_PENDING",
  };
};

export const scanTransportLoadingService = async (body, user) =>
  db.transaction(async (trx) => {
    const crateCode = normalizeText(body.crate_qr || body.crate_code || body.crateCode, "crate_qr");
    const vehicleNumber = normalizeText(body.vehicle_number || body.vehicle_no, "vehicle_number");

    const context = await getPackedCrateContextByCode(crateCode, trx);
    if (!context) throw createError("Packed crate not found for scanned QR", 404);
    if (context.crate_qr_type !== "A") throw createError("Crate QR must be an aquaculture crate");
    if (context.booking_status !== "booked") throw createError("Harvest Request must be accepted before transport loading");
    if (!context.inspection_id) throw createError("Quality Inspection must be completed before transport loading");

    const operator = await resolveOperator(user, body, trx);
    assertActorCanAccessTrader(user, context.trader_id, operator);

    const existingLoading = await getLoadingByCratePackingId(context.crate_packing_id, trx);
    if (existingLoading) throw createError("Crate has already been loaded", 409);
    if (context.packing_status !== "CRATE_PACKED") {
      throw createError("Crate must be packed before transport loading", 422);
    }

    const loading = await createTransportLoading(
      {
        crate_packing_id: context.crate_packing_id,
        crate_qr_id: context.crate_qr_id,
        harvest_id: context.harvest_id,
        trader_id: context.trader_id,
        transport_operator_id: operator.id,
        transport_operator_rv_id: operator.operator_rv_id,
        vehicle_number: vehicleNumber,
        crate_code: context.crate_code,
        gps_latitude: normalizeOptionalNumber(body.gps_latitude ?? body.gps_lat, "gps_latitude"),
        gps_longitude: normalizeOptionalNumber(body.gps_longitude ?? body.gps_lng, "gps_longitude"),
        chain_of_custody_status: "LOADED",
        loaded_at: normalizeDateTime(body.loaded_at, "loaded_at"),
        remarks: body.remarks || null,
      },
      trx
    );

    await updatePackingStatus(context.crate_packing_id, { packing_status: "LOADED" }, trx);

    await insertProgressEvent(
      {
        trader_id: context.trader_id,
        entity_type: "AQUACULTURE_TRANSPORT_LOADING",
        entity_id: String(loading.id),
        from_status: "CRATE_PACKED",
        to_status: "LOADED",
        actor_role: user?.role || "TRANSPORT_OPERATOR",
        actor_id: String(user?.operator_rv_id || user?.id || operator.operator_rv_id),
        remarks: body.remarks || null,
      },
      trx
    );

    const rows = await getHarvestLoadingRows(context.harvest_id, trx);
    return buildLoadingResponse({
      context,
      operator,
      loading,
      progress: summarizeRows(rows),
    });
  });

export const getTransportLoadingProgressService = async ({ harvest_id, user }) => {
  const harvestId = normalizeId(harvest_id, "harvest_id");
  const rows = await getHarvestLoadingRows(harvestId);
  if (!rows.length) throw createError("No packed crates found for harvest", 404);

  if (user?.role === "TRANSPORT_OPERATOR") {
    const operator = user.operator_rv_id
      ? await getTransportOperatorByRvId(user.operator_rv_id)
      : await getTransportOperatorById(user.id);
    assertActorCanAccessTrader(user, rows[0].trader_id, operator);
  } else {
    assertActorCanAccessTrader(user, rows[0].trader_id);
  }

  return {
    ...summarizeRows(rows),
    crates: rows.map((row) => ({
      crate_packing_id: row.crate_packing_id,
      crate_code: row.crate_code,
      species: row.species,
      grade: row.grade,
      weight_kg: row.weight_kg,
      packing_status: row.packing_status,
      loaded: Boolean(row.loading_id),
      loaded_at: row.loaded_at,
      vehicle_number: row.vehicle_number,
      transport_operator_id: row.transport_operator_id,
      transport_operator_rv_id: row.transport_operator_rv_id,
      transport_operator_name: row.transport_operator_name,
      chain_of_custody_status: row.chain_of_custody_status,
    })),
  };
};
