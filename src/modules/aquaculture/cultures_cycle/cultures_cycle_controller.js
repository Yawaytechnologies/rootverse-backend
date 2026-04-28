import { createCultureCycleService, getCultureCycleByidService, getCultureCycleByuserIdService, getCultureCyclesByVerificationStatusService} from "./cultures_cycle_service.js";

const sendError = (res, error) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

export const createCultureCycleController = async (req, res) => {
  try {
    const cultureCycle = await createCultureCycleService(req.body);

    return res.status(201).json({
      success: true,
      message: "Culture cycle created successfully",
      data: cultureCycle,
    });
  } catch (error) {
    return sendError(res, error);
  }
};


export const getCultureCycleByIdController = async (req, res) => {
  try {
    const cultureCycle = await getCultureCycleByidService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Culture cycle fetched successfully",
      data: cultureCycle,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getCultureCycleByUserIdController = async (req, res) => {
  try {
    const cultureCycles = await getCultureCycleByuserIdService(req.params.user_id);

    return res.status(200).json({
      success: true,
      message: "Culture cycles fetched successfully",
      data: cultureCycles,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getCultureCyclesByVerificationStatusController = async (req, res) => {
  try {
    const cultureCycles = await getCultureCyclesByVerificationStatusService(req.params.verification_status);

    return res.status(200).json({
      success: true,
      message: "Culture cycles fetched successfully",
      data: cultureCycles,
    });
  } catch (error) {
    return sendError(res, error);
  }
};