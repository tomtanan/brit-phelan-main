import { addClass, removeClass, on } from 'utils/helpers';
import { $, $$ } from 'select-dom';
import { gsap } from 'gsap';

class Contact {
  static instances = new WeakMap();

  constructor(el) {
    this.el = el;
    this.triggerBtn = $('[data-contact-trigger]');
    this.closeBtn = $('[data-contact-close]');
    this.words = $$('.word', el);
    this.animation = null;

    this.bindEvents();
  }

  open() {
    addClass(document.body, 'scroll-lock');
    addClass(this.el, 'active');

    if (!this.animation) {
      this.animation = gsap.fromTo(
        this.words,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: { amount: 1, from: 'start', overlap: 0.5 },
        }
      );
    }
  }

  close() {
    removeClass(document.body, 'scroll-lock');
    removeClass(this.el, 'active');
  }

  bindEvents() {
    if (this.triggerBtn) {
      on(this.triggerBtn, 'click', () => this.open());
    }
    if (this.closeBtn) {
      on(this.closeBtn, 'click', () => this.close());
    }
  }

  static init(el) {
    if (!Contact.instances.has(el)) {
      Contact.instances.set(el, new Contact(el));
    }
  }
}

export default Contact;
