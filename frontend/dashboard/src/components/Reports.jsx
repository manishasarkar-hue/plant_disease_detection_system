import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Printer, Camera, Calendar, 
  CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, Leaf 
} from 'lucide-react';

const Reports = ({ setActiveTab }) => {
  const [reportsList, setReportsList] = useState([]);
  const [activeReport, setActiveReport] = useState(null);

  const loadReports = () => {
    try {
      const saved = localStorage.getItem('plantGuardDiagnosisHistory');
      if (saved) {
        const parsed = JSON.parse(saved);
        setReportsList(parsed);
        if (parsed.length > 0 && !activeReport) {
          setActiveReport(parsed[0]);
        }
      } else {
        setReportsList([]);
        setActiveReport(null);
      }
    } catch (e) {
      console.error(e);
      setReportsList([]);
    }
  };

  useEffect(() => {
    loadReports();
    const handleUpdate = () => loadReports();
    window.addEventListener('plantGuardDiagnosisAdded', handleUpdate);
    return () => window.removeEventListener('plantGuardDiagnosisAdded', handleUpdate);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="reports" className="tab-content active" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header className="content-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Agronomic Diagnosis Reports</h1>
          <p>Download, print, or review full clinical crop pathology reports.</p>
        </div>
        {reportsList.length > 0 && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              className="btn-diagnose-secondary" 
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
              onClick={handlePrint}
            >
              <Printer size={14} /> Print Report
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
        {reportsList.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}>
            <FileText size={64} style={{ marginBottom: '1rem', opacity: 0.4, color: 'var(--kombu-green)' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--kombu-green)', marginBottom: '0.5rem' }}>No Reports Generated</h3>
            <p style={{ maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              Perform a leaf scan using your camera or photo upload to automatically generate official disease diagnosis reports.
            </p>
            <button 
              className="landing-btn-primary" 
              style={{ margin: '0 auto', display: 'inline-flex' }}
              onClick={() => setActiveTab && setActiveTab('scanner')}
            >
              <Camera size={16} /> Run First Scan
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>
            {/* Reports Sidebar List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontSize: '0.88rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Recent Diagnoses ({reportsList.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {reportsList.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setActiveReport(item)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '0.75rem',
                      border: '1px solid var(--border-color)',
                      background: activeReport?.id === item.id ? 'var(--tan)' : 'var(--bg-panel)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <img 
                      src={item.image || item.previewUrl} 
                      alt="thumbnail" 
                      style={{ width: '40px', height: '40px', borderRadius: '0.4rem', objectFit: 'cover' }} 
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--kombu-green)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.diseaseName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.date} • {item.confidence}% Match
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Selected Report */}
            {activeReport && (
              <div style={{
                background: 'var(--bg-panel)',
                border: '1px solid var(--border-color)',
                borderRadius: '1.25rem',
                padding: '2rem',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--moss-green)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      <Leaf size={16} /> Official Agronomic Report • ID: {activeReport.id}
                    </div>
                    <h2 style={{ fontSize: '1.6rem', color: 'var(--kombu-green)' }}>
                      {activeReport.diseaseName}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                      Host Crop: {activeReport.crop} | Pathogen: {activeReport.scientificName} | Evaluated on {activeReport.date} at {activeReport.time}
                    </p>
                  </div>

                  <span className={`diagnosis-severity-tag severity-${activeReport.severity}`} style={{ fontSize: '0.85rem' }}>
                    {activeReport.severity}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '1.25rem', alignItems: 'center' }}>
                  <img 
                    src={activeReport.image || activeReport.previewUrl} 
                    alt={activeReport.diseaseName} 
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }} 
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--kombu-green)', marginBottom: '0.25rem' }}>
                      Diagnostic Confidence Match: {activeReport.confidence}%
                    </div>
                    <div className="confidence-bar-track" style={{ marginBottom: '0.75rem' }}>
                      <div className="confidence-bar-fill" style={{ width: `${activeReport.confidence}%` }}></div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Identified via Deep Convolutional Neural Network foliage lesion mapping.
                    </p>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--kombu-green)', marginBottom: '0.5rem' }}>Foliar Clinical Symptoms</h4>
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {activeReport.symptoms?.map((symp, idx) => (
                      <li key={idx}>{symp}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#166534', marginBottom: '0.5rem' }}>🌿 Organic Treatment Plan</h4>
                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {activeReport.organicCare?.map((care, idx) => (
                        <li key={idx}>{care}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#854d0e', marginBottom: '0.5rem' }}>🧪 Chemical Fungicide Protocol</h4>
                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {activeReport.chemicalCare?.map((care, idx) => (
                        <li key={idx}>{care}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ background: 'rgba(136, 144, 99, 0.15)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--kombu-green)', marginBottom: '0.35rem' }}>Preventative Recommendations</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--kombu-green)', lineHeight: 1.45 }}>
                    {activeReport.prevention}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Reports;
