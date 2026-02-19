import db from "../../config/db.js";

const COUNTRY = "country";


export function createCountry(payload) {
  return db(COUNTRY).insert(payload).returning("*").then(rows => rows[0]);
}

export function getCountryByAll() {
  return db(COUNTRY).select("*").orderBy("name", "asc");
}

export function getCountryById(id) {
  return db(COUNTRY).select("*").where({ id }).first();
}

export function updateCountry(id, updates) {
  return db(COUNTRY)
    .where({ id })
    .update({
      ...updates,
      updated_at: db.fn.now(),
    })
    .returning("*")
    .then(rows => rows[0]);
}


export function deleteCountry(id) {
  return db(COUNTRY).where({ id }).del();
}