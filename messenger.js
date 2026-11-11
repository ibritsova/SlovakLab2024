// Floating contact UI:
//  - "write to us" button in the corner: opens Telegram / WhatsApp links
//    (clicks on the links themselves are counted by tracking.js as contact_click)
//  - phones: a "sign up" button pinned to the bottom of the screen (CSS shows it only below 600px);
//    it appears once the first screen is scrolled past and hides while the form itself is in view
(function () {
  const root = document.getElementById('sl-chat');
  if (root) {
    const toggle = root.querySelector('.sl-chat-toggle');
    const setOpen = open => {
      root.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setOpen(!root.classList.contains('is-open')));
    document.addEventListener('click', event => { if (!root.contains(event.target)) setOpen(false); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') setOpen(false); });
    root.querySelectorAll('.sl-chat-link').forEach(link => link.addEventListener('click', () => setOpen(false)));
  }

  const cta = document.getElementById('sl-sticky-cta');
  const form = cta && document.querySelector(cta.getAttribute('href'));
  if (!cta || !form) return;

  let formInView = false;
  const update = () => {
    const show = window.scrollY > window.innerHeight * 0.7 && !formInView;
    cta.classList.toggle('is-visible', show);
    // Hidden button stays out of the keyboard order and away from screen readers
    cta.setAttribute('aria-hidden', String(!show));
    cta.tabIndex = show ? 0 : -1;
  };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      formInView = entries[0].isIntersecting;
      update();
    }).observe(form);
  }
  window.addEventListener('scroll', update, { passive: true });
  update();

  cta.addEventListener('click', () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'cta_click', cta_name: 'sticky_mobile' });
  });
})();
