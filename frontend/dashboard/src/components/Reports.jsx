import React from 'react';
import { FileX2 } from 'lucide-react';

const Reports = () => {
  return (
    <section id="reports" className="tab-content active">
      <header className="content-header">
        <h1>Diagnosis Reports</h1>
        <p>Detailed reports and treatment plans.</p>
      </header>
      <div className="empty-state">
        <FileX2 size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <h3>No reports generated</h3>
        <p>Complete a diagnosis to receive a detailed treatment report.</p>
      </div>
    </section>
  );
};

export default Reports;
