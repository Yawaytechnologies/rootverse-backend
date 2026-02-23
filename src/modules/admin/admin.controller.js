import { registerAdmin, loginAdmin, getAdminById, getAllAdminsService, updateAdminService, deleteAdminService } from "./admin.service.js";

export async function createAdminController(req, res) {
    try {
        const payload = req.body;
        const admin = await registerAdmin(payload);
        res.status(201).json(admin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function loginAdminController(req, res) {
    try {
        const token = await loginAdmin(req);
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getAdminDetailsController(req, res) {
    try {
        // req.user is set by the requireAuth middleware
        const adminId = req.user.id;
        const admin = await getAdminById(adminId);
        res.status(200).json(admin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getAllAdminsController(req, res) {
    try {
        const admins = await getAllAdminsService();
        res.status(200).json(admins);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function updateAdminController(req, res) {
    try {
        const adminId = req.params.id;
        const payload = req.body;
        const updatedAdmin = await updateAdminService(adminId, payload);
        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function deleteAdminController(req, res) {
    try {
        const adminId = req.params.id;
        await deleteAdminService(adminId);
        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}