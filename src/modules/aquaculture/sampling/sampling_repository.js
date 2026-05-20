import db from '../../../shared/lib/db.js';

const SampleTable = 'sampling';

const getExecutor = (trx) => trx || db;

const withSamplingDetails = (query) => {
    return query
        .leftJoin('rootverse_users as ru', 'sampling.user_id', 'ru.id')
        .leftJoin('farms as f', 'sampling.farm_id', 'f.id')
        .leftJoin('ponds as p', 'sampling.pond_id', 'p.id')
        .leftJoin('culture_cycles as cc', 'sampling.culture_id', 'cc.id')
        .leftJoin('aquaculture_qrs as aq', 'sampling.qr_code_id', 'aq.id')
        .select(
            'sampling.*',
            'ru.username',
            'ru.owner_id',
            'f.farm_id as farm_code',
            'f.farm_name',
            'p.pond_id as pond_code',
            'p.pond_name',
            'cc.culture_code',
            'aq.qrs_code as qr_code'
        );
};

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
    return withSamplingDetails(getExecutor(trx)(SampleTable))
        .orderBy('sampling.created_at', 'desc');
};

export const getSamplingRecordById = async (id, trx) => {
    return withSamplingDetails(getExecutor(trx)(SampleTable))
        .where('sampling.id', id)
        .first();
};

export const getSamplingRecordsByCultureCycleId = async (cultureId, trx) => {
    return withSamplingDetails(getExecutor(trx)(SampleTable))
        .where('sampling.culture_id', cultureId)
        .orderBy('sampling.created_at', 'desc');
};

export const getSamplingRecordsByFarmId = async (farmId, trx) => {
    return withSamplingDetails(getExecutor(trx)(SampleTable))
        .where('sampling.farm_id', farmId)
        .orderBy('sampling.created_at', 'desc');
};

export const getSamplingRecordsByPondId = async (pondId, trx) => {
    return withSamplingDetails(getExecutor(trx)(SampleTable))
        .where('sampling.pond_id', pondId)
        .orderBy('sampling.created_at', 'desc');
};

export const getSamplingRecordsByQrCodeId = async (qrCodeId, trx) => {
    return withSamplingDetails(getExecutor(trx)(SampleTable))
        .where('sampling.qr_code_id', qrCodeId)
        .orderBy('sampling.created_at', 'desc');
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
