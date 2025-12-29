import db from '../../config/db.js';

const TABLE = "states";

export function createState(payload) {
    return db(TABLE).insert(payload).returning("*");
}

export function getStateById(id) {
    return db(TABLE).where({ id }).first();
}

export function getAllStates() {
    return db(TABLE).select("*");
}

export function updateState(id, updates) {
    return db(TABLE).where({ id }).update(updates).returning("*");
}

export function deleteState(id) {
    return db(TABLE).where({ id }).del();
}
