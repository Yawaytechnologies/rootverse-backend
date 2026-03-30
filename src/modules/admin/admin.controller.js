import {
  registerAdmin, loginAdmin, getAdminById, getAllAdminsService,
  updateAdminService, deleteAdminService,
  createCentre, listCentresService, getCentreService, updateCentreService,
  createCCOperator, createTransportOperator, updateOperatorStatusService,
  getDashboardSummaryService, listAllCratesService, getCrateDetailService,
  listAssignmentsService, listTemperatureLogsService, overrideCrateStatusService,
  listAllUsersService,
} from "./admin.service.js";

// ── Admin CRUD ────────────────────────────────────────────────────────────────

export async function createAdminController(req, res) {
  try {
    const admin = await registerAdmin(req.body);
    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function loginAdminController(req, res) {
  try {
    const result = await loginAdmin(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAdminDetailsController(req, res) {
  try {
    const admin = await getAdminById(req.user.id);
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllAdminsController(req, res) {
  try {
    res.status(200).json(await getAllAdminsService());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateAdminController(req, res) {
  try {
    res.status(200).json(await updateAdminService(req.params.id, req.body));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteAdminController(req, res) {
  try {
    await deleteAdminService(req.params.id);
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// ── Collection centres ────────────────────────────────────────────────────────

export async function createCentreController(req, res) {
  try {
    res.status(201).json({ success: true, data: await createCentre(req.body) });
  } catch (error) {
    res.status(error.message.includes("already exists") ? 409 : 400).json({ success: false, error: error.message });
  }
}

export async function listCentresController(req, res) {
  try {
    res.status(200).json({ success: true, data: await listCentresService(req.query) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function getCentreController(req, res) {
  try {
    res.status(200).json({ success: true, data: await getCentreService(req.params.centreId) });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
}

export async function updateCentreController(req, res) {
  try {
    res.status(200).json({ success: true, data: await updateCentreService(req.params.centreId, req.body) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

// ── Operators ─────────────────────────────────────────────────────────────────

export async function createCCOperatorController(req, res) {
  try {
    res.status(201).json({ success: true, data: await createCCOperator(req.body) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function createTransportOperatorController(req, res) {
  try {
    res.status(201).json({ success: true, data: await createTransportOperator(req.body) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function updateOperatorStatusController(req, res) {
  try {
    res.status(200).json({ success: true, data: await updateOperatorStatusService(req.params.operatorId, req.body) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

// ── Monitoring ────────────────────────────────────────────────────────────────

export async function getDashboardSummaryController(req, res) {
  try {
    res.status(200).json({ success: true, data: await getDashboardSummaryService(req.query) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function listAllCratesController(req, res) {
  try {
    res.status(200).json({ success: true, data: await listAllCratesService(req.query) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function getCrateDetailController(req, res) {
  try {
    res.status(200).json({ success: true, data: await getCrateDetailService(req.params.crateId) });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
}

export async function overrideCrateStatusController(req, res) {
  try {
    res.status(200).json({ success: true, data: await overrideCrateStatusService(req.params.crateId, req.body) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function listAssignmentsController(req, res) {
  try {
    res.status(200).json({ success: true, data: await listAssignmentsService(req.query) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function listTemperatureLogsController(req, res) {
  try {
    res.status(200).json({ success: true, data: await listTemperatureLogsService(req.query) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function listAllUsersController(req, res) {
  try {
    res.status(200).json({ success: true, data: await listAllUsersService(req.query) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
