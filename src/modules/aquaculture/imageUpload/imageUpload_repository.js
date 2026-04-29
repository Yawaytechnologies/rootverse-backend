import db from "../../../shared/lib/db.js";

const tableName = "aquaculture_image";

export const createImageRecord = async (cultureCycleId, imageUrl, storagePath, description) => {
    const [insertedRow] = await db(tableName).insert({
        culture_cycle_id: cultureCycleId,
        image_url: imageUrl,
        storage_path: storagePath,
        description
    }).returning("id");
    return insertedRow?.id ?? insertedRow;
};

export const getImagesByCultureCycleId = async (cultureCycleId) => {
    return await db(tableName).where({ culture_cycle_id: cultureCycleId }).select("*");
};
