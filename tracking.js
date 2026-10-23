// Marketing helpers shared by both pages:
//  - remembers which ad brought the visitor (UTM tags, fbclid, gclid) so leads can be attributed
//  - reports clicks on the level-test bot and contact links to GTM (dataLayer) and Meta Pixel
(function () {
  const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];
  const STORE_KEY = 'slovaklab-attribution';

  // Last ad touch wins: overwrite only when the URL actually carries campaign parameters
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
      localStorage.setItem(STORE_KEY, JSON.stringify(found));
    }
  } catch (e) { /* storage unavailable — attribution is best effort */ }

  window.slAttribution = function () {
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
})();
