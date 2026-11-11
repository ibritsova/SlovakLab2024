// Course details pop-ups on the pricing cards.
// Native <dialog>: Esc closes it, focus stays inside while it is open.
// Each pop-up has its own URL hash (#group-lessons …), so it can be shared as a link
// and the browser's Back button closes it instead of leaving the page.
(function () {
  const dialogs = [...document.querySelectorAll('dialog.sl-modal')];
  if (!dialogs.length) return;

  const hashOf = dialog => '#' + dialog.id.replace('modal-', '') + '-lessons';
  const byHash = hash => dialogs.find(d => hashOf(d) === hash);
  // The prices block the pop-ups belong to (#prices on the home page, #formats on Курси)
  const home = dialog => dialog.closest('#prices, #formats');
  const homeHash = dialog => (home(dialog) ? '#' + home(dialog).id : location.pathname);

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
    else history.replaceState(null, '', homeHash(dialog));
    pushed = false;
  };

  // One line per format in the application form's comment ("Цікавлять парні заняття.");
  // choosing another format replaces the earlier line instead of adding a second one
  const notes = document.getElementById('sk-notes');
  const FORMAT_NOTES = {
    'notes-group': 'Цікавлять групові заняття.',
    'notes-pair': 'Цікавлять парні заняття.',
    'notes-individual': 'Цікавлять індивідуальні заняття.'
  };
  let formatLine = '';
  const noteFormat = dialog => {
    if (!notes) return;
    const key = 'notes-' + dialog.id.replace('modal-', '');
    const dict = (window.slI18n && window.slI18n.dict) || {};
    const line = dict[key] || FORMAT_NOTES[key];
    if (!line) return;
    let text = notes.value;
    if (formatLine && text.includes(formatLine)) text = text.replace(formatLine, line);
    else if (!text.includes(line)) text = text ? text.trim() + '\n' + line : line;
    notes.value = text;
    formatLine = line;
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
    // (and note the chosen format in the form's comment, the way the promo code is)
    dialog.querySelectorAll('.sl-modal-actions a[href^="#"]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        const hash = link.getAttribute('href');
        noteFormat(dialog);
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
      home(wanted)?.scrollIntoView({ behavior: 'instant' });
      show(wanted);
    } else {
      pushed = false;
    }
  };
  window.addEventListener('popstate', sync);
  sync();
})();
