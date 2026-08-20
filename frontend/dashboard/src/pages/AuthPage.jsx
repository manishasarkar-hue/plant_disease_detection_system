import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, Mail, Lock, Eye, EyeOff, ArrowRight, 
  Sprout, ShieldCheck, CheckCircle2, Sparkles, 
  ArrowLeft, Leaf, Zap, HelpCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, isLoggedIn } = useAuth();

  // If initial route is /signup or query contains mode=signup, set to signup
  const isSignupInit = location.pathname.includes('signup') || new URLSearchParams(location.search).get('mode') === 'signup';
  const [isSignUp, setIsSignUp] = useState(isSignupInit);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [farmName, setFarmName] = useState('');
  const [role, setRole] = useState('Pro Agri-Grower');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (isSignUp) {
        if (!fullName.trim()) {
          setError('Please provide your full name.');
          setLoading(false);
          return;
        }

        signup({
          fullName,
          email,
          password,
          farmName: farmName || 'Organic Family Farm',
          role
        });
      } else {
        login(email, password);
      }

      setLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  // One-click Demo Farmer Login
  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login('farmer@example.com', 'plantcare123');
      navigate('/dashboard');
    }, 400);
  };

  // Google Social Login Simulation
  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login('google.grower@gmail.com', 'googleAuthPass');
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="auth-page">
      {/* Top Navbar */}
      <header className="auth-top-nav">
        <div className="auth-brand" onClick={() => navigate('/')}>
          <img src="/assets/logo.png" alt="Logo" className="auth-brand-logo" onError={(e) => { e.target.style.display = 'none'; }} />
          <span className="auth-brand-title">PlantCare AI</span>
        </div>
        <button className="auth-back-link" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </header>

      {/* Main Card */}
      <div className="auth-card">
        <div className="auth-header">
          <h1>{isSignUp ? 'Create Your Account' : 'Welcome Back'}</h1>
          <p>
            {isSignUp 
              ? 'Unlock unlimited plant scans, diagnostic reports & schedules.'
              : 'Log in to access your farm diagnostics & records.'}
          </p>
        </div>

        {/* Free trial hint */}
        <div className="auth-trial-pill">
          <Sparkles size={16} style={{ color: 'var(--moss-green)', flexShrink: 0 }} />
          <span>
            {isSignUp 
              ? 'Free account includes unlimited AI crop diagnoses & weather alerts.'
              : 'Guest scan limit reached? Log in for unlimited disease detection.'}
          </span>
        </div>

        {/* Mode Switcher */}
        <div className="auth-mode-switch">
          <button 
            type="button"
            className={`auth-mode-btn ${!isSignUp ? 'active' : ''}`}
            onClick={() => { setIsSignUp(false); setError(''); }}
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`auth-mode-btn ${isSignUp ? 'active' : ''}`}
            onClick={() => { setIsSignUp(true); setError(''); }}
          >
            Create Account
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#dc2626',
            padding: '0.65rem 0.9rem',
            borderRadius: '0.5rem',
            fontSize: '0.85rem',
            fontWeight: 500
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {isSignUp && (
            <>
              <div className="auth-form-group">
                <label><User size={15} /> Full Name</label>
                <div className="auth-input-wrapper">
                  <User size={16} className="auth-input-icon" />
                  <input 
                    type="text" 
                    className="auth-input" 
                    placeholder="e.g. Sumit Adak"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label><Sprout size={15} /> Farm / Garden Name (Optional)</label>
                <div className="auth-input-wrapper">
                  <Sprout size={16} className="auth-input-icon" />
                  <input 
                    type="text" 
                    className="auth-input" 
                    placeholder="e.g. Green Meadows Farm"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="auth-form-group">
            <label><Mail size={15} /> Email Address</label>
            <div className="auth-input-wrapper">
              <Mail size={16} className="auth-input-icon" />
              <input 
                type="email" 
                className="auth-input" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label><Lock size={15} /> Password</label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input 
                type={showPassword ? 'text' : 'password'}
                className="auth-input" 
                placeholder="Enter password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="auth-extra-row">
            <label className="auth-checkbox-label">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>

            {!isSignUp && (
              <button 
                type="button" 
                className="auth-link" 
                onClick={() => alert('Password reset link sent to demo account email!')}
              >
                Forgot password?
              </button>
            )}
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Processing...' : (
              <>
                {isSignUp ? 'Create Free Account' : 'Sign In'} <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>or quickly test</span>
        </div>

        {/* Quick Demo & Social Login */}
        <div className="auth-quick-actions">
          <button type="button" className="auth-demo-btn" onClick={handleDemoLogin}>
            <Sparkles size={16} /> Instant Demo Farmer Login
          </button>

          <button type="button" className="auth-social-btn" onClick={handleGoogleLogin}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
