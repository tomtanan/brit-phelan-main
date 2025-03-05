import { $, $$ } from 'select-dom';
import { addClass, off, on, isTouchDevice} from 'utils/helpers';
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
    this.previews = $$(`.${refs.preview}`, this.el);
    this.init();
    this.bindEvents();
  }

  init() {
    if ($$('.swiper-slide', this.el).length <= 0) {
      return;
    }

    if (!this.swiper) {
      this.swiper = new Swiper($(`.${refs.swiper}`, this.el), {
        slidesPerView: 'auto',
        centeredSlides: true,
        loop: true,
        spaceBetween: 40,
        keyboard: { enabled: true },
        allowTouchMove: !isTouchDevice(),
        slideToClickedSlide: !isTouchDevice(),
        noSwiping: true,
        noSwipingClass: 'js-video',
        navigation: {
          nextEl: `.${refs.nextBtn}`,
          prevEl: `.${refs.prevBtn}`,
        },
        on: {
          slideChangeTransitionEnd: () => {
            if (!isTouchDevice()) this.initVideoPlayer();
          }
        }
      });

      // Initialize all video players if it's a touch device
      if (isTouchDevice()) {
        this.initAllVideoPlayers();
      }
    }
  }

  bindEvents() {
    if (!isTouchDevice()) {
      emitter.on('togglePlay', (paused) => {
        this.previews.forEach((preview) => {
          $('video', preview)?.[paused ? 'pause' : 'play']();
        });
      });
  
      this.previews.forEach(preview => on(preview, 'click', this.markViewed.bind(this)));
    } else {

    }
  }

  markViewed() {
    const activeSlide = $('.swiper-slide-active', this.el);
    if (activeSlide && !this.el.classList.contains('swiper-viewed')) {
        this.initVideoPlayer()
        addClass(this.el, 'swiper-viewed');
        this.previews.forEach(preview => off(preview, 'click', this.markViewed.bind(this)));
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

  initAllVideoPlayers() {
    const slides = $$('.swiper-slide', this.el);
    slides.forEach(slide => {
      const videoContainer = $(`.${refs.video}`, slide);
      if (videoContainer && !VideoPlayer.instances.has(videoContainer)) {
          VideoPlayer.init(videoContainer);
      }
    });
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
