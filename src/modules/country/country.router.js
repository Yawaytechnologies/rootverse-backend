import express from "express";
import { createCountryController, getAllCountriesController, getCountryByIdController, updateCountryController, deleteCountryController } from "./country.controller.js";

const router = express.Router();

router.post('/', createCountryController);
router.get('/', getAllCountriesController);
router.get('/:id', getCountryByIdController);
router.put('/:id', updateCountryController);
router.delete('/:id', deleteCountryController);


export default router;