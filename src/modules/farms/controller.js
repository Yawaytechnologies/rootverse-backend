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

export const createFarmController = async (req, res) => {
  try {
    const farm = await createFarmService(req.body);

    return res.status(201).json({
      success: true,
      message: "Farm registered successfully",
      data: farm,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

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

export const getFarmByIdController = async (req, res) => {
  try {
    const farm = await getFarmByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Farm fetched successfully",
      data: farm,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getFarmByFarmIdController = async (req, res) => {
  try {
    const farm = await getFarmByFarmIdService(req.params.farm_id);

    return res.status(200).json({
      success: true,
      message: "Farm fetched successfully",
      data: farm,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const updateFarmController = async (req, res) => {
  try {
    const farm = await updateFarmService(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Farm updated successfully",
      data: farm,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const deleteFarmController = async (req, res) => {
  try {
    const result = await deleteFarmService(req.params.id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return sendError(res, error);
  }
};