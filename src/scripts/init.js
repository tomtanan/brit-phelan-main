import modal from '../modules/modal.js';
import projects from '../modules/projects.js';
import videoPlayer from '../modules/video-player.js';

export const modulesMap = {
  'modal': modal,
  'projects': projects,
  'video-player': videoPlayer
};

// Automatically initialize sections based on the data-module attribute
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-module]').forEach((element) => {
    const moduleName = element.getAttribute('data-module');
    const module = modulesMap[moduleName];

    if (module && typeof module === 'function') {
      module(element);
    } else {
      console.error(`No module found for: ${moduleName}`);
    }
  });
});
