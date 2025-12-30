// src/modules/wildcapture/vesselreg/vesselreg.service.js
import * as VesselModel from "./vesselreg.model.js";

function badRequest(message) {
  const e = new Error(message);
  e.status = 400;
  throw e;
}

const ALLOWED_METHODS = new Set(["Trawl", "Gillnet", "Longline", "Purse seine"]);

function normalizeMethods(v) {
  if (v == null) return [];
  const arr = Array.isArray(v) ? v : [v];
  return arr.map((x) => String(x).trim()).filter(Boolean);
}

function validateCreate(payload) {
  if (!payload) badRequest("Payload required");

  if (!payload.govt_registration_number || !String(payload.govt_registration_number).trim())
    badRequest("Govt registration number is required");

  if (!payload.vessel_name || !String(payload.vessel_name).trim())
    badRequest("Vessel name is required");

  if (!payload.home_port || !String(payload.home_port).trim())
    badRequest("Home port is required");

  if (!payload.vessel_type || !String(payload.vessel_type).trim())
    badRequest("Vessel type is required");

  const methods = normalizeMethods(payload.allowed_fishing_methods);

  const invalid = methods.filter((m) => !ALLOWED_METHODS.has(m));
  if (invalid.length) badRequest(`Invalid fishing methods: ${invalid.join(", ")}`);

  return {
    ...payload,
    allowed_fishing_methods: methods,
    state_code: payload.state_code ? String(payload.state_code).trim().toUpperCase() : "TN",
  };
}

export async function registerVessel(payload) {
  const clean = validateCreate(payload);
  return VesselModel.createVessel(clean);
}

export async function getVessel(vesselId) {
  if (!vesselId) badRequest("vesselId is required");
  return VesselModel.getVesselById(String(vesselId).trim());
}

export async function getVesselList(query = {}) {
  const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
  const offset = Math.max(Number(query.offset || 0), 0);
  const q = query.q ? String(query.q) : "";
  return VesselModel.listVessels({ limit, offset, q });
}

export async function updateVessel(vesselId, patch) {
  if (!vesselId) badRequest("vesselId is required");
  if (!patch || typeof patch !== "object") badRequest("Patch payload required");

  if (patch.allowed_fishing_methods !== undefined) {
    const methods = normalizeMethods(patch.allowed_fishing_methods);
    const invalid = methods.filter((m) => !ALLOWED_METHODS.has(m));
    if (invalid.length) badRequest(`Invalid fishing methods: ${invalid.join(", ")}`);
    patch.allowed_fishing_methods = methods;
  }

  return VesselModel.patchVessel(String(vesselId).trim(), patch);
}

export async function removeVessel(vesselId) {
  if (!vesselId) badRequest("vesselId is required");
  return VesselModel.deleteVessel(String(vesselId).trim());
}
