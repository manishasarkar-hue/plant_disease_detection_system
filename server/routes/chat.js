import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generatePlantCareReply } from '../services/gemini.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

/**
 * Health check endpoint for chat service
 * GET /api/chat/health
 */
router.get('/health', (req, res) => {
  dotenv.config({ path: path.join(__dirname, '..', '.env'), override: true });

  const isKeyConfigured = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== 'your_api_key_here' &&
    process.env.GEMINI_API_KEY !== 'your_gemini_api_key'
  );

  res.json({
    status: 'ok',
    service: 'PlantGuard Assistant API',
    apiKeyConfigured: isKeyConfigured,
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  });
});


/**
 * Main chat endpoint
 * POST /api/chat
 * Expected body: { message: string, history?: Array }
 */
router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body || {};

    // Validate message
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        error: 'Message is required and must not be empty.',
      });
    }

    const trimmedMessage = message.trim();

    // Generate reply using Gemini with system instructions & conversation history
    const reply = await generatePlantCareReply(trimmedMessage, history);

    return res.json({
      reply,
    });
  } catch (error) {
    console.error('[Chat API Error]:', error.message || error);

    // Differentiate error types for better client-side handling
    if (error.code === 'CONFIG_MISSING' || error.status === 503) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in server/.env',
        code: 'API_KEY_NOT_CONFIGURED',
      });
    }

    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({
        error: 'PlantGuard Assistant is receiving high traffic right now. Please wait a few seconds and try again.',
        code: 'RATE_LIMIT',
      });
    }

    if (error.code === 'TIMEOUT' || error.status === 504) {
      return res.status(504).json({
        error: 'Response took too long. Please check your connection and try again.',
        code: 'TIMEOUT',
      });
    }

    // Default generic error - never expose internal keys or raw traces
    return res.status(500).json({
      error: 'Something went wrong while connecting to PlantGuard Assistant.',
      code: 'SERVER_ERROR',
    });
  }
});

export default router;
