import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Camera, Upload, Trash2, Check, Shield, Bell, Sprout, 
  Settings, Key, Smartphone, Download, UploadCloud, RefreshCw, 
  MapPin, Mail, Phone, Globe, Sliders, AlertTriangle, Eye, 
  EyeOff, Save, CheckCircle2, Award, FileText, ChevronRight,
  Database, Sparkles, Layers, Activity
} from 'lucide-react';
import '../styles/account.css';

const PRESET_AVATARS = [
  { id: 'farmer', emoji: '🧑‍🌾', label: 'Master Farmer' },
  { id: 'botanist', emoji: '🌿', label: 'Botanist' },
  { id: 'pathologist', emoji: '🔬', label: 'Plant Pathologist' },
  { id: 'sprout', emoji: '🌱', label: 'Green Thumb' },
  { id: 'flora', emoji: '🌻', label: 'Flora Specialist' },
  { id: 'tractor', emoji: '🚜', label: 'Agri-Technician' },
  { id: 'organic', emoji: '🥑', label: 'Organic Grower' },
  { id: 'indoor', emoji: '🪴', label: 'Hydroponics Pro' }
];

const DEFAULT_PROFILE = {
  fullName: 'Demo Farmer',
  email: 'farmer@example.com',
  phone: '+1 (555) 234-5678',
  role: 'Pro Agri-Grower',
  avatarUrl: null,
  avatarType: 'preset',
  avatarPreset: '🧑‍🌾',
  farmName: 'Green Horizon Eco Farm',
  location: 'California Valley, USA',
  farmType: 'Organic Greenhouse & Orchard',
  farmSize: '12.5 Acres',
  soilType: 'Loamy with High Organic Matter',
  climateZone: 'Zone 9b - Subtropical Mediterranean',
  experienceYears: '7+ Years',
  crops: ['Tomatoes', 'Bell Peppers', 'Strawberries', 'Potatoes', 'Lettuce', 'Basil'],
  bio: 'Passionate sustainable grower utilizing AI diagnostics, precision irrigation, and organic pest control to cultivate high-yield crop varieties.',
  memberSince: 'March 2024'
};

const DEFAULT_PREFERENCES = {
  diseaseSensitivity: 'High (Early Detection)',
  unitSystem: 'Metric (°C, Hectares, Liters)',
  autoWeatherSync: true,
  aiModelMode: 'Ensemble Deep Vision (Highest Accuracy)',
  language: 'English (US)',
  autoBackup: true
};

const DEFAULT_NOTIFICATIONS = {
  emailAlerts: true,
  smsCriticalAlerts: false,
  pushDiseaseOutbreak: true,
  wateringReminders: true,
  weeklyDigest: true,
  severeWeatherAlerts: true
};

const Account = () => {
  // Tabs: 'profile' | 'farm' | 'preferences' | 'notifications' | 'security' | 'activity'
  const [activeTab, setActiveTab] = useState('profile');
  
  // State
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  
  // Avatar custom modal/presets selector visibility
  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const fileInputRef = useRef(null);

  // New crop input
  const [newCropInput, setNewCropInput] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Sessions list
  const [sessions, setSessions] = useState([
    { id: '1', device: 'Windows 11 • Chrome 128', location: 'Current Session (Local)', lastActive: 'Active Now', isCurrent: true },
    { id: '2', device: 'iPhone 15 Pro • PlantGuard Mobile', location: 'California, US', lastActive: '3 hours ago', isCurrent: false },
    { id: '3', device: 'iPad Air • Safari Browser', location: 'California, US', lastActive: '2 days ago', isCurrent: false }
  ]);

  // Activity Log
  const [activities, setActivities] = useState([
    { id: 1, text: 'Logged in from Windows Chrome', time: 'Just now' },
    { id: 2, text: 'Performed AI Diagnosis on Tomato Leaf Blight', time: 'Yesterday at 3:45 PM' },
    { id: 3, text: 'Updated Water Schedule for Greenhouse Sector B', time: '2 days ago' },
    { id: 4, text: 'Downloaded Disease Management PDF Report', time: '3 days ago' },
    { id: 5, text: 'Connected Soil Moisture & Weather Tracker', time: '5 days ago' }
  ]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Load from local storage
  useEffect(() => {
    const savedProfile = localStorage.getItem('plantGuardUserProfile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    }

    const savedPrefs = localStorage.getItem('plantGuardUserPrefs');
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs));
      } catch (e) {
        console.error('Failed to parse user prefs', e);
      }
    }

    const savedNotifs = localStorage.getItem('plantGuardUserNotifs');
    if (savedNotifs) {
      try {
        setNotifications(JSON.parse(savedNotifs));
      } catch (e) {
        console.error('Failed to parse user notifs', e);
      }
    }

    const saved2FA = localStorage.getItem('plantGuard2FA');
    if (saved2FA) {
      setTwoFactorEnabled(saved2FA === 'true');
    }
  }, []);

  // Save changes to localStorage and dispatch event for header/sidebar sync
  const saveProfileData = (updatedProfile) => {
    const dataToSave = updatedProfile || profile;
    localStorage.setItem('plantGuardUserProfile', JSON.stringify(dataToSave));
    window.dispatchEvent(new Event('plantGuardProfileUpdated'));
    showToast('Profile information saved successfully!');
  };

  const savePreferencesData = () => {
    localStorage.setItem('plantGuardUserPrefs', JSON.stringify(preferences));
    showToast('Preferences updated successfully!');
  };

  const saveNotificationsData = () => {
    localStorage.setItem('plantGuardUserNotifs', JSON.stringify(notifications));
    showToast('Notification settings updated!');
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result;
      const updated = {
        ...profile,
        avatarUrl: base64Url,
        avatarType: 'upload'
      };
      setProfile(updated);
      saveProfileData(updated);
      showToast('Profile photo updated successfully!');
    };
    reader.readAsDataURL(file);
  };

  // Handle Preset Avatar selection
  const handleSelectPreset = (emoji) => {
    const updated = {
      ...profile,
      avatarUrl: null,
      avatarType: 'preset',
      avatarPreset: emoji
    };
    setProfile(updated);
    saveProfileData(updated);
    setShowPresetPicker(false);
    showToast(`Avatar updated to ${emoji}`);
  };

  // Reset / Remove Avatar
  const handleRemoveAvatar = () => {
    const updated = {
      ...profile,
      avatarUrl: null,
      avatarType: 'preset',
      avatarPreset: '🧑‍🌾'
    };
    setProfile(updated);
    saveProfileData(updated);
    showToast('Profile photo reset to default.');
  };

  // Add Crop Tag
  const handleAddCrop = (e) => {
    e.preventDefault();
    const trimmed = newCropInput.trim();
    if (!trimmed) return;
    if (profile.crops.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      showToast('This crop is already listed!');
      return;
    }
    const updated = {
      ...profile,
      crops: [...profile.crops, trimmed]
    };
    setProfile(updated);
    setNewCropInput('');
  };

  // Remove Crop Tag
  const handleRemoveCrop = (cropToRemove) => {
    const updated = {
      ...profile,
      crops: profile.crops.filter(c => c !== cropToRemove)
    };
    setProfile(updated);
  };

  // Password Strength Calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: '#ef4444' };
      case 2:
        return { score: 50, label: 'Fair', color: '#f59e0b' };
      case 3:
        return { score: 75, label: 'Good', color: '#3b82f6' };
      case 4:
        return { score: 100, label: 'Strong', color: '#10b981' };
      default:
        return { score: 15, label: 'Very Weak', color: '#ef4444' };
    }
  };

  const passwordStrength = getPasswordStrength(newPassword);

  // Handle Password Submit
  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password changed successfully!');
  };

  // 2FA Toggle
  const toggle2FA = () => {
    const nextState = !twoFactorEnabled;
    setTwoFactorEnabled(nextState);
    localStorage.setItem('plantGuard2FA', String(nextState));
    showToast(nextState ? 'Two-Factor Authentication enabled!' : '2FA disabled.');
  };

  // Revoke session
  const revokeSession = (id) => {
    setSessions(sessions.filter(s => s.id !== id));
    showToast('Device session revoked.');
  };

  // Export Account & Farm Data
  const handleExportData = () => {
    const fullData = {
      profile,
      preferences,
      notifications,
      trackers: JSON.parse(localStorage.getItem('plantTrackers') || '[]'),
      schedules: JSON.parse(localStorage.getItem('plantCareTasks') || '[]'),
      exportDate: new Date().toISOString()
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `plantguard_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Full account & farm data exported successfully!');
  };

  // Clear Local Data
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to reset all profile and farm data? This cannot be undone.')) {
      localStorage.clear();
      setProfile(DEFAULT_PROFILE);
      setPreferences(DEFAULT_PREFERENCES);
      setNotifications(DEFAULT_NOTIFICATIONS);
      setTwoFactorEnabled(false);
      window.dispatchEvent(new Event('plantGuardProfileUpdated'));
      showToast('All local application data has been reset.');
    }
  };

  // Profile completeness score
  const calculateCompleteness = () => {
    let fields = [
      profile.fullName, profile.email, profile.phone, profile.farmName,
      profile.location, profile.farmType, profile.farmSize, profile.soilType,
      profile.bio, (profile.crops && profile.crops.length > 0)
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completeness = calculateCompleteness();

  return (
    <div className="account-container">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="account-toast">
          <CheckCircle2 size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Standard Header */}
      <div className="content-header">
        <h1>Account & Farm Profile</h1>
        <p>Manage your farmer identity, crop configurations, system alerts, and security settings.</p>
      </div>

      {/* Main Scrollable Content */}
      <div className="account-scrollable-content">
        {/* Profile Overview Banner */}
        <div className="profile-banner-card">
          <div className="profile-banner-top">
            <div className="profile-hero">
              {/* Avatar with image / preset / overlay */}
              <div 
                className="avatar-wrapper"
                onClick={() => fileInputRef.current?.click()}
                title="Click to upload custom photo"
              >
                {profile.avatarType === 'upload' && profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.fullName} className="avatar-img" />
                ) : (
                  <span className="avatar-initials">
                    {profile.avatarPreset || profile.fullName.charAt(0)}
                  </span>
                )}

                <div className="avatar-overlay-btn">
                  <Camera size={18} />
                  <span>Upload</span>
                </div>
              </div>

              <div className="profile-details">
                <div className="profile-title-row">
                  <h2>{profile.fullName}</h2>
                  <span className="badge-role">
                    <Award size={13} /> {profile.role}
                  </span>
                </div>
                <div className="profile-meta-row">
                  <span className="profile-meta-item">
                    <Mail size={14} /> {profile.email}
                  </span>
                  <span className="profile-meta-item">
                    <MapPin size={14} /> {profile.location}
                  </span>
                  <span className="profile-meta-item">
                    <Sprout size={14} /> {profile.farmName}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons for Avatar */}
            <div className="avatar-actions">
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              <button 
                type="button"
                className="secondary-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={15} /> Upload Photo
              </button>
              <button 
                type="button"
                className="secondary-btn"
                onClick={() => setShowPresetPicker(!showPresetPicker)}
              >
                <Sparkles size={15} /> Choose Preset
              </button>
              {(profile.avatarUrl || profile.avatarPreset !== '🧑‍🌾') && (
                <button 
                  type="button"
                  className="danger-outline-btn"
                  onClick={handleRemoveAvatar}
                  title="Reset Avatar"
                >
                  <Trash2 size={15} /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Preset Avatars Selector Drawer */}
          {showPresetPicker && (
            <div className="preset-avatars-box">
              <p>Choose an Agricultural Persona Avatar:</p>
              <div className="preset-avatars-grid">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    className={`preset-avatar-btn ${profile.avatarPreset === av.emoji && profile.avatarType === 'preset' ? 'selected' : ''}`}
                    onClick={() => handleSelectPreset(av.emoji)}
                    title={av.label}
                  >
                    {av.emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Completeness Bar */}
          <div className="profile-progress-section">
            <div className="progress-header">
              <span>Profile Completeness</span>
              <span>{completeness}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${completeness}%` }}></div>
            </div>
          </div>
        </div>

        {/* Quick Statistics Row */}
        <div className="account-stats-row">
          <div className="account-stat-card">
            <div className="stat-icon-wrap">
              <Activity size={22} />
            </div>
            <div className="stat-info">
              <h4>34</h4>
              <p>Total Scans Performed</p>
            </div>
          </div>
          <div className="account-stat-card">
            <div className="stat-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#2563eb' }}>
              <Sprout size={22} />
            </div>
            <div className="stat-info">
              <h4>{profile.crops.length}</h4>
              <p>Monitored Crops</p>
            </div>
          </div>
          <div className="account-stat-card">
            <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#059669' }}>
              <CheckCircle2 size={22} />
            </div>
            <div className="stat-info">
              <h4>94.8%</h4>
              <p>Crop Health Rate</p>
            </div>
          </div>
          <div className="account-stat-card">
            <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#d97706' }}>
              <Shield size={22} />
            </div>
            <div className="stat-info">
              <h4>Pro Tier</h4>
              <p>Since {profile.memberSince}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="account-tabs-nav">
          <button 
            type="button"
            className={`account-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={17} /> Personal Profile
          </button>
          <button 
            type="button"
            className={`account-tab-btn ${activeTab === 'farm' ? 'active' : ''}`}
            onClick={() => setActiveTab('farm')}
          >
            <Sprout size={17} /> Farm & Crops
          </button>
          <button 
            type="button"
            className={`account-tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <Sliders size={17} /> AI & Preferences
          </button>
          <button 
            type="button"
            className={`account-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={17} /> Notifications
          </button>
          <button 
            type="button"
            className={`account-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={17} /> Security & Privacy
          </button>
          <button 
            type="button"
            className={`account-tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <Activity size={17} /> Activity & Data
          </button>
        </div>

        {/* TAB 1: PERSONAL PROFILE */}
        {activeTab === 'profile' && (
          <div className="tab-section-card">
            <div className="section-card-header">
              <h3><User size={20} /> Personal Information</h3>
              <p>Update your grower details and contact information.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); saveProfileData(); }}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    placeholder="e.g. Sumit Adak"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="farmer@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="form-group">
                  <label>Farmer Role / Title</label>
                  <select 
                    className="form-select"
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  >
                    <option value="Pro Agri-Grower">Pro Agri-Grower</option>
                    <option value="Organic Farmer">Organic Farmer</option>
                    <option value="Urban Gardener">Urban Gardener</option>
                    <option value="Botanical Researcher">Botanical Researcher</option>
                    <option value="Hydroponics Specialist">Hydroponics Specialist</option>
                    <option value="Hobbyist Gardener">Hobbyist Gardener</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Farming Experience</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profile.experienceYears}
                    onChange={(e) => setProfile({ ...profile, experienceYears: e.target.value })}
                    placeholder="e.g. 5+ Years"
                  />
                </div>

                <div className="form-group">
                  <label>Location / Region</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="City, State, Country"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Grower Bio & Notes</label>
                  <textarea 
                    className="form-textarea" 
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Write a brief overview of your farm, goals, or practices..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="tab-card-actions">
                <button type="submit" className="primary-btn">
                  <Save size={17} /> Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: FARM & CROPS */}
        {activeTab === 'farm' && (
          <div className="tab-section-card">
            <div className="section-card-header">
              <h3><Sprout size={20} /> Farm Setup & Crops</h3>
              <p>Customize your field specifications, soil types, and monitored plants.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); saveProfileData(); }}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Farm / Greenhouse Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profile.farmName}
                    onChange={(e) => setProfile({ ...profile, farmName: e.target.value })}
                    placeholder="e.g. Sunrise Organic Acres"
                  />
                </div>

                <div className="form-group">
                  <label>Farm Type</label>
                  <select 
                    className="form-select"
                    value={profile.farmType}
                    onChange={(e) => setProfile({ ...profile, farmType: e.target.value })}
                  >
                    <option value="Organic Greenhouse & Orchard">Organic Greenhouse & Orchard</option>
                    <option value="Commercial Open-Field Farm">Commercial Open-Field Farm</option>
                    <option value="Hydroponics / Vertical Farm">Hydroponics / Vertical Farm</option>
                    <option value="Home & Kitchen Garden">Home & Kitchen Garden</option>
                    <option value="Vineyard & Berry Plantation">Vineyard & Berry Plantation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Farm Size</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profile.farmSize}
                    onChange={(e) => setProfile({ ...profile, farmSize: e.target.value })}
                    placeholder="e.g. 10 Acres / 500 sq meters"
                  />
                </div>

                <div className="form-group">
                  <label>Primary Soil Type</label>
                  <select 
                    className="form-select"
                    value={profile.soilType}
                    onChange={(e) => setProfile({ ...profile, soilType: e.target.value })}
                  >
                    <option value="Loamy with High Organic Matter">Loamy (High Organic Matter)</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Clay Soil (Nutrient Dense)">Clay Soil (Nutrient Dense)</option>
                    <option value="Silty Loam">Silty Loam</option>
                    <option value="Hydroponic Medium (Rockwool/Coco Coir)">Hydroponic (Rockwool/Coco Coir)</option>
                    <option value="Peat Moss & Perlite Mix">Peat Moss & Perlite Mix</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Climate Hardiness Zone</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profile.climateZone}
                    onChange={(e) => setProfile({ ...profile, climateZone: e.target.value })}
                    placeholder="e.g. USDA Zone 9b, Subtropical, Arid"
                  />
                </div>

                {/* Crop Tags Manager */}
                <div className="form-group full-width">
                  <label>Currently Monitored Crops ({profile.crops.length})</label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    These plants receive specialized AI disease monitoring algorithms.
                  </p>

                  <div className="input-wrapper" style={{ maxWidth: '420px', marginBottom: '0.75rem' }}>
                    <input 
                      type="text"
                      id="chat-input"
                      placeholder="Add crop (e.g. Eggplant, Rice, Corn)..."
                      value={newCropInput}
                      onChange={(e) => setNewCropInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCrop(e);
                        }
                      }}
                    />
                    <button type="button" className="primary-btn" onClick={handleAddCrop}>
                      Add
                    </button>
                  </div>

                  <div className="crops-tag-container">
                    {profile.crops.map((crop, idx) => (
                      <span key={idx} className="crop-tag">
                        <Sprout size={14} />
                        {crop}
                        <button 
                          type="button" 
                          className="crop-tag-remove"
                          onClick={() => handleRemoveCrop(crop)}
                          title={`Remove ${crop}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="tab-card-actions">
                <button type="submit" className="primary-btn">
                  <Save size={17} /> Update Farm Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: AI & SYSTEM PREFERENCES */}
        {activeTab === 'preferences' && (
          <div className="tab-section-card">
            <div className="section-card-header">
              <h3><Sliders size={20} /> AI Diagnostics & App Preferences</h3>
              <p>Fine-tune diagnosis sensitivity, unit systems, and automatic sync features.</p>
            </div>

            <div className="settings-list">
              <div className="settings-item">
                <div className="settings-item-info">
                  <h4>Disease Detection Sensitivity</h4>
                  <p>High sensitivity flags potential fungal infections in early microscopic stages.</p>
                </div>
                <select 
                  className="form-select" 
                  style={{ width: 'auto', minWidth: '220px' }}
                  value={preferences.diseaseSensitivity}
                  onChange={(e) => setPreferences({ ...preferences, diseaseSensitivity: e.target.value })}
                >
                  <option value="High (Early Detection)">High (Early Detection)</option>
                  <option value="Balanced (Recommended)">Balanced (Recommended)</option>
                  <option value="Low (Confirmed Symptoms Only)">Low (Confirmed Only)</option>
                </select>
              </div>

              <div className="settings-item">
                <div className="settings-item-info">
                  <h4>Diagnostic AI Engine Mode</h4>
                  <p>Choose between maximum accuracy multi-model ensemble or lightweight fast prediction.</p>
                </div>
                <select 
                  className="form-select" 
                  style={{ width: 'auto', minWidth: '220px' }}
                  value={preferences.aiModelMode}
                  onChange={(e) => setPreferences({ ...preferences, aiModelMode: e.target.value })}
                >
                  <option value="Ensemble Deep Vision (Highest Accuracy)">Ensemble Deep Vision (Highest Accuracy)</option>
                  <option value="Standard MobileNet (Balanced)">Standard MobileNet (Balanced)</option>
                  <option value="Fast Edge Mode (Offline Capable)">Fast Edge Mode (Offline Capable)</option>
                </select>
              </div>

              <div className="settings-item">
                <div className="settings-item-info">
                  <h4>Measurement Units</h4>
                  <p>Toggle between metric system (°C, ha, mm) and imperial units (°F, acres, in).</p>
                </div>
                <select 
                  className="form-select" 
                  style={{ width: 'auto', minWidth: '220px' }}
                  value={preferences.unitSystem}
                  onChange={(e) => setPreferences({ ...preferences, unitSystem: e.target.value })}
                >
                  <option value="Metric (°C, Hectares, Liters)">Metric (°C, Hectares, Liters)</option>
                  <option value="Imperial (°F, Acres, Gallons)">Imperial (°F, Acres, Gallons)</option>
                </select>
              </div>

              <div className="settings-item">
                <div className="settings-item-info">
                  <h4>Auto Weather Geolocation Sync</h4>
                  <p>Automatically update humidity and temperature risk analysis based on real-time sensors.</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={preferences.autoWeatherSync}
                    onChange={(e) => setPreferences({ ...preferences, autoWeatherSync: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="settings-item">
                <div className="settings-item-info">
                  <h4>Automatic Local Cloud Backup</h4>
                  <p>Store scheduled tracker history and crop scans in encrypted local storage.</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={preferences.autoBackup}
                    onChange={(e) => setPreferences({ ...preferences, autoBackup: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="tab-card-actions">
              <button type="button" className="primary-btn" onClick={savePreferencesData}>
                <Save size={17} /> Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS & ALERTS */}
        {activeTab === 'notifications' && (
          <div className="tab-section-card">
            <div className="section-card-header">
              <h3><Bell size={20} /> Notification & Alert Dispatch</h3>
              <p>Control what plant alerts you receive and via which channels.</p>
            </div>

            <div className="settings-list">
              <div className="settings-item">
                <div className="settings-item-info">
                  <h4>Critical Pathogen & Pest Alerts</h4>
                  <p>Receive immediate alerts when a contagious blight, rust, or mildew is detected.</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifications.pushDiseaseOutbreak}
                    onChange={(e) => setNotifications({ ...notifications, pushDiseaseOutbreak: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="settings-item">
                <div className="settings-item-info">
                  <h4>Severe Weather & Frost Warnings</h4>
                  <p>Get notified of sudden temperature drops, heatwaves, or high-humidity spore conditions.</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifications.severeWeatherAlerts}
                    onChange={(e) => setNotifications({ ...notifications, severeWeatherAlerts: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="settings-item">
                <div className="settings-item-info">
                  <h4>Watering & Care Schedule Reminders</h4>
                  <p>Daily notifications for upcoming irrigation, organic spray, or fertilization routines.</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifications.wateringReminders}
                    onChange={(e) => setNotifications({ ...notifications, wateringReminders: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="settings-item">
                <div className="settings-item-info">
                  <h4>Weekly Crop Health Digest (Email)</h4>
                  <p>A summary email detailing farm health trends, soil metrics, and treated areas.</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifications.weeklyDigest}
                    onChange={(e) => setNotifications({ ...notifications, weeklyDigest: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="settings-item">
                <div className="settings-item-info">
                  <h4>SMS Urgent Notifications</h4>
                  <p>Send text message notifications to {profile.phone} for emergency crop risks.</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifications.smsCriticalAlerts}
                    onChange={(e) => setNotifications({ ...notifications, smsCriticalAlerts: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="tab-card-actions">
              <button type="button" className="primary-btn" onClick={saveNotificationsData}>
                <Save size={17} /> Save Notification Settings
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY & PRIVACY */}
        {activeTab === 'security' && (
          <div className="tab-section-card">
            <div className="section-card-header">
              <h3><Shield size={20} /> Account Security & Active Sessions</h3>
              <p>Manage your password, two-factor authentication, and connected devices.</p>
            </div>

            {/* Password Change Form */}
            <form onSubmit={handlePasswordUpdate}>
              <h4 style={{ color: 'var(--kombu-green)', marginBottom: '1rem', fontSize: '1.05rem' }}>Change Password</h4>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Current Password</label>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    className="form-input" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    className="form-input" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                  />
                  {newPassword && (
                    <div className="password-meter-wrap">
                      <div className="password-meter-bar">
                        <div 
                          className="password-meter-fill" 
                          style={{ width: `${passwordStrength.score}%`, backgroundColor: passwordStrength.color }}
                        ></div>
                      </div>
                      <span className="password-meter-text" style={{ color: passwordStrength.color }}>
                        Strength: {passwordStrength.label}
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    className="form-input" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                  />
                </div>

                <div className="form-group" style={{ justifyContent: 'center' }}>
                  <label style={{ cursor: 'pointer', marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input 
                      type="checkbox" 
                      checked={showPassword} 
                      onChange={(e) => setShowPassword(e.target.checked)} 
                    />
                    <span>Show Passwords</span>
                  </label>
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <button type="submit" className="primary-btn">
                  <Key size={16} /> Update Password
                </button>
              </div>
            </form>

            {/* 2FA Section */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <div className="settings-item">
                <div className="settings-item-info">
                  <h4>Two-Factor Authentication (2FA)</h4>
                  <p>Add an extra layer of security using an authenticator app (Google Authenticator, Authy).</p>
                </div>
                <button 
                  type="button" 
                  className={twoFactorEnabled ? 'danger-outline-btn' : 'secondary-btn'}
                  onClick={toggle2FA}
                >
                  {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                </button>
              </div>
            </div>

            {/* Active Devices */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <h4 style={{ color: 'var(--kombu-green)', marginBottom: '1rem', fontSize: '1.05rem' }}>Active Signed-in Devices</h4>
              <div className="sessions-list">
                {sessions.map((sess) => (
                  <div key={sess.id} className="session-card">
                    <div className="session-main">
                      <div className="session-icon">
                        <Smartphone size={20} />
                      </div>
                      <div className="session-meta">
                        <h5>
                          {sess.device} {sess.isCurrent && <span style={{ color: 'var(--moss-green)', fontSize: '0.75rem', fontWeight: 600 }}>(This Device)</span>}
                        </h5>
                        <p>{sess.location} • {sess.lastActive}</p>
                      </div>
                    </div>
                    {!sess.isCurrent && (
                      <button 
                        type="button" 
                        className="danger-outline-btn"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                        onClick={() => revokeSession(sess.id)}
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ACTIVITY & DATA BACKUP */}
        {activeTab === 'activity' && (
          <div className="tab-section-card">
            <div className="section-card-header">
              <h3><Activity size={20} /> Activity Audit & Data Portability</h3>
              <p>Review your recent system activities and export or reset your local farm database.</p>
            </div>

            {/* Activity Timeline */}
            <div>
              <h4 style={{ color: 'var(--kombu-green)', marginBottom: '1rem', fontSize: '1.05rem' }}>Recent Account Timeline</h4>
              <div className="activity-timeline">
                {activities.map((act) => (
                  <div key={act.id} className="activity-item">
                    <div className="activity-dot"></div>
                    <div className="activity-content">
                      <p>{act.text}</p>
                      <span className="activity-time">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Portability */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <h4 style={{ color: 'var(--kombu-green)', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Data Export & Migration</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Download a complete JSON snapshot of your profile, crop configurations, treatment schedules, and logs.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  className="secondary-btn"
                  onClick={handleExportData}
                >
                  <Download size={17} /> Export Full Farm Data (.json)
                </button>

                <button 
                  type="button" 
                  className="danger-outline-btn"
                  onClick={handleClearData}
                >
                  <Trash2 size={17} /> Reset All Local Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
