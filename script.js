new Swiper(".card-wrapper", {
  loop: true,
  slidesPerView: 2, // Базова кількість слайдів
  spaceBetween: 20,
  centeredSlides: true,

  // Адаптивні налаштування
  breakpoints: {
    // Мобільні екрани
    0: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    // Планшети
    768: {
      slidesPerView: 2,
      spaceBetween: 15,
      centeredSlides: false,
    },
    // Десктопи
    1024: {
      slidesPerView: 2,
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
