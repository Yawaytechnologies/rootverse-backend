import{createImageRecord, getImagesByCultureCycleId}from"./imageUpload_repository.js"
import { supabase, SUPABASE_BUCKET } from "../../../shared/lib/supabase.js";
import { aquacultureImageKey } from "../../../shared/utils/storageKey.js";


export async function uploadAquacultureImageService(cultureCycleId, file, description) {
    const storageKey = aquacultureImageKey(cultureCycleId, file.originalname);
    const contentType = file.mimetype;
    const { error } = await supabase.storage        .from(SUPABASE_BUCKET)
        .upload(storageKey, file.buffer, { contentType, upsert: true });
    if (error) throw error;

    const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(storageKey);
    const imageUrl = data.publicUrl;
    const imageId = await createImageRecord(cultureCycleId, imageUrl, storageKey, description);
    return { id: imageId, imageUrl };
}


export async function getAquaculturebyCultureCycleIdService(cultureCycleId) {
    const images = await getImagesByCultureCycleId(cultureCycleId);
    return images;
}


