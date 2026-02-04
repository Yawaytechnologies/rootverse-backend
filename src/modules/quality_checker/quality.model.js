import db from "../../config/db.js";

const TABLE = "quality_checker";
const STATES = "states";
const DISTRICTS = "districts";
const LOCATIONS = "locations";

/** ✅ Helper: returns quality checker with state and district names */
export function getQualityCheckerPopulated(id) {
    return db.transaction(async (trx) => {
        return trx(`${TABLE} as qc`)
            .join(`${STATES} as s`, "qc.state_id", "s.id")
            .join(`${DISTRICTS} as d`, "qc.district_id", "d.id")
            .join(`${LOCATIONS} as l`, "qc.location_id", "l.id")
            .select(
                "qc.id",
                "qc.checker_name",
                "qc.checker_email",
                "qc.checker_phone",
                "qc.state_id",
                "s.name as state_name",
                "qc.district_id",
                "d.name as district_name",
                "qc.location_id",
                "l.name as location_name",
                "qc.checker_code",
                "qc.is_active",
                "qc.created_at",
                "qc.updated_at"
            )
            .where("qc.id", id)
            .first();
    });
}

export async function createQualityChecker(payload){
    const [row] = await db(TABLE).insert(payload).returning('id');
    return getQualityCheckerPopulated(row.id);
}

export function getAllQualityCheckers(){
    return db(`${TABLE} as qc`)
        .join(`${STATES} as s`, "qc.state_id", "s.id")
        .join(`${DISTRICTS} as d`, "qc.district_id", "d.id")
        .join(`${LOCATIONS} as l`, "qc.location_id", "l.id")
        .select(
            "qc.id",
            "qc.checker_name",
            "qc.checker_email",
            "qc.checker_phone",
            "qc.state_id",
            "s.name as state_name",
            "qc.district_id",
            "d.name as district_name",
            "qc.location_id",
            "l.name as location_name",
            "qc.checker_code",
            "qc.is_active",
            "qc.created_at",
            "qc.updated_at"
        )
        .orderBy("qc.created_at", "desc");
}

export function getQualityCheckerByCode(checker_code){
    return db(`${TABLE} as qc`)
        .join(`${STATES} as s`, "qc.state_id", "s.id")
        .join(`${DISTRICTS} as d`, "qc.district_id", "d.id")
        .select(
            "qc.id",
            "qc.checker_name",
            "qc.checker_email",
            "qc.checker_phone",
            "qc.state_id",
            "s.name as state_name",
            "qc.district_id",
            "d.name as district_name",
            "qc.location_id",
            "l.name as location_name",
            "qc.checker_code",
            "qc.is_active",
            "qc.created_at",
            "qc.updated_at"
        )
        .where("qc.checker_code", checker_code)
        .first();
}

export async function updateQualityCheckerById(id, updates){
    const [row] = await db(TABLE).where({id}).update(updates).returning('id');
    return getQualityCheckerPopulated(row.id);
}

export function deleteQualityCheckerById(id){
    return db(TABLE).where("id", id).del()
}

