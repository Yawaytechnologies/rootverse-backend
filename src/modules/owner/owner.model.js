import db from '../../config/db.js';

const TABLE = "rootverse_users";

export function createOwner(payload) {
    return db(TABLE).insert(payload).returning("*");
}

export function getOwnerById(id) {
    return db(`${TABLE} as ru`)
        .leftJoin("states as s", "ru.state_id", "s.id")
        .leftJoin("districts as d", "ru.district_id", "d.id")
        .select(
            "ru.*",
            "s.name as state_name",
            "d.name as district_name"
        )
        .where("ru.id", id)
        .first();
}

export function getAllOwners() {
    return db(`${TABLE} as ru`)
        .leftJoin("states as s", "ru.state_id", "s.id")
        .leftJoin("districts as d", "ru.district_id", "d.id")
        .select(
            "ru.*",
            "s.name as state_name",
            "d.name as district_name"
        );
}

export function getByRootverseType(rootverse_type) {
    return db(`${TABLE} as ru`)
        .leftJoin("states as s", "ru.state_id", "s.id")
        .leftJoin("districts as d", "ru.district_id", "d.id")
        .select(
            "ru.*",
            "s.name as state_name",
            "d.name as district_name"
        )
        .where("ru.rootverse_type", rootverse_type);
}

export function updateOwner(id, updates) {
    return db(TABLE).where({ id }).update(updates).returning("*");
}

export function deleteOwner(id) {
    return db(TABLE).where({ id }).del();
}

export function verifyOwner(id) {
    return db(TABLE)
        .where({ id })
        .update({ verification_status: "VERIFIED", updated_at: db.fn.now() })
        .returning("*");
}

