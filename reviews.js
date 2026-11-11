// Review screenshots: tap one in the strip to see it large in a native <dialog>.
// ‹ › buttons, the keyboard arrows and a sideways swipe move between reviews;
// ×, Esc or a tap outside the picture closes it.
(function () {
  const viewer = document.getElementById('review-lightbox');
  const shots = [...document.querySelectorAll('.sl-review img')];
  if (!viewer || !shots.length) return;

  const picture = viewer.querySelector('img');
  const count = viewer.querySelector('.sl-lightbox-count');
  let current = 0;

  const show = i => {
    current = (i + shots.length) % shots.length;
    picture.src = shots[current].currentSrc || shots[current].src;
    picture.alt = shots[current].alt;
    count.textContent = (current + 1) + ' / ' + shots.length;
  };
  const open = i => {
    show(i);
    if (typeof viewer.showModal === 'function') viewer.showModal();
    else viewer.setAttribute('open', '');
  };
  const close = () => {
    if (typeof viewer.close === 'function') viewer.close();
    else viewer.removeAttribute('open');
  };

  shots.forEach((img, i) => img.closest('.sl-review').addEventListener('click', () => open(i)));
  viewer.querySelector('.sl-lightbox-close').addEventListener('click', close);
  viewer.querySelector('.sl-lightbox-prev').addEventListener('click', () => show(current - 1));
  viewer.querySelector('.sl-lightbox-next').addEventListener('click', () => show(current + 1));
  viewer.addEventListener('click', event => { if (event.target === viewer) close(); });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
  });

  // Swipe left / right on phones
  let startX = null;
  viewer.addEventListener('touchstart', event => { startX = event.touches[0].clientX; }, { passive: true });
  viewer.addEventListener('touchend', event => {
    if (startX === null) return;
    const dx = event.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
