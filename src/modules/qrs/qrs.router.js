import express, { Router } from "express"
import { reserveQrsController, reserveBulkController, listQrsController } from "./qrs.controller.js"

const router = express.Router()

router.post('/reserve', reserveQrsController);
router.post('/bulk-reserve', reserveBulkController);
router.get('/qrs', listQrsController );

export default router