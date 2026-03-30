import db from "../../shared/lib/db.js";

// ── Auth ──────────────────────────────────────────────────────────────────────

export const findOperatorByLoginId = (loginId) =>
  db("transport_operators")
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

// ── Assigned crates ───────────────────────────────────────────────────────────

export const listAssignedCrates = (transportOperatorId, { date } = {}) => {
  const q = db("crate_assignments as ca")
    .join("crate_qrs as cq", "cq.id", "ca.crate_id")
    .where("ca.transport_operator_id", transportOperatorId)
    .andWhere("cq.custody_status", "SCHEDULED_FOR_DISPATCH");

  if (date)
    q.whereRaw("DATE(ca.scheduled_time_utc AT TIME ZONE 'UTC') = ?", [date]);

  return q.select(
    "cq.id as crate_id",
    "cq.code as crate_qr",
    "cq.custody_status as status",
    "ca.destination_name as destination",
    "ca.scheduled_time_utc as scheduled_time",
    "ca.vehicle_no as assigned_vehicle_no",
    "ca.notes",
    "ca.driver_name",
    "cq.production_category",
    "cq.total_weight as weight_kg",
    "cq.grade as quality_grade",
    "ca.centre_id as collection_centre"
  );
};

// ── In transit crates ─────────────────────────────────────────────────────────

export const listInTransitCrates = (transportOperatorId, { date } = {}) => {
  const q = db("crate_assignments as ca")
    .join("crate_qrs as cq", "cq.id", "ca.crate_id")
    .where("ca.transport_operator_id", transportOperatorId)
    .andWhere("cq.custody_status", "IN_TRANSIT");

  if (date)
    q.whereRaw("DATE(ca.picked_up_at_utc AT TIME ZONE 'UTC') = ?", [date]);

  return q.select(
    "cq.id as crate_id",
    "cq.code as crate_qr",
    "cq.custody_status as status",
    "ca.destination_name as destination",
    "ca.scheduled_time_utc as scheduled_time",
    "ca.picked_up_at_utc",
    "ca.vehicle_no as assigned_vehicle_no",
    "cq.production_category",
    "cq.grade as quality_grade"
  );
};

// ── Pickup scan ───────────────────────────────────────────────────────────────

export const pickupCrate = async (crate, assignment, operatorId, body) => {
  const now = new Date().toISOString();

  await db("crate_qrs").where({ id: crate.id }).update({
    custody_status: "IN_TRANSIT",
    current_custodian_role: "TRANSPORT_OPERATOR",
    current_custodian_id: body.transport_operator_id,
    updated_at: db.fn.now(),
  });

  await db("crate_assignments").where({ id: assignment.id }).update({
    picked_up_at_utc: now,
    pickup_gps_lat: body.gps_lat || null,
    pickup_gps_lng: body.gps_lng || null,
    updated_at: db.fn.now(),
  });

  await db("crate_status_history").insert({
    crate_id: crate.id,
    crate_qr_code: crate.code,
    from_status: crate.custody_status,
    to_status: "IN_TRANSIT",
    actor_role: "TRANSPORT_OPERATOR",
    actor_id: operatorId,
    centre_or_transport_id: body.transport_id || null,
    gps_lat: body.gps_lat || null,
    gps_lng: body.gps_lng || null,
  });

  return {
    crate_id: crate.id,
    crate_qr: crate.code,
    status: "IN_TRANSIT",
    picked_up_at_utc: now,
    gps_pickup: body.gps_lat ? { lat: body.gps_lat, lng: body.gps_lng } : null,
    transport_operator_id: body.transport_operator_id,
    assigned_vehicle_no: body.vehicle_no || assignment.vehicle_no,
  };
};

// ── Temperature log ───────────────────────────────────────────────────────────

export const logTemperature = (crateId, transportId, operatorId, body) =>
  db("temperature_logs").insert({
    crate_id: crateId,
    actor_role: "TRANSPORT_OPERATOR",
    actor_id: operatorId,
    temperature_value: body.temperature_value,
    centre_or_transport_id: transportId,
    recorded_at_utc: body.recorded_at_utc || db.fn.now(),
    notes: body.notes || null,
  });

// ── Deliver ───────────────────────────────────────────────────────────────────

export const deliverCrate = async (crate, assignment, operatorId, body) => {
  const now = new Date().toISOString();

  await db("crate_qrs").where({ id: crate.id }).update({
    custody_status: "DELIVERED",
    current_custodian_role: "DESTINATION",
    current_custodian_id: body.destination_entity_id || null,
    updated_at: db.fn.now(),
  });

  await db("crate_assignments").where({ id: assignment.id }).update({
    delivered_at_utc: now,
    updated_at: db.fn.now(),
  });

  await db("crate_status_history").insert({
    crate_id: crate.id,
    crate_qr_code: crate.code,
    from_status: crate.custody_status,
    to_status: "DELIVERED",
    actor_role: "TRANSPORT_OPERATOR",
    actor_id: operatorId,
    gps_lat: body.gps_lat || null,
    gps_lng: body.gps_lng || null,
    remarks: body.remarks || null,
  });

  return { crate_id: crate.id, status: "DELIVERED", delivered_at_utc: now };
};

// ── Assignment by crate ───────────────────────────────────────────────────────

export const findAssignmentByCrate = (crateId) =>
  db("crate_assignments").where({ crate_id: crateId }).orderBy("created_at", "desc").first();

// ── Dashboard stats ───────────────────────────────────────────────────────────

export const getDashboardStats = async (transportOperatorId, date) => {
  const q = db("crate_assignments as ca")
    .join("crate_qrs as cq", "cq.id", "ca.crate_id")
    .where("ca.transport_operator_id", transportOperatorId);

  if (date)
    q.whereRaw("DATE(ca.scheduled_time_utc AT TIME ZONE 'UTC') = ?", [date]);

  const rows = await q.select("cq.custody_status");

  return {
    total_my_crates: rows.length,
    assigned: rows.filter((r) => r.custody_status === "SCHEDULED_FOR_DISPATCH").length,
    in_transit: rows.filter((r) => r.custody_status === "IN_TRANSIT").length,
  };
};
