import { createCountryService, getAllCountriesService, getCountryByIdService, updateCountryService, deleteCountryService } from "./country.service.js";


export async function createCountryController(req, res) {
  try {
    const country = await createCountryService(req.body);
    res.status(201).json(country);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAllCountriesController(req, res) {
  try {
    const countries = await getAllCountriesService();
    res.json(countries);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getCountryByIdController(req, res) {
  try {
    const country = await getCountryByIdService(req.params.id);
    if (!country) return res.status(404).json({ error: "Not found" });
    res.json(country);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateCountryController(req, res) {
  try {
    const country = await updateCountryService(req.params.id, req.body);
    res.json(country);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteCountryController(req, res) {
  try {
    await deleteCountryService(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}