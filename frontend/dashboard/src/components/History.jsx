import React, { useState, useEffect } from 'react';
import { 
  Inbox, Trash2, Camera, Calendar, ArrowRight, 
  CheckCircle2, ShieldAlert, Sparkles, Eye 
} from 'lucide-react';

const History = ({ setActiveTab }) => {
  const [historyList, setHistoryList] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('plantGuardDiagnosisHistory');
      if (saved) {
        setHistoryList(JSON.parse(saved));
      } else {
        setHistoryList([]);
      }
    } catch (e) {
      console.error(e);
      setHistoryList([]);
    }
  };

  useEffect(() => {
    loadHistory();
    const handleUpdate = () => loadHistory();
    window.addEventListener('plantGuardDiagnosisAdded', handleUpdate);
    return () => window.removeEventListener('plantGuardDiagnosisAdded', handleUpdate);
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your diagnosis history?')) {
      localStorage.removeItem('plantGuardDiagnosisHistory');
      setHistoryList([]);
      setSelectedScan(null);
    }
  };

  return (
    <section id="history" className="tab-content active" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header className="content-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Diagnosis History</h1>
          <p>Review your historical crop scans, lesion detections, and AI prescriptions.</p>
        </div>
        {historyList.length > 0 && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              className="btn-diagnose-secondary" 
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
              onClick={handleClearHistory}
            >
              <Trash2 size={14} color="#ef4444" /> Clear All
            </button>
            <button 
              className="landing-btn-primary" 
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
              onClick={() => setActiveTab && setActiveTab('scanner')}
            >
              <Camera size={14} /> New Scan
            </button>
          </div>
        )}
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2.5rem 3rem' }}>
        {historyList.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}>
            <Inbox size={64} style={{ marginBottom: '1rem', opacity: 0.4, color: 'var(--kombu-green)' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--kombu-green)', marginBottom: '0.5rem' }}>No Scan History Yet</h3>
            <p style={{ maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              Your disease scans and leaf diagnoses will be saved here automatically.
            </p>
            <button 
              className="landing-btn-primary" 
              style={{ margin: '0 auto', display: 'inline-flex' }}
              onClick={() => setActiveTab && setActiveTab('scanner')}
            >
              <Camera size={16} /> Scan Plant Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {historyList.map((item) => (
              <div 
                key={item.id} 
                style={{
                  background: 'var(--bg-panel)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '160px', background: '#000' }}>
                  <img 
                    src={item.image || item.previewUrl} 
                    alt={item.diseaseName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    background: item.severity === 'healthy' ? 'rgba(34, 197, 94, 0.85)' : 'rgba(239, 68, 68, 0.85)',
                    color: '#fff',
                    backdropFilter: 'blur(4px)'
                  }}>
                    {item.severity}
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '0.35rem',
                    fontSize: '0.72rem',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    <Calendar size={12} /> {item.date || 'Recent'}
                  </div>
                </div>

                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ color: 'var(--kombu-green)', fontSize: '1rem', fontWeight: 600 }}>{item.diseaseName}</h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{item.crop} • {item.scientificName}</span>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--moss-green)' }}>
                      {item.confidence}%
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: '0.25rem' }}>
                    {item.symptoms?.[0] || 'Pathogen markers identified.'}
                  </p>

                  <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.time || ''}
                    </span>
                    <button 
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--kombu-green)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                      onClick={() => setActiveTab && setActiveTab('scanner')}
                    >
                      Scan More <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default History;
