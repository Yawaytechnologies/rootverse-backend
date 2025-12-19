import db from '../../../config/db.js';

const OwnerModel = {
  async create(data, trx = null) {
    let query = db('owners').insert(data).returning('*');
    if (trx) query = query.transacting(trx);
    return query;
  },

  async findAll() {
    return db('owners').select('*');
  },

  async findById(id) {
    return db('owners').where({ id }).first();
  },

  async update(id, data) {
    return db('owners').where({ id }).update(data).returning('*');
  },

  async remove(id) {
    return db('owners').where({ id }).del();
  }
};

export default OwnerModel;





