import { $, $$ } from 'select-dom';
import { on, addClass } from 'utils/helpers';

class Credits {
  constructor(el) {
    this.el = el;
    this.items = $$('li', this.el);
    this.container = document.createElement('ul');
    this.button = document.createElement('button');

    if (this.items.length <= 4) return;

    this.setup();
    this.bindEvents();
  }

  setup() {
    this.container.className = 'credits-hidden-list';

    this.items.forEach((item, index) => {
      if (index >= 4) {
        this.container.appendChild(item);
      }
    });

    this.el.appendChild(this.container);

    this.button.textContent = 'See More';
    this.button.className = 'credits-more-btn';
    this.el.appendChild(this.button);
  }

  bindEvents() {
    on(this.button, 'click', () => this.show());
  }

  show() {
    this.button.remove();
    addClass(this.container, 'visible'); 
    addClass(this.button, 'hide');
  }

  static init(el) {
    new Credits(el);
  }
}

export default Credits;