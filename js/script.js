/* ============================================================
   IDA — Intelligent Data Analytics · script.js
   ============================================================ */

(function () {
  'use strict';

  /* ─── Prefers-reduced-motion check ──────────────────────── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── 1. NAVBAR SCROLL EFFECT ────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── 2. MOBILE MENU ─────────────────────────────────────── */
  const burger      = document.getElementById('burger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');

  const toggleMenu = (force) => {
    const isOpen = force !== undefined ? force : !burger.classList.contains('open');
    burger.classList.toggle('open', isOpen);
    mobileMenu.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  burger.addEventListener('click', () => toggleMenu());
  mobileLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));

  /* ─── 3. SCROLL REVEAL ───────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ─── 4. HERO CANVAS ANIMATION ───────────────────────────── */
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');

  /* Palette */
  const C_CYAN   = '#00E5C7';
  const C_VIOLET = '#7C6FFF';
  const C_AMBER  = '#FFB454';

  /* State */
  let W, H, animId;
  let phase   = 0;      // 0=helix → 1=histogram, 0..1 float
  let phasDir = 1;      // direction
  const NODES = 60;

  /* Node definition */
  const nodes = [];

  /* ─── 4a. Resize ───────────────────────────────────────── */
  const resize = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width  = rect.width  * window.devicePixelRatio;
    H = canvas.height = rect.height * window.devicePixelRatio;
    canvas.style.width  = rect.width  + 'px';
    canvas.style.height = rect.height + 'px';
    initNodes();
  };

  /* ─── 4b. Positions ─────────────────────────────────────── */
  function helixPos(i) {
    const t    = (i / NODES) * Math.PI * 4 - Math.PI * 2;
    const cx   = W / 2;
    const cy   = H / 2;
    const rX   = W * 0.18;
    const rY   = H * 0.38;
    // Two strands alternating
    const strand = i % 2 === 0 ? 1 : -1;
    return {
      x: cx + Math.sin(t) * rX * strand,
      y: cy + (i / NODES - 0.5) * rY * 2,
    };
  }

  function histPos(i) {
    const BARS  = 10;
    const barW  = W * 0.65 / BARS;
    const barIdx = Math.floor(i / (NODES / BARS));
    const heights = [0.38, 0.58, 0.72, 0.5, 0.85, 0.62, 0.44, 0.76, 0.55, 0.66];
    const bh    = H * heights[Math.min(barIdx, BARS - 1)] * 0.75;
    const bx    = W * 0.18 + barIdx * barW + barW / 2;
    const countInBar = Math.ceil(NODES / BARS);
    const posInBar   = i % countInBar;
    const by    = H * 0.82 - (posInBar / countInBar) * bh;
    return { x: bx, y: by };
  }

  /* ─── 4c. Init Nodes ─────────────────────────────────────── */
  function initNodes() {
    for (let i = 0; i < NODES; i++) {
      const hp = helixPos(i);
      const gp = histPos(i);
      const colors = [C_CYAN, C_VIOLET, C_AMBER];
      nodes[i] = nodes[i] || {
        x: hp.x, y: hp.y,
        color: colors[i % 3],
        radius: 2.5 + Math.random() * 2,
        speed: 0.4 + Math.random() * 0.6,
        offset: Math.random() * Math.PI * 2,
      };
      nodes[i].helixX = hp.x;
      nodes[i].helixY = hp.y;
      nodes[i].histX  = gp.x;
      nodes[i].histY  = gp.y;
    }
  }

  /* ─── 4d. Easing ─────────────────────────────────────────── */
  const easeInOut = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

  /* ─── 4e. Draw ────────────────────────────────────────────── */
  let lastTime = 0;
  function draw(ts) {
    if (prefersReduced) return;

    const dt = Math.min((ts - lastTime) / 1000, 0.05);
    lastTime  = ts;

    /* Advance phase */
    phase += phasDir * dt * 0.22;
    if (phase > 1) { phase = 1; phasDir = -1; }
    if (phase < 0) { phase = 0; phasDir =  1; }
    const ep = easeInOut(phase);

    /* Clear */
    ctx.clearRect(0, 0, W, H);

    /* Background glow */
    const grad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W*0.55);
    grad.addColorStop(0, 'rgba(0,229,199,0.04)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    /* Update & collect positions */
    const pos = nodes.map((n, i) => {
      const wobble = Math.sin(ts * 0.001 * n.speed + n.offset) * 4;
      const x = n.helixX + (n.histX - n.helixX) * ep + wobble;
      const y = n.helixY + (n.histY - n.helixY) * ep + wobble * 0.5;
      return { x, y, color: n.color, r: n.radius };
    });

    /* Connections */
    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        const dx = pos[i].x - pos[j].x;
        const dy = pos[i].y - pos[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const maxDist = W * 0.18;
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.35;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,229,199,${alpha.toFixed(3)})`;
          ctx.lineWidth   = 0.8;
          ctx.moveTo(pos[i].x, pos[i].y);
          ctx.lineTo(pos[j].x, pos[j].y);
          ctx.stroke();
        }
      }
    }

    /* Nodes */
    pos.forEach(p => {
      /* Glow */
      const gNode = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
      gNode.addColorStop(0, p.color + '55');
      gNode.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.fillStyle = gNode;
      ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
      ctx.fill();

      /* Core */
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  }

  /* ─── 4f. Start / Resize ─────────────────────────────────── */
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);
  resize();

  if (!prefersReduced) {
    animId = requestAnimationFrame(draw);
  }

  /* ─── 5. FORM ENHANCEMENTS ───────────────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      const btn = form.querySelector('.form-submit');
      btn.textContent = 'Envoi en cours…';
      btn.disabled    = true;
    });
  }

  /* ─── 6. ACTIVE NAV LINK ON SCROLL ──────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[data-section]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach(s => sectionObserver.observe(s));

  /* ─── 7. YEAR IN FOOTER ──────────────────────────────────── */
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
