import { $, $$ } from 'select-dom';
import { addClass, removeClass, on, isTouchDevice} from 'utils/helpers';
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
    this.observeVisibleSlides();
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
        slideToClickedSlide: true,
        loopAdditionalSlides: 5,
        navigation: {
          nextEl: `.${refs.nextBtn}`,
          prevEl: `.${refs.prevBtn}`,
        },
        on: {
          slideChangeTransitionStart: () => {
            this.previews.forEach((preview) => {
              removeClass(preview, 'hide');
            });
            this.playPreviews();
            this.resetIframes();
          },
          slideChangeTransitionEnd: () => {
            this.observeVisibleSlides();
          }
        }
      });
    }

    this.observeVisibleSlides();
  }

  observeVisibleSlides() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.initVideoPlayer(entry.target);
        }
      });
    }, { root: this.el, threshold: 0.5 }); // Adjust threshold as needed

    $$('.swiper-slide', this.el).forEach((slide) => {
      observer.observe(slide);
    });
  }

  initVideoPlayer(slide) {
    const videoContainer = $(`.${refs.video}`, slide);
    if (videoContainer && !VideoPlayer.instances.has(videoContainer)) {
      VideoPlayer.init(videoContainer);
    }
  }

  bindEvents() {
    this.previews.forEach((preview) => {
      on(preview, 'click', (e) => {
        const activeSlide = $('.swiper-slide-active', this.el);
        if (preview.closest('.swiper-slide') === activeSlide) {
          addClass(preview, 'hide');
          this.pausePreviews();
          emitter.emit('triggerPlay');
        }
      });
    });
  }

  pausePreviews() {
    this.previews.forEach((preview) => {
      $('video', preview).pause();
    });
  }

  playPreviews() {
    this.previews.forEach((preview) => {
      $('video', preview).play();
    });
  }

  resetIframes() {
    const activeSlide = $('.swiper-slide-active', this.el);
    const iframes = $$('iframe', this.el);

    iframes.forEach((iframe) => {
      if (!activeSlide.contains(iframe)) {
        iframe.src = iframe.src;
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
