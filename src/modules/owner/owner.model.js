import db from '../../config/db.js';

const TABLE = "rootverse_users";

export function createOwner(payload) {
    return db(TABLE).insert(payload).returning("*");
}

export function getOwnerById(id) {
    return db(TABLE).where({ id }).first();
}

export function getAllOwners() {
    return db(TABLE).select("*");
}

export function getByRootverseType(rootverse_type) {
    return db(TABLE).where({ rootverse_type });
}

export function updateOwner(id, updates) {
    return db(TABLE).where({ id }).update(updates).returning("*");
}

export function deleteOwner(id) {
    return db(TABLE).where({ id }).del();
}

