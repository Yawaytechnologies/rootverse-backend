import { createCultureCycleService, getAllCultureCyclesService, getCultureCycleByidService, getCultureCycleByuserIdService, getCultureCyclesByFarmIdAndPondIdService, getCultureCyclesByFarmIdService, getCultureCyclesByVerificationStatusService, updateVerificationStatusService} from "./cultures_cycle_service.js";

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

export const getAllCultureCyclesController = async (req, res) => {
  try {
    const cultureCycles = await getAllCultureCyclesService();

    return res.status(200).json({
      success: true,
      message: "Culture cycles fetched successfully",
      data: cultureCycles,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getCultureCyclesByFarmIdController = async (req, res) => {
  try {
    const cultureCycles = await getCultureCyclesByFarmIdService(req.params.farm_id);

    return res.status(200).json({
      success: true,
      message: "Culture cycles fetched successfully",
      data: cultureCycles,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getCultureCyclesByFarmIdAndPondIdController = async (req, res) => {
  try {
    const cultureCycles = await getCultureCyclesByFarmIdAndPondIdService(
      req.params.farm_id,
      req.params.pond_id
    );

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


export const updateVerificationStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus, remarks } = req.body;

    const updatedCycle = await updateVerificationStatusService(id, newStatus, remarks);

    return res.status(200).json({
      success: true,
      message: "Verification status updated successfully",
      data: updatedCycle,
    });
  } catch (error) {
    return sendError(res, error);
  }
};
