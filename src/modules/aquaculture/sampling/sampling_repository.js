import db from '../../../shared/lib/db.js';

const SampleTable = 'sampling';

const getExecutor = (trx) => trx || db;

export const createSamplingRecord = async (data, trx) => {
    try {
        const [row] = await getExecutor(trx)(SampleTable)
            .insert(data)
            .returning('*'); // return full record
        return row;
    }
    catch (error) {
        console.error('Error creating sampling record:', error);
        throw error;
    }
};

export const getAllSamplingRecords = async (trx) => {
    return getExecutor(trx)(SampleTable)
        .select('*')
        .orderBy('created_at', 'desc');
};

export const getSamplingRecordById = async (id, trx) => {
    return getExecutor(trx)(SampleTable)
        .where({ id })
        .first();
};

export const getSamplingRecordsByCultureCycleId = async (cultureId, trx) => {
    return getExecutor(trx)(SampleTable)
        .where({ culture_id: cultureId })
        .select('*')
        .orderBy('created_at', 'desc');
};

export const getSamplingRecordsByFarmId = async (farmId, trx) => {
    return getExecutor(trx)(SampleTable)
        .where({ farm_id: farmId })
        .select('*')
        .orderBy('created_at', 'desc');
};

export const getSamplingRecordsByPondId = async (pondId, trx) => {
    return getExecutor(trx)(SampleTable)
        .where({ pond_id: pondId })
        .select('*')
        .orderBy('created_at', 'desc');
};

export const getSamplingRecordsByQrCodeId = async (qrCodeId, trx) => {
    return getExecutor(trx)(SampleTable)
        .where({ qr_code_id: qrCodeId })
        .select('*')
        .orderBy('created_at', 'desc');
};

export const updateSamplingRecord = async (id, data, trx) => {
    const [row] = await getExecutor(trx)(SampleTable)
        .where({ id })
        .update({
            ...data,
            updated_at: new Date(),
        })
        .returning('*');

    return row;
};

export const deleteSamplingRecord = async (id, trx) => {
    return getExecutor(trx)(SampleTable)
        .where({ id })
        .del();
};

export const getSamplingPrerequisites = async ({ culture_id, pond_id, qr_code_id }, trx) => {
    return getExecutor(trx)('culture_cycles as cc')
        .innerJoin('ponds as p', 'cc.pond_id', 'p.id')
        .innerJoin('aquaculture_qrs as aq', function joinQr() {
            this.on('aq.id', '=', db.raw('?', [qr_code_id]));
        })
        .select(
            'cc.id as culture_id',
            'cc.user_id as culture_user_id',
            'cc.farm_id as culture_farm_id',
            'cc.pond_id as culture_pond_id',
            'cc.verification_status as culture_verification_status',
            'p.pond_status',
            'p.verification_status as pond_verification_status',
            'aq.id as qr_code_id',
            'aq.type as qr_type',
            'aq.farm_id as qr_farm_id',
            'aq.pond_id as qr_pond_id',
            'aq.is_active as qr_is_active'
        )
        .where('cc.id', culture_id)
        .where('p.id', pond_id)
        .first();
};
