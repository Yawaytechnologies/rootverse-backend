import express from "express";
import { createQualityCheckerController, getAllQualityCheckersController, getQualityCheckerByCodeController, updateQualityCheckerByIdController, deleteQualityCheckerByIdController} from "./quality.controller.js";

const router = express.Router();

router.post('/', createQualityCheckerController);
router.get('/', getAllQualityCheckersController);
router.get('/:checker_code', getQualityCheckerByCodeController);
router.put('/:id', updateQualityCheckerByIdController);
router.delete('/:id', deleteQualityCheckerByIdController);

export default router;
