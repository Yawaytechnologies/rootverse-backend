import express from 'express'
import { createFishTypesController, getallfishTypesController, getbyfishTypesIdController, updateFishTypesByIdController, deleteFishTypesByIdController } from "./fish_types_controller.js";


const router = express.Router();

router.post('/fish-types', createFishTypesController);
router.get('/fish-types', getallfishTypesController);
router.get('/fish-types/:id', getbyfishTypesIdController);
router.put('/fish-types/:id', updateFishTypesByIdController);
router.delete('/fish-types/:id', deleteFishTypesByIdController);

export default router;