import express from 'express';
import { predictRisk } from '../controllers/riskController.js';
import { validateShipmentPayload } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/risk/predict', validateShipmentPayload, predictRisk);

export default router;
