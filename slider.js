// Card rows on phones: every .sl-swipe container becomes a swipeable strip (CSS scroll-snap,
// only below 600px); this adds the dots under each one — they follow the swipe and jump to a card on tap.
// On wider screens the dots are hidden by CSS and the containers keep their normal grid.
// .sl-swipe--always strips (review screenshots) scroll on every screen and also get ‹ › arrows.
(function () {
  document.querySelectorAll('.sl-swipe').forEach(strip => {
    const cards = [...strip.children].filter(el => el.nodeType === 1);
    if (cards.length < 2) return;

    // Where cards line up when snapped: the strip's left edge plus its scroll padding
    const snapLeft = () => strip.getBoundingClientRect().left + (parseFloat(getComputedStyle(strip).scrollPaddingLeft) || 0);
    const offsetOf = card => card.getBoundingClientRect().left - snapLeft();
    const goTo = i => {
      const card = cards[Math.max(0, Math.min(cards.length - 1, i))];
      strip.scrollTo({ left: strip.scrollLeft + offsetOf(card), behavior: 'smooth' });
    };

    const dots = document.createElement('div');
    dots.className = 'sl-slider-dots';
    cards.forEach((card, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', String(i + 1) + ' / ' + cards.length);
      dot.addEventListener('click', () => goTo(i));
      dots.appendChild(dot);
    });

    let active = 0;
    let prev = null;
    let next = null;
    if (strip.classList.contains('sl-swipe--always')) {
      const dict = (window.slI18n && window.slI18n.dict) || {};
      const arrow = (cls, label, key, text, step) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'sl-slider-arrow ' + cls;
        button.setAttribute('aria-label', dict[key] || label);
        button.setAttribute('data-i18n-aria-label', key);
        button.textContent = text;
        button.addEventListener('click', () => goTo(active + step));
        return button;
      };
      prev = arrow('sl-slider-prev', 'Попередній відгук', 'aria-prev', '‹', -1);
      next = arrow('sl-slider-next', 'Наступний відгук', 'aria-next', '›', 1);
      const nav = document.createElement('div');
      nav.className = 'sl-slider-nav';
      nav.append(prev, dots, next);
      strip.after(nav);
    } else {
      strip.after(dots);
    }

    // The active dot = the card closest to the snap line
    const update = () => {
      active = 0;
      cards.forEach((card, i) => {
        if (Math.abs(offsetOf(card)) < Math.abs(offsetOf(cards[active]))) active = i;
      });
      const atEnd = strip.scrollLeft > 0 && strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 2;
      // Scrolled to the very end: the last card can't reach the snap line, so light it explicitly
      if (atEnd) active = cards.length - 1;
      [...dots.children].forEach((dot, i) => dot.classList.toggle('is-active', i === active));
      if (prev) prev.disabled = strip.scrollLeft <= 2;
      if (next) next.disabled = atEnd || strip.scrollWidth <= strip.clientWidth + 2;
    };
    strip.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    window.addEventListener('resize', update);
    update();
  });
})();
