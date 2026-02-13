import {
  registerVessel,
  getVessel,
  getVesselList,
  getVesselsByOwnerId, 
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


function resolveOwnerId(req) {
  const fromAuth = req.user?.id || req.user?.userId || req.user?.owner_id;
  const fromBody = req.body?.owner_id;

  return fromAuth ?? fromBody ?? null;
}

export async function createVessel(req, res) {
  try {
    const owner_id = resolveOwnerId(req);

    const row = await registerVessel({
      ...req.body,
      owner_id,
    });

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
      return res
        .status(404)
        .json({ success: false, message: "Vessel not found" });
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


export async function updateVesselById(req, res) {
  try {
    const { vesselId } = req.params;

    
    if ("owner_id" in (req.body || {})) {
      return res.status(400).json({
        success: false,
        message: "owner_id cannot be updated",
      });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update",
      });
    }

    const row = await updateVessel(vesselId, req.body);

    if (!row) {
      return res
        .status(404)
        .json({ success: false, message: "Vessel not found" });
    }

    return res.json({ success: true, data: row });
  } catch (err) {
    return sendError(res, err);
  }
}


export async function patchVessel(req, res) {
  try {
    const { vesselId } = req.params;

    
    if ("owner_id" in (req.body || {})) {
      return res.status(400).json({
        success: false,
        message: "owner_id cannot be updated",
      });
    }

    const row = await updateVessel(vesselId, req.body);

    if (!row) {
      return res
        .status(404)
        .json({ success: false, message: "Vessel not found" });
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
      return res
        .status(404)
        .json({ success: false, message: "Vessel not found" });
    }

    return res.json({ success: true, message: "Vessel deleted" });
  } catch (err) {
    return sendError(res, err);
  }
}


export async function getVesselsByOwnerIdHandler(req, res) {
  try {
    
    const owner_id = resolveOwnerId(req) ?? req.params.ownerId;

    if (!owner_id) {
      return res.status(400).json({
        success: false,
        message: "owner_id is required",
      });
    }

    const rows = await getVesselsByOwnerId(owner_id, req.query);
    return res.json({ success: true, data: rows });
  } catch (err) {
    return sendError(res, err);
  }
}
