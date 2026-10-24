// Motion layer: scroll reveals, animated counters, goals marquee and scroll progress.
// Everything here is progressive — without JS, or when the visitor asks for
// reduced motion, the page is fully visible and static.
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  // Blocks that fade + rise in as they enter the viewport
  const REVEAL = [
    '.sl-block-head', '.bot-test-section', '.sl-founder-row',
    '.sl-price-card', '.sl-step', '.sl-uni-card', '.sl-quote',
    '.sl-benefit', '.sl-course', '.info-courses', '.sl-trial-cta', '.sl-sk-hero-grid',
    '.sl-benefits-photo',
    // the success message is display:none until the form is sent — never hide it
    '.form-container > *:not(.success-message)',
    '#target-section-sk-documents .sl-consult-checklist p', '#faqAccordion .sl-faq-item'
  ].join(',');

  // Containers that only need .is-visible to trigger their inner details
  // (ticks drawing in, numbers lighting up, photos settling)
  const DETAIL = [
    '.sl-consult-checklist', '.bot-test-section .checklist',
    '.sl-steps-grid',
    '.sl-sk-hero-photo', '.sl-benefits-photo', '.sl-founder-photo', '.sl-uni-photo'
  ].join(',');

  const inViewport = el => {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  };

  const pending = new Set();
  const show = el => {
    el.classList.add('is-visible');
    observer.unobserve(el);
    pending.delete(el);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) show(entry.target); });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  // A fast fling can carry an element past the viewport between two observer
  // checks; anything that is already above the bottom of the screen gets shown.
  let sweepQueued = false;
  const sweep = () => {
    sweepQueued = false;
    pending.forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight) show(el); });
  };
  window.addEventListener('scroll', () => {
    if (!sweepQueued && pending.size) { sweepQueued = true; setTimeout(sweep, 150); }
  }, { passive: true });

  function setupReveal() {
    document.querySelectorAll(REVEAL).forEach(el => {
      el.classList.add('sl-reveal');
      // Stagger cards that sit side by side
      const siblings = el.parentElement ? [...el.parentElement.children].filter(c => c.matches(REVEAL)) : [];
      const index = Math.max(0, siblings.indexOf(el));
      el.style.setProperty('--sl-delay', Math.min(index, 5) * 90 + 'ms');
    });

    // Anything already on screen is shown straight away, so nothing flashes
    document.querySelectorAll('.sl-reveal, ' + DETAIL).forEach(el => {
      if (inViewport(el)) el.classList.add('is-visible');
      else { pending.add(el); observer.observe(el); }
    });

    document.documentElement.classList.add('sl-anim');

    // Elements already visible at load still get their detail animations
    requestAnimationFrame(() => {
      document.querySelectorAll(DETAIL).forEach(el => {
        if (el.classList.contains('is-visible')) {
          el.classList.remove('is-visible');
          requestAnimationFrame(() => el.classList.add('is-visible'));
        }
      });
    });
  }

  // "500+" / "6" in the hero stats count up from zero
  function setupCounters() {
    const numbers = [...document.querySelectorAll('.sl-stat b')]
      .map(el => ({ el, match: el.textContent.trim().match(/^(\d+)(\D*)$/) }))
      .filter(item => item.match);

    const run = ({ el, match }) => {
      const target = parseInt(match[1], 10);
      const suffix = match[2];
      const duration = 1600;
      const start = performance.now();
      const step = now => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        counterObserver.unobserve(entry.target);
        numbers.filter(n => n.el === entry.target).forEach(run);
      });
    }, { threshold: 0.6 });

    numbers.forEach(item => {
      item.el.textContent = '0' + item.match[2];
      counterObserver.observe(item.el);
    });
  }

  // Goals strip becomes an endless ticker: a second copy of the row follows the first
  function setupMarquee() {
    const strip = document.querySelector('.sl-goals');
    const row = strip && strip.querySelector('.sl-goals-row');
    if (!row) return;

    const copy = row.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    // Ids must stay unique; translations follow the copy through data-i18n
    copy.querySelectorAll('[id]').forEach(el => {
      el.setAttribute('data-i18n', el.id);
      el.removeAttribute('id');
    });
    strip.appendChild(copy);
    strip.classList.add('is-marquee');
  }

  // Thin progress line under the nav
  function setupProgress() {
    const root = document.documentElement;
    let ticking = false;
    const update = () => {
      const max = root.scrollHeight - window.innerHeight;
      root.style.setProperty('--sl-progress', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  const init = () => {
    setupMarquee();
    setupReveal();
    setupCounters();
    setupProgress();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
