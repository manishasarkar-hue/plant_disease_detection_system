import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Chatbot from './components/Chatbot';
import History from './components/History';
import Reports from './components/Reports';
import Account from './components/Account';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Chatbot />;
      case 'history':
        return <History />;
      case 'reports':
        return <Reports />;
      case 'account':
        return <Account />;
      default:
        return <Chatbot />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
