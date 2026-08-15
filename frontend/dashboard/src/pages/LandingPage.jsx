import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Target, ShieldCheck } from 'lucide-react';
import '../styles/landing.css';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const worksRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Navbar Scroll Effect
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbarRef.current?.classList.add('scrolled');
      } else {
        navbarRef.current?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);

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
        scrollTrigger: { trigger: ".feature-grid", start: "top 80%" },
        y: 50, opacity: 0, duration: 0.8, delay: i * 0.15, ease: "power3.out"
      });
    });

    // How It Works Scroll Animations
    gsap.from(".how-it-works h2", {
      scrollTrigger: { trigger: ".how-it-works", start: "top 80%" },
      y: 30, opacity: 0, duration: 0.8, ease: "power3.out"
    });

    gsap.utils.toArray('.step').forEach((step, i) => {
      gsap.from(step, {
        scrollTrigger: { trigger: ".steps", start: "top 80%" },
        x: i % 2 === 0 ? -50 : 50, opacity: 0, duration: 0.8, delay: i * 0.2, ease: "power3.out"
      });
    });

    // CTA Scroll Animation
    gsap.from(".cta-content", {
      scrollTrigger: { trigger: ".cta-section", start: "top 80%" },
      y: 50, opacity: 0, duration: 1, ease: "power3.out"
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
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-navbar" ref={navbarRef}>
        <div className="landing-logo">
          <img src="/assets/logo.png" alt="Logo" />
          <span>PlantCare AI</span>
        </div>
        <div className="landing-nav-links">
          <a href="#features" onClick={(e) => handleNavClick(e, '#features')}>Features</a>
          <a href="#how-it-works" onClick={(e) => handleNavClick(e, '#how-it-works')}>How it Works</a>
          <a href="#about" onClick={(e) => handleNavClick(e, '#about')}>About Us</a>
        </div>
        <button className="landing-btn-primary" onClick={() => navigate('/dashboard')}>Try Now</button>
      </nav>

      {/* Hero Section */}
      <header className="hero" ref={heroRef} id="about">
        <div className="hero-content">
          <h1>Save Your Harvest. <br/><span className="highlight">Detect Disease</span> Instantly.</h1>
          <p>Empower your farming with AI-driven plant disease detection. Upload a photo of a leaf and get instant, accurate diagnostics.</p>
          <div className="hero-buttons">
            <button className="landing-btn-primary large" onClick={() => navigate('/dashboard')}>Start Diagnosis</button>
            <button className="landing-btn-secondary large">Learn More</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="image-wrapper">
            <img src="/assets/diseased.png" alt="Diseased plant leaf" />
            <div className="scan-overlay"></div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="features" ref={featuresRef}>
        <h2>Why Choose PlantCare AI?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <Zap size={48} />
            <h3>Lightning Fast</h3>
            <p>Get results in seconds. Our advanced AI model processes images instantly.</p>
          </div>
          <div className="feature-card">
            <Target size={48} />
            <h3>High Accuracy</h3>
            <p>Trained on thousands of leaves to identify over 50+ diseases accurately.</p>
          </div>
          <div className="feature-card">
            <ShieldCheck size={48} />
            <h3>Reliable Solutions</h3>
            <p>Receive actionable treatment plans to save your crops immediately.</p>
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
                <p>Take a clear photo of the affected plant leaf using your smartphone.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div>
                <h3>AI Analysis</h3>
                <p>Our deep learning models analyze the visual symptoms with precision.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div>
                <h3>Get Results & Treat</h3>
                <p>Receive instant diagnosis and expert-recommended treatment plans.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" ref={ctaRef}>
        <div className="cta-content">
          <h2>Ready to protect your plants?</h2>
          <p>Join thousands of farmers using AI to secure their yield.</p>
          <button className="landing-btn-primary large" onClick={() => navigate('/dashboard')}>Get Started Today</button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="landing-logo">
            <img src="/assets/logo.png" alt="Logo" />
            <span>PlantCare AI</span>
          </div>
          <p>&copy; 2026 PlantCare AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
