import { createFishTypes, getallfishTypes, getbyfishTypesId, updateFishTypesById, deleteFishTypesById } from "./fish_types_model.js";
import { supabase, SUPABASE_BUCKET } from "../../config/supabase.js";
import { buildFishTypeKey } from "../../utils/storageKey.js";

export async function createFishTypesService(payload, file = null){
    let updatedPayload = { ...payload };

    if (file) {
        const storageKey = buildFishTypeKey({ originalName: file.originalname });
        const contentType = file.mimetype;

        const { error } = await supabase.storage
            .from(SUPABASE_BUCKET)
            .upload(storageKey, file.buffer, { contentType, upsert: true });

        if (error) throw error;

        const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(storageKey);
        updatedPayload.fish_type_key = storageKey;
        updatedPayload.fish_type_url = data.publicUrl;
    } else {
        updatedPayload.fish_type_key = null;
        updatedPayload.fish_type_url = null;
    }

    const [fishTypes] = await createFishTypes(updatedPayload);
    return fishTypes;
}

export async function getallfishTypesService(){
    const fishtypes = getallfishTypes();
    return fishtypes;
}

export async function getbyfishTypesIdService(id){
    const fishTypes = await getbyfishTypesId(id);
    return fishTypes
}

export async function updateFishTypesByIdService(id, updates){
    const fishTypes = await updateFishTypesById(id, updates);
    return fishTypes
}

export async function deleteFishTypesByIdService(id){
    const fishTypes = await deleteFishTypesById(id);
    return fishTypes
}