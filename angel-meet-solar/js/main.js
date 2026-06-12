/* ===================================================
   ANGEL MEET SOLAR SOLUTION — Main JS
=================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── PRELOADER ──
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('hide'), 2000);
  }

  // ── NAVBAR SCROLL ──
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    // back to top
    const btn = document.getElementById('back-top');
    if (btn) {
      if (window.scrollY > 400) btn.classList.add('show');
      else btn.classList.remove('show');
    }
  };
  window.addEventListener('scroll', onScroll);

  // ── MOBILE MENU ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (mobileMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
      });
    });
  }

  // ── BACK TO TOP ──
  const backTop = document.getElementById('back-top');
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── SCROLL REVEAL ──
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  // ── COUNTER ANIMATION ──
  const counters = document.querySelectorAll('[data-count]');
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const dur = 2000;
        const step = target / (dur / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 16);
        countObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => countObs.observe(el));

  // ── PARTICLES ──
  const particleContainer = document.querySelector('.hero-particles');
  if (particleContainer) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        bottom:0;
        --dur:${Math.random() * 8 + 6}s;
        --delay:${Math.random() * 8}s;
        opacity:0;
      `;
      particleContainer.appendChild(p);
    }
  }

  // ── VIDEO PLAY BUTTON ──
  document.querySelectorAll('[data-video-trigger]').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrap = btn.closest('[data-video-wrap]');
      if (!wrap) return;
      const video = wrap.querySelector('video');
      const placeholder = wrap.querySelector('.video-placeholder');
      if (video) { video.play(); if (placeholder) placeholder.style.display = 'none'; btn.style.display = 'none'; }
    });
  });

  // ── CONTACT FORM ──
  // (Form submission is now handled by js/firebase-form.js, which saves
  //  enquiries to Firebase Firestore and shows the success/error message.)

  // ── ACTIVE NAV LINK ──
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const activeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[data-section="${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => activeObs.observe(s));

  // ── DUPLICATE TESTIMONIAL TRACK ──
  const track = document.querySelector('.testimonials-track');
  if (track) {
    const clone = track.innerHTML;
    track.innerHTML += clone;
  }

  // ── DUPLICATE TICKER ──
  const ticker = document.querySelector('.ticker-inner');
  if (ticker) ticker.innerHTML += ticker.innerHTML;

});
