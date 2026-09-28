import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sprout, User, Check, Copy } from 'lucide-react';

function formatTimestamp(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const ChatMessage = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  return (
    <div className={`pg-message-row ${isAssistant ? 'assistant' : 'user'}`}>
      <div className="pg-message-avatar" aria-hidden="true">
        {isAssistant ? <Sprout size={18} /> : <User size={18} />}
      </div>

      <div className="pg-message-content-wrap">
        <div className="pg-message-bubble">
          {isAssistant ? (
            <div className="pg-markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.55' }}>
              {message.content}
            </div>
          )}
        </div>

        <div className="pg-message-meta">
          <span>{formatTimestamp(message.timestamp)}</span>
          {isAssistant && (
            <button 
              type="button" 
              className="pg-btn-copy" 
              onClick={handleCopy}
              title="Copy message to clipboard"
            >
              {copied ? (
                <>
                  <Check size={12} color="#34d399" />
                  <span style={{ color: '#34d399' }}>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
