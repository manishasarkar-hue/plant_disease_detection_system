import React from 'react';
import { Inbox } from 'lucide-react';

const History = () => {
  return (
    <section id="history" className="tab-content active">
      <header className="content-header">
        <h1>Diagnosis History</h1>
        <p>Review your past plant analyses.</p>
      </header>
      <div className="empty-state">
        <Inbox size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <h3>No history yet</h3>
        <p>Your past diagnoses will appear here once you start using the AI.</p>
      </div>
    </section>
  );
};

export default History;
