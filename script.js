/* ============================================================
   BUILDCRAFT - Premium Construction & Real Estate Website
   script.js
   ============================================================ */

'use strict';

// ----- DOM READY -----
document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     DARK / LIGHT MODE TOGGLE
     ========================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  const storedTheme = localStorage.getItem('theme');

  // Apply stored theme on load
  if (storedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  }

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      themeIcon.classList.replace('fa-sun', 'fa-moon');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.classList.replace('fa-moon', 'fa-sun');
      localStorage.setItem('theme', 'dark');
    }
  });

  /* ==========================================================
     MOBILE HAMBURGER MENU
     ========================================================== */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });

  /* ==========================================================
     ACTIVE NAV LINK HIGHLIGHT (Intersection Observer)
     ========================================================== */
  const sections = document.querySelectorAll('section[id]');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { rootMargin: '-50% 0px -50% 0px' }
  );

  sections.forEach(section => navObserver.observe(section));

  /* ==========================================================
     COUNTER ANIMATION (Intersection Observer)
     ========================================================== */
  const counterNumbers = document.querySelectorAll('.counter-number');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          counterNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            animateCounter(counter, target);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  if (counterNumbers.length > 0) {
    counterObserver.observe(counterNumbers[0].closest('.counters'));
  }

  function animateCounter(element, target) {
    const duration = 2000;
    const step = Math.max(1, Math.floor(target / 60));
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = current;
      }
    }, duration / 60);
  }

  /* ==========================================================
     SCROLL REVEAL (Intersection Observer)
     ========================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==========================================================
     CONTACT FORM HANDLING (Formspree)
     ========================================================== */
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        alert('Thank you! Your message has been sent successfully.');
        contactForm.reset();
      } else {
        alert('Something went wrong. Please try again later.');
      }
    } catch {
      alert('Network error. Please check your connection and try again.');
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });

  /* ==========================================================
     SMOOTH SCROLL FOR NAV LINKS (Fallback)
     ========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
