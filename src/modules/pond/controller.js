import {
  createPondService,
  getAllPondsService,
  getPondByIdService,
  getPondsByFarmIdService,
  updatePondService,
  deletePondService,
} from "./service.js";

const sendError = (res, error) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

export const createPondController = async (req, res) => {
  try {
    const pond = await createPondService(req.body);

    return res.status(201).json({
      success: true,
      message: "Pond registered successfully",
      data: pond,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getAllPondsController = async (req, res) => {
  try {
    const ponds = await getAllPondsService();

    return res.status(200).json({
      success: true,
      message: "Ponds fetched successfully",
      data: ponds,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getPondByIdController = async (req, res) => {
  try {
    const pond = await getPondByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Pond fetched successfully",
      data: pond,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getPondsByFarmIdController = async (req, res) => {
  try {
    const ponds = await getPondsByFarmIdService(req.params.farm_id);

    return res.status(200).json({
      success: true,
      message: "Farm ponds fetched successfully",
      data: ponds,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const updatePondController = async (req, res) => {
  try {
    const pond = await updatePondService(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Pond updated successfully",
      data: pond,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const deletePondController = async (req, res) => {
  try {
    const result = await deletePondService(req.params.id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return sendError(res, error);
  }
};