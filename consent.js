// Cookie banner + Google Consent Mode v2 + Meta Pixel consent.
// The defaults (everything denied unless chosen before) are set inline in <head>, before GTM;
// this file shows the banner on the first visit, saves the choice and passes it on:
//  - Google tags (GA4, Ads) through gtag('consent', 'update', …)
//  - Meta Pixel through fbq('consent', 'grant' | 'revoke')
// Any [data-cookie-open] link (footer, privacy page) reopens the settings later.
(function () {
  const KEY = 'slovaklab-consent';
  const banner = document.getElementById('sl-cookie');
  if (!banner) return;

  const options = banner.querySelector('.sl-cookie-options');
  const boxes = {
    analytics: banner.querySelector('input[name="analytics"]'),
    marketing: banner.querySelector('input[name="marketing"]')
  };
  const button = name => banner.querySelector('[data-cookie="' + name + '"]');

  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
  };

  const apply = choice => {
    const saved = { analytics: !!choice.analytics, marketing: !!choice.marketing, date: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* storage unavailable */ }
    window.slConsent = saved;

    const state = on => (on ? 'granted' : 'denied');
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        analytics_storage: state(saved.analytics),
        ad_storage: state(saved.marketing),
        ad_user_data: state(saved.marketing),
        ad_personalization: state(saved.marketing)
      });
    }
    if (typeof fbq === 'function') fbq('consent', saved.marketing ? 'grant' : 'revoke');

    // The ad that brought the visitor is kept only with ads consent
    if (saved.marketing) {
      if (window.slAttributionSave) window.slAttributionSave();
    } else {
      try { localStorage.removeItem('slovaklab-attribution'); } catch (e) { /* storage unavailable */ }
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'consent_update', consent_analytics: saved.analytics, consent_marketing: saved.marketing });
    close();
  };

  const showSettings = on => {
    options.hidden = !on;
    button('settings').hidden = on;
    button('save').hidden = !on;
  };
  const open = withSettings => {
    const saved = read();
    boxes.analytics.checked = !!(saved && saved.analytics);
    boxes.marketing.checked = !!(saved && saved.marketing);
    showSettings(!!withSettings);
    banner.hidden = false;
    document.documentElement.classList.add('has-cookie-banner');
  };
  const close = () => {
    banner.hidden = true;
    document.documentElement.classList.remove('has-cookie-banner');
  };

  button('all').addEventListener('click', () => apply({ analytics: true, marketing: true }));
  button('necessary').addEventListener('click', () => apply({ analytics: false, marketing: false }));
  button('settings').addEventListener('click', () => showSettings(true));
  button('save').addEventListener('click', () => apply({ analytics: boxes.analytics.checked, marketing: boxes.marketing.checked }));

  // Delegated: the footer comes after this script in the page
  document.addEventListener('click', event => {
    if (!event.target.closest('[data-cookie-open]')) return;
    event.preventDefault();
    open(true);
  });

  if (!read()) open(false);
})();
