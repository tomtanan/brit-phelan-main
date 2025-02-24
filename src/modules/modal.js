import { $ } from 'select-dom';
import { addClass, removeClass, on } from 'utils/helpers';
import emitter from 'utils/events';

const modal = (el) => {
  const modalName = el.getAttribute('data-modal');
  const modal = $(`[data-modal-target="${modalName}"]`);

  if (!modal) {
    console.error(`No modal found with data-modal-target="${modalName}"`);
    return;
  }

  const closeBtn = $('.js-modal-close', modal);

  const showModal = () => {
    emitter.emit('openModal');
    addClass(document.body, 'scroll-lock');
    addClass(modal, 'active');
  };

  // Close the modal with animation
  const closeModal = () => {
    removeClass(document.body, 'scroll-lock');
    removeClass(modal, 'active');
    emitter.emit('closeModal');
    emitter.emit('resetPlayers');
    emitter.emit('resetGallery');
  };

  // Event listeners
  on(el, 'click', (e) => {
    e.preventDefault();
    showModal();
  });

  on(closeBtn, 'click', (e) => {
    e.preventDefault();
    closeModal();
  });
};

export default modal;
