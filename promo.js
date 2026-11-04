// Seasonal promo block (Black Friday).
// - hides itself once the date in data-until has passed, so the site never shows an expired offer
// - "Отримати знижку" puts the promo code into the application form's comment field
(function () {
  const section = document.getElementById('black-friday');
  if (!section) return;

  const until = Date.parse(section.getAttribute('data-until') || '');
  if (!isNaN(until) && Date.now() >= until) {
    section.hidden = true;
    return;
  }

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
