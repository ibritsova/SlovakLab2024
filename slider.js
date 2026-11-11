// Card rows on phones: every .sl-swipe container becomes a swipeable strip (CSS scroll-snap,
// only below 600px); this adds the dots under each one — they follow the swipe and jump to a card on tap.
// On wider screens the dots are hidden by CSS and the containers keep their normal grid.
(function () {
  document.querySelectorAll('.sl-swipe').forEach(strip => {
    const cards = [...strip.children].filter(el => el.nodeType === 1);
    if (cards.length < 2) return;

    // Where cards line up when snapped: the strip's left edge plus its scroll padding
    const snapLeft = () => strip.getBoundingClientRect().left + (parseFloat(getComputedStyle(strip).scrollPaddingLeft) || 0);
    const offsetOf = card => card.getBoundingClientRect().left - snapLeft();

    const dots = document.createElement('div');
    dots.className = 'sl-slider-dots';
    cards.forEach((card, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', String(i + 1) + ' / ' + cards.length);
      dot.addEventListener('click', () => {
        strip.scrollTo({ left: strip.scrollLeft + offsetOf(card), behavior: 'smooth' });
      });
      dots.appendChild(dot);
    });
    strip.after(dots);

    // The active dot = the card closest to the snap line
    const update = () => {
      let active = 0;
      cards.forEach((card, i) => {
        if (Math.abs(offsetOf(card)) < Math.abs(offsetOf(cards[active]))) active = i;
      });
      // Scrolled to the very end: the last card can't reach the snap line, so light it explicitly
      if (strip.scrollLeft > 0 && strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 2) active = cards.length - 1;
      [...dots.children].forEach((dot, i) => dot.classList.toggle('is-active', i === active));
    };
    strip.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    window.addEventListener('resize', update);
    update();
  });
})();
