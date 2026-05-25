import {
  createFarmerDetailsService,
  deleteFarmerDetailsByIdService,
  deleteFarmerDetailsByUserIdService,
  getAllFarmerDetailsService,
  getFarmerDetailsByIdService,
  getFarmerDetailsByUserIdService,
  updateFarmerDetailsByUserIdService,
} from "./service.js";

const sendError = (res, error) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

export const createFarmerDetailsController = async (req, res) => {
  try {
    const farmer = await createFarmerDetailsService(req.body);

    return res.status(201).json({
      success: true,
      message: "Farmer details created successfully",
      data: farmer,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getAllFarmerDetailsController = async (req, res) => {
  try {
    const farmers = await getAllFarmerDetailsService();

    return res.status(200).json({
      success: true,
      message: "Farmer details fetched successfully",
      data: farmers,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getFarmerDetailsByIdController = async (req, res) => {
  try {
    const farmer = await getFarmerDetailsByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Farmer details fetched successfully",
      data: farmer,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getFarmerDetailsByUserIdController = async (req, res) => {
  try {
    const farmer = await getFarmerDetailsByUserIdService(req.params.user_id);

    return res.status(200).json({
      success: true,
      message: "Farmer details fetched successfully",
      data: farmer,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const updateFarmerDetailsByUserIdController = async (req, res) => {
  try {
    const farmer = await updateFarmerDetailsByUserIdService(req.params.user_id, req.body);

    return res.status(200).json({
      success: true,
      message: "Farmer details updated successfully",
      data: farmer,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const deleteFarmerDetailsByIdController = async (req, res) => {
  try {
    const result = await deleteFarmerDetailsByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const deleteFarmerDetailsByUserIdController = async (req, res) => {
  try {
    const result = await deleteFarmerDetailsByUserIdService(req.params.user_id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return sendError(res, error);
  }
};
