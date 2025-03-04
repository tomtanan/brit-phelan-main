import { $, $$ } from 'select-dom';
import Swiper from 'swiper/bundle';
import emitter from 'utils/events';
import VideoPlayer from './video-player';

const refs = {
  swiper: 'js-episodes-swiper',
  nextBtn: 'js-episodes-nav-next',
  prevBtn: 'js-episodes-nav-prev',
  preview: 'js-preview',
  video: 'js-video',
};

class Episodes {
  static instances = new WeakMap();

  constructor(el) {
    this.el = el;
    this.swiper = null;
    this.init();
  }

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
        on: {
          init: () => this.initVideoPlayer(),
          slideChangeTransitionStart: () => emitter.emit('resetPlayer'),
          slideChangeTransitionEnd: () => this.initVideoPlayer(),
        },
      });
    }
  }

  initVideoPlayer() {
    const activeSlide = $('.swiper-slide-active', this.el);
    if (activeSlide) {
      const videoContainer = $(`.${refs.video}`, activeSlide);
      if (videoContainer && !VideoPlayer.instances.has(videoContainer)) {
        VideoPlayer.init(videoContainer);
      }
    }
  }  

  destroy() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
  }

  static init(el) {
    if (!Episodes.instances.has(el)) {
      Episodes.instances.set(el, new Episodes(el));
    }
  }

  static destroy(el) {
    const instance = Episodes.instances.get(el);
    if (instance) {
      instance.destroy();
      Episodes.instances.delete(el);
    }
  }
}

export default Episodes;
