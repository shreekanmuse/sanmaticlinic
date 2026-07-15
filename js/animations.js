/*
 * sanmaticlinic - animations.js
 * GSAP, ScrollTrigger, AOS, and Custom Micro-animations Control
 * Adds immersive, top-tier interactions to the clinic platform
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Splash Screen (runs first)
  initSplashScreen();

  // Initialize AOS (Animate on Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      offset: 120
    });
  }

  // Initialize GSAP custom effects
  initGsapAnimations();

  // Initialize Stat Counter animations
  initStatsCounters();

  // Initialize 3D Card Tilt effects
  initCardTilts();

  // Listen for theme change to update GSAP visual parameters if needed
  window.addEventListener('themechanged', (e) => {
    // React to dark mode toggle animations if required
  });
});

/* ==========================================================================
   Splash / Welcome Screen Timer (Session Bound)
   ========================================================================== */
function initSplashScreen() {
  const splash = document.getElementById('splash-screen');
  if (!splash) return;

  // Check if splash has already been shown in this browser session
  const splashShown = sessionStorage.getItem('splash_shown');

  if (splashShown === 'true') {
    // Skip splash immediately
    splash.style.display = 'none';
    document.body.classList.remove('splash-active');
  } else {
    // Show splash, then set session flag
    document.body.classList.add('splash-active');
    
    // Animate loader progress bar matching keyframe timer
    const progress = splash.querySelector('.splash-loader-progress');
    if (progress) {
      progress.style.width = '100%';
    }

    // Fade out and scale down splash after 2.8s
    setTimeout(() => {
      splash.style.transition = 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), visibility 0.8s';
      splash.style.opacity = '0';
      splash.style.transform = 'scale(1.05)';
      splash.style.pointerEvents = 'none';
      
      // Let body scroll
      document.body.classList.remove('splash-active');
      sessionStorage.setItem('splash_shown', 'true');

      // Trigger home page animations right after splash ends
      setTimeout(() => {
        splash.style.display = 'none';
        triggerHeroAnimations();
      }, 800);
    }, 2800);
  }
}

/* ==========================================================================
   GSAP & ScrollTrigger Custom Core Animations
   ========================================================================== */
function initGsapAnimations() {
  // Ensure GSAP and ScrollTrigger are loaded via CDN
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Fallback if CDNs are blocked or unavailable
    console.warn("GSAP or ScrollTrigger is not loaded. Falling back to CSS transitions.");
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Parallax elements
  const parallaxBackgrounds = document.querySelectorAll('.parallax-bg');
  parallaxBackgrounds.forEach(bg => {
    gsap.to(bg, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: bg.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // Reveal timeline path lines
  const timelineContainer = document.querySelector('.timeline-container');
  if (timelineContainer) {
    gsap.fromTo('.timeline-container::after', 
      { scaleY: 0 }, 
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: timelineContainer,
          start: 'top 30%',
          end: 'bottom 80%',
          scrub: true
        }
      }
    );
  }

  // Image reveal effects on scroll
  const revealWrappers = document.querySelectorAll('.img-reveal-wrapper');
  revealWrappers.forEach(wrapper => {
    ScrollTrigger.create({
      trigger: wrapper,
      start: 'top 80%',
      onEnter: () => wrapper.classList.add('revealed')
    });
  });

  // Smooth scroll anchors using GSAP ScrollTo
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        gsap.to(window, {
          duration: 1.2,
          scrollTo: {
            y: target,
            offsetY: 70
          },
          ease: 'power3.inOut'
        });
      }
    });
  });
}

/* ==========================================================================
   Hero Entrance Animation
   ========================================================================== */
function triggerHeroAnimations() {
  if (typeof gsap === 'undefined') return;

  const timeline = gsap.timeline();
  
  timeline.fromTo('.navbar', 
    { y: -100, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
  );

  timeline.fromTo('.hero-title', 
    { opacity: 0, y: 50 }, 
    { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
    '-=0.6'
  );

  timeline.fromTo('.hero-subtitle', 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
    '-=0.8'
  );

  timeline.fromTo('.hero-cta-group .btn', 
    { opacity: 0, scale: 0.9 }, 
    { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)', stagger: 0.15 },
    '-=0.6'
  );

  timeline.fromTo('.hero-visual', 
    { opacity: 0, x: 50, scale: 0.95 }, 
    { opacity: 1, x: 0, scale: 1, duration: 1.5, ease: 'power3.out' },
    '-=1.2'
  );
}

/* ==========================================================================
   Stats Counters (Animate Count Up)
   ========================================================================== */
function initStatsCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length === 0) return;

  const countUp = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * target);

      counter.textContent = currentValue.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        counter.textContent = target.toLocaleString() + suffix;
      }
    };

    requestAnimationFrame(updateCount);
  };

  const observerOptions = {
    root: null,
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

/* ==========================================================================
   3D Card Tilt Effects
   ========================================================================== */
function initCardTilts() {
  const tiltCards = document.querySelectorAll('.tilt-card');
  
  // Skip on mobile screens for performance and user-experience issues
  if (window.matchMedia('(max-width: 991px)').matches) return;

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate within element
      const y = e.clientY - rect.top;  // y coordinate within element
      
      const width = rect.width;
      const height = rect.height;
      
      // Convert to degrees (-10deg to +10deg)
      const rotateX = -10 * ((y - height / 2) / (height / 2));
      const rotateY = 10 * ((x - width / 2) / (width / 2));
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.transition = 'transform 0.5s ease';
    });
  });
}
