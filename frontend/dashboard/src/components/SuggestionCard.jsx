import React from 'react';
import { Sprout } from 'lucide-react';

const SUGGESTIONS = [
  { emoji: '🌱', text: 'How do I grow tomatoes?' },
  { emoji: '💧', text: 'How often should I water my plant?' },
  { emoji: '☀️', text: 'How much sunlight does basil need?' },
  { emoji: '🌿', text: 'What soil is best for chilli plants?' },
  { emoji: '🪴', text: 'When should I repot my plant?' },
  { emoji: '🐛', text: 'How can I prevent pests?' },
];

const SuggestionCard = ({ onSelectSuggestion }) => {
  return (
    <div className="pg-empty-state">
      <div className="pg-empty-icon">
        <Sprout size={32} />
      </div>

      <h2 className="pg-empty-title">
        How can I help your plants today?
      </h2>

      <p className="pg-empty-subtitle">
        Ask me about watering, sunlight, soil, fertilizer, planting, pests, or anything related to plant care.
      </p>

      <div className="pg-suggestions-grid">
        {SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            className="pg-suggestion-card"
            onClick={() => onSelectSuggestion(item.text)}
          >
            <span className="pg-suggestion-emoji">{item.emoji}</span>
            <span className="pg-suggestion-text">{item.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionCard;
