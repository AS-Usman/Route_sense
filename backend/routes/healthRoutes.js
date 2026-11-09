import express from 'express';
import { getHealthStatus, getDashboardStats } from '../controllers/statsController.js';

const router = express.Router();

router.get('/health', getHealthStatus);
router.get('/dashboard/stats', getDashboardStats);

export default router;
