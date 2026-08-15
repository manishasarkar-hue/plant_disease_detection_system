import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Camera, Send, X } from 'lucide-react';

const Chatbot = () => {
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
  const fileInputRef = useRef(null);
  const chatMessagesRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
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
        botReply = "Based on the image uploaded, the visual symptoms indicate early signs of **Powdery Mildew**. \n\nI recommend removing infected leaves and applying a sulfur-based fungicide. Avoid overhead watering to reduce humidity around the plant.";
      } else if (newUserMsg.text.toLowerCase().includes('spot') || newUserMsg.text.toLowerCase().includes('yellow')) {
        botReply = "Yellow spots can be a sign of a nutrient deficiency (like nitrogen) or a fungal infection such as Leaf Spot. Please upload a photo so I can confirm.";
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: botReply
      }]);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <section id="dashboard" className="tab-content active">
      <header className="content-header">
        <h1>AI Diagnosis Chat</h1>
        <p>Upload a photo or describe the symptoms to get a diagnosis.</p>
      </header>

      <div className="chat-container">
        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}-message`}>
              <div className="avatar">
                {msg.sender === 'bot' ? (
                  <img src="/chatbot_logo.jpg" alt="Bot" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
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
                <img src="/chatbot_logo.jpg" alt="Bot" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
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
              title="Upload Photo" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={20} />
            </button>
            
            <input 
              type="text" 
              id="chat-input" 
              placeholder="Ask about a disease or plant care..."
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
