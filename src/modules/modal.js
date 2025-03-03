import { $ } from 'select-dom';
import { addClass, removeClass, on } from 'utils/helpers';
import emitter from 'utils/events';
import VideoPlayer from './video-player';

// References to DOM elements
const refs = {
  closeBtn: 'js-modal-close',
  video: '.js-video-player',
};

class Modal {
  static instances = new WeakMap();

  constructor(trigger) {
    this.trigger = trigger;
    this.modalName = trigger.getAttribute('data-modal');
    this.modal = $(`[data-modal-target="${this.modalName}"]`);
    
    if (!this.modal) {
      console.error(`No modal found with data-modal-target="${this.modalName}"`);
      return;
    }

    this.videoPlayer = null;
    this.first = true;
    this.closeBtn = $(`.${refs.closeBtn}`, this.modal);
    this.bindEvents();
  }

  // Show modal with scroll lock
  show() {
    addClass(document.body, 'scroll-lock');
    addClass(this.modal, 'active');

    if (this.first) {
      this.first = false;
      const video = $(refs.video, this.modal);

      if (video) {
        this.videoPlayer = new VideoPlayer(video);
      }
    }

    emitter.emit('openModal');
  }

  // Close modal with animation and state reset
  hide() {
    removeClass(document.body, 'scroll-lock');
    removeClass(this.modal, 'active');
    emitter.emit('closeModal');
  }

  // Bind event listeners
  bindEvents() {
    on(this.trigger, 'click', (e) => {
      e.preventDefault();
      this.show();
    });
    
    if (this.closeBtn) {
      on(this.closeBtn, 'click', (e) => {
        e.preventDefault();
        this.hide();
      });
    }
  }

  static init(trigger) {
    if (!Modal.instances.has(trigger)) {
      Modal.instances.set(trigger, new Modal(trigger));
    }
  }
}

export default Modal;
