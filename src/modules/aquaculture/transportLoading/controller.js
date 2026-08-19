import {
  getTransportLoadingProgressService,
  scanTransportLoadingService,
  getTransportOperatorActivityService,
} from "./service.js";

export const getTransportOperatorActivityController = async (req, res) => {
  try {
    const data = await getTransportOperatorActivityService(req.params.transport_operator_id, req.query);
    return res.status(200).json({ success: true, message: "Transport operator activity fetched successfully", data });
  } catch (error) {
    console.error("Error fetching transport operator activity:", error);
    return sendError(res, error);
  }
};

const sendError = (res, error) =>
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });

export const scanTransportLoadingController = async (req, res) => {
  try {
    const data = await scanTransportLoadingService(req.body, req.user);
    return res.status(201).json({
      success: true,
      message: "Crate loaded successfully",
      data,
    });
  } catch (error) {
    console.error("Error loading transport crate:", error);
    return sendError(res, error);
  }
};

export const getTransportLoadingProgressController = async (req, res) => {
  try {
    const data = await getTransportLoadingProgressService({
      harvest_id: req.params.harvest_id,
      user: req.user,
    });
    return res.status(200).json({
      success: true,
      message: "Transport loading progress fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching transport loading progress:", error);
    return sendError(res, error);
  }
};
