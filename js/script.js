/*
 * sanmaticlinic - script.js
 * Core Interactive Features & DOM Manipulation
 * Fully accessible, clean, and modular vanilla javascript
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all core components
  initThemeToggle();
  initStickyNavbar();
  initMobileMenu();
  initReadingProgressBar();
  initAccordion();
  initLightbox();
  initRippleEffect();
  initCursorGlow();
  initScrollToTop();
  initFormValidation();
  initLazyLoading();
  initSearch();
});

/* ==========================================================================
   Dark / Light Theme Toggle
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.querySelector('.theme-toggle');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    let newTheme = theme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Dispatch custom event for animations.js to react if needed
    window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme: newTheme } }));
  });
}

/* ==========================================================================
   Sticky Navbar
   ========================================================================== */
function initStickyNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const scrollThreshold = 50;

  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Initial check
  handleScroll();
}

/* ==========================================================================
   Mobile Responsive Menu
   ========================================================================== */
function initMobileMenu() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navbar) return;

  // Toggle Menu
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    navbar.classList.toggle('menu-open');
    const isOpen = navbar.classList.contains('menu-open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on clicking outside navbar
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navbar.classList.contains('menu-open')) {
      navbar.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   Reading Progress Bar
   ========================================================================== */
function initReadingProgressBar() {
  const progressBar = document.querySelector('.reading-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (height > 0) {
      const scrolled = (windowScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    } else {
      progressBar.style.width = '0%';
    }
  });
}

/* ==========================================================================
   Accordion Layout (FAQ)
   ========================================================================== */
function initAccordion() {
  const headers = document.querySelectorAll('.accordion-header');
  
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close other open accordions
      document.querySelectorAll('.accordion-item.active').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('active');
          openItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
        }
      });
      
      // Toggle current accordion
      item.classList.toggle('active');
      header.setAttribute('aria-expanded', !isActive);
    });
    
    // Support space and enter key for accessibility
    header.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        header.click();
      }
    });
  });
}

/* ==========================================================================
   Image Lightbox (Gallery)
   ========================================================================== */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const lightboxCaption = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
  const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const galleryItems = document.querySelectorAll('.gallery-item-trigger');

  if (!lightbox || !lightboxImg) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const largeImgUrl = item.getAttribute('href') || item.querySelector('img').src;
      const captionText = item.getAttribute('data-caption') || item.querySelector('img').alt;

      lightboxImg.src = largeImgUrl;
      if (lightboxCaption) {
        lightboxCaption.textContent = captionText;
      }

      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scroll
      closeBtn.focus();
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
    lightboxImg.src = ''; // Clear source to prevent flash next open
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Handle escape key to close lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   Ripple Button Animation
   ========================================================================== */
function initRippleEffect() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      // Cleanup
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/* ==========================================================================
   Custom Interactive Cursor Glow
   ========================================================================== */
function initCursorGlow() {
  // Only enable on desktop screens where hover exists
  if (window.matchMedia('(hover: hover)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    });

    // Enlarge glow on clickable items
    const clickables = document.querySelectorAll('a, button, .accordion-header, [role="button"]');
    clickables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        glow.style.width = '600px';
        glow.style.height = '600px';
      });
      item.addEventListener('mouseleave', () => {
        glow.style.width = '400px';
        glow.style.height = '400px';
      });
    });
  }
}

/* ==========================================================================
   Scroll To Top Action
   ========================================================================== */
function initScrollToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   Premium Client Form Validation
   ========================================================================== */
function initFormValidation() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    // Skip native search forms
    if (form.classList.contains('nav-search')) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const isAppointmentForm = form.getAttribute('aria-label') === 'Appointment Request Form' || form.querySelector('#form-name') !== null;

      // Clear previous validation alert box
      const existingAlert = form.querySelector('.form-alert-box');
      if (existingAlert) {
        existingAlert.remove();
      }

      // Clear all previous invalid classes
      form.querySelectorAll('.invalid').forEach(input => input.classList.remove('invalid'));

      if (isAppointmentForm) {
        const nameInput = form.querySelector('#form-name');
        const phoneInput = form.querySelector('#form-phone');
        const emailInput = form.querySelector('#form-email');
        const messageInput = form.querySelector('#form-message');

        const name = nameInput ? nameInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';

        let errors = [];

        // 1. Name validation
        if (!name) {
          errors.push({ field: nameInput, msg: "Your Full Name is required." });
        } else {
          if (name.length < 2) {
            errors.push({ field: nameInput, msg: "Full Name must be at least 2 characters long." });
          }
          if (!/^[a-zA-Z\s.]+$/.test(name)) {
            errors.push({ field: nameInput, msg: "Full Name should only contain alphabetic letters and spaces." });
          }
        }

        // 2. Mobile validation
        if (!phone) {
          errors.push({ field: phoneInput, msg: "Mobile Number is required." });
        } else if (!/^[1-9][0-9]{9}$/.test(phone)) {
          errors.push({ field: phoneInput, msg: "Mobile Number must be exactly 10 digits and cannot start with 0." });
        }

        // 3. Email validation
        const emailHasUppercase = /[A-Z]/.test(email);
        const emailEndsWithCom = /\.com$/.test(email);
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.com$/;

        if (!email) {
          errors.push({ field: emailInput, msg: "Email Address is required." });
        } else if (emailHasUppercase) {
          errors.push({ field: emailInput, msg: "Email Address should not contain uppercase letters." });
        } else if (!emailEndsWithCom) {
          errors.push({ field: emailInput, msg: "Email Address must end with .com." });
        } else if (!emailRegex.test(email)) {
          errors.push({ field: emailInput, msg: "Please enter a valid lowercase email format (e.g., name@domain.com)." });
        }

        // 4. Message validation
        if (!message) {
          errors.push({ field: messageInput, msg: "Ailment/therapy description is required." });
        } else if (message.length < 5) {
          errors.push({ field: messageInput, msg: "Ailment/therapy details must be at least 5 characters long." });
        }

        if (errors.length > 0) {
          // Highlight invalid fields
          errors.forEach(err => {
            if (err.field) {
              err.field.classList.add('invalid');
            }
          });

          // Create alert box
          const alertBox = document.createElement('div');
          alertBox.className = 'form-alert-box glass-card';
          alertBox.style.cssText = `
            background: rgba(239, 68, 68, 0.08);
            border: 1.5px solid #ef4444;
            padding: 1.25rem 1.5rem;
            border-radius: var(--border-radius-sm);
            margin-bottom: 1.5rem;
            color: #ff5c5c;
            font-size: 0.875rem;
          `;

          let alertHtml = '<strong style="display:block; margin-bottom: 0.5rem; color: #ef4444; font-size: 0.95rem;">Please resolve the following entries:</strong><ul style="margin: 0; padding-left: 1.25rem; line-height: 1.6;">';
          errors.forEach(err => {
            alertHtml += `<li>${err.msg}</li>`;
          });
          alertHtml += '</ul>';
          alertBox.innerHTML = alertHtml;

          form.insertBefore(alertBox, form.firstChild);
          alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          return;
        }

        // Success: Compile and send to WhatsApp
        const whatsappMsg = `Hello Dr. Smeeta, I would like to book an appointment:\n\n` +
                            `• *Name:* ${name}\n` +
                            `• *Mobile:* ${phone}\n` +
                            `• *Email:* ${email}\n` +
                            `• *Ailment/Therapy:* ${message}`;

        const encodedMsg = encodeURIComponent(whatsappMsg);
        const whatsappUrl = `https://wa.me/919902870235?text=${encodedMsg}`;

        // Open WhatsApp chat
        window.open(whatsappUrl, '_blank');

        // Show success toast notification
        showNotification(form);

      } else {
        // Standard Newsletter Form validation
        let isValid = true;
        const inputs = form.querySelectorAll('input[required]');

        inputs.forEach(input => {
          if (!input.value.trim()) {
            isValid = false;
            input.classList.add('invalid');
          } else if (input.type === 'email' && !validateEmail(input.value)) {
            isValid = false;
            input.classList.add('invalid');
          }
        });

        if (isValid) {
          showNotification(form);
        }
      }
    });
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showNotification(form) {
    const toast = document.createElement('div');
    toast.className = 'glass-card';
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translate(-50%, 100px);
      z-index: 2000;
      padding: 1.5rem 3rem;
      border-color: var(--accent-color);
      text-align: center;
      opacity: 0;
      transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease;
    `;
    toast.innerHTML = `
      <h4 style="margin: 0 0 0.5rem; color: var(--primary-color);">Thank You!</h4>
      <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Opening WhatsApp connection... Your request details are compiled!</p>
    `;
    document.body.appendChild(toast);

    // Trigger slide up
    setTimeout(() => {
      toast.style.transform = 'translate(-50%, 0)';
      toast.style.opacity = '1';
    }, 100);

    // Slide down and remove
    setTimeout(() => {
      toast.style.transform = 'translate(-50%, 100px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 500);
      form.reset();
    }, 4000);
  }
}

/* ==========================================================================
   Lazy Loading Images
   ========================================================================== */
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          if (image.dataset.src) {
            image.src = image.dataset.src;
          }
          image.classList.add('loaded');
          observer.unobserve(image);
        }
      });
    });

    lazyImages.forEach(image => {
      imageObserver.observe(image);
    });
  } else {
    // Fallback for older browsers
    lazyImages.forEach(image => {
      if (image.dataset.src) {
        image.src = image.dataset.src;
      }
    });
  }
}

/* ==========================================================================
   Dynamic Search Bar Logic
   ========================================================================== */
function initSearch() {
  const searchInputs = document.querySelectorAll('.nav-search input, .nav-search-mobile input');
  if (searchInputs.length === 0) return;

  // Search index database
  const searchDatabase = [
    { name: "Abhyanga (Ayurvedic Massage)", url: "treatments.html", keywords: "massage, oil, body, relax, prakriti" },
    { name: "Shirodhara (Nervous System Calming)", url: "treatments.html", keywords: "shirodhara, third eye, sleep, stress, anxiety, forehead" },
    { name: "Nasya (Nasal Therapy)", url: "treatments.html", keywords: "nasya, nose, sinus, head, neck, respiratory" },
    { name: "Netra Tarpana (Eye Rejuvenation)", url: "treatments.html", keywords: "eye, vision, netra, computer strain, tears" },
    { name: "Udwarthanam (Weight Management)", url: "treatments.html", keywords: "weight, fat, powder massage, skin, metabolism, udwarthanam" },
    { name: "Swedana (Herbal Steam Therapy)", url: "treatments.html", keywords: "steam, sweat, detox, blood circulation, swedana" },
    { name: "Vamana (Therapeutic Emesis)", url: "treatments.html", keywords: "vamana, kapha, stomach, vomit, emesis, asthma, purification" },
    { name: "Virechana (Therapeutic Purgation)", url: "treatments.html", keywords: "virechana, pitta, liver, spleen, skin, laxative, purification" },
    { name: "Suvarna Prashana Sanskara (Children)", url: "pushya.html", keywords: "suvarna, prashana, children, gold, kids, swarnaprashana, pushya" },
    { name: "Pushya Nakshatra Therapy", url: "pushya.html", keywords: "pushya, nakshatra, calendar, constellation" },
    { name: "About Dr. Smeeta B. Kanmuse", url: "about.html", keywords: "doctor, smeeta, experience, bio, qualifications, study" },
    { name: "Book Appointment / WhatsApp", url: "contact.html", keywords: "contact, booking, book, clinic, appointment, email, hours" },
    { name: "Clinic Hours & Location", url: "contact.html", keywords: "location, address, camp, kalaburagi, timings, open" }
  ];

  searchInputs.forEach(input => {
    // Create dropdown element
    const container = input.closest('.nav-search, .nav-search-mobile');
    if (!container) return;

    const dropdown = document.createElement('div');
    dropdown.className = 'search-dropdown';
    container.appendChild(dropdown);

    const performSearch = () => {
      const value = input.value.trim().toLowerCase();
      if (!value) {
        dropdown.classList.remove('active');
        dropdown.innerHTML = '';
        return;
      }

      const matches = searchDatabase.filter(item => 
        item.name.toLowerCase().includes(value) || 
        item.keywords.toLowerCase().includes(value)
      );

      if (matches.length === 0) {
        dropdown.innerHTML = `<div class="search-item no-results">No matches found for "${input.value}"</div>`;
      } else {
        dropdown.innerHTML = matches.map(match => `
          <a href="${match.url}" class="search-item">
            <span>${match.name}</span>
          </a>
        `).join('');
      }
      dropdown.classList.add('active');
    };

    input.addEventListener('input', performSearch);

    input.addEventListener('focus', () => {
      if (input.value.trim()) {
        dropdown.classList.add('active');
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    // Handle enter key to navigate to first result
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const firstLink = dropdown.querySelector('a.search-item');
        if (firstLink) {
          firstLink.click();
        }
      }
    });
  });
}
