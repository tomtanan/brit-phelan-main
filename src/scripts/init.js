import projects from '../modules/projects.js';
// Mapping of data-module values to imported modules
export const modulesMap = {
  'projects': projects
};

// Automatically initialize sections based on the data-module attribute
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-module]').forEach((element) => {
    const moduleName = element.getAttribute('data-module');
    const module = modulesMap[moduleName];

    if (module && typeof module === 'function') {
      module(element); // Initialize the module, passing in the element if necessary
    } else {
      console.error(`No module found for: ${moduleName}`);
    }
  });
});
