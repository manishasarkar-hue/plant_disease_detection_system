import React from 'react';
import { 
  Sparkles, ShieldAlert, CheckCircle2, AlertTriangle, 
  X, Zap, Leaf, FlaskConical, CloudRain, ShieldCheck
} from 'lucide-react';

const ScanContextBanner = ({ context, onClearContext, onSelectQuestion }) => {
  if (!context) return null;

  const isHealthy = context.isHealthy || context.severity === 'healthy';

  const suggestionChips = isHealthy
    ? [
        { label: '🌿 Best Organic Nutrition', query: `What are the best organic fertilizers and foliar nutrients to keep my ${context.crop} flourishing?` },
        { label: '💧 Watering & Soil Schedule', query: `What is the ideal watering schedule and soil moisture level for healthy ${context.crop}?` },
        { label: '🛡️ Early Warning Signs', query: `What early warning signs of disease or pest stress should I monitor for on my ${context.crop}?` },
      ]
    : [
        { label: '🌿 Immediate Organic Remedies', query: `What are the exact organic remedies and dilution recipes I should apply today for ${context.diseaseName} on my ${context.crop}?` },
        { label: '🧪 Chemical Spray & Dosage', query: `What specific chemical fungicides and dosages per liter do you recommend for ${context.diseaseName}?` },
        { label: '🌧️ Weather & Rain Advice', query: `How should I adjust spraying for ${context.diseaseName} during humid or rainy weather?` },
        { label: '🛡️ Neighboring Plant Protection', query: `How do I prevent ${context.diseaseName} from spreading to my other plants and crops?` },
      ];

  const getSeverityBadgeClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'severe':
        return 'severity-severe';
      case 'moderate':
        return 'severity-moderate';
      case 'mild':
        return 'severity-mild';
      case 'healthy':
        return 'severity-healthy';
      default:
        return 'severity-moderate';
    }
  };

  return (
    <div className="pg-scan-context-banner">
      <div className="pg-scan-context-header">
        <div className="pg-scan-context-title-group">
          <div className="pg-scan-context-icon">
            {isHealthy ? (
              <CheckCircle2 size={18} color="#34d399" />
            ) : (
              <ShieldAlert size={18} color="#f87171" />
            )}
          </div>
          <div>
            <div className="pg-scan-context-kicker">
              <Sparkles size={13} />
              <span>AI Scan Consultation Active</span>
            </div>
            <h4 className="pg-scan-context-heading">
              {context.crop} — {context.diseaseName}
            </h4>
          </div>
        </div>

        <div className="pg-scan-context-meta">
          <span className={`pg-severity-tag ${getSeverityBadgeClass(context.severity)}`}>
            {context.severity?.toUpperCase()}
          </span>
          <span className="pg-confidence-tag">
            <Zap size={12} />
            {context.confidence}% Match
          </span>
          <button 
            type="button" 
            className="pg-scan-context-dismiss"
            onClick={onClearContext}
            title="Dismiss scan context"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="pg-scan-context-body">
        {context.image && (
          <div className="pg-scan-thumbnail-wrap">
            <img src={context.image} alt="Scanned Leaf" className="pg-scan-thumbnail" />
          </div>
        )}

        <div className="pg-scan-details-content">
          {context.scientificName && (
            <p className="pg-scan-scientific-name">
              Pathogen: <em>{context.scientificName}</em>
            </p>
          )}

          {context.symptoms && context.symptoms.length > 0 && !isHealthy && (
            <p className="pg-scan-symptom-preview">
              <strong>Key Detection:</strong> {context.symptoms[0]}
            </p>
          )}

          {isHealthy && (
            <p className="pg-scan-symptom-preview" style={{ color: '#86efac' }}>
              No active disease patterns detected. Consulting for preventative maintenance.
            </p>
          )}

          <div className="pg-scan-chips-row">
            <span className="pg-chips-label">Quick Consult:</span>
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                className="pg-scan-chip-btn"
                onClick={() => onSelectQuestion && onSelectQuestion(chip.query)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanContextBanner;
