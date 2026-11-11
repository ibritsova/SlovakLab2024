// Floating "write to us" button in the corner: opens Telegram / WhatsApp links.
// Clicks on the links themselves are counted by tracking.js (contact_click).
(function () {
  const root = document.getElementById('sl-chat');
  if (!root) return;
  const toggle = root.querySelector('.sl-chat-toggle');

  const setOpen = open => {
    root.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(!root.classList.contains('is-open')));
  document.addEventListener('click', event => { if (!root.contains(event.target)) setOpen(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setOpen(false); });
  root.querySelectorAll('.sl-chat-link').forEach(link => link.addEventListener('click', () => setOpen(false)));
})();
