import React, { useState, useEffect } from 'react';
import { LayoutDashboard, History, FileText, User, LogOut, CalendarClock, BarChart2 } from 'lucide-react';
import WeatherWidget from './WeatherWidget';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [userProfile, setUserProfile] = useState({
    fullName: 'Demo Farmer',
    role: 'Pro Agri-Grower',
    avatarUrl: null,
    avatarType: 'preset',
    avatarPreset: '🧑‍🌾'
  });

  const loadProfile = () => {
    const saved = localStorage.getItem('plantGuardUserProfile');
    if (saved) {
      try {
        setUserProfile(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    loadProfile();
    const handleUpdate = () => loadProfile();
    window.addEventListener('plantGuardProfileUpdated', handleUpdate);
    return () => window.removeEventListener('plantGuardProfileUpdated', handleUpdate);
  }, []);

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
          className={`nav-item ${activeTab === 'scheduler' ? 'active' : ''}`}
          onClick={() => setActiveTab('scheduler')}
        >
          <CalendarClock size={20} />
          <span>Scheduler</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'trackers' ? 'active' : ''}`}
          onClick={() => setActiveTab('trackers')}
        >
          <BarChart2 size={20} />
          <span>Trackers</span>
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

      {/* Mini Profile Badge in Sidebar */}
      <div 
        className={`sidebar-user-card ${activeTab === 'account' ? 'active' : ''}`}
        onClick={() => setActiveTab('account')}
        title="View & Edit Account"
      >
        <div className="sidebar-user-avatar">
          {userProfile.avatarType === 'upload' && userProfile.avatarUrl ? (
            <img src={userProfile.avatarUrl} alt="Avatar" />
          ) : (
            <span>{userProfile.avatarPreset || '🧑‍🌾'}</span>
          )}
        </div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{userProfile.fullName}</div>
          <div className="sidebar-user-role">{userProfile.role}</div>
        </div>
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

