import React from 'react';
import { Sprout } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="pg-message-row assistant">
      <div className="pg-message-avatar" aria-hidden="true">
        <Sprout size={18} />
      </div>

      <div className="pg-message-content-wrap">
        <div className="pg-typing-card" role="status" aria-label="PlantGuard Assistant is typing">
          <div className="pg-typing-dot"></div>
          <div className="pg-typing-dot"></div>
          <div className="pg-typing-dot"></div>
          <span className="pg-typing-label">PlantGuard Assistant is typing...</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
