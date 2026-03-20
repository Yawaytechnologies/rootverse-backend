import * as service from "./service.js";

export async function loginController(req, res) {
  try {
    const result = await service.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
}

export async function getDashboardController(req, res) {
  try {
    const data = await service.getDashboard(req.user.centre_id, req.query.date);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
}

export async function listCratesController(req, res) {
  try {
    const data = await service.listCrates(req.user.centre_id, req.query);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
}

export async function receiveCrateController(req, res) {
  try {
    const body = {
      ...req.body,
      centre_id: req.user.centre_id || req.body.centre_id,
      operator_id: req.user.operator_rv_id || req.body.operator_id,
    };
    const data = await service.receiveCrate(body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
}

export async function getCrateDetailController(req, res) {
  try {
    const data = await service.getCrateDetail(req.params.crateId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(error.status || 404).json({ error: error.message });
  }
}

export async function logTemperatureController(req, res) {
  try {
    const body = {
      ...req.body,
      collection_centre_id: req.user.centre_id || req.body.collection_centre_id,
      operator_id: req.user.operator_rv_id || req.body.operator_id,
    };
    const data = await service.logTemperature(req.params.crateId, body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
}

export async function assignDispatchController(req, res) {
  try {
    const body = {
      ...req.body,
      centre_id: req.user.centre_id || req.body.centre_id,
      operator_id: req.user.operator_rv_id || req.body.operator_id,
    };
    const data = await service.assignDispatch(req.params.crateId, body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
}
