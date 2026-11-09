import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PORT } from './config/constants.js';
import { requestLogger } from './middleware/loggerMiddleware.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

import healthRoutes from './routes/healthRoutes.js';
import riskRoutes from './routes/riskRoutes.js';
import shipmentRoutes from './routes/shipmentRoutes.js';

dotenv.config();

/**
 * NOTE: This Node.js / Express server running on port 5001 is a secondary/practice implementation.
 * The primary canonical graded backend is the Flask REST API + MySQL server running in `backend/python-flask/app.py` on port 5000.
 */
const app = express();

// Global Core Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Mount API v1 Routes
app.use('/api/v1', healthRoutes);
app.use('/api/v1', riskRoutes);
app.use('/api/v1', shipmentRoutes);

// Root route welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to RouteSense REST API Engine',
    documentation: '/api/v1/health',
    status: 'online'
  });
});

// Global Error Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 RouteSense REST API Server running on port ${PORT}`);
  console.log(`🌐 Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`=================================================`);
});
