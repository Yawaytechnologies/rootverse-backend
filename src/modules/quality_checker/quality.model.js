import db from "../../config/db.js";

const TABLE = "quality_checker";

export function createQualityChecker(payload){
    return db(TABLE).insert(payload).returning('*')
}

export function getAllQualityCheckers(){
    return db.transaction(async (trx) => {
        return trx(TABLE).select('*')
    });
}

export function getQualityCheckerByCode(checker_code){
    return db(TABLE).where({ checker_code }).first();
}

export function updateQualityCheckerById(id, updates){
    return db(TABLE).where({id}).update(updates).returning('*')
}

export function deleteQualityCheckerById(id){
    return db(TABLE).where("id", id).del()
}

