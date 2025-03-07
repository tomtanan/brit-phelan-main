import { $, $$ } from 'select-dom';
import { addClass, removeClass, isTouchDevice } from 'utils/helpers';
import Swiper from 'swiper/bundle';
import emitter from 'utils/events';

const refs = {
  main: 'js-projects-swiper',
  thumbs: 'js-thumbs-swiper',
  thumbsNav: 'js-thumbs-nav',
  video: 'js-background-video'
};

class Projects {
  constructor(el) {
    this.el = el;
    this.main = $(`.${refs.main}`, el);
    this.videos = $$(`.${refs.video}`, el);
    this.thumbs = $(`.${refs.thumbs}`, el);
    this.thumbSlides = $$(`.${refs.thumbs} .swiper-slide`, el);
    this.initSwipers();
    this.bindEvents();
  }

  get activeSlide() {
    return $('.swiper-slide-active', this.main);
  }

  get activeThumbSlide() {
    return $('.swiper-slide-active', this.thumbs);
  }

  get activeVideo() {
    return this.activeSlide ? $(`.${refs.video}`, this.activeSlide) : null;
  }

  // Updates the active thumbnail
  updateActiveThumb() {
    this.thumbSlides.forEach(slide => removeClass(slide, 'swiper-slide-loading'));
    if (!this.activeThumbSlide) return;
    addClass(this.activeThumbSlide, 'swiper-slide-loading');
  }

  // Handles video playback for the active slide
  handleVideoPlayback(activeSlide = this.activeSlide) {
    this.videos.forEach(video => {
      if (!video.paused) video.pause();
    });
    const activeVideo = activeSlide ? $(`.${refs.video}`, activeSlide) : null;
    if (activeVideo && activeVideo.paused) {
      activeVideo.play();
    }
  }

  // Initializes the main and thumbnail Swipers
  initSwipers() {
    this.mainSwiper = new Swiper(this.main, {
      allowTouchMove: false,
      effect: 'fade',
      slidesPerView: 1,
      fadeEffect: { crossFade: true },
      on: {
        slideChangeTransitionEnd: () => this.onSlideChange()
      },
    });

    this.thumbsSwiper = new Swiper(this.thumbs, {
      slidesPerView: 1.001,
      autoplay: { delay: 10000, disableOnInteraction: false },
      keyboard: { enabled: true },
      loop: true,
      spaceBetween: 10,
      loopedSlides: 5,
      loopAdditionalSlides: 2,
      centeredSlides: false,
      slideToClickedSlide: true,
      thumbs: { swiper: this.mainSwiper },
      pagination: { el: `.${refs.thumbsNav}`, clickable: true },
    });

    this.updateActiveThumb();
  }

  // Handles actions when the slide changes
  onSlideChange() {
    const activeSlide = this.activeSlide;
    this.handleVideoPlayback(activeSlide);
    this.updateActiveThumb();
  }

  // Binds custom events for pausing and resuming swipers
  bindEvents() {
    emitter.on('openModal', () => {
      if (this.thumbsSwiper?.autoplay) {
        this.thumbsSwiper.autoplay.stop();
      }
      this.thumbSlides.forEach(slide => removeClass(slide, 'swiper-slide-loading'));
      if (this.activeVideo) this.activeVideo.pause();
    });

    emitter.on('closeModal', () => {
      if (this.thumbsSwiper?.autoplay) {
        this.thumbsSwiper.autoplay.start();
      }
      this.updateActiveThumb();
      if (this.activeVideo) {
        this.activeVideo.currentTime = 0;
        this.activeVideo.play();
      }
    });
  }

  static init(el) {
    return el ? new Projects(el) : null;
  }
}

export default Projects;
