(() => {
  'use strict';

  // fixed start date, not the page's load date
  const RELATIONSHIP_START = new Date(2026, 7, 10);

  const screens = Array.from(document.querySelectorAll('.screen'));
  const total = screens.length;
  const progressEl = document.getElementById('storyProgress');
  const navPrev = document.getElementById('navPrev');
  const navNext = document.getElementById('navNext');
  const startBtn = document.getElementById('startBtn');
  const dayCounterEl = document.getElementById('dayCounter');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  let current = 0;
  let isAnimating = false;

  function buildProgressBars() {
    progressEl.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const bar = document.createElement('div');
      bar.className = 'story-progress__bar';
      const fill = document.createElement('div');
      fill.className = 'story-progress__fill';
      bar.appendChild(fill);
      progressEl.appendChild(bar);
    }
  }

  function updateProgressBars() {
    const bars = progressEl.querySelectorAll('.story-progress__bar');
    bars.forEach((bar, i) => {
      bar.classList.toggle('story-progress__bar--done', i <= current);
    });
  }

  function updateNavButtons() {
    if (!navPrev || !navNext) return;
    navPrev.disabled = current === 0;
    navNext.disabled = current === total - 1;
  }

  function goTo(index) {
    if (index < 0 || index >= total || index === current || isAnimating) return;

    const direction = index > current ? 'next' : 'prev';
    const prevScreen = screens[current];
    const nextScreen = screens[index];

    isAnimating = true;

    prevScreen.classList.remove('is-active');
    if (direction === 'next') {
      prevScreen.classList.add('is-prev');
    }

    nextScreen.classList.remove('is-prev');
    void nextScreen.offsetWidth; // force reflow so the enter transition replays
    nextScreen.classList.add('is-active');

    current = index;
    updateProgressBars();
    updateNavButtons();

    if (nextScreen.classList.contains('screen--counter')) {
      renderDayCounter();
    }

    window.setTimeout(() => {
      prevScreen.classList.remove('is-prev');
      isAnimating = false;
    }, 560);

    nextScreen.focus({ preventScroll: true });
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function renderDayCounter() {
    if (!dayCounterEl) return;
    const now = new Date();
    const start = new Date(RELATIONSHIP_START.getFullYear(), RELATIONSHIP_START.getMonth(), RELATIONSHIP_START.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const msPerDay = 1000 * 60 * 60 * 24;
    let days = Math.round((today - start) / msPerDay);
    if (days < 0) days = 0;

    dayCounterEl.textContent = days.toLocaleString('en-US');
  }

  function openLightbox(imgEl) {
    lightboxImg.src = imgEl.currentSrc || imgEl.src;
    lightboxImg.alt = imgEl.alt || '';
    lightbox.hidden = false;
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
  }

  screens.forEach((screen) => {
    screen.tabIndex = -1;
  });

  startBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    next();
  });

  navPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    prev();
  });

  navNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    next();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox && !lightbox.hidden) {
      if (e.key === 'Escape') closeLightbox();
      return;
    }
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
  });

  document.querySelectorAll('.polaroid img').forEach((img) => {
    img.addEventListener('click', (e) => {
      if (img.closest('.polaroid--empty')) return;
      e.stopPropagation();
      openLightbox(img);
    });
  });

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightboxImg) return;
    closeLightbox();
  });

  lightboxClose?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  buildProgressBars();
  updateProgressBars();
  updateNavButtons();
  screens[0].classList.add('is-active');
  renderDayCounter();
})();
