
import { $$ } from 'select-dom';
import { watchVideos, on } from 'utils/helpers';
import modal from '../modules/modal.js';
import projects from '../modules/projects.js';
import videoPlayer from '../modules/video-player.js';
import episodes from '../modules/episodes.js';
import discover from '../modules/discover.js';
import contact from '../modules/contact.js';
import credits from '../modules/credits.js';

export const modulesMap = {
  'modal': modal,
  'projects': projects,
  'episodes': episodes,
  'discover': discover,
  'video-player': videoPlayer,
  'contact': contact,
  'credits': credits,
};

// Automatically initialize sections based on the data-module attribute
on(document, 'DOMContentLoaded', () => {
  $$('[data-module]', document).forEach((element) => {
    const moduleName = element.getAttribute('data-module');
    const module = modulesMap[moduleName];

    if (module && typeof module.init === 'function') {
      module.init(element); // Works with class-based modules like Discover
    } else if (typeof module === 'function') {
      module(element); // Works with function-based modules
    } else {
      console.error(`Invalid module structure for: ${moduleName}`);
    }
    element.removeAttribute('data-module');
  });

  watchVideos('video');
});
