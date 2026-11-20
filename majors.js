// Majors & difficulty (data from the SlovakLab guide):
//  - group chips filter the cards and dim the other dots on the map
//  - sorting: by group (guide order), easier to get in, easier to study
//  - a number on the map opens that major's card and scrolls to it
//  - opening a card is reported to GTM (major_open)
(function () {
  const root = document.getElementById('target-section-sk-majors');
  if (!root) return;
  const list = root.querySelector('.sl-majors-list');
  const cards = [...list.querySelectorAll('.sl-major')];
  const dots = [...root.querySelectorAll('.sl-map-dot')];
  const chips = [...root.querySelectorAll('.sl-chip')];
  const sorts = [...root.querySelectorAll('.sl-sort')];

  const filter = group => {
    chips.forEach(c => c.classList.toggle('is-active', c.dataset.filter === group));
    cards.forEach(c => { c.hidden = group !== 'all' && c.dataset.group !== group; });
    dots.forEach(d => d.classList.toggle('is-dim', group !== 'all' && d.dataset.group !== group));
  };
  chips.forEach(chip => chip.addEventListener('click', () => filter(chip.dataset.filter)));

  // Ties keep the guide order (by the other rating, then by number)
  const sortBy = key => {
    sorts.forEach(s => s.classList.toggle('is-active', s.dataset.sort === key));
    const other = key === 'entry' ? 'study' : 'entry';
    const ordered = [...cards].sort((a, b) => key === 'n'
      ? a.dataset.n - b.dataset.n
      : (a.dataset[key] - b.dataset[key]) || (a.dataset[other] - b.dataset[other]) || (a.dataset.n - b.dataset.n));
    ordered.forEach(card => list.appendChild(card));
  };
  sorts.forEach(s => s.addEventListener('click', () => sortBy(s.dataset.sort)));

  dots.forEach(dot => dot.addEventListener('click', () => {
    const card = document.getElementById('major-' + dot.dataset.major);
    if (!card) return;
    filter('all');
    card.open = true;
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.classList.remove('is-flash');
    void card.offsetWidth; // restart the highlight animation
    card.classList.add('is-flash');
  }));

  cards.forEach(card => card.addEventListener('toggle', () => {
    if (!card.open) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'major_open', major: card.querySelector('.sl-major-name').textContent.trim() });
  }));
})();
