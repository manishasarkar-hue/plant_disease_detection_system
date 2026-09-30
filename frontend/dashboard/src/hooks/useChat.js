import { useState, useCallback, useEffect, useRef } from 'react';
import { sendChatMessage, checkChatHealth } from '../services/chatApi';

const STORAGE_KEY = 'plantguard_chat_history_v1';
const ACTIVE_CONTEXT_KEY = 'plantGuardActiveScanContext';
const PENDING_TRIGGER_KEY = 'plantGuardPendingConsultation';

export function buildConsultationPrompt(context) {
  if (!context) return '';
  const isHealthy = context.isHealthy || context.severity === 'healthy';

  if (isHealthy) {
    return `I just analyzed my ${context.crop} plant foliage using the PlantGuard EfficientNetB0 AI Scanner, and it detected: Healthy & Disease-Free with ${context.confidence}% confidence.

Please provide professional guidance on:
1. Best routine cultural practices to keep this ${context.crop} crop thriving.
2. Key environmental warning signs or early stress symptoms to monitor.
3. Optimal organic fertilizer and watering schedule for this growth stage.`;
  }

  const symptomsList = (context.symptoms && context.symptoms.length > 0)
    ? context.symptoms.map(s => `• ${s}`).join('\n')
    : '• Foliar lesion/blight patterns identified by neural classifier.';

  return `I just scanned my ${context.crop} foliage using the PlantGuard EfficientNetB0 AI Scanner, which detected ${context.diseaseName} (${context.scientificName || 'Crop Pathogen'}) with ${context.confidence}% confidence (Severity: ${context.severity}).

Detected symptoms from the leaf scan:
${symptomsList}

Please act as my agricultural plant pathologist and provide:
1. An explanation of what ${context.diseaseName} is, how the pathogen behaves, and what happens if left untreated.
2. Immediate first-aid actions to halt disease progression today.
3. Detailed step-by-step Organic & Biological Remedies (dilution rates, preparation, and application frequency).
4. Recommended Chemical Fungicides / Pesticides with precise dosage per liter, safety precautions, and pre-harvest intervals.
5. Cultural & environmental management (watering adjustments, mulching, air circulation, crop rotation).`;
}

export function useChat() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
        }
      }
    } catch (e) {
      console.warn('Could not read cached chat messages:', e);
    }
    return [];
  });

  const [activeScanContext, setActiveScanContext] = useState(() => {
    try {
      const saved = sessionStorage.getItem(ACTIVE_CONTEXT_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Could not read cached scan context:', e);
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUserMessage, setLastUserMessage] = useState('');
  const [healthInfo, setHealthInfo] = useState({
    status: 'checking',
    apiKeyConfigured: true,
    model: 'gemini-2.5-flash',
  });

  // Keep ref of messages for callbacks
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // Persist to session storage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Could not cache chat messages:', e);
    }
  }, [messages]);

  // Check health on mount
  useEffect(() => {
    checkChatHealth().then((info) => {
      setHealthInfo(info);
    });
  }, []);

  /**
   * Send a message to PlantGuard Assistant
   */
  const sendMessage = useCallback(async (userText) => {
    const text = userText?.trim();
    if (!text || isLoading) return;

    setError(null);
    setLastUserMessage(text);

    const userMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    // Prepare history snapshot prior to adding this message
    const previousHistory = messagesRef.current.map(m => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { reply } = await sendChatMessage(text, previousHistory);

      const assistantMessage = {
        id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setError(null);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage =
        err.message || 'Something went wrong while connecting to PlantGuard Assistant.';
      setError({
        message: errorMessage,
        code: err.code || 'UNKNOWN',
        canRetry: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  /**
   * Process a consultation triggered from the AI Scanner
   */
  const triggerConsultation = useCallback((context) => {
    if (!context) return;
    setActiveScanContext(context);
    try {
      sessionStorage.setItem(ACTIVE_CONTEXT_KEY, JSON.stringify(context));
    } catch (e) {
      console.warn(e);
    }
    const prompt = buildConsultationPrompt(context);
    sendMessage(prompt);
  }, [sendMessage]);

  // Check for pending consultation on mount or event
  useEffect(() => {
    const checkPending = () => {
      try {
        const pending = sessionStorage.getItem(PENDING_TRIGGER_KEY);
        if (pending) {
          sessionStorage.removeItem(PENDING_TRIGGER_KEY);
          const parsed = JSON.parse(pending);
          triggerConsultation(parsed);
        }
      } catch (e) {
        console.warn('Error reading pending consultation:', e);
      }
    };

    // Check immediately
    checkPending();

    // Listen for custom trigger event
    const handleConsultEvent = (e) => {
      if (e.detail) {
        sessionStorage.removeItem(PENDING_TRIGGER_KEY);
        triggerConsultation(e.detail);
      }
    };

    window.addEventListener('plantGuardConsultScan', handleConsultEvent);
    return () => {
      window.removeEventListener('plantGuardConsultScan', handleConsultEvent);
    };
  }, [triggerConsultation]);

  /**
   * Clear active scan context
   */
  const clearScanContext = useCallback(() => {
    setActiveScanContext(null);
    try {
      sessionStorage.removeItem(ACTIVE_CONTEXT_KEY);
      sessionStorage.removeItem(PENDING_TRIGGER_KEY);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  /**
   * Retry the last sent user message
   */
  const retryLastMessage = useCallback(() => {
    if (!lastUserMessage) return;
    sendMessage(lastUserMessage);
  }, [lastUserMessage, sendMessage]);

  /**
   * Start a new chat session
   */
  const startNewChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setLastUserMessage('');
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  /**
   * Clear current chat
   */
  const clearChat = useCallback(() => {
    startNewChat();
  }, [startNewChat]);

  return {
    messages,
    isLoading,
    error,
    lastUserMessage,
    healthInfo,
    activeScanContext,
    clearScanContext,
    triggerConsultation,
    sendMessage,
    retryLastMessage,
    startNewChat,
    clearChat,
  };
}
