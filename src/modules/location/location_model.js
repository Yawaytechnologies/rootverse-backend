import db from '../../config/db.js';

const Locaton = 'locations';
const Districts = 'districts';
const States = 'states';

export async function creationLocation(payload) {
    const [row] = await db(Locaton).insert(payload).returning(['id']);
    const insertedId = row?.id; 
    return getLocationByIdPopulated(insertedId);
}

export function getLocationByIdPopulated(id) {
    return db.transaction(async (trx) => {
        return trx(`${Locaton} as l`)
            .join(`${Districts} as d`, "l.district_id", "d.id")
            .join(`${States} as s`, "d.state_id", "s.id")
            .select(    
                "l.id",
                "l.name",
                "l.location_code",
                "l.district_id",
                "d.name as district_name",
                "s.id as state_id",
                "s.name as state_name",
                "l.created_at",
                "l.updated_at"
            )
            .where("l.id", id)
            .first();
    }
    );
}


export function getLocationByDistrictId(district_id) {
    return db.transaction(async (trx) => {
        return trx(`${Locaton} as l`)
            .join(`${Districts} as d`, "l.district_id", "d.id")
            .join(`${States} as s`, "d.state_id", "s.id")
            .select(    
                "l.id",
                "l.name",
                "l.location_code",
                "l.district_id",
                "d.name as district_name",
                "s.id as state_id",
                "s.name as state_name",
                "l.created_at",
                "l.updated_at"
            )
            .where("l.district_id", district_id)
            .orderBy("l.name", "asc");
    });

}

export function getallLocations(){
    return db.transaction(async (trx) => {
        return trx(Locaton).select('*')
    });
}

export function updateLocationById(id, updates){
    return db(Locaton).where({id}).update(updates).returning('*')
}

export function deleteLocationById(id){
    return db(Locaton).where("id", id).del()
}
