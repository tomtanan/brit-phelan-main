import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'src'), // Set src as the root directory
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Alias for src directory
      styles: resolve(__dirname, 'src/styles'),
      components: resolve(__dirname, 'src/components'),
      modules: resolve(__dirname, 'src/modules'),
      scripts: resolve(__dirname, 'src/scripts'),
      utils: resolve(__dirname, 'src/utils'),
    },
    extensions: ['.js', '.ts', '.css'], // Optional extensions
  },
  server: {
    open: true,
    port: 3000,
  },
  build: {
    outDir: resolve(__dirname, 'dist'), // Ensure dist is outside src
    clean: true, // Ensures the output directory is cleaned before building
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        require('autoprefixer')({
          overrideBrowserslist: ['> 1%', 'last 2 versions', 'not dead'],
        }),
      ],
    },
  },
});
