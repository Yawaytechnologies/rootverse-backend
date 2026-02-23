import { createOwner, getAllOwners, getByRootverseType, getOwnerById, updateOwner, deleteOwner, verifyOwner, generateOwnerId, getOwnerByLocation  } from "./owner.model.js";
import { supabase, SUPABASE_BUCKET } from "../../config/supabase.js";
import { buildProfileKey } from "../../utils/storageKey.js";
import db from "../../config/db.js";
import { phone } from "../owner/owner.verification.js";

const ALLOWED = new Set(["PENDING", "VERIFIED"])

async function uploadDoc(userId, file, type) {
  const key = buildProfileKey({ userId, originalName: file.originalname });
  const contentType = file.mimetype === 'application/pdf' ? 'application/pdf' : file.mimetype;
  const { error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(key, file.buffer, { contentType, upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(key);
  return { key, url: data.publicUrl };
  
}


export function formatOwner(row) {
    if (!row) return null;
    const { state_id, state_name, district_id, district_name, ...rest } = row;
    return {
        ...rest,
        state: state_id ? { id: state_id, name: state_name } : null,
        district: district_id ? { id: district_id, name: district_name } : null,
        state_name: state_name ?? null,
        district_name: district_name ?? null,
    };
}

export async function registerOwner(payload, profileImage) {
    const username = payload.username || payload.userName || payload.usserName;
    const phone_no = payload.phone_no || payload.phoneNo;
    const address = payload.address || payload.addr;
    const rootverse_type = payload.rootverse_type || payload.rootverseType;
    const state_id = payload.state_id || payload.stateId || null;
    const district_id = payload.district_id || payload.districtId || null;
    const location_id = payload.location_id || payload.locationId || null;

    if (!phone(phone_no)) {
        throw new Error("Invalid phone number format.");
    }
    if (!username || !address || !rootverse_type) {
        throw new Error("Missing required fields.");
    }

    // Generate owner_id
    const owner_id = await generateOwnerId();

    let created = null;
    try {
        const rows = await createOwner({
            owner_id,
            username,
            phone_no,
            address,
            rootverse_type,
            state_id,
            district_id,
            location_id,
            verification_status: "PENDING",
            profile_picture_url: null,
            profile_picture_key: null,
            created_at: db.fn.now(),
            updated_at: db.fn.now(),
        });
        created = rows?.[0] ?? rows;

        if (!profileImage) {
            const full = await getOwnerById(created.id);
            return formatOwner(full);
        }

        const mimeType = profileImage.mimetype;
        if (!mimeType.startsWith("image/")) {
            const err = new Error("Profile picture must be an image (image/*)");
            err.status = 400;
            throw err;
        }

        const storageKey = buildProfileKey({
            userId: created.id,
            originalName: profileImage.originalname,
        });

        const { error: upErr } = await supabase.storage
            .from(SUPABASE_BUCKET)
            .upload(storageKey, profileImage.buffer, { contentType: mimeType, upsert: true });

        if (upErr) throw upErr;

        const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(storageKey);
        const publicUrl = data.publicUrl;

        const updatedRows = await updateOwner(created.id, {
            profile_picture_key: storageKey,
            profile_picture_url: publicUrl,
            updated_at: db.fn.now(),
        });

        // fetch fresh row with state/district info
        const full = await getOwnerById(created.id);
        return formatOwner(full);
    } catch (err) {
        if (created && created.id) {
            try {
                await deleteOwner(created.id);
            } catch (deleteErr) {
                console.error("Failed to delete owner on error:", deleteErr);
            }
        }
        throw err;
    }
}

export async function verifyOwnerService(id, verification_status) {
    if (!ALLOWED.has(verification_status)) {
        throw new Error("Invalid verification status.");
    }
    await verifyOwner(id);
    const owner = await getOwnerById(id);
    return formatOwner(owner);
}

export async function listAllOwners() {
    const owners = await getAllOwners();
    return owners.map(formatOwner);
}

export async function getOwnerService(id) {
    const row = await getOwnerById(id);
    return formatOwner(row);
}

export async function updateOwnerService(id, updates) {
    await updateOwner(id, updates);
    const owner = await getOwnerById(id);
    return formatOwner(owner);



}


export async function fetchUsersByRootverseType(rootverse_type) {
  // Call the model
  const users = await getByRootverseType(rootverse_type);

  // Add progress calculation (verified vs pending)
  const verifiedCount = users.filter(u => u.verification_status === "VERIFIED").length;
  const pendingCount = users.filter(u => u.verification_status === "PENDING").length;
  const total = users.length;

  return {
    rootverse_type,
    total,
    progress: {
      verified: verifiedCount,
      pending: pendingCount,
      percentage_verified: total > 0 ? ((verifiedCount / total) * 100).toFixed(2) : "0.00"
    },
    users
  };
}


export async function verifyOwnerDocs(id, payload = {}) {
  const updates = {
    verification_status: "VERIFIED",
    updated_at: db.fn.now(),
  };

  await updateOwner(id, updates);
  const owner = await getOwnerById(id);
  return owner;
}

export async function deleteOwnerService(id) {
    await deleteOwner(id);
    return { message: "Owner deleted successfully" };
}

export async function getOwnerByLocationService(location_id) {
    const rows = await getOwnerByLocation(location_id);
    return rows.map(formatOwner);
}






