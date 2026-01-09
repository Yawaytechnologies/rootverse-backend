import express, { Router } from "express"
import { reserveQrsController, reserveBulkController, listQrsController, listFilledQrsController, getFilledQrByCodeController, updateQrImagesController } from "./qrs.controller.js"
import { upload } from "../../shared/middlewares/upload.js"

const router = express.Router()

router.post('/reserve', reserveQrsController);
router.post('/bulk-reserve', reserveBulkController);
router.get('/qrs', listQrsController );
router.get('/qrs/filled', listFilledQrsController );
router.get('/filled/:code', getFilledQrByCodeController );
router.put('/qrs/:code', upload.array('images', 3), updateQrImagesController);

export default router
