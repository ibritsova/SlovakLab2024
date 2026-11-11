// Marketing helpers shared by both pages:
//  - remembers which ad brought the visitor (UTM tags, fbclid, gclid) so leads can be attributed
//  - reports clicks on the level-test bot and contact links to GTM (dataLayer) and Meta Pixel
//  - GTM events: cta_click (hero button), form_start / form_abandon / form_resume, time_on_site (15/30/60 s)
(function () {
  const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];
  const STORE_KEY = 'slovaklab-attribution';

  // Last ad touch wins: overwrite only when the URL actually carries campaign parameters.
  // It is kept in the browser only with ads consent (consent.js calls slAttributionSave);
  // without it, it lives in memory for this page view and still reaches a lead sent from here.
  let pending = null;
  try {
    const query = new URLSearchParams(window.location.search);
    const found = {};
    PARAMS.forEach(key => {
      const value = query.get(key);
      if (value) found[key] = value.slice(0, 200);
    });
    if (Object.keys(found).length) {
      found.landing_page = window.location.pathname;
      found.first_seen = new Date().toISOString();
      pending = found;
    }
  } catch (e) { /* attribution is best effort */ }

  window.slAttributionSave = function () {
    if (!pending) return;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(pending)); } catch (e) { /* storage unavailable */ }
  };
  if (window.slConsent && window.slConsent.marketing) window.slAttributionSave();

  window.slAttribution = function () {
    if (pending) return pending;
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
  };

  // One call → GTM event (for GA4 / Google Ads) and, optionally, a Meta Pixel event
  window.slTrack = function (gtmEvent, data, pixel) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: gtmEvent }, data));
    if (pixel && typeof fbq === 'function') fbq(pixel[0], pixel[1], pixel[2] || {}, pixel[3] || {});
  };

  const contactChannel = href => {
    if (href.startsWith('mailto:')) return 'email';
    if (href.includes('instagram.com')) return 'instagram';
    if (href.includes('t.me/')) return 'telegram';
    if (href.includes('wa.me/')) return 'whatsapp';
    return null;
  };

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');

    // Level test in the Telegram bot — a strong intent signal, tracked on its own
    if (href.includes('t.me/levelSK_SlovakLab_bot')) {
      window.slTrack('level_test_click', { link_url: href }, ['trackCustom', 'StartLevelTest']);
      return;
    }
    const channel = contactChannel(href);
    if (channel) {
      window.slTrack('contact_click', { contact_channel: channel, link_url: href },
        ['track', 'Contact', { content_name: channel }]);
    }
  });

  // Main hero button ("Записатись на пробний урок")
  const heroCta = document.getElementById('button-start');
  if (heroCta) {
    heroCta.addEventListener('click', () => window.slTrack('cta_click', { cta_name: 'hero_free_lesson' }));
  }

  // Forms: form_start on the first field the visitor fills in; form_abandon if they then
  // leave the page (or switch away from the tab) without a successful send (generate_lead);
  // form_resume if they come back and type again after that — so real abandons = abandon − resume
  const FORMS = { skConsultForm: 'consultation', trialForm: 'trial_lesson' };
  const started = {};
  const lastField = {};
  let abandonReported = false;
  Object.keys(FORMS).forEach(id => {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener('input', event => {
      lastField[id] = event.target.name || event.target.id;
      if (abandonReported) {
        // Back after a tab switch: undo the abandon, and report again if they leave once more
        abandonReported = false;
        window.slTrack('form_resume', { form_name: FORMS[id] });
      }
      if (started[id]) return;
      started[id] = true;
      window.slTrack('form_start', { form_name: FORMS[id] });
    });
  });
  const leadSent = () => (window.dataLayer || []).some(item => item && item.event === 'generate_lead');
  const reportAbandon = () => {
    if (abandonReported || leadSent()) return;
    const id = Object.keys(started).find(key => started[key]);
    if (!id) return;
    abandonReported = true;
    window.slTrack('form_abandon', { form_name: FORMS[id], last_field: lastField[id] || '' });
  };
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') reportAbandon(); });
  window.addEventListener('pagehide', reportAbandon);

  // Time on site: 15 / 30 / 60 seconds, counted only while the tab is actually visible
  const MARKS = [15, 30, 60];
  let visibleSeconds = 0;
  const clock = setInterval(() => {
    if (document.visibilityState !== 'visible') return;
    visibleSeconds++;
    if (MARKS.includes(visibleSeconds)) window.slTrack('time_on_site', { engaged_seconds: visibleSeconds });
    if (visibleSeconds >= MARKS[MARKS.length - 1]) clearInterval(clock);
  }, 1000);
})();
