import * as service from "./service.js";

export async function getDashboardController(req, res) {
  try {
    const data = await service.getDashboard(req.user, req.query.date);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
}

export async function listAssignedController(req, res) {
  try {
    const data = await service.listAssigned(req.user.operator_rv_id, req.query);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
}

export async function listInTransitController(req, res) {
  try {
    const data = await service.listInTransit(req.user.operator_rv_id, req.query);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
}

export async function scanPickupController(req, res) {
  try {
    const data = await service.scanPickup(req.body, req.user);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
}

export async function logTemperatureController(req, res) {
  try {
    const data = await service.logTemperature(req.params.crateId, req.body, req.user);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
}

export async function deliverController(req, res) {
  try {
    const data = await service.deliver(req.params.crateId, req.body, req.user);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
}
