import {
  registerVessel,
  getVessel,
  getVesselList,
  updateVessel,
  removeVessel,
} from "./vesselreg.service.js";

function sendError(res, err) {
  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    message: err.message || "Server error",
  });
}

export async function createVessel(req, res) {
  try {
    const row = await registerVessel(req.body);
    return res.status(201).json({ success: true, data: row });
  } catch (err) {
    return sendError(res, err);
  }
}

export async function getVesselById(req, res) {
  try {
    const { vesselId } = req.params;
    const row = await getVessel(vesselId);

    if (!row) {
      return res.status(404).json({ success: false, message: "Vessel not found" });
    }

    return res.json({ success: true, data: row });
  } catch (err) {
    return sendError(res, err);
  }
}

export async function getAllVessels(req, res) {
  try {
    const rows = await getVesselList(req.query);
    return res.json({ success: true, data: rows });
  } catch (err) {
    return sendError(res, err);
  }
}

export async function patchVessel(req, res) {
  try {
    const { vesselId } = req.params;
    const row = await updateVessel(vesselId, req.body);

    if (!row) {
      return res.status(404).json({ success: false, message: "Vessel not found" });
    }

    return res.json({ success: true, data: row });
  } catch (err) {
    return sendError(res, err);
  }
}

export async function deleteVessel(req, res) {
  try {
    const { vesselId } = req.params;
    const ok = await removeVessel(vesselId);

    if (!ok) {
      return res.status(404).json({ success: false, message: "Vessel not found" });
    }

    return res.json({ success: true, message: "Vessel deleted" });
  } catch (err) {
    return sendError(res, err);
  }
}
