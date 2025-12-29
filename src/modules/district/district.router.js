import express from 'express';
import { createDistrictController, listDistrictsController, getDistrictController, updateDistrictController, deleteDistrictController, listDistrictsByStateController } from './district.controller.js';

export const router = express.Router();

router.post('/districts', createDistrictController);
router.get('/districts', listDistrictsController);
router.get('/districts/:id', getDistrictController);
router.put('/districts/:id', updateDistrictController);
router.delete('/districts/:id', deleteDistrictController);
router.get('/states/:state_id/districts', listDistrictsByStateController);

export default router;