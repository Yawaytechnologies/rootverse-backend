import db from "../../../config/db.js";

const KycModel = {
    async create(data, trx = null) {
        let query = db('kyc').insert(data).returning('*');
        if (trx) query = query.transacting(trx);
        return query;
    },
    async findAll() {
        return db('kyc').select('*');
    },
    async findById(id) {
        return db('kyc').where({ id }).first();
    },
    async update(id, data) {
        return db('kyc').where({ id }).update(data).returning('*');
    },
    async remove(id) {
        return db('kyc').where({ id }).del();
    },
};

export default KycModel;
