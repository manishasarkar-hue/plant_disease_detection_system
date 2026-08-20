import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { 
  Zap, 
  Target, 
  ShieldCheck, 
  CalendarClock, 
  BarChart2, 
  CloudSun, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import '../styles/landing.css';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const worksRef = useRef(null);
  const ctaRef = useRef(null);

  useGSAP(() => {
    // Navbar Scroll Effect
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbarRef.current?.classList.add('scrolled');
      } else {
        navbarRef.current?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Hero Animations
    const heroTl = gsap.timeline();
    heroTl.from(".landing-navbar", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" })
      .from(".hero-content h1", { y: 40, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.4")
      .from(".hero-content p", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
      .from(".hero-buttons", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
      .from(".hero-image", { x: 60, opacity: 0, duration: 1.2, ease: "power3.out" }, "-=0.8");

    // Features Scroll Animations
    gsap.from(".features h2", {
      scrollTrigger: { trigger: ".features", start: "top 80%" },
      y: 30, opacity: 0, duration: 0.8, ease: "power3.out"
    });

    gsap.utils.toArray('.feature-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: "top 85%" },
        y: 40, opacity: 0, duration: 0.7, delay: (i % 3) * 0.1, ease: "power3.out"
      });
    });

    // How It Works Scroll Animations
    gsap.from(".how-it-works h2", {
      scrollTrigger: { trigger: ".how-it-works", start: "top 80%" },
      y: 30, opacity: 0, duration: 0.8, ease: "power3.out"
    });

    gsap.utils.toArray('.step').forEach((step, i) => {
      gsap.from(step, {
        scrollTrigger: { trigger: step, start: "top 85%" },
        x: i % 2 === 0 ? -40 : 40, opacity: 0, duration: 0.8, ease: "power3.out"
      });
    });

    // CTA Scroll Animation
    gsap.from(".cta-content", {
      scrollTrigger: { trigger: ".cta-section", start: "top 85%" },
      y: 40, opacity: 0, duration: 1, ease: "power3.out"
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const topOffset = targetElement.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-navbar" ref={navbarRef}>
        <div className="landing-logo">
          <img src="/assets/logo.png" alt="Logo" onError={(e) => { e.target.style.display = 'none'; }} />
          <span>PlantCare AI</span>
        </div>
        <div className="landing-nav-links">
          <a href="#features" onClick={(e) => handleNavClick(e, '#features')}>Features</a>
          <a href="#how-it-works" onClick={(e) => handleNavClick(e, '#how-it-works')}>How it Works</a>
          <a href="#about" onClick={(e) => handleNavClick(e, '#about')}>About Us</a>
        </div>
        <div className="landing-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="landing-btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => navigate('/login')}>
            Sign In
          </button>
          <button className="landing-btn-primary" onClick={() => navigate('/dashboard')}>
            Try Free Scan
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero" ref={heroRef} id="about">
        <div className="hero-content">
          <h1>Save Your Harvest. <br/><span className="highlight">Detect Disease</span> Instantly.</h1>
          <p>Empower your farming with AI-driven plant disease detection. Upload a photo of a leaf and get instant, accurate diagnostics.</p>
          <div className="hero-buttons">
            <button className="landing-btn-primary large" onClick={() => navigate('/dashboard')}>
              Start Diagnosis <ArrowRight size={18} style={{ marginLeft: '6px' }} />
            </button>
            <button className="landing-btn-secondary large" onClick={(e) => handleNavClick(e, '#features')}>
              Explore Features
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="image-wrapper">
            <img src="/assets/diseased.png" alt="Diseased plant leaf" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80'; }} />
            <div className="scan-overlay"></div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="features" ref={featuresRef}>
        <h2>Why Choose PlantCare AI?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <Zap size={44} />
            <h3>Lightning Fast AI</h3>
            <p>Get results in under 2 seconds. Our optimized deep learning models process leaf images in real-time.</p>
          </div>
          
          <div className="feature-card">
            <Target size={44} />
            <h3>High Accuracy</h3>
            <p>Trained on over 50,000+ laboratory & field images to accurately identify 50+ plant diseases and deficiencies.</p>
          </div>
          
          <div className="feature-card">
            <ShieldCheck size={44} />
            <h3>Actionable Solutions</h3>
            <p>Receive comprehensive, expert-verified chemical and organic treatment plans tailored to save your harvest.</p>
          </div>

          <div className="feature-card">
            <CalendarClock size={44} />
            <h3>Farm Task Scheduler</h3>
            <p>Plan and automate your daily watering, fertilization, pruning, and harvesting tasks with custom reminders.</p>
          </div>

          <div className="feature-card">
            <BarChart2 size={44} />
            <h3>Interactive Trackers</h3>
            <p>Monitor moisture levels, pesticide cycles, and crop health progression visually over time with historical charts.</p>
          </div>

          <div className="feature-card">
            <CloudSun size={44} />
            <h3>Weather Intelligence</h3>
            <p>Live meteorological integration advising on optimal spraying conditions, temperature alerts, and climate suitability.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works" ref={worksRef}>
        <div className="works-content">
          <h2>Seamless Detection Process</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div>
                <h3>Capture or Upload</h3>
                <p>Take a clear photo of the affected plant leaf using your smartphone or upload an existing image.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div>
                <h3>AI Analysis</h3>
                <p>Our deep learning convolutional vision models analyze visual symptoms, lesions, and spots with precision.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div>
                <h3>Get Results & Treat</h3>
                <p>Receive an instant diagnosis report along with actionable, expert-recommended treatment solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" ref={ctaRef}>
        <div className="cta-content">
          <h2>Ready to protect your plants?</h2>
          <p>Join thousands of farmers and gardeners using AI to secure their crop health and maximize yields.</p>
          <button className="landing-btn-primary large" onClick={() => navigate('/dashboard')}>
            Get Started Today <ArrowRight size={18} style={{ marginLeft: '6px' }} />
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="landing-logo">
            <img src="/assets/logo.png" alt="Logo" onError={(e) => { e.target.style.display = 'none'; }} />
            <span>PlantCare AI</span>
          </div>
          <p>&copy; 2026 PlantCare AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
