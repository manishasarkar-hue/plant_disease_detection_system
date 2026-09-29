import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import SuggestionCard from './SuggestionCard';
import TypingIndicator from './TypingIndicator';
import { AlertCircle, RotateCcw } from 'lucide-react';

const ChatWindow = ({
  messages,
  isLoading,
  error,
  onSelectSuggestion,
  onRetry,
}) => {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new message or loading change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, error]);

  return (
    <div className="pg-chat-body">
      <div className="pg-messages-scroll" ref={scrollRef}>
        {messages.length === 0 ? (
          <SuggestionCard onSelectSuggestion={onSelectSuggestion} />
        ) : (
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))
        )}

        {isLoading && <TypingIndicator />}

        {error && (
          <div className="pg-error-banner" role="alert">
            <div className="pg-error-content">
              <AlertCircle size={18} />
              <span>{error.message || 'Something went wrong while connecting to PlantGuard Assistant.'}</span>
            </div>

            {error.canRetry && (
              <button
                type="button"
                className="pg-btn-retry"
                onClick={onRetry}
              >
                <RotateCcw size={14} />
                <span>Try again</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
