import { createCountry, getCountryByAll, getCountryById, updateCountry, deleteCountry } from "./country.model.js";

export async function createCountryService(payload) {
  return createCountry(payload);
}

export async function getAllCountriesService() {
  return getCountryByAll();
}

export async function getCountryByIdService(id) {
  return getCountryById(id);
}

export async function updateCountryService(id, updates) {
  return updateCountry(id, updates);
}

export async function deleteCountryService(id) {
  return deleteCountry(id);
}