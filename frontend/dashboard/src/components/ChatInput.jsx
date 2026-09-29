import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft, Sparkles } from 'lucide-react';

const ChatInput = ({ onSendMessage, isLoading, disabled }) => {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 140)}px`;
    }
  }, [inputText]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading || disabled) return;

    onSendMessage(inputText.trim());
    setInputText('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <footer className="pg-chat-input-area">
      <div className="pg-input-container">
        <form onSubmit={handleSubmit} className="pg-input-box">
          <textarea
            ref={textareaRef}
            className="pg-textarea"
            rows={1}
            placeholder={
              disabled 
                ? "Connecting to PlantGuard..." 
                : "Ask anything about your plant..."
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || disabled}
            aria-label="Chat input"
          />

          <button
            type="submit"
            className="pg-btn-send"
            disabled={!inputText.trim() || isLoading || disabled}
            aria-label="Send message"
            title="Send (Enter)"
          >
            <Send size={18} />
          </button>
        </form>

        <div className="pg-input-footer-hint">
          <div className="pg-input-hint-item">
            <Sparkles size={12} color="#34d399" />
            <span>PlantGuard Assistant • Natural Gardening & Plant Care</span>
          </div>

          <div className="pg-input-hint-item">
            <CornerDownLeft size={12} />
            <span><strong>Enter</strong> to send • <strong>Shift + Enter</strong> for new line</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ChatInput;
