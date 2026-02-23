import { createSuperAdmin , getAllSuperAdmins, updateSuperAdmin, deleteSuperAdmin} from "./super_admin_model.js";
import db from "../../config/db.js";
import { signToken } from "../auth/utils/token.js";
import bcrypt from "bcryptjs";


export async function registerSuperAdmin(payload) {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const superAdminData = {
        ...payload,
        password: hashedPassword
    };
    const superAdmin = await createSuperAdmin(superAdminData);
    return superAdmin;
}


export async function loginSuperAdmin(req) {
    const email = String(req.body?.email || "").trim();
    const password = String(req.body?.password || "").trim();
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");

    const superAdmin = await db("super_admin")
        .select("id", "email", "password")
        .where({ email })
        .first();
    if (!superAdmin) {
        throw new Error("Super Admin not found");
    }

    // Compare the provided password with the hashed password
    let isPasswordValid = false;
    
    // Check if password is hashed (starts with $2a$, $2b$, etc.)
    if (superAdmin.password && superAdmin.password.startsWith('$')) {
        isPasswordValid = await bcrypt.compare(password, superAdmin.password);
    } else {
        // For backward compatibility: compare plain text password
        isPasswordValid = (password === superAdmin.password);
    }
    
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    return signToken({
        id: superAdmin.id,
    });
}


export async function getSuperAdminById(id) {
    const superAdmin = await db("super_admin")
        .select("id", "username", "email", "phone", "address", "date_of_birth", "created_at", "updated_at")
        .where({ id })
        .first();
    if (!superAdmin) {
        throw new Error("Super Admin not found");
    }
    return superAdmin;
}

export async function getAllSuperAdminsService() {
    return await getAllSuperAdmins();
}


export async function updateSuperAdminService(id, payload) {
    if (payload.password) {
        // Hash the new password before updating
        payload.password = await bcrypt.hash(payload.password, 10);
    }
    return await updateSuperAdmin(id, payload);
}


export async function deleteSuperAdminService(id) {
    return await deleteSuperAdmin(id);
}