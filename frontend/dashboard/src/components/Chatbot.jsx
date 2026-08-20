import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, User, Camera, Send, X, Sparkles, 
  Lock, ArrowRight, ShieldCheck, CheckCircle2, Zap 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Chatbot = () => {
  const navigate = useNavigate();
  const { isLoggedIn, trialCount, remainingTrials, canPerformDiagnosis, useTrialScan } = useAuth();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I am PlantCare AI. Please upload a clear photo of your plant's diseased leaf, or describe the symptoms you are seeing."
    }
  ]);
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showTrialLimitModal, setShowTrialLimitModal] = useState(false);

  const fileInputRef = useRef(null);
  const chatMessagesRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = () => {
    if (!input.trim() && !imagePreview) return;

    // Check if free trial limit applies
    if (!canPerformDiagnosis) {
      setShowTrialLimitModal(true);
      return;
    }

    // Deduct free trial scan if guest
    const allowed = useTrialScan();
    if (!allowed) {
      setShowTrialLimitModal(true);
      return;
    }

    // Add user message
    const newUserMsg = {
      id: Date.now(),
      sender: 'user',
      text: input,
      image: imagePreview
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    // Simulate bot response
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      let botReply = "I need more details to make an accurate diagnosis. Could you provide a clearer photo or describe any spots, discoloration, or wilting?";
      
      if (newUserMsg.image) {
        botReply = "Based on the image uploaded, the visual symptoms indicate early signs of **Powdery Mildew** (*Podosphaera xanthii*).\n\n🌿 **Recommended Organic Treatment**:\n• Remove severely infected leaves immediately.\n• Apply a sulfur-based fungicide or neem oil solution early in the morning.\n• Ensure proper plant spacing and avoid overhead sprinkler watering.";
      } else if (newUserMsg.text.toLowerCase().includes('spot') || newUserMsg.text.toLowerCase().includes('yellow')) {
        botReply = "Yellow spots can be a sign of early **Early Blight (Alternaria)** or a nitrogen deficiency.\n\n💧 **Action Plan**:\n• Inspect the underside of leaves for dark concentric rings.\n• Apply copper fungicide spray if fungal lesions spread.\n• Upload a photo of the affected foliage for high-accuracy confirmation.";
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: botReply
      }]);
    }, 1800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <section id="dashboard" className="tab-content active" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Content Header */}
      <header className="content-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>AI Disease Diagnosis Chat</h1>
          <p>Upload a leaf photo or describe symptoms to get instant treatment solutions.</p>
        </div>

        {/* Free trial / Pro Status Badge */}
        <div>
          {!isLoggedIn ? (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.85rem',
              background: remainingTrials > 0 ? 'rgba(136, 144, 99, 0.25)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${remainingTrials > 0 ? 'var(--moss-green)' : '#ef4444'}`,
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: remainingTrials > 0 ? 'var(--kombu-green)' : '#dc2626'
            }}>
              {remainingTrials > 0 ? (
                <>
                  <Sparkles size={14} /> Free Trial: 1 Diagnosis Remaining
                </>
              ) : (
                <>
                  <Lock size={14} /> Free Trial Used — Log in for Unlimited
                </>
              )}
            </div>
          ) : (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.85rem',
              background: 'rgba(53, 64, 36, 0.15)',
              border: '1px solid var(--kombu-green)',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--kombu-green)'
            }}>
              <ShieldCheck size={14} /> Unlimited Pro Diagnostics
            </div>
          )}
        </div>
      </header>

      {/* Trial Limit Modal Popup */}
      {showTrialLimitModal && (
        <div className="trial-modal-overlay">
          <div className="trial-modal-card">
            <button className="trial-modal-close" onClick={() => setShowTrialLimitModal(false)}>
              <X size={20} />
            </button>

            <div className="trial-modal-icon-wrap">
              <Lock size={32} />
            </div>

            <h2>Free Trial Limit Reached</h2>
            <p>
              You have used your <strong>1 free AI plant diagnosis</strong>! Create your free account or sign in to continue diagnosing unlimited plants and accessing advanced farm features.
            </p>

            <div className="trial-benefits-list">
              <div className="trial-benefit-item">
                <CheckCircle2 size={16} color="var(--moss-green)" />
                <span>Unlimited Deep Learning Leaf Disease Scans</span>
              </div>
              <div className="trial-benefit-item">
                <CheckCircle2 size={16} color="var(--moss-green)" />
                <span>Save Full Diagnosis History & PDF Reports</span>
              </div>
              <div className="trial-benefit-item">
                <CheckCircle2 size={16} color="var(--moss-green)" />
                <span>Interactive Farm Trackers & Watering Scheduler</span>
              </div>
              <div className="trial-benefit-item">
                <CheckCircle2 size={16} color="var(--moss-green)" />
                <span>Personalized Farm Profile & Crop Alerts</span>
              </div>
            </div>

            <div className="trial-modal-actions">
              <button 
                className="landing-btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => navigate('/signup')}
              >
                Create Free Account <ArrowRight size={16} />
              </button>

              <button 
                className="landing-btn-secondary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => navigate('/login')}
              >
                Already have an account? Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="chat-container">
        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}-message`}>
              <div className="avatar">
                {msg.sender === 'bot' ? (
                  <img src="/chatbot_logo.jpg" alt="Bot" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }} />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div className="message-content">
                {msg.image && <img src={msg.image} alt="Uploaded plant leaf" />}
                {msg.text && <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot-message">
              <div className="avatar">
                <img src="/chatbot_logo.jpg" alt="Bot" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }} />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="chat-input-area">
          {imagePreview && (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Preview" />
              <button id="remove-image" className="icon-btn" onClick={removeImage}>
                <X size={16} />
              </button>
            </div>
          )}
          
          <div className="input-wrapper">
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              hidden 
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <button 
              className="icon-btn" 
              title="Upload Plant Photo" 
              onClick={() => {
                if (!canPerformDiagnosis) {
                  setShowTrialLimitModal(true);
                } else {
                  fileInputRef.current?.click();
                }
              }}
            >
              <Camera size={20} />
            </button>
            
            <input 
              type="text" 
              id="chat-input" 
              placeholder={canPerformDiagnosis ? "Ask about a disease or upload a leaf photo..." : "Free trial used. Please sign in to ask..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            
            <button className="primary-btn" onClick={handleSend}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chatbot;
