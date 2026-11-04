// Seasonal promo (Black Friday): announcement bar, promo section, countdown.
// - everything hides itself once ENDS_AT has passed, so the site never shows an expired offer
// - the bar can be closed; the choice is remembered in this browser
// - "Отримати знижку" puts the promo code into the application form's comment field
(function () {
  const ENDS_AT = Date.parse('2026-12-01T00:00:00+01:00'); // end of 30 November, Bratislava time
  const BAR_CLOSED_KEY = 'slovaklab-bf-bar-closed';

  const section = document.getElementById('black-friday');
  const bar = document.getElementById('bf-bar-wrap');

  const endPromo = () => {
    if (section) section.hidden = true;
    if (bar) bar.hidden = true;
  };
  if (Date.now() >= ENDS_AT) { endPromo(); return; }

  // Announcement bar
  if (bar) {
    let closed = false;
    try { closed = localStorage.getItem(BAR_CLOSED_KEY) === '1'; } catch (e) { /* storage unavailable */ }
    bar.hidden = closed;
    bar.querySelector('.sl-bf-bar-close').addEventListener('click', () => {
      bar.hidden = true;
      try { localStorage.setItem(BAR_CLOSED_KEY, '1'); } catch (e) { /* storage unavailable */ }
    });
    bar.querySelector('.sl-bf-bar-link').addEventListener('click', () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'promo_bar_click', promo_code: 'BlackLab' });
    });
  }

  // Countdown
  const boxes = {};
  document.querySelectorAll('[data-countdown] [data-cd]').forEach(el => { boxes[el.getAttribute('data-cd')] = el; });
  if (boxes.d) {
    const pad = n => String(n).padStart(2, '0');
    const tick = () => {
      const left = ENDS_AT - Date.now();
      if (left <= 0) { endPromo(); clearInterval(timer); return; }
      const s = Math.floor(left / 1000);
      boxes.d.textContent = Math.floor(s / 86400);
      boxes.h.textContent = pad(Math.floor(s / 3600) % 24);
      boxes.m.textContent = pad(Math.floor(s / 60) % 60);
      boxes.s.textContent = pad(s % 60);
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
