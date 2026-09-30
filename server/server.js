import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import chatRouter from './routes/chat.js';
import predictRouter from './routes/predict.js';

// Load .env from server directory first, fallback to workspace root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/chat', chatRouter);
app.use('/api/predict', predictRouter);

// Model health and info shortcuts
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

app.get('/api/health', async (req, res) => {
  try {
    const mlHealth = await fetch(`${ML_SERVICE_URL}/api/health`);
    if (mlHealth.ok) {
      const data = await mlHealth.json();
      return res.json(data);
    }
    return res.status(503).json({ status: 'degraded', modelLoaded: false });
  } catch {
    return res.status(503).json({ status: 'offline', modelLoaded: false, message: 'ML Service unreachable' });
  }
});

app.get('/api/model-info', async (req, res) => {
  try {
    const infoRes = await fetch(`${ML_SERVICE_URL}/api/model-info`);
    if (infoRes.ok) {
      const data = await infoRes.json();
      return res.json(data);
    }
    return res.status(503).json({ error: 'ML Service unavailable' });
  } catch {
    return res.status(503).json({ error: 'ML Service unreachable' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'PlantGuard Assistant Backend',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      chat: 'POST /api/chat',
      predict: 'POST /api/predict',
      health: 'GET /api/health',
      modelInfo: 'GET /api/model-info',
    },
  });
});

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🌿 PlantGuard Assistant backend listening on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/chat/health`);
  console.log(`   Chat endpoint: http://localhost:${PORT}/api/chat`);
});
