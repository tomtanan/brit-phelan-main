export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export const toggleClass = (el, className) => el.classList.toggle(className);

export const addClass = (el, ...classNames) => {
  const classes = classNames.flatMap(className => className.split(' '));
  const elements = Array.isArray(el) ? el : [el];

  elements.forEach(element => {
    if (element instanceof Element) {
      element.classList.add(...classes);
    }
  });
};

export const removeClass = (el, ...classNames) => {
  const classes = classNames.flatMap(className => className.split(' '));
  const elements = Array.isArray(el) ? el : [el];

  elements.forEach(element => {
    if (element instanceof Element) {
      element.classList.remove(...classes);
    }
  });
};

export const on = (element, event, handler, options = {}) => {
  element.addEventListener(event, handler, options);
};

export const off = (element, event, handler) => {
  element.removeEventListener(event, handler);
};

// Return active modal
export const getActiveModal = () => document.querySelector('.js-modal.active');

// Return active slide
export const getActiveEpisode = () => document.querySelector('.episodes-slide.swiper-slide-active');

// Return active video player
export const getActivePlayer = () => {
  const modal = getActiveModal();
  const episode = getActiveEpisode();
  if (modal) return modal.querySelector('.js-video-player');
  if (episode) return episode.querySelector('.js-video');
  if (!modal && !episode) return null;
};