import { createPondStockingService, getAllPondStockingService, getPondStockingByCultureCycleIdService, getPondStockingByIdService, updatePondStockingService, getPondStockingByQrCodeIdService, deletePondStockingService } from "./pondStocking_service.js";

export const createPondStockingController = async (req, res) => {
    try {
        const data = req.body;

        const newRecord = await createPondStockingService(data);

        res.status(201).json({
            success: true,
            message: "Pond stocking created successfully",
            data: newRecord
        });

    } catch (error) {
        console.error('Error creating pond stocking record:', error);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

export const getPondStockingByIdController = async (req, res) => {
    try {        const { id } = req.params;
        const record = await getPondStockingByIdService(id);
        if (!record) {
            return res.status(404).json({ error: 'Pond stocking record not found' });
        }
        res.json(record);
    } catch (error) {
        console.error('Error fetching pond stocking record by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPondStockingByCultureCycleIdController = async (req, res) => {
    try {        const { culturecycle_id } = req.params;
        const record = await getPondStockingByCultureCycleIdService(culturecycle_id);
        if (!record) {
            return res.status(404).json({ error: 'Pond stocking record not found' });
        }
        res.json(record);
    }
        catch (error) {
        console.error('Error fetching pond stocking record by culture cycle ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPondStockingByQrCodeIdController = async (req, res) => {
    try {        const { qr_code_id } = req.params;
        const record = await getPondStockingByQrCodeIdService(qr_code_id);
        if (!record) {
            return res.status(404).json({ error: 'Pond stocking record not found' });
        }
        res.json(record);
    }
        catch (error) {
        console.error('Error fetching pond stocking record by QR code ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updatePondStockingController = async (req, res) => {
    try {
        const { id } = req.params;  
        const data = req.body;
        const updatedRecord = await updatePondStockingService(id, data);
        if (!updatedRecord) {
            return res.status(404).json({ error: 'Pond stocking record not found' });
        }
        res.json(updatedRecord);
    } catch (error) {
        console.error('Error updating pond stocking record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deletePondStockingController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deletePondStockingService(id);
        res.json(result);
    } catch (error) {
        console.error('Error deleting pond stocking record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllPondStockingController = async (req, res) => {
    try {
        const records = await getAllPondStockingService();
        res.json(records);
    } catch (error) {
        console.error('Error fetching all pond stocking records:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


