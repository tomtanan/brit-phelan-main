import { $, $$ } from 'select-dom';
import { addClass, removeClass } from 'utils/helpers';
import Swiper from 'swiper/bundle';
import emitter from 'utils/events';

const ACTIVE_CLASS = 'swiper-slide-playing';

const projects = (el) => {
  const thumbSlides = $$('.project-thumbs-swiper .swiper-slide', el);
  const videos = $$('.js-project-background-video', el);

  const getActiveSlide = () => $('.projects-swiper-slide.swiper-slide-active', el);
  const getActiveThumbSlide = () => $('.project-thumbs-swiper .swiper-slide-active', el);
  const getActiveVideo = () => {
    const activeSlide = getActiveSlide();
    return activeSlide ? $('.js-project-background-video', activeSlide) : null;
  };

  const updateActiveThumbSlide = () => {
    const activeThumbSlide = getActiveThumbSlide();

    thumbSlides.forEach(slide => removeClass(slide, ACTIVE_CLASS));

    if (activeThumbSlide) {
      addClass(activeThumbSlide, ACTIVE_CLASS);
    }
  };

  const handleVideoPlayback = () => {
    videos.forEach(video => video.pause()); // Ensure all videos stop before playing a new one

    const activeVideo = getActiveVideo();
    if (activeVideo) {
      activeVideo.play();
    }
  };

  const projectSwiper = new Swiper($('.js-projects-swiper', el), {
    allowTouchMove: false,
    effect: 'fade',
    slidesPerView: 1,
    fadeEffect: { crossFade: true },
    loop: true,
    on: {
      init: () => {
        handleVideoPlayback();
        updateActiveThumbSlide();
      },
      slideChangeTransitionEnd: () => {
        handleVideoPlayback();
        updateActiveThumbSlide();
      }
    },
  });

  const thumbSwiper = new Swiper($('.js-project-thumbs-swiper', el), {
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
      swiper: projectSwiper 
    },
    pagination: {
      el: '.js-project-thumbs-nav',
      clickable: true,
    }
  });

  emitter.on('pauseSwipers', () => {
    thumbSwiper.autoplay.stop();
    thumbSlides.forEach(slide => removeClass(slide, ACTIVE_CLASS));

    const activeVideo = getActiveVideo();
    if (activeVideo) {
      activeVideo.pause();
    }
  });

  emitter.on('resumeSwipers', () => {
    thumbSwiper.autoplay.start();
    updateActiveThumbSlide();

    const activeVideo = getActiveVideo();
    if (activeVideo) {
      activeVideo.currentTime = 0;
      activeVideo.play();
    }
  });
};

export default projects;
