import * as service from "./service.js";

const sendError = (res, error, fallbackStatus = 400) =>
  res.status(error.statusCode || fallbackStatus).json({
    success: false,
    message: error.message || "Internal server error",
  });

// ── Account management ──────────────────────────────────────────────────────
export async function createProcessorController(req, res) {
  try {
    const data = await service.registerProcessor(req.body);
    return res.status(201).json({ success: true, message: "Processor registered and pending approval", data });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function loginProcessorController(req, res) {
  try {
    return res.status(200).json(await service.loginProcessor(req.body));
  } catch (error) {
    return sendError(res, error);
  }
}

export async function listProcessorsController(req, res) {
  try {
    const data = await service.listProcessors(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function updateProcessorStatusController(req, res) {
  try {
    const data = await service.updateProcessorStatus(req.params.processorId, req.body);
    return res.status(200).json({ success: true, message: "Processor status updated", data });
  } catch (error) {
    return sendError(res, error, error.message?.includes("not found") ? 404 : 400);
  }
}

export async function getMeController(req, res) {
  try {
    const processorId = req.user?.processor_id || req.user?.id;
    const data = await service.getProcessorProfile(processorId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return sendError(res, error, 404);
  }
}

export async function getDashboardController(req, res) {
  try {
    const data = await service.getDashboard(req.user, req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return sendError(res, error);
  }
}

// ── Receiving + inventory ───────────────────────────────────────────────────
export async function scanReceiveController(req, res) {
  try {
    const data = await service.scanReceiveCrate(req.body, req.user);
    return res.status(201).json({ success: true, message: "Crate received by processor", data });
  } catch (error) {
    console.error("Error receiving crate:", error);
    return sendError(res, error, 500);
  }
}

export async function listInventoryController(req, res) {
  try {
    const data = await service.listInventory(req.user, req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function getInventoryItemController(req, res) {
  try {
    const data = await service.getInventoryItem(req.user, req.params.crateCode, req.query.processor_id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return sendError(res, error, 404);
  }
}
