import {createPondStockingController, getPondStockingByIdController, updatePondStockingController, deletePondStockingController, getAllPondStockingController, getPondStockingByCultureCycleIdController, getPondStockingByQrCodeIdController} from './pondStocking_controller.js';
import express from 'express';

const router = express.Router();

router.post('/', createPondStockingController);
router.get('/', getAllPondStockingController);
router.get('/culturecycle/:culturecycle_id', getPondStockingByCultureCycleIdController);
router.get('/qrcode/:qr_code_id', getPondStockingByQrCodeIdController);
router.get('/:id', getPondStockingByIdController);
router.put('/:id', updatePondStockingController);
router.delete('/:id', deletePondStockingController);


export default router;


