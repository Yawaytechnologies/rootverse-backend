import {
    createSamplingService,
    deleteSamplingService,
    getAllSamplingService,
    getSamplingByCultureCycleIdService,
    getSamplingByFarmIdService,
    getSamplingByIdService,
    getSamplingByPondIdService,
    getSamplingByQrCodeIdService,
    updateSamplingService,
} from './sampling_service.js';

const sendError = (res, error) => {
    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal server error',
    });
};

export const createSamplingController = async (req, res) => {
    try {
        const samplingData = req.body;
        const newSamplingRecord = await createSamplingService(samplingData);

        return res.status(201).json({
            success: true,
            message: 'Sampling record created successfully',
            data: newSamplingRecord,
        });
    } catch (error) {
        console.error('Error in controller while creating sampling record:', error);
        return sendError(res, error);
    }
};

export const getAllSamplingController = async (req, res) => {
    try {
        const samplingRecords = await getAllSamplingService();

        return res.status(200).json({
            success: true,
            message: 'Sampling records fetched successfully',
            data: samplingRecords,
        });
    } catch (error) {
        console.error('Error in controller while fetching sampling records:', error);
        return sendError(res, error);
    }
};

export const getSamplingByIdController = async (req, res) => {
    try {
        const samplingRecord = await getSamplingByIdService(req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Sampling record fetched successfully',
            data: samplingRecord,
        });
    } catch (error) {
        console.error('Error in controller while fetching sampling record:', error);
        return sendError(res, error);
    }
};

export const getSamplingByCultureCycleIdController = async (req, res) => {
    try {
        const samplingRecords = await getSamplingByCultureCycleIdService(req.params.culture_cycle_id);

        return res.status(200).json({
            success: true,
            message: 'Sampling records fetched successfully',
            data: samplingRecords,
        });
    } catch (error) {
        console.error('Error in controller while fetching sampling records by culture cycle:', error);
        return sendError(res, error);
    }
};

export const getSamplingByFarmIdController = async (req, res) => {
    try {
        const samplingRecords = await getSamplingByFarmIdService(req.params.farm_id);

        return res.status(200).json({
            success: true,
            message: 'Sampling records fetched successfully',
            data: samplingRecords,
        });
    } catch (error) {
        console.error('Error in controller while fetching sampling records by farm:', error);
        return sendError(res, error);
    }
};

export const getSamplingByPondIdController = async (req, res) => {
    try {
        const samplingRecords = await getSamplingByPondIdService(req.params.pond_id);

        return res.status(200).json({
            success: true,
            message: 'Sampling records fetched successfully',
            data: samplingRecords,
        });
    } catch (error) {
        console.error('Error in controller while fetching sampling records by pond:', error);
        return sendError(res, error);
    }
};

export const getSamplingByQrCodeIdController = async (req, res) => {
    try {
        const samplingRecords = await getSamplingByQrCodeIdService(req.params.qr_code_id);

        return res.status(200).json({
            success: true,
            message: 'Sampling records fetched successfully',
            data: samplingRecords,
        });
    } catch (error) {
        console.error('Error in controller while fetching sampling records by QR code:', error);
        return sendError(res, error);
    }
};

export const updateSamplingController = async (req, res) => {
    try {
        const samplingRecord = await updateSamplingService(req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: 'Sampling record updated successfully',
            data: samplingRecord,
        });
    } catch (error) {
        console.error('Error in controller while updating sampling record:', error);
        return sendError(res, error);
    }
};

export const deleteSamplingController = async (req, res) => {
    try {
        const result = await deleteSamplingService(req.params.id);

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        console.error('Error in controller while deleting sampling record:', error);
        return sendError(res, error);
    }
};
