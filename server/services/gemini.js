import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PLANT_GUARD_SYSTEM_INSTRUCTION } from '../prompts/plantGuardPrompt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getApiKey() {
  // Reload dotenv with override: true so any changes in .env are picked up immediately
  dotenv.config({ path: path.join(__dirname, '..', '.env'), override: true });
  return process.env.GEMINI_API_KEY?.trim();
}

/**
 * Format history for Google Generative AI
 * Gemini requires:
 * - Alternating roles starting with 'user'
 * - Role must be 'user' or 'model'
 * - Non-empty text in parts
 */
export function formatConversationHistory(history = []) {
  if (!Array.isArray(history) || history.length === 0) {
    return [];
  }

  const formatted = [];

  for (const item of history) {
    const rawRole = item.role || item.sender || 'user';
    const text = (item.content || item.text || '').trim();

    if (!text) continue;

    const role = (rawRole === 'user') ? 'user' : 'model';

    // Gemini requires the first message in history to be from 'user'
    if (formatted.length === 0 && role !== 'user') {
      continue;
    }

    // Merge consecutive messages from same role to ensure alternation
    if (formatted.length > 0 && formatted[formatted.length - 1].role === role) {
      formatted[formatted.length - 1].parts[0].text += `\n\n${text}`;
    } else {
      formatted.push({
        role,
        parts: [{ text }],
      });
    }
  }

  return formatted;
}

/**
 * Generate plant care reply using Gemini API
 * @param {string} message - Current user message
 * @param {Array} history - Previous messages array
 * @returns {Promise<string>}
 */
export async function generatePlantCareReply(message, history = []) {
  const apiKey = getApiKey();

  if (!apiKey || apiKey === 'your_api_key_here' || apiKey === 'your_gemini_api_key') {
    const error = new Error('Gemini API key is not configured. Please set a valid GEMINI_API_KEY in server/.env');
    error.status = 503;
    error.code = 'CONFIG_MISSING';
    throw error;
  }


  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: PLANT_GUARD_SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });

  const formattedHistory = formatConversationHistory(history);

  const chat = model.startChat({
    history: formattedHistory,
  });

  // Call Gemini with a 35 second timeout
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      const err = new Error('Request to Gemini API timed out after 35 seconds');
      err.status = 504;
      err.code = 'TIMEOUT';
      reject(err);
    }, 35000);
  });

  try {
    const result = await Promise.race([
      chat.sendMessage(message),
      timeoutPromise,
    ]);

    const response = await result.response;
    const replyText = response.text();

    if (!replyText || replyText.trim() === '') {
      throw new Error('Received empty response from Gemini model');
    }

    return replyText.trim();
  } catch (err) {
    // If modelName was gemini-2.5-flash and failed because model not found or unavailable,
    // retry with gemini-1.5-flash as fallback
    if (modelName !== 'gemini-1.5-flash' && (err.status === 404 || err.message?.includes('not found') || err.message?.includes('404'))) {
      try {
        const fallbackModel = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: PLANT_GUARD_SYSTEM_INSTRUCTION,
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        });
        const fallbackChat = fallbackModel.startChat({ history: formattedHistory });
        const fallbackResult = await fallbackChat.sendMessage(message);
        return (await fallbackResult.response).text().trim();
      } catch (fallbackErr) {
        throw fallbackErr;
      }
    }
    throw err;
  }
}
