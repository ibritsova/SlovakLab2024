new Swiper(".card-wrapper", {
  loop: true,
  slidesPerView: 1, // Базова кількість слайдів
  spaceBetween: 20,
  centeredSlides: true,
  

  // Адаптивні налаштування
  breakpoints: {
    // Мобільні екрани
    0: {
      slidesPerView: 1,
      spaceBetween: 15,
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





