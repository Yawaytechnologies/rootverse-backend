import { createFishingMethod, getallFishingMethods, updateFishingMethod, deleteFishingMethod} from "./fishing_methods_model.js";
import { SUPABASE_BUCKET, supabase } from "../../config/supabase.js";
import { buildProfileKey } from "../../utils/storageKey.js";
import db from "../../config/db.js";


export async function registerFishingMethod(payload, imageFile) {
    // Accept multiple possible field names coming from form-data or JSON
    let method_name = (payload && (payload.method_name ?? payload.methodName ?? payload.name)) || null;
    let method_code = (payload && (payload.method_code ?? payload.methodCode ?? payload.code)) || null;

    // If nested under `method` object
    if ((!method_name || !method_code) && payload && typeof payload.method === 'object') {
        method_name = method_name || payload.method.method_name || payload.method.methodName || payload.method.name || null;
        method_code = method_code || payload.method.method_code || payload.method.methodCode || payload.method.code || null;
    }

    // Trim strings
    if (typeof method_name === 'string') method_name = method_name.trim();
    if (typeof method_code === 'string') method_code = method_code.trim();

    if (!method_name || !method_code) {
        throw new Error("Missing required fields: method_name and method_code.");
    }

    let image_url = null;
    let image_key = null;
    if (imageFile) {
        const key = buildProfileKey({ userId: `fishing_method_${method_code}`, originalName: imageFile.originalname });
        const contentType = imageFile.mimetype === 'application/pdf' ? 'application/pdf' : imageFile.mimetype;
        const { error } = await supabase.storage
            .from(SUPABASE_BUCKET)
            .upload(key, imageFile.buffer, { contentType, upsert: true });
        if (error) throw error;
        const publicUrlResult = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(key);
        if (publicUrlResult) {
            if (publicUrlResult.data && publicUrlResult.data.publicUrl) {
                image_url = publicUrlResult.data.publicUrl;
            } else if (publicUrlResult.publicUrl) {
                image_url = publicUrlResult.publicUrl;
            }
        }
        image_key = key;
    }
    const createPayload = {
        method_name,
        method_code,
        image_url,
        image_key
    };
    const result = await createFishingMethod(createPayload);
    return result;
}


export async function getAllFishingMethods() {
    return await getallFishingMethods();
}

export async function updateFishingMethodService(id, payload, imageFile) {
    let image_url = null;
    let image_key = null;
    if (imageFile) {
        const key = buildProfileKey({ userId: `fishing_method_${id}`, originalName: imageFile.originalname });
        const contentType = imageFile.mimetype === 'application/pdf' ? 'application/pdf' : imageFile.mimetype;
        const { error } = await supabase.storage
            .from(SUPABASE_BUCKET)
            .upload(key, imageFile.buffer, { contentType, upsert: true });
        if (error) throw error;
        const publicUrlResult = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(key);
        if (publicUrlResult) {
            if (publicUrlResult.data && publicUrlResult.data.publicUrl) {
                image_url = publicUrlResult.data.publicUrl;
            } else if (publicUrlResult.publicUrl) {
                image_url = publicUrlResult.publicUrl;
            }
        }
        image_key = key;
    }
    const updatePayload = {
        ...payload,
        ...(image_url ? { image_url } : {}),
        ...(image_key ? { image_key } : {})
    };
    const result = await updateFishingMethod(id, updatePayload);
    return result;
}

export async function deleteFishingMethodService(id) {
    // First, get the existing method to find the image key
    const existingMethods = await db('fishing_methods').where({ id }).select('*');
    if (existingMethods.length === 0) {
        throw new Error('Fishing method not found');
    }   
    const existingMethod = existingMethods[0];

    // If there's an associated image, delete it from Supabase Storage
    if (existingMethod.image_key) {
        const { error } = await supabase.storage.from(SUPABASE_BUCKET).remove([existingMethod.image_key]);
        if (error) {
            console.error('Error deleting image from storage:', error);
            // We can choose to continue with deletion even if image deletion fails
        }
    }
}



