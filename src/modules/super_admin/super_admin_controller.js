import { registerSuperAdmin, loginSuperAdmin, getSuperAdminById, getAllSuperAdminsService, updateSuperAdminService, deleteSuperAdminService } from "./super_admin_service.js";


export async function createSuperAdminController(req, res) {
    try {
        const payload = req.body;
        const superAdmin = await registerSuperAdmin(payload);
        res.status(201).json(superAdmin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function loginSuperAdminController(req, res) {
    try {
        const token = await loginSuperAdmin(req);
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getSuperAdminDetailsController(req, res) {
    try {
        // req.user is set by the requireAuth middleware
        const superAdminId = req.user.id;
        const superAdmin = await getSuperAdminById(superAdminId);
        res.status(200).json(superAdmin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


export async function getAllSuperAdminsController(req, res) {
    try {
        const superAdmins = await getAllSuperAdminsService();
        res.status(200).json(superAdmins);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function updateSuperAdminController(req, res) {
    try {
        const superAdminId = req.params.id;
        const payload = req.body;
        const updatedSuperAdmin = await updateSuperAdminService(superAdminId, payload);
        res.status(200).json(updatedSuperAdmin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function deleteSuperAdminController(req, res) {
    try {
        const superAdminId = req.params.id;
        await deleteSuperAdminService(superAdminId);
        res.status(200).json({ message: "Super Admin deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}