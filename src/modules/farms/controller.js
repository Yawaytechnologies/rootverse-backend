import {
  createFarmService,
  getAllFarmsService,
  getFarmByIdService,
  getFarmByFarmIdService,
  updateFarmService,
  deleteFarmService,
} from "./service.js";

const sendError = (res, error) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

/**
 * Create Farm
 */
export const createFarmController = async (req, res) => {
  try {
    const data = req.body;

    // ✅ Validate required fields
    if (!data.farm_prefix) {
      return res.status(400).json({
        success: false,
        message: "Farm prefix is required",
      });
    }

    if (!data.farm_name) {
      return res.status(400).json({
        success: false,
        message: "Farm name is required",
      });
    }

    const farm = await createFarmService(data);

    return res.status(201).json({
      success: true,
      message: "Farm registered successfully",
      data: farm,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/**
 * Get All Farms
 */
export const getAllFarmsController = async (req, res) => {
  try {
    const farms = await getAllFarmsService();

    return res.status(200).json({
      success: true,
      message: "Farms fetched successfully",
      data: farms,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/**
 * Get Farm by DB ID
 */
export const getFarmByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const farm = await getFarmByIdService(id);

    return res.status(200).json({
      success: true,
      message: "Farm fetched successfully",
      data: farm,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/**
 * Get Farm by Farm ID (custom ID like IN-TN-NA-260000)
 */
export const getFarmByFarmIdController = async (req, res) => {
  try {
    const { farm_id } = req.params;

    if (!farm_id) {
      return res.status(400).json({
        success: false,
        message: "Farm ID is required",
      });
    }

    const farm = await getFarmByFarmIdService(farm_id);

    return res.status(200).json({
      success: true,
      message: "Farm fetched successfully",
      data: farm,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/**
 * Update Farm
 */
export const updateFarmController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const farm = await updateFarmService(id, data);

    return res.status(200).json({
      success: true,
      message: "Farm updated successfully",
      data: farm,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/**
 * Delete Farm
 */
export const deleteFarmController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteFarmService(id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return sendError(res, error);
  }
};