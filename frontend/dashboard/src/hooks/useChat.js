import { useState, useCallback, useEffect, useRef } from 'react';
import { sendChatMessage, checkChatHealth } from '../services/chatApi';

const STORAGE_KEY = 'plantguard_chat_history_v1';

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
    sendMessage,
    retryLastMessage,
    startNewChat,
    clearChat,
  };
}
