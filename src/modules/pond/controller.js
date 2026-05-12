import {
  createPondService,
  getAllPondsService,
  getPondByIdService,
  getPondsByFarmIdService,
  updatePondService,
  deletePondService,
  updatePondStatusService,
  updatePondVerificationStatusService,
  getActivePondsService,
  getVerifiedPondsService,
} from "./service.js";

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sendSuccess = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

const sendError = (res, error) => {
  console.error("Pond Controller Error:", error);

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

export const createPondController = async (req, res) => {
  try {
    const pond = await createPondService(req.body);

    return sendSuccess(res, 201, "Pond registered successfully", pond);
  } catch (error) {
    return sendError(res, error);
  }
};

export const getAllPondsController = async (req, res) => {
  try {
    const ponds = await getAllPondsService();

    return sendSuccess(res, 200, "Ponds fetched successfully", ponds);
  } catch (error) {
    return sendError(res, error);
  }
};

export const getPondByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw createError("Pond id is required", 400);
    }

    const pond = await getPondByIdService(id);

    return sendSuccess(res, 200, "Pond fetched successfully", pond);
  } catch (error) {
    return sendError(res, error);
  }
};

export const getPondsByFarmIdController = async (req, res) => {
  try {
    const farmId = req.params.farm_id || req.params.farmId;

    if (!farmId) {
      throw createError("Farm id is required", 400);
    }

    const ponds = await getPondsByFarmIdService(farmId);

    return sendSuccess(res, 200, "Farm ponds fetched successfully", ponds);
  } catch (error) {
    return sendError(res, error);
  }
};

export const updatePondController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw createError("Pond id is required", 400);
    }

    const pond = await updatePondService(id, req.body);

    return sendSuccess(res, 200, "Pond updated successfully", pond);
  } catch (error) {
    return sendError(res, error);
  }
};

export const deletePondController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw createError("Pond id is required", 400);
    }

    const result = await deletePondService(id);

    return sendSuccess(
      res,
      200,
      result?.message || "Pond deleted successfully"
    );
  } catch (error) {
    return sendError(res, error);
  }
};

export const updatePondStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const pondStatus = req.body?.pond_status;

    if (!id) {
      throw createError("Pond id is required", 400);
    }

    if (!pondStatus) {
      throw createError("pond_status is required", 400);
    }

    const pond = await updatePondStatusService(id, pondStatus);

    return sendSuccess(res, 200, "Pond status updated successfully", pond);
  } catch (error) {
    return sendError(res, error);
  }
};

export const updatePondVerificationStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const verificationStatus = req.body?.verification_status;

    if (!id) {
      throw createError("Pond id is required", 400);
    }

    if (!verificationStatus) {
      throw createError("verification_status is required", 400);
    }

    const pond = await updatePondVerificationStatusService(
      id,
      verificationStatus
    );

    return sendSuccess(
      res,
      200,
      "Pond verification status updated successfully",
      pond
    );
  } catch (error) {
    return sendError(res, error);
  }
};

export const getActivePondsController = async (req, res) => {
  try {
    const ponds = await getActivePondsService();

    return sendSuccess(res, 200, "Active ponds fetched successfully", ponds);
  } catch (error) {
    return sendError(res, error);
  }
};

export const getVerifiedPondsController = async (req, res) => {
  try {
    const ponds = await getVerifiedPondsService();

    return sendSuccess(res, 200, "Verified ponds fetched successfully", ponds);
  } catch (error) {
    return sendError(res, error);
  }
};