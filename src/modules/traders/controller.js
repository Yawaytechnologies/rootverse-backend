import * as service from "./service.js";

const traderIdFromUser = (req) => req.user.trader_id || req.user.id;

export async function createTraderController(req, res) {
  try {
    res.status(201).json({ success: true, data: await service.registerTrader(req.body) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function loginTraderController(req, res) {
  try {
    res.status(200).json(await service.loginTrader(req.body));
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function getMeController(req, res) {
  try {
    res.status(200).json({ success: true, data: await service.getTraderProfile(req.user) });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
}

export async function listTradersController(req, res) {
  try {
    res.status(200).json({ success: true, data: await service.listTraders(req.query) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function createQualityCheckerController(req, res) {
  try {
    res.status(201).json({ success: true, data: await service.createQualityChecker(traderIdFromUser(req), req.body) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function listQualityCheckersController(req, res) {
  try {
    res.status(200).json({ success: true, data: await service.listQualityCheckers(traderIdFromUser(req)) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function createCratePackerController(req, res) {
  try {
    res.status(201).json({ success: true, data: await service.createCratePacker(traderIdFromUser(req), req.body) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function listCratePackersController(req, res) {
  try {
    res.status(200).json({ success: true, data: await service.listCratePackers(traderIdFromUser(req)) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function createTransportOperatorController(req, res) {
  try {
    res.status(201).json({ success: true, data: await service.createTransportOperator(traderIdFromUser(req), req.body) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function listTransportOperatorsController(req, res) {
  try {
    res.status(200).json({ success: true, data: await service.listTransportOperators(traderIdFromUser(req)) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function getDashboardController(req, res) {
  try {
    res.status(200).json({ success: true, data: await service.getDashboard(traderIdFromUser(req)) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function listCratesController(req, res) {
  try {
    res.status(200).json({ success: true, data: await service.listCrates(traderIdFromUser(req), req.query) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function updateCrateProgressController(req, res) {
  try {
    res.status(200).json({
      success: true,
      data: await service.updateCrateProgress(traderIdFromUser(req), req.params.crateId, req.body, req.user),
    });
  } catch (error) {
    res.status(error.message.includes("not found") ? 404 : 400).json({ success: false, error: error.message });
  }
}
