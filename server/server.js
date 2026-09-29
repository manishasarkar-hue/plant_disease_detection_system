import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import chatRouter from './routes/chat.js';

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

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'PlantGuard Assistant Backend',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      chat: 'POST /api/chat',
      health: 'GET /api/chat/health',
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
