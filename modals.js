// Course details pop-ups on the pricing cards.
// Native <dialog>: Esc closes it, focus stays inside while it is open.
(function () {
  const open = dialog => {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'course_details_open', course: dialog.id.replace('modal-', '') });
  };
  const close = dialog => {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  };

  document.querySelectorAll('[data-modal]').forEach(button => {
    const dialog = document.getElementById(button.getAttribute('data-modal'));
    if (dialog) button.addEventListener('click', () => open(dialog));
  });

  document.querySelectorAll('dialog.sl-modal').forEach(dialog => {
    // The × button and "Записатись" close the pop-up; the link then scrolls on to the form
    dialog.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', () => close(dialog)));
    // A click on the dimmed backdrop (outside the box) closes it too
    dialog.addEventListener('click', event => { if (event.target === dialog) close(dialog); });
  });
})();
