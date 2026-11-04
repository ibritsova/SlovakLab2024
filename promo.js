// Seasonal promo (Black Friday): announcement bar, promo section, countdown.
// - everything hides itself once ENDS_AT has passed, so the site never shows an expired offer
// - the announcement bar stays pinned above the nav for the whole promo (it can't be closed)
// - "Отримати знижку" puts the promo code into the application form's comment field
(function () {
  const ENDS_AT = Date.parse('2026-12-01T00:00:00+01:00'); // end of 30 November, Bratislava time

  const section = document.getElementById('black-friday');
  const bar = document.getElementById('bf-bar-wrap');

  const endPromo = () => {
    if (section) section.hidden = true;
    if (bar) bar.hidden = true;
    document.documentElement.classList.remove('has-bf-bar');
  };
  if (Date.now() >= ENDS_AT) { endPromo(); return; }

  // Announcement bar
  if (bar) {
    // Visitors who closed the earlier (closable) version get it back
    try { localStorage.removeItem('slovaklab-bf-bar-closed'); } catch (e) { /* storage unavailable */ }
    bar.hidden = false;
    document.documentElement.classList.add('has-bf-bar');
    // The bar now sits above the nav: re-align a section opened by link (#black-friday …) below both
    if (location.hash.length > 1) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant' }));
    }
    bar.querySelector('.sl-bf-bar-link').addEventListener('click', () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'promo_bar_click', promo_code: 'BlackLab' });
    });
  }

  // Countdown (in the promo section and in the bar)
  const boxes = { d: [], h: [], m: [], s: [] };
  document.querySelectorAll('[data-cd]').forEach(el => { boxes[el.getAttribute('data-cd')].push(el); });
  if (boxes.d.length) {
    const set = (list, value) => list.forEach(el => { el.textContent = value; });
    const pad = n => String(n).padStart(2, '0');
    const tick = () => {
      const left = ENDS_AT - Date.now();
      if (left <= 0) { endPromo(); clearInterval(timer); return; }
      const s = Math.floor(left / 1000);
      set(boxes.d, Math.floor(s / 86400));
      set(boxes.h, pad(Math.floor(s / 3600) % 24));
      set(boxes.m, pad(Math.floor(s / 60) % 60));
      set(boxes.s, pad(s % 60));
    };
    const timer = setInterval(tick, 1000);
    tick();
  }

  // CTA: carry the promo code into the form
  const cta = document.getElementById('bf-cta');
  const notes = document.getElementById('sk-notes');
  if (cta && notes) {
    cta.addEventListener('click', () => {
      const dict = (window.slI18n && window.slI18n.dict) || {};
      const line = dict['bf-notes'] || 'Промокод BlackLab — знижка −15% на перший місяць.';
      if (!notes.value.includes('BlackLab')) {
        notes.value = notes.value ? notes.value.trim() + '\n' + line : line;
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'promo_click', promo_code: 'BlackLab' });
    });
  }
})();
