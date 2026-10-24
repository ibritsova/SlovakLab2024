//LANGUAGES
async function loadTranslations() {
    const response = await fetch('translations.json?v=20261024');
    return response.json();
}

const LANG_STORAGE_KEY = 'slovaklab-lang';
const HTML_LANG = { ukr: 'uk', en: 'en', sk: 'sk' };
const I18N_ATTRS = ['placeholder', 'alt', 'aria-label'];

function applyTranslations(translations, language) {
    const dict = translations[language];
    if (!dict) return;

    // Element text: the element id is the translation key
    document.querySelectorAll('[id]').forEach(element => {
        const value = dict[element.id];
        if (value) element.textContent = value;
    });

    // Copies of id'd elements (e.g. the duplicated goals marquee) carry data-i18n="key"
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const value = dict[element.getAttribute('data-i18n')];
        if (value) element.textContent = value;
    });

    // Attributes textContent can't reach: data-i18n-<attr>="key"
    I18N_ATTRS.forEach(attr => {
        document.querySelectorAll(`[data-i18n-${attr}]`).forEach(element => {
            const value = dict[element.getAttribute(`data-i18n-${attr}`)];
            if (value) element.setAttribute(attr, value);
        });
    });

    document.documentElement.lang = HTML_LANG[language] || language;

    // Current dictionary for form messages in scriptContact.js
    window.slI18n = { lang: language, dict };
}

// Основная логика
document.addEventListener('DOMContentLoaded', async () => {
    const translations = await loadTranslations(); // Загрузка переводов
    const languageSwitcher = document.getElementById('languageSwitcher');

    // Restore the language picked on a previous page (falls back to Ukrainian)
    let savedLanguage = null;
    try { savedLanguage = localStorage.getItem(LANG_STORAGE_KEY); } catch (e) { /* storage unavailable */ }
    let currentLanguage = translations[savedLanguage] ? savedLanguage : 'ukr';
    languageSwitcher.value = currentLanguage;
    applyTranslations(translations, currentLanguage);

    // Переключение языка
    languageSwitcher.addEventListener('change', (event) => {
        currentLanguage = event.target.value;
        try { localStorage.setItem(LANG_STORAGE_KEY, currentLanguage); } catch (e) { /* storage unavailable */ }
        applyTranslations(translations, currentLanguage);
    });
});
