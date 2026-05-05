import {createPondStocking, getPondStockingById, updatePondStocking, deletePondStocking, getAllPondStocking,getPondStockingByCultureCycleId, getPondStockingByQrCodeId} from './pondStocking_repository.js';
import db from '../../../shared/lib/db.js';


const createError = (msg, code = 400) => {
    const err = new Error(msg);
    err.statusCode = code;
    return err;
};

export const createPondStockingService = async (data) => {
    try {
        const {
            culture_cycle_id,
            qr_code_id,
            species,
            hatchery,
            hatchery_batch_number,
            pl_age_at_dispatch,
            nursery_days,
            stocking_date,
            pl_age_at_stocking,
            total_pl_stocked
        } = data;

        // 🔴 Basic validation
        if (!culture_cycle_id) throw createError("culture_cycle_id is required");
        if (!qr_code_id) throw createError("qr_code_id is required");
        if (!species) throw createError("species is required");
        if (!stocking_date) throw createError("stocking_date is required");

        // 🔴 1. Check culture cycle
        const cycle = await db("culture_cycles")
            .where({ id: culture_cycle_id })
            .first();

        if (!cycle) throw createError("Culture cycle not found", 404);

        // 🔴 VERIFIED check
        if (cycle.verification_status !== "ACTIVE") {
            throw createError("Culture cycle not verified");
        }

        // 🔴 Date check
        const today = new Date();
        if (
            (cycle.start_date && new Date(cycle.start_date) > today) ||
            (cycle.end_date && new Date(cycle.end_date) < today)
        ) {
            throw createError("Culture cycle not active");
        }

        // 🔴 2. Prevent duplicate
        const existing = await db("pond_stocking")
            .where({ culturecycle_id: culture_cycle_id })
            .first();

        if (existing) {
            throw createError("Stocking already exists for this cycle");
        }

        // 🔴 3. Check QR
        const qr = await db("aquaculture_qrs")
            .where({ id: qr_code_id })
            .first();

        if (!qr) throw createError("QR not found", 404);

        if (!qr.is_active) {
        throw createError("QR not activated");
        }

        // 🔴 4. Insert
        const payload = {
            culturecycle_id: culture_cycle_id,
            qr_code_id,
            species,
            hatchery,
            hatchery_batch_number,
            PL_age_at_dispatch: pl_age_at_dispatch,
            nursery_days,
            stocking_date,
            PL_age_at_stocked: pl_age_at_stocking,
            total_PL_stocked: total_pl_stocked,
            created_at: new Date(),
            updated_at: new Date()
        };

        const newRecord = await createPondStocking(payload);

        return newRecord;

    } catch (error) {
        console.error('Error creating pond stocking record:', error);
        throw error;
    }
};

export const getPondStockingByIdService = async (id) => {
    try {
        const record = await getPondStockingById(id);
        return record;
    } catch (error) {
        console.error('Error fetching pond stocking record by ID:', error);
        throw error;
    }
};

export const getPondStockingByCultureCycleIdService = async (culturecycle_id) => {
    try {
        const record = await getPondStockingByCultureCycleId(culturecycle_id);
        return record;
    } catch (error) {
        console.error('Error fetching pond stocking record by culture cycle ID:', error);
        throw error;
    }
};

export const getPondStockingByQrCodeIdService = async (qr_code_id) => {
    try {
        const record = await getPondStockingByQrCodeId(qr_code_id);
        return record;
    } catch (error) {
        console.error('Error fetching pond stocking record by QR code ID:', error);
        throw error;
    }
};

export const updatePondStockingService = async (id, data) => {
    try {
        await updatePondStocking(id, data);
        return await getPondStockingById(id);
    } catch (error) {
        console.error('Error updating pond stocking record:', error);
        throw error;
    }

};

export const deletePondStockingService = async (id) => {
    try {
        await deletePondStocking(id);
        return { message: 'Pond stocking record deleted successfully' };
    } catch (error) {
        console.error('Error deleting pond stocking record:', error);
        throw error;
    }
};

export const getAllPondStockingService = async () => {
    try {
        const records = await getAllPondStocking();
        return records;
    } catch (error) {
        console.error('Error fetching all pond stocking records:', error);
        throw error;
    }
};