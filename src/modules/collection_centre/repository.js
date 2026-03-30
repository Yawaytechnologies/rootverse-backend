import db from "../../shared/lib/db.js";

const TYPE_MAP = { W: "WILD_CAPTURE", A: "AQUACULTURE", M: "MARICULTURE" };

// ── Auth ──────────────────────────────────────────────────────────────────────

export const findOperatorByLoginId = (loginId) =>
  db("collection_centre_operators")
    .where((qb) =>
      qb
        .where("operator_rv_id", loginId)
        .orWhere("email", loginId)
        .orWhere("mobile", loginId)
    )
    .first();

// ── Crate lookup ──────────────────────────────────────────────────────────────

export const findCrateByQr = (crateQr) =>
  db("crate_qrs").where({ code: crateQr }).first();

export const findCrateById = (crateId) =>
  db("crate_qrs").where({ id: crateId }).first();

// ── Receive crate ─────────────────────────────────────────────────────────────

export const receiveCrate = async (crate, centreId, operatorId, body) => {
  const productionCategory =
    body.production_category || TYPE_MAP[crate.type] || null;

  await db("crate_qrs").where({ id: crate.id }).update({
    custody_status: "RECEIVED_AT_COLLECTION_CENTRE",
    production_category: productionCategory,
    current_custodian_role: "COLLECTION_CENTRE_OPERATOR",
    current_custodian_id: centreId,
    received_centre_id: centreId,
    updated_at: db.fn.now(),
  });

  await db("crate_status_history").insert({
    crate_id: crate.id,
    crate_qr_code: crate.code,
    from_status: crate.custody_status || null,
    to_status: "RECEIVED_AT_COLLECTION_CENTRE",
    actor_role: "COLLECTION_CENTRE_OPERATOR",
    actor_id: operatorId,
    centre_or_transport_id: centreId,
    gps_lat: body.gps_lat || null,
    gps_lng: body.gps_lng || null,
    remarks: body.notes || null,
  });

  return db("crate_qrs").where({ id: crate.id }).first();
};

// ── Temperature log ───────────────────────────────────────────────────────────

export const logTemperature = (crateId, centreId, operatorId, body) =>
  db("temperature_logs").insert({
    crate_id: crateId,
    actor_role: "COLLECTION_CENTRE_OPERATOR",
    actor_id: operatorId,
    temperature_value: body.temperature_value,
    centre_or_transport_id: centreId,
    recorded_at_utc: body.logged_at_utc || db.fn.now(),
    notes: body.notes || null,
  });

// ── Assign dispatch ───────────────────────────────────────────────────────────

export const assignDispatch = async (crate, centreId, operatorId, body) => {
  await db("crate_qrs").where({ id: crate.id }).update({
    custody_status: "SCHEDULED_FOR_DISPATCH",
    updated_at: db.fn.now(),
  });

  const [assignment] = await db("crate_assignments")
    .insert({
      crate_id: crate.id,
      destination_name: body.destination_name,
      transport_operator_id: body.transport_operator_id,
      transport_id: body.transport_id || null,
      scheduled_time_utc: body.scheduled_time_utc,
      assigned_to_label: body.assigned_to_label || null,
      driver_name: body.driver_name,
      vehicle_no: body.vehicle_no,
      notes: body.notes || null,
      assigned_by_operator_id: operatorId,
      centre_id: centreId,
    })
    .returning("*");

  await db("crate_status_history").insert({
    crate_id: crate.id,
    crate_qr_code: crate.code,
    from_status: crate.custody_status,
    to_status: "SCHEDULED_FOR_DISPATCH",
    actor_role: "COLLECTION_CENTRE_OPERATOR",
    actor_id: operatorId,
    centre_or_transport_id: centreId,
    remarks: body.notes || null,
  });

  return assignment;
};

// ── List crates ───────────────────────────────────────────────────────────────

export const listCratesByCentre = (centreId, { date, status } = {}) => {
  const q = db("crate_qrs").where({ received_centre_id: centreId });
  if (status) q.andWhere("custody_status", status);
  if (date) q.whereRaw("DATE(updated_at AT TIME ZONE 'UTC') = ?", [date]);
  return q.select("*").orderBy("updated_at", "desc").limit(100);
};

// ── Crate detail ──────────────────────────────────────────────────────────────

export const getCrateDetail = async (crateId) => {
  const crate = await db("crate_qrs").where({ id: crateId }).first();
  if (!crate) return null;

  const [statusHistory, assignment, tempLogs] = await Promise.all([
    db("crate_status_history")
      .where({ crate_id: crateId })
      .orderBy("event_at_utc", "asc"),
    db("crate_assignments")
      .where({ crate_id: crateId })
      .orderBy("created_at", "desc")
      .first(),
    db("temperature_logs")
      .where({ crate_id: crateId })
      .orderBy("recorded_at_utc", "desc"),
  ]);

  return {
    ...crate,
    status_history: statusHistory,
    dispatch_assignment: assignment || null,
    temperature_logs: tempLogs,
  };
};

// ── Dashboard stats ───────────────────────────────────────────────────────────

export const getDashboardStats = async (centreId, date) => {
  const q = db("crate_qrs").where({ received_centre_id: centreId });
  if (date) q.whereRaw("DATE(updated_at AT TIME ZONE 'UTC') = ?", [date]);

  const rows = await q.select("custody_status");

  return {
    total: rows.length,
    received: rows.filter(
      (r) => r.custody_status === "RECEIVED_AT_COLLECTION_CENTRE"
    ).length,
    scheduled_for_dispatch: rows.filter(
      (r) => r.custody_status === "SCHEDULED_FOR_DISPATCH"
    ).length,
    in_transit: rows.filter(
      (r) => r.custody_status === "IN_TRANSIT"
    ).length,
    delivered: rows.filter(
      (r) => r.custody_status === "DELIVERED"
    ).length,
  };
};
