import { $ } from 'select-dom';
import { addClass, removeClass, on } from 'utils/helpers';
import Swiper from 'swiper/bundle';
import emitter from 'utils/events';

const episodes = (el) => {
  const episodeSwiper = new Swiper($('.js-episodes-swiper', el), {
    slidesPerView: 'auto',
    centeredSlides: true,
    loop: true,
    spaceBetween: 40,
    keyboard: { 
      enabled: true 
    },
    slideToClickedSlide: true,
    navigation: {
      nextEl: ".js-episodes-nav-next",
      prevEl: ".js-episodes-nav-prev",
    },
  });
};

export default episodes;
