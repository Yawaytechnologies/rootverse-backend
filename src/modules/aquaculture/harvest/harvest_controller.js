import {
  createHarvestService,
  deleteHarvestService,
  getAllHarvestService,
  getHarvestByFarmIdService,
  getHarvestByIdService,
  getHarvestByPondIdService,
  getHarvestByQrCodeIdService,
  getHarvestByQrCodeService,
  getHarvestByTraderIdService,
  updateHarvestBookingStatusService,
  updateHarvestService,
} from "./harvest_service.js";

const sendError = (res, error) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

export const createHarvestController = async (req, res) => {
  try {
    const harvestRecord = await createHarvestService(req.body);

    return res.status(201).json({
      success: true,
      message: "Harvest record created successfully",
      data: harvestRecord,
    });
  } catch (error) {
    console.error("Error in controller while creating harvest record:", error);
    return sendError(res, error);
  }
};

export const getAllHarvestController = async (req, res) => {
  try {
    const harvestRecords = await getAllHarvestService();

    return res.status(200).json({
      success: true,
      message: "Harvest records fetched successfully",
      data: harvestRecords,
    });
  } catch (error) {
    console.error("Error in controller while fetching harvest records:", error);
    return sendError(res, error);
  }
};

export const getHarvestByIdController = async (req, res) => {
  try {
    const harvestRecord = await getHarvestByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Harvest record fetched successfully",
      data: harvestRecord,
    });
  } catch (error) {
    console.error("Error in controller while fetching harvest record:", error);
    return sendError(res, error);
  }
};

export const getHarvestByFarmIdController = async (req, res) => {
  try {
    const harvestRecords = await getHarvestByFarmIdService(req.params.farm_id);

    return res.status(200).json({
      success: true,
      message: "Harvest records fetched successfully",
      data: harvestRecords,
    });
  } catch (error) {
    console.error("Error in controller while fetching harvest records by farm:", error);
    return sendError(res, error);
  }
};

export const getHarvestByPondIdController = async (req, res) => {
  try {
    const harvestRecords = await getHarvestByPondIdService(req.params.pond_id);

    return res.status(200).json({
      success: true,
      message: "Harvest records fetched successfully",
      data: harvestRecords,
    });
  } catch (error) {
    console.error("Error in controller while fetching harvest records by pond:", error);
    return sendError(res, error);
  }
};

export const getHarvestByQrCodeIdController = async (req, res) => {
  try {
    const harvestRecords = await getHarvestByQrCodeIdService(req.params.qr_code_id);

    return res.status(200).json({
      success: true,
      message: "Harvest records fetched successfully",
      data: harvestRecords,
    });
  } catch (error) {
    console.error("Error in controller while fetching harvest records by QR code ID:", error);
    return sendError(res, error);
  }
};

export const getHarvestByQrCodeController = async (req, res) => {
  try {
    const harvestRecords = await getHarvestByQrCodeService(req.params.qr_code);

    return res.status(200).json({
      success: true,
      message: "Harvest records fetched successfully",
      data: harvestRecords,
    });
  } catch (error) {
    console.error("Error in controller while fetching harvest records by QR code:", error);
    return sendError(res, error);
  }
};

export const getHarvestByTraderIdController = async (req, res) => {
  try {
    const harvestRecords = await getHarvestByTraderIdService(req.params.trader_id);

    return res.status(200).json({
      success: true,
      message: "Harvest records fetched successfully",
      data: harvestRecords,
    });
  } catch (error) {
    console.error("Error in controller while fetching harvest records by trader:", error);
    return sendError(res, error);
  }
};

export const updateHarvestController = async (req, res) => {
  try {
    const harvestRecord = await updateHarvestService(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Harvest record updated successfully",
      data: harvestRecord,
    });
  } catch (error) {
    console.error("Error in controller while updating harvest record:", error);
    return sendError(res, error);
  }
};

export const updateHarvestBookingStatusController = async (req, res) => {
  try {
    const harvestRecord = await updateHarvestBookingStatusService(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Harvest booking status updated successfully",
      data: harvestRecord,
    });
  } catch (error) {
    console.error("Error in controller while updating harvest booking status:", error);
    return sendError(res, error);
  }
};

export const deleteHarvestController = async (req, res) => {
  try {
    const result = await deleteHarvestService(req.params.id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Error in controller while deleting harvest record:", error);
    return sendError(res, error);
  }
};
