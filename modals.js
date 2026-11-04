// Course details pop-ups on the pricing cards.
// Native <dialog>: Esc closes it, focus stays inside while it is open.
// Each pop-up has its own URL hash (#group-lessons …), so it can be shared as a link
// and the browser's Back button closes it instead of leaving the page.
(function () {
  const dialogs = [...document.querySelectorAll('dialog.sl-modal')];
  if (!dialogs.length) return;

  const hashOf = dialog => '#' + dialog.id.replace('modal-', '') + '-lessons';
  const byHash = hash => dialogs.find(d => hashOf(d) === hash);
  const RETURN_HASH = '#prices';

  // true while the open pop-up's hash entry was pushed by us (so Back can pop it)
  let pushed = false;

  const show = dialog => {
    if (dialog.open) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'course_details_open', course: dialog.id.replace('modal-', '') });
  };
  const hide = dialog => {
    if (!dialog.open) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  };

  // Close by the user (×, backdrop, Esc): take the pop-up's hash back out of the URL
  const dismiss = dialog => {
    hide(dialog);
    if (location.hash !== hashOf(dialog)) return;
    if (pushed) history.back();
    else history.replaceState(null, '', RETURN_HASH);
    pushed = false;
  };

  document.querySelectorAll('[data-modal]').forEach(button => {
    const dialog = document.getElementById(button.getAttribute('data-modal'));
    if (!dialog) return;
    button.addEventListener('click', () => {
      history.pushState(null, '', hashOf(dialog));
      pushed = true;
      show(dialog);
    });
  });

  dialogs.forEach(dialog => {
    dialog.querySelector('.sl-modal-close').addEventListener('click', () => dismiss(dialog));
    dialog.addEventListener('click', event => { if (event.target === dialog) dismiss(dialog); });
    dialog.addEventListener('cancel', event => { event.preventDefault(); dismiss(dialog); });

    // "Записатись": swap the pop-up's URL for the form's and scroll there
    dialog.querySelectorAll('.sl-modal-actions a[href^="#"]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        const hash = link.getAttribute('href');
        hide(dialog);
        history.replaceState(null, '', hash);
        pushed = false;
        const target = document.querySelector(hash);
        if (target) target.scrollIntoView();
      });
    });
  });

  // Back / Forward, or a pasted link with a pop-up hash
  const sync = () => {
    const wanted = byHash(location.hash);
    dialogs.forEach(d => { if (d !== wanted) hide(d); });
    if (wanted) {
      document.getElementById('prices')?.scrollIntoView({ behavior: 'instant' });
      show(wanted);
    } else {
      pushed = false;
    }
  };
  window.addEventListener('popstate', sync);
  sync();
})();
