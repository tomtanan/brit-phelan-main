export const splitIntoWords = (elements) => {
  // If 'elements' is a NodeList or an array, iterate through them
  if (NodeList.prototype.isPrototypeOf(elements) || Array.isArray(elements)) {
    elements.forEach((element) => splitIntoWords(element));
    return;
  }

  // Ensure node is valid and not already processed
  const node = elements;
  if (!node || !(node instanceof Node)) throw new Error('Expected a DOM Node.');

  // If it's a text node, split the words and wrap them in spans
  if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
    const fragment = document.createDocumentFragment();
    const words = node.textContent.trim().split(/\s+/);
    words.forEach((word) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = word;
      if (word !== '.' && word !== '!') {
        fragment.appendChild(document.createTextNode(' ')); // Add space before each word
      }
      fragment.appendChild(span);
    });
    node.replaceWith(fragment); // Replace the entire text node at once
    return; // Early return as we don't need to process further
  }

  // If it's an element node, process its children
  if (node.nodeType === Node.ELEMENT_NODE) {
    // If the node is an inline span but not already a 'word', apply the class and skip re-wrapping
    if (node.tagName.toLowerCase() === 'span' && !node.classList.contains('word')) {
      node.classList.add('word');
      return; // Don't process its children further
    }

    // Process only the text node children, leave already wrapped spans untouched
    Array.from(node.childNodes).forEach((childNode) => {
      if (childNode.nodeType === Node.TEXT_NODE || childNode.nodeType === Node.ELEMENT_NODE) {
        splitIntoWords(childNode);
      }
    });
  }
};

export const splitIntoLetters = (elements) => {
  elements.forEach((element) => {
    // Recursive function to handle nested elements
    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const fragment = document.createDocumentFragment();
        const letters = Array.from(node.textContent); // Split text into individual letters
        letters.forEach((letter) => {
          const i = document.createElement('i');
          i.className = 'letter';
          i.textContent = letter;
          fragment.appendChild(i);
        });
        node.replaceWith(fragment); // Replace the original text node with the fragment
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(processNode); // Recurse through child nodes
      }
    };

    // Start processing each top-level node
    Array.from(element.childNodes).forEach(processNode);
  });
};

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

export const watchVideos = (sel = 'video', t = 0.5) => {
  const videos = document.querySelectorAll(sel);
  if (!videos.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause();
    });
  }, { threshold: t });

  videos.forEach(video => observer.observe(video));
};