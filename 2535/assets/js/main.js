/* ==========================================================================
   PROJEKT 25-35 — Nawigacja, Scroll-Reveal, Clipboard UX
   ========================================================================== */

(function () {
  document.documentElement.classList.add('js-ready');

  function initStickyHeader() {
    const header = document.getElementById('site-header');
    const hero = document.getElementById('hero');
    if (!header || !hero || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const heroVisible = entries[0].isIntersecting;
        header.classList.toggle('is-visible', !heroVisible);
      },
      { threshold: 0.15 }
    );
    observer.observe(hero);
  }

  function initMobileDrawer() {
    const toggle = document.getElementById('nav-toggle');
    const drawer = document.getElementById('mobile-drawer');
    if (!toggle || !drawer) return;

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      drawer.classList.toggle('is-open', open);
      drawer.setAttribute('aria-hidden', String(!open));
    };

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });
  }

  function initScrollReveals() {
    const targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    const prefersReduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !('IntersectionObserver' in window)) {
      targets.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          obs.unobserve(el);
          if (typeof window.anime === 'function') {
            window.anime({
              targets: el,
              opacity: [0, 1],
              translateY: [18, 0],
              duration: 620,
              easing: 'easeOutCubic',
            });
          } else {
            el.style.opacity = '1';
            el.style.transform = 'none';
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }

  function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach((btn) => {
      const original = btn.textContent;
      btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-copy');
        if (!text) return;
        try {
          await copyText(text);
          btn.textContent = 'Skopiowano ✓';
          btn.classList.add('btn--copied');
          setTimeout(() => {
            btn.textContent = original;
            btn.classList.remove('btn--copied');
          }, 2000);
        } catch (_) {
          btn.textContent = 'Nie udało się skopiować';
        }
      });
    });
  }

  function initReplayIntro() {
    const replayBtn = document.getElementById('replay-intro');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        if (typeof window.runProjektIntro === 'function') {
          window.runProjektIntro(true);
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initMobileDrawer();
    initScrollReveals();
    initCopyButtons();
    initReplayIntro();
  });
})();
