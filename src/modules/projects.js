import { $, $$ } from 'select-dom';
import Swiper from 'swiper/bundle';

const projects = (el) => {
  const projectSwiper = new Swiper('.js-projects-swiper', {
    allowTouchMove: false,
    effect: 'fade',
    slidesPerView: 1,
    fadeEffect: { 
      crossFade: true 
    },
    loop: true
  });

  const thumbSwiper = new Swiper('.js-project-thumbs-swiper', {
    slidesPerView: 'auto',
    centeredSlides: false,
    autoplay: {
      delay: 10000,
      disableOnInteraction: false
    },
    loop: true,
    keyboard: { 
      enabled: true
    }, 
    slideToClickedSlide: true, 
    thumbs: {
      swiper: projectSwiper,
    },
    pagination: {
        el: '.js-project-thumbs-nav',
        clickable: true,
    }
  });
};

export default projects;