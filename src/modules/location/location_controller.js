import { createLocationService, getLocationService, getLocationsByDistrictService, getAllLocationsService, updateLocationService, deleteLocationService } from "./location_service.js";


export async function createLocationController(req, res) {
    try {
        const payload = req.body;
        if (!payload?.name || !payload?.district_id || !payload?.state_id) {
            return res.status(400).json({
                success: false,
                message: "name, district_id and state_id are required",
            });
        }
        const location = await createLocationService(payload);
        return res.status(201).json({
            success: true,
            message: "Location created successfully",
            data: location,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to create location",
        });
    }
}


export async function getLocationController(req, res) {
    try {
        const { id } = req.params;
        const location = await getLocationService(id);
        if (!location) {
            return res.status(404).json({
                success: false,
                message: "Location not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Location fetched successfully",
            data: location,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch location",
        });
    }
}


export async function getLocationsByDistrictController(req, res) {
    try {
        const { district_id } = req.params;
        const locations = await getLocationsByDistrictService(district_id);
        return res.status(200).json({
            success: true,
            message: "Locations fetched successfully",
            data: locations,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch locations",
        });
    }
}

export async function getAllLocationsController(req, res) {
    try {
        const locations = await getAllLocationsService();
        return res.status(200).json({
            success: true,
            message: "All locations fetched successfully",
            data: locations,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch locations",
        });
    }
}

export async function updateLocationController(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;
        const location = await updateLocationService(id, updates);
        if (!location) {
            return res.status(404).json({
                success: false,
                message: "Location not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Location updated successfully",
            data: location,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to update location",
        });
    }
}


export async function deleteLocationController(req, res) {
    try {
        const { id } = req.params;
        await deleteLocationService(id);
        return res.status(200).json({
            success: true,
            message: "Location deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete location",
        });
    }
}
