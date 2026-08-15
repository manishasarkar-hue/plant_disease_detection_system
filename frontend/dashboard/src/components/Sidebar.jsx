import React from 'react';
import { LayoutDashboard, History, FileText, User, LogOut } from 'lucide-react';
import WeatherWidget from './WeatherWidget';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/assets/logo.png" alt="Logo" className="logo-icon" onError={(e) => e.target.src='https://via.placeholder.com/40'} />
        <h2>PlantCare AI</h2>
      </div>
      
      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={20} />
          <span>History</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <FileText size={20} />
          <span>Diagnosis Reports</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          <User size={20} />
          <span>Account</span>
        </button>
      </nav>
      
      <div className="sidebar-weather-container">
        <WeatherWidget />
      </div>
      
      <div className="sidebar-footer">
        <a href="http://localhost:8000" className="nav-item">
          <LogOut size={20} />
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
