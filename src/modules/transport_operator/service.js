import * as repo from "./repository.js";

// ── Dashboard ─────────────────────────────────────────────────────────────────

export const getDashboard = async (user, date) => {
  const stats = await repo.getDashboardStats(user.operator_rv_id, date);
  return {
    selected_date: date || null,
    current_transport: {
      id: user.transport_id,
      operator_rv_id: user.operator_rv_id,
    },
    stats,
  };
};

// ── Assigned crates ───────────────────────────────────────────────────────────

export const listAssigned = (operatorRvId, filters) =>
  repo.listAssignedCrates(operatorRvId, filters);

// ── In transit ───────────────────────────────────────────────────────────────

export const listInTransit = (operatorRvId, filters) =>
  repo.listInTransitCrates(operatorRvId, filters);

// ── Pickup scan ───────────────────────────────────────────────────────────────

export const scanPickup = async (body, user) => {
  const { crate_qr } = body;
  if (!crate_qr) throw Object.assign(new Error("crate_qr is required"), { status: 400 });

  const crate = await repo.findCrateByQr(crate_qr);
  if (!crate) throw Object.assign(new Error("Unknown crate QR"), { status: 404 });

  if (crate.custody_status !== "SCHEDULED_FOR_DISPATCH") {
    throw Object.assign(
      new Error("Crate must be in Scheduled for Dispatch status before pickup scan"),
      { status: 422 }
    );
  }

  const assignment = await repo.findAssignmentByCrate(crate.id);
  if (!assignment) throw Object.assign(new Error("No dispatch assignment found for this crate"), { status: 404 });

  const operatorRvId = body.transport_operator_id || user.operator_rv_id;
  if (assignment.transport_operator_id !== operatorRvId) {
    throw Object.assign(new Error("Crate not assigned to this transport"), { status: 409 });
  }

  return repo.pickupCrate(crate, assignment, user.operator_rv_id, {
    ...body,
    transport_operator_id: operatorRvId,
  });
};

// ── Temperature log ───────────────────────────────────────────────────────────

export const logTemperature = async (crateId, body, user) => {
  if (!body.temperature_value)
    throw Object.assign(new Error("temperature_value is required"), { status: 400 });

  const crate = await repo.findCrateById(crateId);
  if (!crate) throw Object.assign(new Error("Crate not found"), { status: 404 });

  if (crate.custody_status !== "IN_TRANSIT") {
    throw Object.assign(new Error("Crate is not in transit"), { status: 409 });
  }

  await repo.logTemperature(
    crateId,
    body.transport_id || user.transport_id,
    user.operator_rv_id,
    body
  );

  return {
    crate_id: crateId,
    temperature_value: body.temperature_value,
    recorded_at_utc: new Date().toISOString(),
  };
};

// ── Deliver ───────────────────────────────────────────────────────────────────

export const deliver = async (crateId, body, user) => {
  const crate = await repo.findCrateById(crateId);
  if (!crate) throw Object.assign(new Error("Crate not found"), { status: 404 });

  if (crate.custody_status !== "IN_TRANSIT") {
    throw Object.assign(new Error("Crate must be IN_TRANSIT to deliver"), { status: 422 });
  }

  const assignment = await repo.findAssignmentByCrate(crate.id);
  if (!assignment) throw Object.assign(new Error("No assignment found"), { status: 404 });

  return repo.deliverCrate(crate, assignment, user.operator_rv_id, body);
};
