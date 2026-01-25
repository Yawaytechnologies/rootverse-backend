import { reserveQrservice, reserveBulkService, listQrsService, getFilledQrByCode, uploadImagesToSupabase, updateQrWithImages, getQrByStatusAndCodeService } from "./qrs.service.js";
import { getQrByCodePopulate } from "./qrs.model.js";
import { updateOwner } from "../owner/owner.model.js";
import db from "../../config/db.js";

export async function reserveQrsController(req, res) {
    try{
        const {type} = req.body;
        const qr = await reserveQrservice(type||"FISH");
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
    const { rv_vessel_id, fish_id, owner_id, trip_id, date, time, status, latitude, longitude } = req.body || {};

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
    if (date !== undefined) updatesFromBody.date = date === '' ? null : date;
    if (time !== undefined) updatesFromBody.time = time === '' ? null : time;
    if (trip_id !== undefined) updatesFromBody.trip_id = trip_id === '' ? null : trip_id;
    if (status !== undefined) updatesFromBody.status = status;
    if (latitude !== undefined) updatesFromBody.latitude = latitude === '' ? null : parseFloat(latitude);
    if (longitude !== undefined) updatesFromBody.longitude = longitude === '' ? null : parseFloat(longitude);

    // Update QR record with image information and optional fill fields
    const updatedQr = await updateQrWithImages(code, uploadedImages, updatesFromBody);

    // Update owner_register_progress to COMPLETED (this is the fisherman update, status remains NEW)
    if (updatedQr.owner_id) {
      await updateOwner(updatedQr.owner_id, { owner_register_progress: 'COMPLETED' });
    }

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

export async function fillQrWithQcDetailsController(req, res) {
  try {
    const { code } = req.params;
    const { fish_images: fishImages, pond_condition_image: pondConditionImage } = req.files || {};

    // First check if QR exists and owner_register_progress is COMPLETED
    const qr = await getQrByCodePopulate(code);
    if (!qr) {
      return res.status(404).json({ success: false, message: "QR not found" });
    }

    // Check if owner exists and has COMPLETED registration progress
    if (!qr.owner_id) {
      return res.status(400).json({ success: false, message: "QR must have an owner before QC filling" });
    }

    const owner = await db('rootverse_users').where({ id: qr.owner_id }).first();
    if (!owner) {
      return res.status(400).json({ success: false, message: "Owner not found" });
    }

    if (owner.owner_register_progress !== 'COMPLETED') {
      return res.status(400).json({ success: false, message: "Owner registration must be completed before QC filling" });
    }

    // Extract QC details from body
    const {
      rv_vessel_id,
      fish_id,
      owner_id,
      trip_id,
      date,
      time,
      weight,
      latitude,
      longitude,
      quality_checker_id,
      qc_result,
      quality_grade,
      qc_score,
      temperature_c,
      size,
      damage,
      water_temperature,
      ph_level,
      grade,
      odor_score,
      firmness_score,
      is_damaged,
      reject_reason
    } = req.body || {};

    // Validate required fields for filling
    if (!quality_checker_id) {
      return res.status(400).json({ success: false, message: "quality_checker_id is required" });
    }

    // Convert numeric string fields from multipart form data
    const parsedQcScore = qc_score !== undefined && qc_score !== '' ? parseInt(qc_score) : undefined;
    const parsedTemperature = temperature_c !== undefined && temperature_c !== '' ? parseFloat(temperature_c) : undefined;
    const parsedWaterTemperature = water_temperature !== undefined && water_temperature !== '' ? parseFloat(water_temperature) : undefined;
    const parsedPhLevel = ph_level !== undefined && ph_level !== '' ? parseFloat(ph_level) : undefined;
    const parsedGrade = grade !== undefined && grade !== '' ? parseInt(grade) : undefined;
    const parsedOdorScore = odor_score !== undefined && odor_score !== '' ? parseInt(odor_score) : undefined;
    const parsedFirmnessScore = firmness_score !== undefined && firmness_score !== '' ? parseInt(firmness_score) : undefined;
    const parsedWeight = weight !== undefined && weight !== '' ? parseFloat(weight) : undefined;

    // Validate QC result and grade
    const validQcResults = ['PASS', 'HOLD', 'REJECT'];
    const validQualityGrades = ['A', 'B', 'C', 'REJECTED'];

    if (qc_result && !validQcResults.includes(qc_result)) {
      return res.status(400).json({ success: false, message: "Invalid qc_result. Must be PASS, HOLD, or REJECT" });
    }

    if (quality_grade && !validQualityGrades.includes(quality_grade)) {
      return res.status(400).json({ success: false, message: "Invalid quality_grade. Must be A, B, C, or REJECTED" });
    }

    // Validate organoleptic scores (0-5)
    const organolepticScores = [parsedOdorScore, parsedFirmnessScore];
    for (const score of organolepticScores) {
      if (score !== undefined && (score < 0 || score > 5)) {
        return res.status(400).json({ success: false, message: "Organoleptic scores must be between 0 and 5" });
      }
    }

    // Validate size
    const validSizes = ['SMALL', 'MEDIUM', 'LARGE'];
    if (size && !validSizes.includes(size)) {
      return res.status(400).json({ success: false, message: "Invalid size. Must be SMALL, MEDIUM, or LARGE" });
    }

    // Validate damage
    const validDamages = ['NONE', 'MINOR', 'MODERATE', 'SEVERE'];
    if (damage && !validDamages.includes(damage)) {
      return res.status(400).json({ success: false, message: "Invalid damage. Must be NONE, MINOR, MODERATE, or SEVERE" });
    }

    // Validate grade
    const validGrades = [30, 40];
    if (parsedGrade !== undefined && !validGrades.includes(parsedGrade)) {
      return res.status(400).json({ success: false, message: "Invalid grade. Must be 30 or 40" });
    }

    // Validate QC score (0, 10, 20, 30, 40)
    const validQcScores = [0, 10, 20, 30, 40];
    if (parsedQcScore !== undefined && !validQcScores.includes(parsedQcScore)) {
      return res.status(400).json({ success: false, message: "Invalid qc_score. Must be 0, 10, 20, 30, or 40" });
    }

    // Handle fish images upload if provided
    let uploadedFishImages = [];
    if (fishImages && fishImages.length > 0) {
      if (fishImages.length > 5) {
        return res.status(400).json({ success: false, message: "Maximum 5 fish images allowed" });
      }

      // Upload fish images to Supabase
      uploadedFishImages = await uploadImagesToSupabase(fishImages, `${code}_fish`);
    }

    // Handle pond condition image upload if provided
    let uploadedPondConditionImage = null;
    if (pondConditionImage) {
      // Upload pond condition image to Supabase
      const uploadedImages = await uploadImagesToSupabase([pondConditionImage], `${code}_pond_condition`);
      uploadedPondConditionImage = uploadedImages[0];
    }

    // Build updates object
    const updates = {
      status: 'FILLED',
      qc_status: 'CHECKED',
      filled_at: new Date()
    };

    // Add optional fields
    if (rv_vessel_id !== undefined) updates.rv_vessel_id = rv_vessel_id === '' ? null : rv_vessel_id;
    if (fish_id !== undefined) updates.fish_id = fish_id === '' ? null : fish_id;
    if (owner_id !== undefined) updates.owner_id = owner_id === '' ? null : owner_id;
    if (trip_id !== undefined) updates.trip_id = trip_id === '' ? null : trip_id;
    if (date !== undefined) updates.date = date === '' ? null : date;
    if (time !== undefined) updates.time = time === '' ? null : time;
    if (parsedWeight !== undefined) updates.weight = parsedWeight;
    if (latitude !== undefined) updates.latitude = latitude === '' ? null : parseFloat(latitude);
    if (longitude !== undefined) updates.longitude = longitude === '' ? null : parseFloat(longitude);

    // QC fields
    updates.quality_checker_id = quality_checker_id;

    // Fetch quality checker details to store code and name
    const qualityChecker = await db('quality_checker').where({ id: quality_checker_id }).first();
    if (qualityChecker) {
      updates.quality_checker_code = qualityChecker.checker_code;
      updates.quality_checker_name = qualityChecker.checker_name;
    }

    if (qc_result) updates.qc_result = qc_result;
    if (quality_grade) updates.quality_grade = quality_grade;
    if (parsedQcScore !== undefined) updates.qc_score = parsedQcScore;
    if (parsedTemperature !== undefined) updates.temperature_c = parsedTemperature;
    if (size) updates.size = size;
    if (damage) updates.damage = damage;
    if (parsedWaterTemperature !== undefined) updates.water_temperature = parsedWaterTemperature;
    if (parsedPhLevel !== undefined) updates.ph_level = parsedPhLevel;
    if (parsedGrade !== undefined) updates.grade = parsedGrade;
    if (parsedOdorScore !== undefined) updates.odor_score = parsedOdorScore;
    if (parsedFirmnessScore !== undefined) updates.firmness_score = parsedFirmnessScore;
    if (is_damaged !== undefined) updates.is_damaged = is_damaged;
    if (reject_reason) updates.reject_reason = reject_reason;

    // Store images
    updates.fish_images = uploadedFishImages;
    updates.pond_condition_image = uploadedPondConditionImage;

    // Update the QR record
    const updatedQr = await updateQrWithImages(code, [], updates);

    res.status(200).json({
      success: true,
      message: 'QR filled with QC details successfully',
      qr: updatedQr,
      fish_images: uploadedFishImages,
      pond_condition_image: uploadedPondConditionImage
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function getQrByStatusAndCodeController(req, res) {
  try {
    const { status, code } = req.params;
    const qr = await getQrByStatusAndCodeService(status, code);
    if (!qr) {
      return res.status(404).json({ success: false, message: "QR not found with the specified status and code" });
    }
    res.status(200).json({ success: true, qr });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
