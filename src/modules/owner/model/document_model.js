import db from "../../../config/db.js";

const DocumentModel = {
    async create(data, trx = null) {
        let query = db('documents').insert(data).returning('*');
        if (trx) query = query.transacting(trx);
        return query;
    },
    async findAll() {
        return db('documents').select('*');
    },
    async findById(id) {
        return db('documents').where({ id }).first();
    },
    async update(id, data) {
        return db('documents').where({ id }).update(data).returning('*');
    },
    async remove(id) {
        return db('documents').where({ id }).del();
    },
};

export default DocumentModel;
