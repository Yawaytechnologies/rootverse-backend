import {
  reserveQr,
  reserveBulkQrs,
  listQrs,
  getQrByCodePopulate,
  updateQr,
  deleteQr,
  getQrByStatusAndCode,
  getAllCatchlogsRepo,
} from "./qrs.model.js";
import { supabase, SUPABASE_BUCKET } from "../../config/supabase.js";
import { buildProfileKey } from "../../utils/storageKey.js";
import db from "../../config/db.js";

const ALLOWED_TYPES = new Set(["TRIP", "VESSEL", "FISH"]);

function normType(type) {
  return String(type || "")
    .trim()
    .toUpperCase();
}

export async function reserveQrservice(type = "FISH") {
  if (!type) throw new Error("type is required");
  return reserveQr({ type });
}

export async function reserveBulkService(type = "FISH", count = 10) {
  const t = normType(type);
  if (!ALLOWED_TYPES.has(t)) throw new Error(`Invalid type: ${t}`);

  const c = Number(count);
  if (!Number.isFinite(c) || c < 1) throw new Error("count must be >= 1");
  if (c > 500) throw new Error("count too large (max 500)");

  return reserveBulkQrs({ type: t, count: c });
}

export async function listQrsService({ type, status, page, limit, populate }) {
  const t = type ? normType(type) : undefined;
  const s = status ? String(status).trim().toUpperCase() : undefined;
  const p = populate === "true" || populate === true || populate === "1";

  if (t && !ALLOWED_TYPES.has(t)) throw new Error(`Invalid type: ${t}`);
  if (s && !["NEW", "FILLED"].includes(s))
    throw new Error(`Invalid status: ${s}`);

  return listQrs({ type: t, status: s, page, limit, populate: p });
}

export async function getFilledQrByCode(code) {
  if (!code) throw new Error("code is required");
  const qr = await getQrByCodePopulate(code);
  if (!qr) throw new Error("QR not found");
  if (
    String(qr.status || "")
      .trim()
      .toUpperCase() !== "FILLED"
  )
    throw new Error("QR is not FILLED");
  return qr;
}

export async function uploadImagesToSupabase(files, qrId) {
  if (!files || files.length === 0) {
    throw new Error("No files provided");
  }

  if (files.length > 3) {
    throw new Error("Maximum 3 images allowed");
  }

  const uploadedImages = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Validate file type
    if (!file.mimetype.startsWith("image/")) {
      throw new Error(`File ${i + 1} is not an image`);
    }

    // Generate unique key for the image
    const key = buildProfileKey({
      userId: qrId,
      originalName: file.originalname,
      suffix: `_${i + 1}`,
    });

    // Upload to Supabase
    const { error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(key, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw new Error(`Failed to upload image ${i + 1}: ${error.message}`);
    }

    // Get public URL
    const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(key);

    uploadedImages.push({
      key,
      url: data.publicUrl,
    });
  }

  return uploadedImages;
}

export async function updateQrWithImages(code, images, updatesFromBody = {}) {
  // Get QR by code first
  const qr = await getQrByCodePopulate(code);
  if (!qr) {
    throw new Error("QR not found");
  }

  // Prepare update data
  const updates = {};

  // Store first image into existing image fields
  if (images.length > 0) {
    updates.image_key = images[0].key;
    updates.image_url = images[0].url;
  }

  // Only set status if explicitly provided, don't default to FILLED
  if (updatesFromBody.status !== undefined) {
    updates.status = String(updatesFromBody.status).trim().toUpperCase();
  }

  // Helper to check and normalize foreign ids
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "rv_vessel_id")) {
    const raw = updatesFromBody.rv_vessel_id;

    // null / empty
    if (raw === null || raw === "null" || raw === "") {
      updates.rv_vessel_id = null;
    } else {
      // try numeric id first
      const asNum = Number(raw);
      if (Number.isInteger(asNum) && asNum > 0) {
        const vessel = await db("vessel_registration")
          .where({ id: asNum })
          .first();
        if (!vessel) throw new Error(`Vessel id ${asNum} not found`);
        updates.rv_vessel_id = asNum;
      } else {
        // treat raw as code or name -> lookup by rv_vessel_id or vessel_name
        const vessel = await db("vessel_registration")
          .where("rv_vessel_id", String(raw))
          .orWhere("vessel_name", String(raw))
          .first();
        if (!vessel) throw new Error(`Vessel not found for identifier: ${raw}`);
        updates.rv_vessel_id = vessel.id;
      }
    }
  }

  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "fish_id")) {
    const raw = updatesFromBody.fish_id;

    if (raw === null || raw === "null" || raw === "") {
      updates.fish_id = null;
    } else {
      const asNum = Number(raw);
      if (Number.isInteger(asNum) && asNum > 0) {
        const fish = await db("fish-types").where({ id: asNum }).first();
        if (!fish) throw new Error(`Fish id ${asNum} not found`);
        updates.fish_id = asNum;
      } else {
        // lookup by code or fish_name
        const fish = await db("fish-types")
          .where("code", String(raw))
          .orWhere("fish_name", String(raw))
          .first();
        if (!fish) throw new Error(`Fish not found for identifier: ${raw}`);
        updates.fish_id = fish.id;
      }
    }
  }

  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "owner_id")) {
    const raw = updatesFromBody.owner_id;

    if (raw === null || raw === "null" || raw === "") {
      updates.owner_id = null;
    } else {
      const asNum = Number(raw);
      if (Number.isInteger(asNum) && asNum > 0) {
        const owner = await db("rootverse_users").where({ id: asNum }).first();
        if (!owner) throw new Error(`Owner id ${asNum} not found`);
        updates.owner_id = asNum;
      } else {
        const rawStr = String(raw).trim();
        const rawLower = rawStr.toLowerCase();
        const digits = rawStr.replace(/\D/g, "");

        // try several lookups: username (case-insensitive), phone_no (exact or digits-only), username exact fallback
        let owner = await db("rootverse_users")
          .whereRaw("lower(username) = ?", [rawLower])
          .first();
        if (!owner && digits)
          owner = await db("rootverse_users").where("phone_no", digits).first();
        if (!owner)
          owner = await db("rootverse_users").where("phone_no", rawStr).first();
        if (!owner)
          owner = await db("rootverse_users").where("username", rawStr).first();
        // try owner code (owner_id column) case-insensitively
        if (!owner)
          owner = await db("rootverse_users")
            .whereRaw("lower(owner_id) = ?", [rawLower])
            .first();
        if (!owner)
          owner = await db("rootverse_users").where("owner_id", rawStr).first();

        if (!owner) throw new Error(`Owner not found for identifier: ${raw}`);
        updates.owner_id = owner.id;
      }
    }
  }

  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "trip_id")) {
    const raw = updatesFromBody.trip_id;

    if (raw === null || raw === "null" || raw === "") {
      updates.trip_id = null;
    } else {
      const asNum = Number(raw);
      if (Number.isInteger(asNum) && asNum > 0) {
        const trip = await db("trip_plans").where({ id: asNum }).first();
        if (!trip) throw new Error(`Trip id ${asNum} not found`);
        updates.trip_id = asNum;
      } else {
        // lookup by trip_id (string identifier)
        const trip = await db("trip_plans")
          .where("trip_id", String(raw))
          .first();
        if (!trip) throw new Error(`Trip not found for identifier: ${raw}`);
        updates.trip_id = trip.id;
      }
    }
  }

  // Optional simple fields
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "weight")) {
    const w = updatesFromBody.weight === "" ? null : updatesFromBody.weight;
    updates.weight = w;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "date")) {
    updates.date = updatesFromBody.date === "" ? null : updatesFromBody.date;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "time")) {
    updates.time = updatesFromBody.time === "" ? null : updatesFromBody.time;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "latitude")) {
    updates.latitude =
      updatesFromBody.latitude === "" ? null : updatesFromBody.latitude;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "longitude")) {
    updates.longitude =
      updatesFromBody.longitude === "" ? null : updatesFromBody.longitude;
  }

  // QC fields
  if (
    Object.prototype.hasOwnProperty.call(updatesFromBody, "quality_checker_id")
  ) {
    updates.quality_checker_id = updatesFromBody.quality_checker_id;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "qc_status")) {
    updates.qc_status = updatesFromBody.qc_status;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "qc_result")) {
    updates.qc_result = updatesFromBody.qc_result;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "quality_grade")) {
    updates.quality_grade = updatesFromBody.quality_grade;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "qc_score")) {
    updates.qc_score = updatesFromBody.qc_score;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "temperature_c")) {
    updates.temperature_c = updatesFromBody.temperature_c;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "sample_count")) {
    updates.sample_count = updatesFromBody.sample_count;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "odor_score")) {
    updates.odor_score = updatesFromBody.odor_score;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "gill_score")) {
    updates.gill_score = updatesFromBody.gill_score;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "eye_score")) {
    updates.eye_score = updatesFromBody.eye_score;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "firmness_score")) {
    updates.firmness_score = updatesFromBody.firmness_score;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "ice_present")) {
    updates.ice_present = updatesFromBody.ice_present;
  }
  if (
    Object.prototype.hasOwnProperty.call(updatesFromBody, "packaging_intact")
  ) {
    updates.packaging_intact = updatesFromBody.packaging_intact;
  }
  if (
    Object.prototype.hasOwnProperty.call(
      updatesFromBody,
      "foreign_matter_found",
    )
  ) {
    updates.foreign_matter_found = updatesFromBody.foreign_matter_found;
  }
  if (
    Object.prototype.hasOwnProperty.call(updatesFromBody, "is_mixed_species")
  ) {
    updates.is_mixed_species = updatesFromBody.is_mixed_species;
  }
  if (
    Object.prototype.hasOwnProperty.call(updatesFromBody, "is_contaminated")
  ) {
    updates.is_contaminated = updatesFromBody.is_contaminated;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "is_damaged")) {
    updates.is_damaged = updatesFromBody.is_damaged;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "reject_reason")) {
    updates.reject_reason = updatesFromBody.reject_reason;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "qc_remarks")) {
    updates.qc_remarks = updatesFromBody.qc_remarks;
  }
  if (
    Object.prototype.hasOwnProperty.call(updatesFromBody, "crate_image_url")
  ) {
    updates.crate_image_url = updatesFromBody.crate_image_url;
  }
  if (
    Object.prototype.hasOwnProperty.call(updatesFromBody, "crate_image_key")
  ) {
    updates.crate_image_key = updatesFromBody.crate_image_key;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "filled_at")) {
    updates.filled_at = updatesFromBody.filled_at;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "size")) {
    updates.size = updatesFromBody.size;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "damage")) {
    updates.damage = updatesFromBody.damage;
  }
  if (
    Object.prototype.hasOwnProperty.call(updatesFromBody, "water_temperature")
  ) {
    updates.water_temperature = updatesFromBody.water_temperature;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "ph_level")) {
    updates.ph_level = updatesFromBody.ph_level;
  }
  if (Object.prototype.hasOwnProperty.call(updatesFromBody, "grade")) {
    updates.grade = updatesFromBody.grade;
  }

  // Update the QR record
  const updatedQr = await updateQr(qr.id, updates);

  // If QR status changed to FILLED and has trip_id, increment trip count
  if (updates.status === "FILLED" && updatedQr.trip_id) {
    await db("trip_plans")
      .where({ id: updatedQr.trip_id })
      .increment("count", 1);
  }

  return updatedQr;
}

export async function getQrByStatusAndCodeService(status, code) {
  if (!status) throw new Error("status is required");
  if (!code) throw new Error("code is required");
  return getQrByStatusAndCode(status, code);
}

export async function getAllCatchlogsService(query) {
  const trip_id = query.trip_id || null;
  const trip_status = query.trip_status || null;
 

  const filters = { trip_id, trip_status };
  return getAllCatchlogsRepo(filters);
}
