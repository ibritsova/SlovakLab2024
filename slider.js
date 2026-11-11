// Universities on phones: the grid becomes a swipeable strip (CSS scroll-snap);
// this adds the dots under it — they follow the swipe and jump to a card on tap.
(function () {
  const strip = document.querySelector('.sl-uni-grid');
  if (!strip) return;
  const cards = [...strip.children];

  const dots = document.createElement('div');
  dots.className = 'sl-slider-dots';
  cards.forEach((card, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', String(i + 1) + ' / ' + cards.length);
    dot.addEventListener('click', () => {
      strip.scrollTo({ left: card.offsetLeft - strip.offsetLeft - parseFloat(getComputedStyle(strip).scrollPaddingLeft || 0), behavior: 'smooth' });
    });
    dots.appendChild(dot);
  });
  strip.after(dots);

  // The active dot = the card closest to the strip's left edge
  const update = () => {
    const left = strip.scrollLeft;
    let active = 0;
    cards.forEach((card, i) => {
      if (Math.abs(card.offsetLeft - strip.offsetLeft - left) < Math.abs(cards[active].offsetLeft - strip.offsetLeft - left)) active = i;
    });
    // Scrolled to the very end: the last card can't reach the left edge, so light it explicitly
    if (left + strip.clientWidth >= strip.scrollWidth - 2) active = cards.length - 1;
    [...dots.children].forEach((dot, i) => dot.classList.toggle('is-active', i === active));
  };
  strip.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  window.addEventListener('resize', update);
  update();
})();
