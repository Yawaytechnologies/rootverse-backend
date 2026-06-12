import * as service from "./service.js";

const traderIdFromRequest = (req) =>
  req.params.traderId ||
  req.params.trader_id ||
  req.query.trader_id ||
  req.query.traderId ||
  req.body?.trader_id ||
  req.body?.traderId;

const parsePayload = (body = {}) => {
  let payload = { ...body };
  if (typeof body.data === "string") {
    try {
      payload = { ...payload, ...JSON.parse(body.data) };
    } catch {
      throw new Error("Invalid JSON in data field");
    }
  } else if (body.data && typeof body.data === "object") {
    payload = { ...payload, ...body.data };
  }
  delete payload.data;
  return payload;
};

const firstFile = (files, names) => {
  for (const name of names) {
    const file = files?.[name]?.[0];
    if (file) return file;
  }
  return null;
};

export async function createTraderController(req, res) {
  try {
    const payload = parsePayload(req.body);
    const files = {
      profileImage: firstFile(req.files, ["profile_image", "profileImage", "trader_profile_image"]),
      companyLogo: firstFile(req.files, ["company_logo", "companyLogo"]),
    };
    res.status(201).json({ success: true, data: await service.registerTrader(payload, files) });
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
    res.status(200).json({ success: true, data: await service.getTraderProfile(traderIdFromRequest(req)) });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
}

export async function getTraderDetailController(req, res) {
  try {
    res.status(200).json({ success: true, data: await service.getTraderDetail(traderIdFromRequest(req)) });
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

export async function updateTraderStatusController(req, res) {
  try {
    res.status(200).json({ success: true, data: await service.updateTraderStatus(req.params.traderId, req.body) });
  } catch (error) {
    res.status(error.message.includes("not found") ? 404 : 400).json({ success: false, error: error.message });
  }
}

export async function createQualityCheckerController(req, res) {
  try {
    res.status(201).json({ success: true, data: await service.createQualityChecker(traderIdFromRequest(req), req.body) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function listQualityCheckersController(req, res) {
  try {
    res.status(200).json({ success: true, data: await service.listQualityCheckers(traderIdFromRequest(req)) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function createCratePackerController(req, res) {
  try {
    res.status(201).json({ success: true, data: await service.createCratePacker(traderIdFromRequest(req), req.body) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function listCratePackersController(req, res) {
  try {
    res.status(200).json({ success: true, data: await service.listCratePackers(traderIdFromRequest(req)) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function createTransportOperatorController(req, res) {
  try {
    res.status(201).json({ success: true, data: await service.createTransportOperator(traderIdFromRequest(req), req.body) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function listTransportOperatorsController(req, res) {
  try {
    res.status(200).json({ success: true, data: await service.listTransportOperators(traderIdFromRequest(req)) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function getDashboardController(req, res) {
  try {
    res.status(200).json({ success: true, data: await service.getDashboard(traderIdFromRequest(req)) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function listCratesController(req, res) {
  try {
    res.status(200).json({ success: true, data: await service.listCrates(traderIdFromRequest(req), req.query) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function updateCrateProgressController(req, res) {
  try {
    res.status(200).json({
      success: true,
      data: await service.updateCrateProgress(traderIdFromRequest(req), req.params.crateId, req.body, req.user),
    });
  } catch (error) {
    res.status(error.message.includes("not found") ? 404 : 400).json({ success: false, error: error.message });
  }
}
