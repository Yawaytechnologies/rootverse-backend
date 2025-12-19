import db from "../../../config/db.js";

const ContactModel = {
    async create(data, trx = null) {
        let query = db('contacts').insert(data).returning('*');
        if (trx) query = query.transacting(trx);
        return query;
    },
    async findAll() {
        return db('contacts').select('*');
    },
    async findById(id) {
        return db('contacts').where({ id }).first();
    },
    async update(id, data) {
        return db('contacts').where({ id }).update(data).returning('*');
    },
    async remove(id) {
        return db('contacts').where({ id }).del();
    },
};

export default ContactModel;
