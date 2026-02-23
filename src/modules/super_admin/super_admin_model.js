import db from "../../config/db.js";

export async function createSuperAdmin(payload) {
    const superAdmin = await db("super_admin").insert(payload).returning("*");
    return superAdmin;
}


export async function getAllSuperAdmins() {
    const superAdmins = await db("super_admin").select("id", "username", "email", "phone", "address", "date_of_birth", "created_at", "updated_at");
    return superAdmins;
}

export async function deleteSuperAdmin(id) {
    const deleted = await db("super_admin").where({ id }).del();
    if (!deleted) {
        throw new Error("Super Admin not found");
    }
    return true;
}

export async function updateSuperAdmin(id, payload) {
    const updated = await db("super_admin").where({ id }).update(payload).returning("*");
    if (!updated.length) {
        throw new Error("Super Admin not found");
    }
    return updated[0];
}