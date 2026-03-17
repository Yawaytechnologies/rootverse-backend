import { supabase,SUPABASE_BUCKET } from "../lib/supabase.js";

export async function uploadFile(file, key) {
    const contentType = file.mimetype === 'application/pdf' ? 'application/pdf' : file.mimetype;
    const { error } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .upload(key, file.buffer, { contentType, upsert: true });

    if (error) throw error;

    const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(key);
    return data.publicUrl;
}
