// Initialize Lucide Icons
lucide.createIcons();

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hero Animations
const heroTl = gsap.timeline();

heroTl.from(".navbar", { 
    y: -20, 
    opacity: 0, 
    duration: 0.8, 
    ease: "power3.out" 
})
.from(".hero-content h1", { 
    y: 40, 
    opacity: 0, 
    duration: 1, 
    ease: "power3.out" 
}, "-=0.4")
.from(".hero-content p", { 
    y: 20, 
    opacity: 0, 
    duration: 0.8, 
    ease: "power3.out" 
}, "-=0.6")
.from(".hero-buttons", { 
    y: 20, 
    opacity: 0, 
    duration: 0.8, 
    ease: "power3.out" 
}, "-=0.6")
.from(".hero-image", { 
    x: 60, 
    opacity: 0, 
    duration: 1.2, 
    ease: "power3.out" 
}, "-=0.8");

// Features Scroll Animations
gsap.from(".features h2", {
    scrollTrigger: {
        trigger: ".features",
        start: "top 80%",
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
});

gsap.utils.toArray('.feature-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: ".feature-grid",
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.15,
        ease: "power3.out"
    });
});

// How It Works Scroll Animations
gsap.from(".how-it-works h2", {
    scrollTrigger: {
        trigger: ".how-it-works",
        start: "top 80%",
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
});

gsap.utils.toArray('.step').forEach((step, i) => {
    gsap.from(step, {
        scrollTrigger: {
            trigger: ".steps",
            start: "top 80%",
        },
        x: i % 2 === 0 ? -50 : 50,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.2,
        ease: "power3.out"
    });
});

// CTA Scroll Animation
gsap.from(".cta-content", {
    scrollTrigger: {
        trigger: ".cta-section",
        start: "top 80%",
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Offset for navbar
                behavior: 'smooth'
            });
        }
    });
});
