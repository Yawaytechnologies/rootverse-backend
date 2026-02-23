import db from "../../config/db.js";

export async function createAdmin(payload) {
    const admin = await db("admin").insert(payload).returning("*");
    return admin;
}

export async function getAllAdmins() {
    const admins = await db("admin").select("id", "username", "email", "phone", "address", "date_of_birth", "created_at", "updated_at");
    return admins;
}


export async function deleteAdmin(id) {
    const deleted = await db("admin").where({ id }).del();
    if (!deleted) {
        throw new Error("Admin not found");
    }
    return true;
}

export async function updateAdmin(id, payload) {
    const updated = await db("admin").where({ id }).update(payload).returning("*");
    if (!updated.length) {
        throw new Error("Admin not found");
    }   
    return updated[0];
}