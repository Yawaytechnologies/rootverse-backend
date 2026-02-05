import db from "../../config/db.js";

const TABLE = "trip_plans"
const LOCATIONS = "locations"

export function createTrips(payload) {
    return db(TABLE).insert(payload).returning('*')

}

export function getAllTrip(){
    return db(`${TABLE} as tp`)
        .join(`${LOCATIONS} as l`, "tp.location_id", "l.id")
        .select(
            "tp.id",
            "tp.trip_id",
            "tp.owner_code",
            "tp.diesel",
            "tp.ice",
            "tp.qr_count",
            "tp.total",
            "tp.approval_status",
            "tp.created_at",
            "tp.updated_at",
            "l.name as location_name"
        );
}

export function getTriPlanById(id){
   return db(`${TABLE} as tp`)
   .join(`${LOCATIONS} as l`, "tp.location_id", "l.id")
   .select(
       "tp.id",
       "tp.trip_id",
        "tp.owner_code",
        "tp.approval_status",
        "tp.diesel",
        "tp.ice",
        "tp.qr_count",
        "tp.total",
        "tp.created_at",
        "tp.updated_at",
        "l.name as location_name"
    )
    .where("tp.id", id)
    .first();
    
}
export function updateTrip(id, updates){
    return db(TABLE).where({id}).update(updates).returning('*')

}

export function deleteTrip(id){
    return db(TABLE).where({id}).del()
}

export async function approveTripPlan(id) {
  return db(`${TABLE} as tp`)
  .join(`${LOCATIONS} as l`, "tp.location_id", "l.id")
  .select(
      "tp.id",
      "tp.trip_id", 
        "tp.owner_code",
        "tp.approval_status",
        "tp.diesel",
        "tp.ice",
        "tp.qr_count",
        "tp.total",
        "tp.created_at",
        "tp.updated_at",
        "l.name as location_name"
    )

    .where({ id })
    .update({ approval_status: "approved", updated_at: db.fn.now() })
    .returning("*");
}


export async function getbyownerCode(owner_code){
    return db(`${TABLE} as tp`)
    .join(`${LOCATIONS} as l`, "tp.location_id", "l.id")
    .select(
        "tp.id",
        "tp.trip_name",
        "tp.owner_code",
        "tp.approval_status",
        "tp.created_at",
        "tp.updated_at",
        "l.name as location_name"
    )
    .where("owner_code", owner_code)
}

export async function getbyownerCodeAndStatus(owner_code, approval_status){
    return db(`${TABLE} as tp`)
    .join(`${LOCATIONS} as l`, "tp.location_id", "l.id")
    .select(
        "tp.id",
        "tp.trip_name",
        "tp.owner_code",
        "tp.approval_status",
        "tp.created_at",
        "tp.updated_at",
        "l.name as location_name"
    )
    .where("owner_code", owner_code)
    .andWhere("approval_status", approval_status)
}


