import express from 'express'
import { createFishingMethodController, getAllFishingMethodsController, updateFishingMethodController, deleteFishingMethodController } from './fishing_methods_controller.js';
import { upload } from "../../shared/middlewares/upload.js";


const router = express.Router();

router.post('/', upload.single('image'), createFishingMethodController);
router.get('/', getAllFishingMethodsController);
router.put('/:id', upload.single('image'), updateFishingMethodController);
router.delete('/:id', deleteFishingMethodController);
export default router;

