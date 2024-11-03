new Swiper(".card-wrapper", {
  loop: true,
  slidesPerView: 2,
  spaceBetween: 20,
  // pagination bullets
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
