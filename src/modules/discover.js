import { $ } from 'select-dom';
import Swiper from 'swiper/bundle';
import debounce from 'debounce';

const refs = {
  swiper: 'js-featured-projects-swiper'
};

class Discover {
  // Store instances in a WeakMap to avoid memory leaks
  static instances = new WeakMap();

  constructor(el) {
    this.el = el;
    this.swiper = null;
    this.init();
    this.observeResize();
  }

  // Initialize Swiper only if it's not already created and viewport is narrow
  init() {
    if (!this.swiper && window.innerWidth < 992) {
      this.swiper = new Swiper($(`.${refs.swiper}`, this.el), {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 10,
        keyboard: { enabled: true },
        slideToClickedSlide: false,
        initialSlide: 1,
      });
    }
  }

  // Destroy Swiper instance if it exists
  destroy() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
  }

  // Update Swiper based on viewport width
  update() {
    window.innerWidth < 992 ? this.init() : this.destroy();
  }

  // Observe window resizes and debounce updates for efficiency
  observeResize() {
    this.resizeObserver = new ResizeObserver(debounce(() => this.update(), 200));
    this.resizeObserver.observe(document.body);
  }

  // Disconnect observers and clean up
  disconnect() {
    this.resizeObserver.disconnect();
    this.destroy();
  }

  // Static method to initialize a Swiper instance for an element
  static init(el) {
    if (!Discover.instances.has(el)) {
      Discover.instances.set(el, new Discover(el));
    }
  }

  // Static method to destroy a Swiper instance for an element
  static destroy(el) {
    const instance = Discover.instances.get(el);
    if (instance) {
      instance.disconnect();
      Discover.instances.delete(el);
    }
  }
}

export default Discover;