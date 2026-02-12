import db from "../../config/db.js";

const FishingMethods = 'fishing_methods';

export async function createFishingMethod(payload) {
    return db(FishingMethods).insert(payload).returning('*');
}

export async function getallFishingMethods() {
    return db(FishingMethods).select('*');
}

export async function updateFishingMethod(id, payload) {
    return db(FishingMethods).where({ id }).update(payload).returning('*');
}

export async function deleteFishingMethod(id) {
    return db(FishingMethods).where({ id }).del();
}
