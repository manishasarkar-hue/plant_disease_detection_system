import React, { useState } from 'react';
import { 
  Sprout, PlusCircle, Trash2, Info, X, 
  Sparkles, CheckCircle2, ShieldAlert, Cpu
} from 'lucide-react';

const ChatHeader = ({ onNewChat, onClearChat, messagesCount, healthInfo }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      <header className="pg-chat-header">
        <div className="pg-brand-wrapper">
          <div className="pg-brand-icon-wrap">
            <Sprout size={24} />
          </div>

          <div className="pg-brand-titles">
            <div className="pg-brand-title-row">
              <h1 className="pg-brand-title">PlantGuard Assistant</h1>
              <span className="pg-badge-assistant" title="Powered by Google Gemini">
                <span className="pg-status-dot"></span>
                Gemini AI
              </span>
            </div>
            <p className="pg-brand-subtitle">
              Your intelligent companion for healthier plants.
            </p>
          </div>
        </div>

        <div className="pg-header-actions">
          <button 
            type="button"
            className="pg-btn-header primary"
            onClick={onNewChat}
            title="Start a fresh conversation"
          >
            <PlusCircle size={15} />
            <span>New Chat</span>
          </button>

          {messagesCount > 0 && (
            <button 
              type="button"
              className="pg-btn-header"
              onClick={onClearChat}
              title="Clear current messages"
            >
              <Trash2 size={15} />
              <span>Clear</span>
            </button>
          )}

          <button 
            type="button"
            className="pg-btn-header"
            onClick={() => setShowInfoModal(true)}
            title="Assistant Information & Settings"
          >
            <Info size={15} />
            <span>About</span>
          </button>
        </div>
      </header>

      {/* Info / Assistant Architecture Modal */}
      {showInfoModal && (
        <div className="pg-modal-overlay" onClick={() => setShowInfoModal(false)}>
          <div className="pg-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="pg-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div className="pg-brand-icon-wrap" style={{ width: 34, height: 34 }}>
                  <Sparkles size={18} />
                </div>
                <h3 className="pg-modal-title">About PlantGuard Assistant</h3>
              </div>
              <button 
                className="pg-modal-close" 
                onClick={() => setShowInfoModal(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem', lineHeight: '1.6' }}>
              <p>
                <strong>PlantGuard Assistant</strong> is an intelligent, conversational plant-care companion powered by Google Gemini. It provides friendly, tailored gardening advice from seed sowing to pest prevention.
              </p>

              <div style={{ padding: '0.85rem', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#34d399', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <Cpu size={16} />
                  <span>General Plant-Care Assistant</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                  This chatbot focuses on holistic gardening guidance: watering schedules, soil mixes, sunlight, germination, repotting, pruning, and organic care.
                </p>
              </div>

              <div style={{ padding: '0.85rem', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#93c5fd', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <ShieldAlert size={16} />
                  <span>Disease Treatment Assistant (Separate Module)</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Automated leaf disease diagnosis using the deep learning EfficientNetB0 ML model is dedicated in the <strong>Scan Disease</strong> tab.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid var(--pg-border)', paddingTop: '0.85rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>AI Engine:</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{healthInfo?.model || 'Google Gemini 2.5 Flash'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Language Support:</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 500 }}>English, Hindi, Hinglish</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Backend Status:</span>
                  <span style={{ color: healthInfo?.status === 'ok' ? '#34d399' : '#f87171', fontWeight: 500 }}>
                    {healthInfo?.status === 'ok' ? 'Connected (Port 5000)' : 'Connecting / Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatHeader;
