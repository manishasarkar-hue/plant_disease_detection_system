import React, { useState, useEffect } from 'react';
import { Droplet, Bug, Sprout, Activity, Plus, Calendar, Save } from 'lucide-react';
import '../styles/trackers.css';

const defaultTrackers = [
  {
    id: 'water',
    name: 'Water Schedule',
    iconType: 'water',
    logs: [],
    nextScheduleDate: '',
    tips: 'Use drip irrigation to save up to 40% water.'
  },
  {
    id: 'pesticide',
    name: 'Pesticide Tracker',
    iconType: 'pesticide',
    logs: [],
    nextScheduleDate: '',
    tips: 'Apply pesticides during early morning or late evening.'
  },
  {
    id: 'care',
    name: 'Care Tracker',
    iconType: 'care',
    logs: [],
    nextScheduleDate: '',
    tips: 'Regularly prune dead leaves to encourage new growth.'
  }
];

const Trackers = () => {
  const [trackers, setTrackers] = useState([]);
  const [activeTrackerId, setActiveTrackerId] = useState('water');
  
  // New Log State
  const [newLogDate, setNewLogDate] = useState('');
  const [newLogPercentage, setNewLogPercentage] = useState(50);
  const [nextDate, setNextDate] = useState('');

  // New Custom Tracker State
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customTrackerName, setCustomTrackerName] = useState('');

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('plantTrackers');
    if (saved) {
      setTrackers(JSON.parse(saved));
    } else {
      setTrackers(defaultTrackers);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (trackers.length > 0) {
      localStorage.setItem('plantTrackers', JSON.stringify(trackers));
    }
  }, [trackers]);

  const activeTracker = trackers.find(t => t.id === activeTrackerId) || trackers[0];

  const getIcon = (type, size = 24) => {
    switch(type) {
      case 'water': return <Droplet size={size} className="tracker-icon water-icon" />;
      case 'pesticide': return <Bug size={size} className="tracker-icon pesticide-icon" />;
      case 'care': return <Sprout size={size} className="tracker-icon care-icon" />;
      default: return <Activity size={size} className="tracker-icon custom-icon" />;
    }
  };

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!newLogDate) return;

    const newLog = {
      id: Date.now().toString(),
      date: newLogDate,
      percentage: parseInt(newLogPercentage, 10)
    };

    const updatedTrackers = trackers.map(t => {
      if (t.id === activeTrackerId) {
        // Keep logs sorted by date
        const updatedLogs = [...t.logs, newLog].sort((a, b) => new Date(a.date) - new Date(b.date));
        return { ...t, logs: updatedLogs, nextScheduleDate: nextDate || t.nextScheduleDate };
      }
      return t;
    });

    setTrackers(updatedTrackers);
    setNewLogDate('');
    setNextDate('');
    setNewLogPercentage(50);
  };

  const handleAddCustomTracker = (e) => {
    e.preventDefault();
    if (!customTrackerName.trim()) return;

    const newTracker = {
      id: `custom_${Date.now()}`,
      name: customTrackerName,
      iconType: 'custom',
      logs: [],
      nextScheduleDate: '',
      tips: 'Consistency is key to a healthy harvest.'
    };

    setTrackers([...trackers, newTracker]);
    setCustomTrackerName('');
    setShowAddCustom(false);
    setActiveTrackerId(newTracker.id);
  };

  if (trackers.length === 0) return null; // wait for load

  // Prepare chart data (last 5 logs)
  const chartLogs = activeTracker.logs.slice(-5);

  return (
    <div className="trackers-container">
      <div className="content-header">
        <h1>Farm Trackers</h1>
        <p>Monitor your daily activities and progress visually.</p>
      </div>

      <div className="trackers-layout">
        {/* Sidebar for Trackers */}
        <div className="trackers-menu card-panel">
          <h3>Your Trackers</h3>
          <div className="tracker-list">
            {trackers.map(t => (
              <button 
                key={t.id} 
                className={`tracker-menu-btn ${activeTrackerId === t.id ? 'active' : ''}`}
                onClick={() => setActiveTrackerId(t.id)}
              >
                {getIcon(t.iconType, 18)}
                <span>{t.name}</span>
              </button>
            ))}
          </div>

          {!showAddCustom ? (
            <button className="add-custom-btn" onClick={() => setShowAddCustom(true)}>
              <Plus size={18} /> Add Custom Tracker
            </button>
          ) : (
            <form onSubmit={handleAddCustomTracker} className="add-custom-form">
              <input 
                type="text" 
                placeholder="Tracker Name..."
                value={customTrackerName}
                onChange={(e) => setCustomTrackerName(e.target.value)}
                autoFocus
              />
              <div className="custom-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddCustom(false)}>Cancel</button>
                <button type="submit" className="save-btn">Add</button>
              </div>
            </form>
          )}
        </div>

        {/* Main Tracker Details */}
        <div className="tracker-details card-panel">
          <div className="tracker-header">
            <div className="tracker-title-group">
              {getIcon(activeTracker.iconType, 32)}
              <h2>{activeTracker.name}</h2>
            </div>
            
            <div className="next-schedule card-panel inner-card">
              <h4>Next Scheduled</h4>
              <div className="schedule-info">
                <Calendar size={20} className="text-primary" />
                <span>
                  {activeTracker.nextScheduleDate 
                    ? new Date(activeTracker.nextScheduleDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })
                    : 'Not scheduled yet'}
                </span>
              </div>
            </div>
          </div>

          <div className="tracker-history">
            <h3>History</h3>
            {chartLogs.length === 0 ? (
              <div className="no-history">No logs yet. Add your first log below!</div>
            ) : (
              <div className="chart-container">
                {chartLogs.map(log => (
                  <div key={log.id} className="chart-bar-group">
                    <div className="bar-wrapper">
                      <div className="bar-fill" style={{ height: `${log.percentage}%` }}>
                        <span className="bar-tooltip">{log.percentage}%</span>
                      </div>
                    </div>
                    <span className="bar-label">
                      {new Date(log.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="tracker-action-area">
            <div className="log-form-card card-panel inner-card">
              <h3>Log Activity</h3>
              <form onSubmit={handleAddLog} className="log-form">
                <div className="log-inputs">
                  <div className="form-group">
                    <label>Date Completed</label>
                    <input 
                      type="date" 
                      value={newLogDate}
                      onChange={(e) => setNewLogDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Work Completed (%)</label>
                    <div className="range-group">
                      <input 
                        type="range" 
                        min="0" max="100" step="5"
                        value={newLogPercentage}
                        onChange={(e) => setNewLogPercentage(e.target.value)}
                      />
                      <span className="range-value">{newLogPercentage}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="form-group next-date-group">
                  <label>Schedule Next One? (Optional)</label>
                  <input 
                    type="date" 
                    value={nextDate}
                    onChange={(e) => setNextDate(e.target.value)}
                  />
                </div>

                <button type="submit" className="primary-btn log-submit-btn">
                  <Save size={18} /> Save Log
                </button>
              </form>
            </div>

            <div className="tracker-tips card-panel inner-card">
              <h3>Expert Tip</h3>
              <div className="tip-content">
                {getIcon(activeTracker.iconType, 48)}
                <p>{activeTracker.tips}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trackers;
