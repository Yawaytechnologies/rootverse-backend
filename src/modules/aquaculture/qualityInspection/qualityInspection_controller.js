import {
  createQualityInspectionService,
  getQualityInspectionByIdService,
  getQualityInspectionPrefillService,
  getQualityInspectionsByStatusService,
  listQualityInspectionsService,
} from "./qualityInspection_service.js";

const sendError = (res, error) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

const parseRequestBody = (body) => {
  if (!body?.data) return body;

  let data;
  try {
    data = typeof body.data === "string" ? JSON.parse(body.data) : body.data;
  } catch {
    const error = new Error("Valid JSON is required in data field");
    error.statusCode = 400;
    throw error;
  }

  const { data: _data, ...fields } = body;
  return { ...data, ...fields };
};

export const getQualityInspectionPrefillController = async (req, res) => {
  try {
    const data = await getQualityInspectionPrefillService({
      qr_code: req.params.qr_code,
      harvest_id: req.query.harvest_id,
      checker_code: req.query.checker_code,
      quality_checker_id: req.query.quality_checker_id,
    });

    return res.status(200).json({
      success: true,
      message: "Quality inspection prefill fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching quality inspection prefill:", error);
    return sendError(res, error);
  }
};

export const createQualityInspectionController = async (req, res) => {
  try {
    const data = await createQualityInspectionService(parseRequestBody(req.body), req.files || []);

    return res.status(201).json({
      success: true,
      message: "Quality inspection created successfully",
      data,
    });
  } catch (error) {
    console.error("Error creating quality inspection:", error);
    return sendError(res, error);
  }
};

export const listQualityInspectionsController = async (req, res) => {
  try {
    const data = await listQualityInspectionsService(req.query);

    return res.status(200).json({
      success: true,
      message: "Quality inspections fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching quality inspections:", error);
    return sendError(res, error);
  }
};

export const getQualityInspectionsByStatusController = async (req, res) => {
  try {
    const data = await getQualityInspectionsByStatusService(req.params.inspection_status);

    return res.status(200).json({
      success: true,
      message: "Quality inspections fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching quality inspections by status:", error);
    return sendError(res, error);
  }
};

export const getQualityInspectionByIdController = async (req, res) => {
  try {
    const data = await getQualityInspectionByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Quality inspection fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching quality inspection:", error);
    return sendError(res, error);
  }
};
