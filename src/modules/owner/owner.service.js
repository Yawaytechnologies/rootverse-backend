import { createOwner, getAllOwners, getByRootverseType, getOwnerById, updateOwner, deleteOwner, verifyOwner } from "./owner.model.js";
import { supabase, SUPABASE_BUCKET } from "../../config/supabase.js";
import { buildProfileKey } from "../../utils/storageKey.js";
import db from "../../config/db.js";
import { phone } from "../owner/owner.verification.js";

const ALLOWED = new Set(["PENDING", "VERIFIED"])

export async function registerOwner(payload, profileImage) {
    const username = payload.username || payload.userName || payload.usserName;
    const phone_no = payload.phone_no || payload.phoneNo;
    const address = payload.address || payload.addr;
    const rootverse_type = payload.rootverse_type || payload.rootverseType;

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
            verification_status: "PENDING",
            profile_picture_url: null,
            profile_picture_key: null,
            created_at: db.fn.now(),
            updated_at: db.fn.now(),
        });
        created = rows?.[0] ?? rows;

        if (!profileImage) return created;

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

        return updatedRows?.[0] ?? updatedRows;
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
    const owner = await verifyOwner(id);
    return owner;
}


