// Guarded: ".card-wrapper" isn't present on every page, and an uncaught
// error here used to abort the rest of this file — including the
// translations logic below — before it ever ran.
if (document.querySelector(".card-wrapper")) {
  try {
    new Swiper(".card-wrapper", {
      loop: true,
      slidesPerView: 1, // Базова кількість слайдів
      spaceBetween: 20,
      centeredSlides: true,


      // Адаптивні налаштування
      breakpoints: {
        // Мобільні екрани
        0: {
          slidesPerView: 'auto',  // Автоматическое отображение слайдов по ширине контейнера
          spaceBetween: 0, // Убираем отступы между слайдами
          centeredSlides: true,
        },
        // Планшети
        768: {
          slidesPerView: 2,
          spaceBetween: 15,
          centeredSlides: false,
        },
        // Десктопи
        1024: {
          slidesPerView: 3,
          spaceBetween: 20,
          centeredSlides: false,
        },
      },

      // Pagination bullets
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },

      // Navigation arrows
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  } catch (err) {
    console.error("Swiper init failed:", err);
  }
}

//LANGUAGES
async function loadTranslations() {
    const response = await fetch('translations.json');
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





