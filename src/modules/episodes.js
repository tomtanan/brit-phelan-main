import { $ } from 'select-dom';
import { addClass, removeClass } from 'utils/helpers';
import Swiper from 'swiper/bundle';
import emitter from 'utils/events';

const refs = {
  swiper: 'js-episodes-swiper',
  nextBtn: 'js-episodes-nav-next',
  prevBtn: 'js-episodes-nav-prev',
};

class Episodes {
  // Store instances to prevent memory leaks
  static instances = new WeakMap();

  constructor(el) {
    this.el = el;
    this.swiper = null;
    this.init();
  }

  // Initialize Swiper instance
  init() {
    if (!this.swiper) {
      this.swiper = new Swiper($(`.${refs.swiper}`, this.el), {
        slidesPerView: 'auto',
        centeredSlides: true,
        loop: true,
        spaceBetween: 40,
        keyboard: { enabled: true },
        slideToClickedSlide: true,
        navigation: {
          nextEl: `.${refs.nextBtn}`,
          prevEl: `.${refs.prevBtn}`,
        },
      });
    }
  }

  // Destroy Swiper instance and clean up
  destroy() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
  }

  // Initialize an instance for a given element
  static init(el) {
    if (!Episodes.instances.has(el)) {
      Episodes.instances.set(el, new Episodes(el));
    }
  }

  // Destroy an instance for a given element
  static destroy(el) {
    const instance = Episodes.instances.get(el);
    if (instance) {
      instance.destroy();
      Episodes.instances.delete(el);
    }
  }
}

export default Episodes;