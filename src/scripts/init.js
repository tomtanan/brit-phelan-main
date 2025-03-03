import modal from '../modules/modal.js';
import projects from '../modules/projects.js';
import videoPlayer from '../modules/video-player.js';
import episodes from '../modules/episodes.js';
import discover from '../modules/discover.js';

export const modulesMap = {
  'modal': modal,
  'projects': projects,
  'episodes': episodes,
  'discover': discover,
  'video-player': videoPlayer
};

// Automatically initialize sections based on the data-module attribute
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-module]').forEach((element) => {
    const moduleName = element.getAttribute('data-module');
    const module = modulesMap[moduleName];

    if (module && typeof module.init === 'function') {
      module.init(element); // Works with class-based modules like Discover
    } else if (typeof module === 'function') {
      module(element); // Works with function-based modules
    } else {
      console.error(`Invalid module structure for: ${moduleName}`);
    }
  });
});
