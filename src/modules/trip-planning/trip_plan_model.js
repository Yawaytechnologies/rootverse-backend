import db from "../../config/db.js";

const TABLE = "trip_plans"

export function createTrips(payload) {
    return db(TABLE).insert(payload).returning('*')

}

export function getAllTrip(){
    return db(TABLE).select('*')

}

export function getTriPlanById(id){
   return db.transaction(async (trx) => {
       return trx(TABLE).where({id}).first();
   });
}
export function updateTrip(id, updates){
    return db(TABLE).where({id}).update(updates).returning('*')

}

export function deleteTrip(id){
    return db(TABLE).where({id}).del()
}

export async function approveTripPlan(id) {
  return db("trip_plans")
    .where({ id })
    .update({ approval_status: "approved", updated_at: db.fn.now() })
    .returning("*");
}


export async function getbyownerCode(owner_code){
    return db('trip_plans')
    .where("owner_code", owner_code)
}

export async function getbyownerCodeAndStatus(owner_code, approval_status){
    return db('trip_plans')
    .where("owner_code", owner_code)
    .andWhere("approval_status", approval_status)
}


