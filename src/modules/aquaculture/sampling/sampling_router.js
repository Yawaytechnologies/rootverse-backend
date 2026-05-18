import express from 'express';
import {
    createSamplingController,
    deleteSamplingController,
    getAllSamplingController,
    getSamplingByCultureCycleIdController,
    getSamplingByFarmIdController,
    getSamplingByIdController,
    getSamplingByPondIdController,
    getSamplingByQrCodeIdController,
    updateSamplingController,
} from './sampling_controller.js';

const router = express.Router();


router.post('/', createSamplingController);
router.get('/', getAllSamplingController);
router.get('/culture-cycle/:culture_cycle_id', getSamplingByCultureCycleIdController);
router.get('/farm/:farm_id', getSamplingByFarmIdController);
router.get('/pond/:pond_id', getSamplingByPondIdController);
router.get('/qrcode/:qr_code_id', getSamplingByQrCodeIdController);
router.get('/:id', getSamplingByIdController);
router.put('/:id', updateSamplingController);
router.delete('/:id', deleteSamplingController);

export default router;
