import {
  getCratePackingPrefillService,
  listHarvestCratesService,
  packCratesService,
} from "./service.js";

const sendError = (res, error) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

export const getCratePackingPrefillController = async (req, res) => {
  try {
    const data = await getCratePackingPrefillService({
      pond_qr: req.params.pond_qr,
      harvest_id: req.query.harvest_id,
      user: req.user,
      body: req.query,
    });

    return res.status(200).json({
      success: true,
      message: "Crate packing prefill fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching crate packing prefill:", error);
    return sendError(res, error);
  }
};

export const packCratesController = async (req, res) => {
  try {
    const data = await packCratesService(req.body, req.user);

    return res.status(201).json({
      success: true,
      message: "Crates packed successfully",
      data,
    });
  } catch (error) {
    console.error("Error packing crates:", error);
    return sendError(res, error);
  }
};

export const listHarvestCratesController = async (req, res) => {
  try {
    const data = await listHarvestCratesService({
      harvest_id: req.params.harvest_id,
      trader_id: req.query.trader_id,
      user: req.user,
    });

    return res.status(200).json({
      success: true,
      message: "Harvest crates fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching harvest crates:", error);
    return sendError(res, error);
  }
};
