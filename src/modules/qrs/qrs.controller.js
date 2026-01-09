import { reserveQrservice, reserveBulkService, listQrsService, getFilledQrByCode, uploadImagesToSupabase, updateQrWithImages } from "./qrs.service.js";

export async function reserveQrsController(req, res) {
    try{
        const {type} = req.body;
        const qr = await reserveQrservice(type||"CRATE");
        res.status(201).json({sucess:true, qr});
    }
    catch(err){
        res.status(400).json({sucess:false, message:err.message});
    }
    
}

export async function reserveBulkController(req, res) {
  try {
    const { type, count } = req.body;
    const qrs = await reserveBulkService(type, count);
    res.status(201).json({ success: true, count: qrs.length, qrs });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function listQrsController(req, res) {
  try {
    const { type, status, page, limit, populate } = req.query;
    const data = await listQrsService({ type, status, page, limit, populate });
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function listFilledQrsController(req, res) {
  try {
    const { type, page, limit } = req.query;
    const data = await listQrsService({ type, status: 'FILLED', page, limit, populate: true });
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function getFilledQrByCodeController(req, res) {
  try {
    const { code } = req.params;
    const qr = await getFilledQrByCode(code);
    res.status(200).json({ success: true, qr });
  } catch (err) {
    if (err.message === 'QR not found') return res.status(404).json({ success: false, message: err.message });
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function updateQrImagesController(req, res) {
  try {
    const { code } = req.params;
    const files = req.files;

    // Accept optional fill data in body
    const { rv_vessel_id, fish_id, owner_id, trip_id, weight, date, time, status } = req.body || {};

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "No images provided" });
    }

    if (files.length > 3) {
      return res.status(400).json({ success: false, message: "Maximum 3 images allowed" });
    }

    // Upload images to Supabase
    const uploadedImages = await uploadImagesToSupabase(files, code);

    // Build optional updates object from body
    const updatesFromBody = {};
    if (rv_vessel_id !== undefined) updatesFromBody.rv_vessel_id = rv_vessel_id === '' ? null : rv_vessel_id;
    if (fish_id !== undefined) updatesFromBody.fish_id = fish_id === '' ? null : fish_id;
    if (owner_id !== undefined) updatesFromBody.owner_id = owner_id === '' ? null : owner_id;
    if (weight !== undefined) updatesFromBody.weight = weight === '' ? null : weight;
    if (date !== undefined) updatesFromBody.date = date === '' ? null : date;
    if (time !== undefined) updatesFromBody.time = time === '' ? null : time;
    if (status !== undefined) updatesFromBody.status = status;

    // Update QR record with image information and optional fill fields
    const updatedQr = await updateQrWithImages(code, uploadedImages, updatesFromBody);

    res.status(200).json({
      success: true,
      message: `${uploadedImages.length} image(s) uploaded successfully`,
      qr: updatedQr,
      images: uploadedImages
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
