/* ==========================================================================
   PROJEKT 25-35 — Choreografia ekranu wejścia (anime.js 3.2.2)
   Sekwencja:
   1. PROJEKT zjeżdża od góry
   2. 25 wjeżdża od lewej
   3. myślnik zoom-in ze środka
   4. 35 wjeżdża od prawej
   5. pauza -> całość powiększa się w stronę użytkownika (scale up),
      a 25 i 35 rozsuwają się na boki jak zapraszające wrota
   ========================================================================== */

(function () {
  const SESSION_KEY = 'projekt2535_intro_seen';

  function getElements() {
    return {
      overlay: document.getElementById('intro-overlay'),
      stage: document.getElementById('intro-stage'),
      projekt: document.getElementById('intro-logo-projekt'),
      n25: document.getElementById('intro-logo-25'),
      dash: document.getElementById('intro-logo-dash'),
      n35: document.getElementById('intro-logo-35'),
      skipBtn: document.getElementById('intro-skip'),
    };
  }

  function finishIntro(overlay) {
    if (!overlay) return;
    overlay.classList.add('is-hidden');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('intro-active');
    document.body.classList.remove('intro-active');
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch (_) {}
  }

  function runIntro(forceReplay) {
    const el = getElements();
    if (!el.overlay || !el.stage) return;

    const prefersReduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const forceParam = new URLSearchParams(window.location.search).get('intro') === '1';

    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch (_) {}

    if (prefersReduced || (!forceReplay && !forceParam && alreadySeen) || typeof window.anime !== 'function') {
      finishIntro(el.overlay);
      return;
    }

    // Reset stanu przed startem (istotne przy powtórce)
    document.documentElement.classList.remove('intro-skip-initial');
    document.documentElement.classList.add('intro-active');
    document.body.classList.add('intro-active');
    el.overlay.classList.remove('is-hidden');
    el.overlay.setAttribute('aria-hidden', 'false');
    el.overlay.style.opacity = '1';

    window.anime.set(el.stage, { scale: 1, opacity: 1 });
    window.anime.set(el.projekt, { translateY: -95, opacity: 0 });
    window.anime.set(el.n25, { translateX: -140, opacity: 0 });
    window.anime.set(el.n35, { translateX: 140, opacity: 0 });
    window.anime.set(el.dash, { scale: 0, opacity: 0 });

    const tl = window.anime.timeline({
      autoplay: true,
      complete: () => finishIntro(el.overlay),
    });

    // 1. Słowo PROJEKT zjeżdża od góry (po krótkiej chwili pustego tła)
    tl.add({
      targets: el.projekt,
      translateY: [-95, 0],
      opacity: [0, 1],
      delay: 80,
      duration: 620,
      easing: 'easeOutExpo',
    })
      // 2. 25 wjeżdża od lewej
      .add(
        {
          targets: el.n25,
          translateX: [-140, 0],
          opacity: [0, 1],
          duration: 500,
          easing: 'easeOutCubic',
        },
        '-=240'
      )
      // 3. Zoom-in myślnika
      .add(
        {
          targets: el.dash,
          scale: [0, 1],
          opacity: [0, 1],
          duration: 280,
          easing: 'easeOutBack(2.2)',
        },
        '-=200'
      )
      // 4. 35 wjeżdża od prawej
      .add(
        {
          targets: el.n35,
          translateX: [140, 0],
          opacity: [0, 1],
          duration: 500,
          easing: 'easeOutCubic',
        },
        '-=120'
      )
      // 5A. Chwila oddechu, po czym całość powiększa się w stronę użytkownika (efekt wejścia w głąb)
      .add(
        {
          targets: el.stage,
          scale: [1, 2.35],
          duration: 820,
          easing: 'easeInOutQuart',
        },
        '+=240'
      )
      // 5B. Myślnik znika, robiąc miejsce na przejście
      .add(
        {
          targets: el.dash,
          scale: [1, 0],
          opacity: [1, 0],
          duration: 240,
          easing: 'easeInQuad',
        },
        '-=820'
      )
      // 5C. PROJEKT unosi się nad „nadprożem” i rozmywa
      .add(
        {
          targets: el.projekt,
          translateY: [0, -75],
          opacity: [1, 0],
          duration: 580,
          easing: 'easeInCubic',
        },
        '-=760'
      )
      // 5D. 25 otwiera się jak lewe skrzydło wrót
      .add(
        {
          targets: el.n25,
          translateX: [0, -240],
          opacity: [1, 0],
          duration: 740,
          easing: 'easeInOutQuart',
        },
        '-=780'
      )
      // 5E. 35 otwiera się jak prawe skrzydło wrót
      .add(
        {
          targets: el.n35,
          translateX: [0, 240],
          opacity: [1, 0],
          duration: 740,
          easing: 'easeInOutQuart',
        },
        '-=740'
      )
      // 5F. Płynne wygaszenie tła overlay
      .add(
        {
          targets: el.overlay,
          opacity: [1, 0],
          duration: 420,
          easing: 'easeOutQuad',
        },
        '-=420'
      );

    const cancel = () => {
      tl.pause();
      finishIntro(el.overlay);
    };

    if (el.skipBtn) {
      el.skipBtn.onclick = cancel;
    }
    el.overlay.onclick = (e) => {
      if (e.target === el.overlay || e.target === el.stage) cancel();
    };
    window.addEventListener(
      'keydown',
      (e) => {
        if (e.key === 'Escape') cancel();
      },
      { once: true }
    );
  }

  window.runProjektIntro = runIntro;
  document.addEventListener('DOMContentLoaded', () => runIntro(false));
})();
