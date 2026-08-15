import React from 'react';
import { User } from 'lucide-react';

const Account = () => {
  return (
    <section id="account" className="tab-content active">
      <header className="content-header">
        <h1>Your Account</h1>
        <p>Manage your profile and settings.</p>
      </header>
      <div className="account-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={40} />
          </div>
          <div className="profile-info">
            <h3>Demo Farmer</h3>
            <p>farmer@example.com</p>
          </div>
        </div>
        <button className="primary-btn" style={{ marginTop: '1rem' }}>Edit Profile</button>
      </div>
    </section>
  );
};

export default Account;
