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

function applyTranslations(translations, language) {
    const elements = document.querySelectorAll('[id]');
    elements.forEach(element => {
        const key = element.id; 
        if (translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });
}

// Основная логика
document.addEventListener('DOMContentLoaded', async () => {
    const translations = await loadTranslations(); // Загрузка переводов
    const languageSwitcher = document.getElementById('languageSwitcher');

    // Установка языка по умолчанию
    let currentLanguage = 'ukr';
    applyTranslations(translations, currentLanguage);

    // Переключение языка
    languageSwitcher.addEventListener('change', (event) => {
        currentLanguage = event.target.value;
        applyTranslations(translations, currentLanguage);
    });
});





