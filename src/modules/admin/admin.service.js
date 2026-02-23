import { createAdmin, getAllAdmins, deleteAdmin, updateAdmin } from "./admin.model.js";
import db from "../../config/db.js";
import { signToken } from "../auth/utils/token.js";
import bcrypt from "bcryptjs";

export async function registerAdmin(payload) {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const adminData = {
        ...payload,
        password: hashedPassword
    };
    const admin = await createAdmin(adminData);
    return admin;
}


export async function loginAdmin(req) {
    const email = String(req.body?.email || "").trim();
    const password = String(req.body?.password || "").trim();
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");
    const admin = await db("admin")
        .select("id", "email", "password")
        .where({ email })
        .first();
    if (!admin) {
        throw new Error("Admin not found");
    }
    // Compare the provided password with the hashed password
    let isPasswordValid = false;
    // Check if password is hashed (starts with $2a$, $2b$, etc.)
    if (admin.password && admin.password.startsWith('$')) {
        isPasswordValid = await bcrypt.compare(password, admin.password);
    } else {
        // For backward compatibility: compare plain text password
        isPasswordValid = (password === admin.password);
    }
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }
    return signToken({
        id: admin.id,
    });
}

export async function getAdminById(id) {
    const admin = await db("admin")
        .select("id", "username", "email", "phone", "address", "date_of_birth", "created_at", "updated_at")
        .where({ id })
        .first();
    if (!admin) {
        throw new Error("Admin not found");
    }
    return admin;
}

export async function getAllAdminsService() {
    return await getAllAdmins();
}

export async function deleteAdminService(id) {
    return await deleteAdmin(id);
}

export async function updateAdminService(id, payload) {
    return await updateAdmin(id, payload);
}