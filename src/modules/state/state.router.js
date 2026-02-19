import express from 'express';
import { createStateController, listStatesController, getStateController, updateStateController, deleteStateController } from './state.controller.js';

const router = express.Router();

router.post('/states', createStateController);
router.get('/states', listStatesController);
router.get('/states/:id', getStateController);
router.put('/states/:id', updateStateController);
router.delete('/states/:id', deleteStateController);

export default router;