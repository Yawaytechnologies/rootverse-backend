import db from '../../../shared/lib/db.js';
import {
    createSamplingRecord,
    deleteSamplingRecord,
    getAllSamplingRecords,
    getSamplingPrerequisites,
    getSamplingRecordById,
    getSamplingRecordsByCultureCycleId,
    getSamplingRecordsByFarmId,
    getSamplingRecordsByPondId,
    getSamplingRecordsByQrCodeId,
    updateSamplingRecord,
} from './sampling_repository.js';

const createError = (message, statusCode = 400) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const REQUIRED_NUMBER_FIELDS = [
    'user_id',
    'farm_id',
    'culture_id',
    'pond_id',
    'qr_code_id',
    'DOC',
    'sample_count',
    'sample_weight',
    'total_pl_stock',
];

const normalizeNumber = (value) => {
    if (value === undefined || value === null || value === '') {
        return NaN;
    }

    return Number(value);
};

const normalizeDate = (value) => {
    if (!value) {
        return '';
    }

    if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
    }

    return String(value).trim();
};

const validateId = (value, fieldName = 'id') => {
    const id = normalizeNumber(value);

    if (!Number.isInteger(id) || id <= 0) {
        throw createError(`Valid ${fieldName} is required`);
    }

    return id;
};

const normalizeSamplingPayload = (body) => {
    const cultureId = body.culture_cycle_id ?? body.culture_id;

    const data = {
        user_id: normalizeNumber(body.user_id),
        farm_id: normalizeNumber(body.farm_id),
        culture_id: normalizeNumber(cultureId),
        pond_id: normalizeNumber(body.pond_id),
        qr_code_id: normalizeNumber(body.qr_code_id),
        sampling_date: normalizeDate(body.sampling_date),
        DOC: normalizeNumber(body.DOC),
        sample_count: normalizeNumber(body.sample_count),
        sample_weight: normalizeNumber(body.sample_weight),
        total_pl_stock: normalizeNumber(body.total_pl_stock),
    };

    const ABW = data.sample_weight / data.sample_count;

    return {
        ...data,
        ABW: Math.round(ABW),
        count_kg: Math.round(1000 / ABW),
        expected_biomass: Math.round((data.total_pl_stock * ABW) / 1000),
    };
};

const validateSamplingPayload = (data) => {
    for (const field of REQUIRED_NUMBER_FIELDS) {
        if (!Number.isFinite(data[field]) || data[field] <= 0) {
            throw createError(`Valid ${field} is required`);
        }
    }

    if (!data.sampling_date) {
        throw createError('sampling_date is required');
    }

    if (Number.isNaN(new Date(data.sampling_date).getTime())) {
        throw createError('Valid sampling_date is required');
    }
};

const requireRecords = (records, message = 'Sampling records not found') => {
    if (!records || records.length === 0) {
        throw createError(message, 404);
    }

    return records;
};

const validateSamplingPrerequisites = (data, prerequisites) => {
    if (!prerequisites) {
        throw createError('Culture cycle, pond, or QR code not found', 404);
    }

    if (Number(prerequisites.culture_user_id) !== Number(data.user_id)) {
        throw createError('user_id does not belong to the given culture cycle');
    }

    if (Number(prerequisites.culture_farm_id) !== Number(data.farm_id)) {
        throw createError('farm_id does not belong to the given culture cycle');
    }

    if (Number(prerequisites.culture_pond_id) !== Number(data.pond_id)) {
        throw createError('pond_id does not belong to the given culture cycle');
    }

    if (prerequisites.culture_verification_status !== 'ACTIVE') {
        throw createError('Culture cycle verification_status must be ACTIVE');
    }

    if (prerequisites.pond_status !== 'Active') {
        throw createError('Pond status must be Active');
    }

    if (prerequisites.pond_verification_status !== 'Verified') {
        throw createError('Pond verification_status must be Verified');
    }

    if (prerequisites.qr_type !== 'pond') {
        throw createError('QR code must be a pond QR');
    }

    if (Number(prerequisites.qr_pond_id) !== Number(data.pond_id)) {
        throw createError('qr_code_id does not belong to the given pond');
    }

    if (prerequisites.qr_is_active !== true) {
        throw createError('QR code must be active');
    }
};

const validateSamplingCanBeSaved = async (samplingData, trx) => {
    const prerequisites = await getSamplingPrerequisites(samplingData, trx);

    validateSamplingPrerequisites(samplingData, prerequisites);
};

export const createSamplingService = async (data) => {
    try {
        const samplingData = normalizeSamplingPayload(data);

        validateSamplingPayload(samplingData);

        return await db.transaction(async (trx) => {
            await validateSamplingCanBeSaved(samplingData, trx);

            return await createSamplingRecord(samplingData, trx);
        });
    } catch (error) {
        console.error('Error in service while creating sampling record:', error);
        throw error;
    }
};

export const getAllSamplingService = async () => {
    const records = await getAllSamplingRecords();

    return requireRecords(records);
};

export const getSamplingByIdService = async (id) => {
    const samplingId = validateId(id);
    const record = await getSamplingRecordById(samplingId);

    if (!record) {
        throw createError('Sampling record not found', 404);
    }

    return record;
};

export const getSamplingByCultureCycleIdService = async (cultureCycleId) => {
    const id = validateId(cultureCycleId, 'culture_cycle_id');
    const records = await getSamplingRecordsByCultureCycleId(id);

    return requireRecords(records, 'No sampling records found for this culture cycle');
};

export const getSamplingByFarmIdService = async (farmId) => {
    const id = validateId(farmId, 'farm_id');
    const records = await getSamplingRecordsByFarmId(id);

    return requireRecords(records, 'No sampling records found for this farm');
};

export const getSamplingByPondIdService = async (pondId) => {
    const id = validateId(pondId, 'pond_id');
    const records = await getSamplingRecordsByPondId(id);

    return requireRecords(records, 'No sampling records found for this pond');
};

export const getSamplingByQrCodeIdService = async (qrCodeId) => {
    const id = validateId(qrCodeId, 'qr_code_id');
    const records = await getSamplingRecordsByQrCodeId(id);

    return requireRecords(records, 'No sampling records found for this QR code');
};

export const updateSamplingService = async (id, body) => {
    const samplingId = validateId(id);

    return await db.transaction(async (trx) => {
        const existingRecord = await getSamplingRecordById(samplingId, trx);

        if (!existingRecord) {
            throw createError('Sampling record not found', 404);
        }

        const samplingData = normalizeSamplingPayload({
            ...existingRecord,
            ...body,
        });

        validateSamplingPayload(samplingData);
        await validateSamplingCanBeSaved(samplingData, trx);

        return await updateSamplingRecord(samplingId, samplingData, trx);
    });
};

export const deleteSamplingService = async (id) => {
    const samplingId = validateId(id);

    const existingRecord = await getSamplingRecordById(samplingId);

    if (!existingRecord) {
        throw createError('Sampling record not found', 404);
    }

    await deleteSamplingRecord(samplingId);

    return { message: 'Sampling record deleted successfully' };
};
