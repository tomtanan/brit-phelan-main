import { $, $$ } from 'select-dom';
import { addClass, removeClass, isTouchDevice, on, off } from 'utils/helpers';
import Swiper from 'swiper/bundle';
import emitter from 'utils/events';
import { Howl, Howler } from 'howler'; // 🚀 Import Howler.js

const refs = {
  main: 'js-projects-swiper',
  thumbs: 'js-thumbs-swiper',
  thumbsNav: 'js-thumbs-nav',
  video: 'js-background-video',
  musicBtn: 'js-music', // 🚀 Added music button reference
};

class Projects {
  constructor(el) {
    this.el = el;
    this.main = $(`.${refs.main}`, el);
    this.videos = $$(`.${refs.video}`, el);
    this.thumbs = $(`.${refs.thumbs}`, el);
    this.thumbSlides = $$(`.${refs.thumbs} .swiper-slide`, el);
    this.currentSound = null; // 🚀 Store the current Howl instance
    this.isMuted = false; // 🚀 Mute state tracking
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

  get activeMusicBtn() { // 🚀 Get active slide's music button
    return this.activeSlide ? $(`.${refs.musicBtn}`, this.activeSlide) : null;
  }
  
  get activeAudioSrc() { // 🚀 Get music URL for active slide
    const btn = this.activeMusicBtn;
    return btn ? btn.dataset.musicMp3 || btn.dataset.musicM4a || btn.dataset.musicOgg : null;
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

  // Handle background music per slide using Howler
  handleMusicPlayback() { 
    if (this.currentSound) {
      this.currentSound.stop();
    }
    if (!this.activeAudioSrc) return;

    this.currentSound = new Howl({
      src: [this.activeAudioSrc],
      loop: true,
      volume: this.isMuted ? 0 : 0.3, 
      autoplay: true
    });
    this.updateMusicBtnState();
  }

  // Toggle mute / unmute
  toggleMusic() { 
    this.isMuted = !this.isMuted;
    if (this.currentSound) {
      this.currentSound.volume(this.isMuted ? 0 : 0.3);
    }
    this.updateMusicBtnState();
  }

  // 🚀 Add/remove class on all music buttons
  updateMusicBtnState() { 
    $$(`.${refs.musicBtn}`).forEach(btn => {
      if (this.isMuted) {
        removeClass(btn, 'active');
      } else {
        addClass(btn, 'active');
      }
    });
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
      spaceBetween: 20,
      centeredSlides: false,
      slideToClickedSlide: true,
      thumbs: { swiper: this.mainSwiper },
      pagination: { el: `.${refs.thumbsNav}`, clickable: true },
    });

    this.updateActiveThumb();
    this.handleMusicPlayback(); 
  }

  // Handles actions when the slide changes
  onSlideChange() {
    const activeSlide = this.activeSlide;
    this.handleVideoPlayback(activeSlide);
    this.updateActiveThumb();
    this.handleMusicPlayback(); 
  }

  // Binds custom events for pausing and resuming swipers
  bindEvents() {
    emitter.on('openModal', () => {
      if (this.currentSound) {
        this.currentSound.pause();
      }
      if (this.thumbsSwiper?.autoplay) {
        this.thumbsSwiper.autoplay.stop();
      }
      this.thumbSlides.forEach(slide => removeClass(slide, 'swiper-slide-loading'));
      if (this.activeVideo) this.activeVideo.pause();
    });

    emitter.on('closeModal', () => {
      if (this.currentSound) {
        this.currentSound.stop();
        this.handleMusicPlayback();
      }
      if (this.thumbsSwiper?.autoplay) {
        this.thumbsSwiper.autoplay.start();
      }
      this.updateActiveThumb();
      if (this.activeVideo) {
        this.activeVideo.currentTime = 0;
        this.activeVideo.play();
      }
    });

    // Toggle music on button click
    on(this.el, 'click', (e) => {
      if (e.target.closest(`.${refs.musicBtn}`)) {
        this.toggleMusic();
      }
    });
  }

  static init(el) {
    return el ? new Projects(el) : null;
  }
}

export default Projects;
