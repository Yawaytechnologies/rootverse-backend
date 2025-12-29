import { createOwner, getAllOwners, getByRootverseType, getOwnerById, updateOwner, deleteOwner, verifyOwner } from "./owner.model.js";
import { supabase, SUPABASE_BUCKET } from "../../config/supabase.js";
import { buildProfileKey } from "../../utils/storageKey.js";
import db from "../../config/db.js";
import { phone } from "../owner/owner.verification.js";

const ALLOWED = new Set(["PENDING", "VERIFIED"])

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

    if (!phone(phone_no)) {
        throw new Error("Invalid phone number format.");
    }
    if (!username || !address || !rootverse_type) {
        throw new Error("Missing required fields.");
    }

    let created = null;
    try {
        const rows = await createOwner({
            username,
            phone_no,
            address,
            rootverse_type,
            state_id,
            district_id,
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
        if (created?.id) {
            await deleteOwner(created.id);
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


