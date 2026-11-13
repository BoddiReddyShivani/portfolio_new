/* ============================================================
   Portfolio Script – Boddireddy Shivani
   Handles: Navbar scroll, mobile menu, scroll-spy,
            scroll-to-top, fade-in animations, contact form
   ============================================================ */

'use strict';

/* ---------- DOM references ---------- */
const navbar       = document.getElementById('navbar');
const hamburger    = document.getElementById('hamburger');
const navLinks     = document.getElementById('navLinks');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const contactForm  = document.getElementById('contactForm');
const formStatus   = document.getElementById('formStatus');

/* ============================================================
   NAVBAR – Sticky shadow on scroll
   ============================================================ */
const handleNavbarScroll = () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleNavbarScroll, { passive: true });

/* ============================================================
   MOBILE HAMBURGER MENU
   ============================================================ */
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

/* Close mobile menu when a link is clicked */
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* Close mobile menu when clicking outside */
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

/* ============================================================
   SCROLL SPY – highlight active nav link
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const activateNavLink = () => {
  let currentId = '';

  sections.forEach(section => {
    const top    = section.offsetTop - 90;
    const bottom = top + section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      currentId = section.getAttribute('id');
    }
  });

  navAnchors.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active');
    }
  });
};

window.addEventListener('scroll', activateNavLink, { passive: true });
activateNavLink(); // Run once on load

/* ============================================================
   SCROLL-TO-TOP BUTTON
   ============================================================ */
const handleScrollTop = () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
};

window.addEventListener('scroll', handleScrollTop, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   INTERSECTION OBSERVER – Fade-in animations
   ============================================================ */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target); // fire once
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-in').forEach((el, index) => {
  /* Stagger delay for grid children */
  el.style.transitionDelay = `${(index % 6) * 60}ms`;
  fadeObserver.observe(el);
});

/* ============================================================
   CONTACT FORM – Client-side validation & submission
   ============================================================ */
const showStatus = (type, message) => {
  formStatus.textContent = message;
  formStatus.className   = `form-status ${type}`;
};

const hideStatus = () => {
  formStatus.className = 'form-status';
  formStatus.textContent = '';
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideStatus();

  const name    = document.getElementById('contactName').value.trim();
  const email   = document.getElementById('contactEmail').value.trim();
  const message = document.getElementById('contactMessage').value.trim();
  const submit  = document.getElementById('contactSubmit');

  /* Validation */
  if (!name) {
    showStatus('error', '⚠ Please enter your name.');
    document.getElementById('contactName').focus();
    return;
  }
  if (!email || !validateEmail(email)) {
    showStatus('error', '⚠ Please enter a valid email address.');
    document.getElementById('contactEmail').focus();
    return;
  }
  if (message.length < 10) {
    showStatus('error', '⚠ Message must be at least 10 characters long.');
    document.getElementById('contactMessage').focus();
    return;
  }

  /* Simulate form submission (replace with real API/Formspree endpoint) */
  submit.disabled    = true;
  submit.textContent = 'Sending…';

  await new Promise(resolve => setTimeout(resolve, 1200)); // simulated network call

  showStatus(
    'success',
    '✅ Thanks for reaching out, ' + name + '! I\'ll get back to you within 24 hours.'
  );
  contactForm.reset();
  submit.disabled    = false;
  submit.innerHTML   = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
    Send Message
  `;

  /* Auto-hide success message after 6 s */
  setTimeout(hideStatus, 6000);
});

/* ============================================================
   SMOOTH ANCHOR SCROLLING (offset for fixed navbar)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const offset = navbar.offsetHeight + 8;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   TYPED EFFECT – Hero role text (subtle, no flicker)
   ============================================================ */
const typedEl = document.querySelector('.hero-role');
if (typedEl) {
  const roles = [
    'Full Stack Developer  |  Computer Science Student',
    'Python Enthusiast  |  Problem Solver',
    'MERN Stack Developer  |  CS Undergraduate',
  ];
  let roleIndex   = 0;
  let charIndex   = roles[0].length;
  let isDeleting  = false;
  let isPaused    = false;
  const PAUSE_MS  = 2600;
  const TYPE_MS   = 52;
  const DELETE_MS = 28;

  const type = () => {
    const current = roles[roleIndex];

    if (isPaused) {
      isPaused = false;
      isDeleting = true;
      setTimeout(type, PAUSE_MS);
      return;
    }

    if (!isDeleting) {
      typedEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isPaused = true;
        setTimeout(type, TYPE_MS);
        return;
      }
      setTimeout(type, TYPE_MS);
    } else {
      typedEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting  = false;
        roleIndex   = (roleIndex + 1) % roles.length;
        charIndex   = 0;
      }
      setTimeout(type, DELETE_MS);
    }
  };

  /* Start typed effect after a short delay */
  setTimeout(() => {
    charIndex  = 0;
    typedEl.textContent = '';
    type();
  }, 800);
}

/* ============================================================
   SKILL TAG hover – ripple (lightweight)
   ============================================================ */
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('mouseenter', () => {
    tag.style.transform = 'scale(1.05)';
  });
  tag.addEventListener('mouseleave', () => {
    tag.style.transform = '';
  });
});

/* ============================================================
   INIT – log version info
   ============================================================ */
console.info('%c Shivani Portfolio v1.0 – Clean · Professional · Fast ', 
  'background:#2563eb;color:#fff;border-radius:4px;padding:4px 10px;font-weight:600;');
