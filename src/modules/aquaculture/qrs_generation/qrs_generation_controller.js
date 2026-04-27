import {
  activateFarmQrService,
  activatePondQrService,
  generateAquacultureQrService,
  getAquacultureQrByCodeService,
  getAquacultureQrByIdService,
  listAquacultureQrsService,
} from "./qrs_generation_service.js";

const sendError = (res, error) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

export const generateAquacultureQrController = async (req, res) => {
  try {
    const qrs = await generateAquacultureQrService(req.body);

    return res.status(201).json({
      success: true,
      message: "Aquaculture QR codes generated successfully",
      data: qrs,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const activateFarmQrController = async (req, res) => {
  try {
    const qr = await activateFarmQrService(req.params.farm_id, req.params.qr_id);

    return res.status(200).json({
      success: true,
      message: "Farm QR activated successfully",
      data: qr,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const activatePondQrController = async (req, res) => {
  try {
    const qr = await activatePondQrService(req.params.pond_id, req.params.qr_id);

    return res.status(200).json({
      success: true,
      message: "Pond QR activated successfully",
      data: qr,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getAquacultureQrByIdController = async (req, res) => {
  try {
    const qr = await getAquacultureQrByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Aquaculture QR fetched successfully",
      data: qr,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getAquacultureQrByCodeController = async (req, res) => {
  try {
    const qr = await getAquacultureQrByCodeService(req.params.code);

    return res.status(200).json({
      success: true,
      message: "Aquaculture QR fetched successfully",
      data: qr,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const listAquacultureQrsController = async (req, res) => {
  try {
    const qrs = await listAquacultureQrsService(req.query);

    return res.status(200).json({
      success: true,
      message: "Aquaculture QRs fetched successfully",
      data: qrs,
    });
  } catch (error) {
    return sendError(res, error);
  }
};
