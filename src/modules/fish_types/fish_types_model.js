import db from "../../config/db.js";

const TABLE = "fish-types";

export function createFishTypes(payload){
    return db(TABLE).insert(payload).returning('*')
}

export function getallfishTypes(){
    return db.transaction(async (trx) => {
        return trx(TABLE).select('*')
    });
}

export function getbyfishTypesId(id){
    return db(TABLE).where({ id }).first();
}

export function updateFishTypesById(id, updates){
    return db(TABLE).where({ id }).update(updates).returning('*')
}

export function deleteFishTypesById(id){
    return db(TABLE).where("id", id).del()
}