import bcrypt from "bcryptjs";
import { signToken } from "../auth/utils/token.js";
import * as repo from "./repository.js";
import db from "../../shared/lib/db.js";

// ── Auth ──────────────────────────────────────────────────────────────────────

export const login = async ({ login_id, password }) => {
  if (!login_id || !password) throw Object.assign(new Error("login_id and password are required"), { status: 400 });

  const operator = await repo.findOperatorByLoginId(login_id);
  if (!operator) throw Object.assign(new Error("Operator not found"), { status: 404 });
  if (!operator.is_active) throw Object.assign(new Error("Account is inactive"), { status: 403 });

  const valid = await bcrypt.compare(password, operator.password_hash);
  if (!valid) throw Object.assign(new Error("Invalid credentials"), { status: 401 });

  const centre = await db("collection_centres")
    .where({ centre_id: operator.centre_id })
    .select("centre_id", "centre_name")
    .first();

  const access_token = signToken({
    id: operator.id,
    role: "COLLECTION_CENTRE_OPERATOR",
    centre_id: operator.centre_id,
    operator_rv_id: operator.operator_rv_id,
  });

  return {
    access_token,
    token_type: "Bearer",
    role: "COLLECTION_CENTRE_OPERATOR",
    user: {
      operator_rv_id: operator.operator_rv_id,
      full_name: operator.full_name,
      centre_id: operator.centre_id,
      centre_name: centre?.centre_name || null,
    },
  };
};

// ── Dashboard ─────────────────────────────────────────────────────────────────

export const getDashboard = async (centreId, date) => {
  const centre = await db("collection_centres")
    .where({ centre_id: centreId })
    .first();
  if (!centre) throw Object.assign(new Error("Collection centre not found"), { status: 404 });

  const stats = await repo.getDashboardStats(centreId, date);

  return {
    selected_date: date || null,
    centre: {
      centre_id: centre.centre_id,
      centre_name: centre.centre_name,
    },
    stats,
  };
};

// ── List crates ───────────────────────────────────────────────────────────────

export const listCrates = (centreId, filters) =>
  repo.listCratesByCentre(centreId, filters);

// ── Receive crate ─────────────────────────────────────────────────────────────

export const receiveCrate = async (body) => {
  const { crate_qr, centre_id, operator_id } = body;
  if (!crate_qr) throw Object.assign(new Error("crate_qr is required"), { status: 400 });
  if (!centre_id) throw Object.assign(new Error("centre_id is required"), { status: 400 });
  if (!operator_id) throw Object.assign(new Error("operator_id is required"), { status: 400 });

  const crate = await repo.findCrateByQr(crate_qr);
  if (!crate) throw Object.assign(new Error("Unknown crate QR"), { status: 404 });

  if (
    crate.custody_status === "IN_TRANSIT" ||
    crate.custody_status === "DELIVERED"
  ) {
    throw Object.assign(
      new Error(`Crate cannot be received in its current status: ${crate.custody_status}`),
      { status: 409 }
    );
  }

  const updated = await repo.receiveCrate(crate, centre_id, operator_id, body);
  return updated;
};

// ── Temperature log ───────────────────────────────────────────────────────────

export const logTemperature = async (crateId, body) => {
  const { temperature_value, collection_centre_id, operator_id } = body;
  if (!temperature_value) throw Object.assign(new Error("temperature_value is required"), { status: 400 });
  if (!collection_centre_id) throw Object.assign(new Error("collection_centre_id is required"), { status: 400 });
  if (!operator_id) throw Object.assign(new Error("operator_id is required"), { status: 400 });

  const crate = await repo.findCrateById(crateId);
  if (!crate) throw Object.assign(new Error("Crate not found"), { status: 404 });

  if (
    crate.current_custodian_role !== "COLLECTION_CENTRE_OPERATOR" ||
    crate.current_custodian_id !== collection_centre_id
  ) {
    throw Object.assign(new Error("Crate is not under this centre's custody"), { status: 409 });
  }

  await repo.logTemperature(crateId, collection_centre_id, operator_id, body);
  return { crate_id: crateId, temperature_value, recorded_at_utc: new Date().toISOString() };
};

// ── Assign dispatch ───────────────────────────────────────────────────────────

export const assignDispatch = async (crateId, body) => {
  const required = ["destination_name", "transport_operator_id", "scheduled_time_utc", "driver_name", "vehicle_no"];
  for (const f of required) {
    if (!body[f]) throw Object.assign(new Error(`${f} is required`), { status: 400 });
  }

  const crate = await repo.findCrateById(crateId);
  if (!crate) throw Object.assign(new Error("Crate not found"), { status: 404 });

  if (crate.custody_status !== "RECEIVED_AT_COLLECTION_CENTRE") {
    throw Object.assign(
      new Error("Crate must be in RECEIVED_AT_COLLECTION_CENTRE status before dispatch"),
      { status: 422 }
    );
  }

  // Verify this operator's centre owns the crate
  const centreId = body.centre_id || crate.current_custodian_id;
  if (centreId && crate.current_custodian_id && centreId !== crate.current_custodian_id) {
    throw Object.assign(new Error("Crate is not under this centre's custody"), { status: 403 });
  }

  // Verify transport operator exists
  const transport = await db("transport_operators")
    .where({ operator_rv_id: body.transport_operator_id })
    .first();
  if (!transport) throw Object.assign(new Error("Transport operator not found"), { status: 404 });

  return repo.assignDispatch(crate, centreId, body.operator_id || "SYSTEM", body);
};

// ── Crate detail ──────────────────────────────────────────────────────────────

export const getCrateDetail = async (crateId) => {
  const detail = await repo.getCrateDetail(crateId);
  if (!detail) throw Object.assign(new Error("Crate not found"), { status: 404 });
  return detail;
};
