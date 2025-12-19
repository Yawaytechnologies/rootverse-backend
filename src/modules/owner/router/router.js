import OwnerController from '../controller/owner_controller.js';
import express from 'express';

const router = express.Router();

router.post('/owners', OwnerController.createOwner);


export default router;