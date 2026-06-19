/* ============================================================
   TITAN FITNESS — script.js
   Funcionalidades: nav, scroll, animações, FAQ, contadores
   ============================================================ */

'use strict';

/* ─── HEADER: sticky + scroll ─────────────────────────────── */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ─── MOBILE MENU ─────────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');
  if (!hamburger || !nav) return;

  const toggle = () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', isOpen);
  };

  const close = () => {
    nav.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', toggle);

  // Close when a nav link is clicked
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();


/* ─── SMOOTH SCROLL for anchor links ──────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      const headerH = document.getElementById('header')?.offsetHeight || 80;
      const top     = target.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ─── ACTIVE NAV LINK on scroll ───────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    let current = '';
    const offset = 120;

    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - offset) {
        current = sec.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ─── REVEAL ANIMATIONS (Intersection Observer) ───────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once revealed, stop observing
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


/* ─── ANIMATED COUNTERS ───────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  // Easing function (ease out)
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000; // ms
    const start    = performance.now();
    const startVal = 0;

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOut(progress) * (target - startVal) + startVal);

      el.textContent = value.toLocaleString('pt-BR');

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString('pt-BR');
      }
    };

    requestAnimationFrame(tick);
  };

  // Trigger when element enters viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ─── FAQ ACCORDION ───────────────────────────────────────── */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      items.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
          const ans = other.querySelector('.faq-answer');
          if (ans) ans.style.maxHeight = '0';
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();


/* ─── BACK TO TOP BUTTON ──────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const onScroll = () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ─── CTA FORM HANDLER ────────────────────────────────────── */
function handleCTA() {
  const inputs = document.querySelectorAll('.cta-input');
  const name   = inputs[0]?.value.trim();
  const phone  = inputs[1]?.value.trim();

  if (!name || !phone) {
    // Shake animation for empty fields
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#ff4444';
        input.style.animation = 'shake 0.4s ease';
        setTimeout(() => {
          input.style.borderColor = '';
          input.style.animation = '';
        }, 400);
      }
    });
    return;
  }

  // Simulate submission success
  const btn = document.querySelector('.cta-section .btn-primary');
  if (btn) {
    const original = btn.innerHTML;
    btn.innerHTML = '✓ Agendado com sucesso!';
    btn.style.background = '#22c55e';
    btn.style.color = '#fff';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
      inputs.forEach(i => { i.value = ''; });
    }, 3000);
  }
}


/* ─── HERO PARALLAX (subtle) ──────────────────────────────── */
(function initParallax() {
  const orb = document.querySelector('.hero-orb');
  if (!orb) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    orb.style.transform = `translateY(${y * 0.2}px)`;
  }, { passive: true });
})();


/* ─── CURSOR GLOW EFFECT (desktop only) ──────────────────── */
(function initCursorGlow() {
  // Only on devices that support hover (non-touch)
  if (window.matchMedia('(hover: none)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,208,0,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    z-index: 9999;
    transition: opacity 0.3s;
    opacity: 0;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let visible = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) {
      glow.style.opacity = '1';
      visible = true;
    }
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
    visible = false;
  });

  // Smooth lerp
  const lerp = (a, b, t) => a + (b - a) * t;

  const animate = () => {
    glowX = lerp(glowX, mouseX, 0.08);
    glowY = lerp(glowY, mouseY, 0.08);
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    requestAnimationFrame(animate);
  };
  animate();
})();


/* ─── SHAKE KEYFRAME (injected) ──────────────────────────── */
(function injectShakeKeyframe() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);
})();


/* ─── INIT LOG ────────────────────────────────────────────── */
console.log('%c⚡ TITAN FITNESS', 'color: #FFD000; font-size: 20px; font-weight: bold;');
console.log('%cSite carregado com sucesso.', 'color: #888; font-size: 12px;');
