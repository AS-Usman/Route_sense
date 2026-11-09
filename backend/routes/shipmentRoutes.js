import express from 'express';
import { 
  getShipments, 
  getShipmentById, 
  createShipment, 
  deleteShipment 
} from '../controllers/shipmentController.js';
import { validateShipmentPayload } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/shipments', getShipments);
router.get('/shipments/:id', getShipmentById);
router.post('/shipments', validateShipmentPayload, createShipment);
router.delete('/shipments/:id', deleteShipment);

export default router;
