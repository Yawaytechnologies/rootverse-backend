import db from '../../../shared/lib/db.js';

const TABLE_NAME = 'pond_stocking';
const CYCLE_TABLE = 'culture_cycles';
const QR_TABLE = 'aquaculture_qrs';


export const createPondStocking = async (data) => {
    try {
        const [row] = await db(TABLE_NAME)
            .insert(data)
            .returning('*'); // return full record

        return row;
    } catch (error) {
        console.error('Error creating pond stocking record:', error);
        throw error;
    }
};

export const getPondStockingById = async (id) => {
    try {
        const record = await db(TABLE_NAME)
            .where({ id })
            .first();
        return record;
    } catch (error) {
        console.error('Error fetching pond stocking record by ID:', error);
        throw error;
    }
};

export const getPondStockingByCultureCycleId = async (culturecycle_id) => {
    try {
        const record = await db(TABLE_NAME) 
            .where({ culturecycle_id })
            .first();
        return record;
    } catch (error) {
        console.error('Error fetching pond stocking record by culture cycle ID:', error);
        throw error;
    }
};

export const getPondStockingByQrCodeId = async (qr_code_id) => {
    try {
        const record = await db(TABLE_NAME)
            .where({ qr_code_id })
            .first();
        return record;
    } catch (error) {
        console.error('Error fetching pond stocking record by QR code ID:', error);
        throw error;
    }
};

export const updatePondStocking = async (id, data) => {
    try {
        await db(TABLE_NAME)
            .where({ id })
            .update(data);
    } catch (error) {
        console.error('Error updating pond stocking record:', error);
        throw error;
    }
};

export const deletePondStocking = async (id) => {
    try {
        await db(TABLE_NAME)
            .where({ id })
            .del();
    } catch (error) {
        console.error('Error deleting pond stocking record:', error);
        throw error;
    }
};

export const getAllPondStocking = async () => {
    try {
        const records = await db(TABLE_NAME).select('*');
        return records;
    } catch (error) {
        console.error('Error fetching all pond stocking records:', error);
        throw error;
    }
};