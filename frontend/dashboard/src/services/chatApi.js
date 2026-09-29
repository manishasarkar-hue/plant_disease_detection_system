/**
 * Service for communicating with the PlantGuard Assistant Chat backend.
 * Architecture allows easy extension when the secondary Disease-Treatment ML Chatbot is added.
 */

const API_BASE = '/api';

/**
 * Send a chat message with previous conversation history to Gemini backend.
 * @param {string} message - Current user prompt
 * @param {Array} history - Previous messages array [{ role: 'user'|'assistant', content: string }]
 * @returns {Promise<{ reply: string }>}
 */
export async function sendChatMessage(message, history = []) {
  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new Error('Message cannot be empty.');
  }

  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message.trim(),
        history: history.map((h) => ({
          role: h.role === 'user' ? 'user' : 'model',
          content: h.content || h.text || '',
        })),
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const err = new Error(
        data?.error || 'Something went wrong while connecting to PlantGuard Assistant.'
      );
      err.status = response.status;
      err.code = data?.code || 'REQUEST_FAILED';
      throw err;
    }

    if (!data || typeof data.reply !== 'string') {
      throw new Error('Invalid response received from server.');
    }

    return { reply: data.reply };
  } catch (error) {
    // If it's a network disconnection
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const netErr = new Error(
        'Unable to reach PlantGuard backend server. Please verify the server is running on port 5000.'
      );
      netErr.code = 'NETWORK_ERROR';
      throw netErr;
    }
    throw error;
  }
}

/**
 * Health check to verify Gemini backend status and API key configuration
 * @returns {Promise<{ status: string, apiKeyConfigured: boolean, model: string }>}
 */
export async function checkChatHealth() {
  try {
    const response = await fetch(`${API_BASE}/chat/health`);
    if (!response.ok) {
      return { status: 'down', apiKeyConfigured: false, model: 'unknown' };
    }
    return await response.json();
  } catch {
    return { status: 'down', apiKeyConfigured: false, model: 'unknown' };
  }
}
