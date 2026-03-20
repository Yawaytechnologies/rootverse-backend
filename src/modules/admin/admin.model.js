import db from "../../shared/lib/db.js";

// ── Admin CRUD ────────────────────────────────────────────────────────────────

export async function createAdmin(payload) {
  return db("admin").insert(payload).returning("*");
}

export async function getAllAdmins() {
  return db("admin").select("id", "username", "email", "phone", "address", "date_of_birth", "created_at", "updated_at");
}

export async function deleteAdmin(id) {
  const deleted = await db("admin").where({ id }).del();
  if (!deleted) throw new Error("Admin not found");
  return true;
}

export async function updateAdmin(id, payload) {
  const updated = await db("admin").where({ id }).update(payload).returning("*");
  if (!updated.length) throw new Error("Admin not found");
  return updated[0];
}

export function findAdminByLoginId(loginId) {
  return db("admin")
    .where((qb) => qb.where("email", loginId).orWhere("phone", loginId))
    .first();
}

// ── Collection centres ────────────────────────────────────────────────────────

export function insertCentre(payload) {
  return db("collection_centres").insert(payload).returning("*");
}

export function findCentreById(centreId) {
  return db("collection_centres").where({ centre_id: centreId }).first();
}

export function listCentres({ page = 1, page_size = 20 } = {}) {
  return db("collection_centres")
    .select("*")
    .orderBy("created_at", "desc")
    .limit(Number(page_size))
    .offset((Number(page) - 1) * Number(page_size));
}

export async function updateCentre(centreId, payload) {
  return db("collection_centres")
    .where({ centre_id: centreId })
    .update({ ...payload, updated_at: db.fn.now() })
    .returning("*");
}

// ── Operator management ───────────────────────────────────────────────────────

export function insertCCOperator(payload) {
  return db("collection_centre_operators").insert(payload).returning("*");
}

export function insertTransportOperator(payload) {
  return db("transport_operators").insert(payload).returning("*");
}

export async function setOperatorStatus(operatorId, is_active) {
  const cc = await db("collection_centre_operators")
    .where({ operator_rv_id: operatorId })
    .update({ is_active, updated_at: db.fn.now() });
  if (cc) return { operator_rv_id: operatorId, type: "collection_centre_operator", is_active };

  const tr = await db("transport_operators")
    .where({ operator_rv_id: operatorId })
    .update({ is_active, updated_at: db.fn.now() });
  if (tr) return { operator_rv_id: operatorId, type: "transport_operator", is_active };

  return null;
}

// ── Monitoring ────────────────────────────────────────────────────────────────

export function listAllCrates({ date, status, centre_id, transport_operator_id, destination_name, page = 1, page_size = 20 } = {}) {
  const q = db("crate_qrs as cq").select("cq.*");

  if (status) q.where("cq.custody_status", status);
  if (date) q.whereRaw("DATE(cq.updated_at AT TIME ZONE 'UTC') = ?", [date]);
  if (centre_id) q.where("cq.received_centre_id", centre_id);

  if (transport_operator_id || destination_name) {
    q.leftJoin("crate_assignments as ca", "ca.crate_id", "cq.id");
    if (transport_operator_id) q.where("ca.transport_operator_id", transport_operator_id);
    if (destination_name) q.where("ca.destination_name", "ilike", `%${destination_name}%`);
  }

  return q.orderBy("cq.updated_at", "desc").limit(Number(page_size)).offset((Number(page) - 1) * Number(page_size));
}

export async function getCrateDetail(crateId) {
  const crate = await db("crate_qrs").where({ id: crateId }).first();
  if (!crate) return null;

  const [statusHistory, assignment, tempLogs] = await Promise.all([
    db("crate_status_history").where({ crate_id: crateId }).orderBy("event_at_utc", "asc"),
    db("crate_assignments").where({ crate_id: crateId }).orderBy("created_at", "desc").first(),
    db("temperature_logs").where({ crate_id: crateId }).orderBy("recorded_at_utc", "desc"),
  ]);

  return { ...crate, status_history: statusHistory, dispatch_assignment: assignment || null, temperature_logs: tempLogs };
}

export function listAssignments({ date, transport_operator_id, page = 1, page_size = 20 } = {}) {
  const q = db("crate_assignments");
  if (transport_operator_id) q.where({ transport_operator_id });
  if (date) q.whereRaw("DATE(scheduled_time_utc AT TIME ZONE 'UTC') = ?", [date]);
  return q.select("*").orderBy("created_at", "desc").limit(Number(page_size)).offset((Number(page) - 1) * Number(page_size));
}

export function listTemperatureLogs({ role, page = 1, page_size = 50 } = {}) {
  const q = db("temperature_logs");
  if (role) q.where({ actor_role: role });
  return q.select("*").orderBy("recorded_at_utc", "desc").limit(Number(page_size)).offset((Number(page) - 1) * Number(page_size));
}

export async function overrideCrateStatus(crateId, { new_status, reason_code, reason_text, admin_id }) {
  const crate = await db("crate_qrs").where({ id: crateId }).first();
  if (!crate) return null;

  await db("crate_qrs").where({ id: crateId }).update({ custody_status: new_status, updated_at: db.fn.now() });

  await db("crate_status_history").insert({
    crate_id: crateId,
    crate_qr_code: crate.code,
    from_status: crate.custody_status,
    to_status: new_status,
    actor_role: "ADMIN",
    actor_id: String(admin_id),
    remarks: `[${reason_code}] ${reason_text}`,
  });

  return db("crate_qrs").where({ id: crateId }).first();
}

export async function getDashboardSummary(date) {
  const crateQ = db("crate_qrs");
  if (date) crateQ.whereRaw("DATE(updated_at AT TIME ZONE 'UTC') = ?", [date]);

  const [crates, centreCount, ccOpCount, trOpCount] = await Promise.all([
    crateQ.select("custody_status"),
    db("collection_centres").count("id as count").first(),
    db("collection_centre_operators").count("id as count").first(),
    db("transport_operators").count("id as count").first(),
  ]);

  return {
    selected_date: date || null,
    centres: Number(centreCount?.count || 0),
    cc_operators: Number(ccOpCount?.count || 0),
    transport_operators: Number(trOpCount?.count || 0),
    crates: {
      total: crates.length,
      received_at_collection_centre: crates.filter((c) => c.custody_status === "RECEIVED_AT_COLLECTION_CENTRE").length,
      scheduled_for_dispatch: crates.filter((c) => c.custody_status === "SCHEDULED_FOR_DISPATCH").length,
      in_transit: crates.filter((c) => c.custody_status === "IN_TRANSIT").length,
      delivered: crates.filter((c) => c.custody_status === "DELIVERED").length,
    },
  };
}

export function listAllUsers({ role, is_active, page = 1, page_size = 20 } = {}) {
  const p = Number(page);
  const ps = Number(page_size);

  if (role === "COLLECTION_CENTRE_OPERATOR") {
    const q = db("collection_centre_operators").select(
      "operator_rv_id as user_id", "full_name", "email", "mobile",
      db.raw("'COLLECTION_CENTRE_OPERATOR' as role"), "is_active", "created_at"
    );
    if (is_active !== undefined) q.where({ is_active: is_active === "true" || is_active === true });
    return q.limit(ps).offset((p - 1) * ps);
  }

  if (role === "TRANSPORT_OPERATOR") {
    const q = db("transport_operators").select(
      "operator_rv_id as user_id", "full_name", "email", "mobile",
      db.raw("'TRANSPORT_OPERATOR' as role"), "is_active", "created_at"
    );
    if (is_active !== undefined) q.where({ is_active: is_active === "true" || is_active === true });
    return q.limit(ps).offset((p - 1) * ps);
  }

  // Default: return admins
  return db("admin").select(
    db.raw("CAST(id AS TEXT) as user_id"),
    db.raw("COALESCE(username,'') as full_name"),
    "email", "phone as mobile",
    db.raw("'ADMIN' as role"), db.raw("TRUE as is_active"), "created_at"
  ).limit(ps).offset((p - 1) * ps);
}
