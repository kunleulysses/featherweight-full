const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const path = require('path');
const tailwindcss = require('@tailwindcss/vite');

/** @type {import('vite').UserConfig} */
module.exports = defineConfig({
  root: 'client',
  resolve: {
    alias: {
      '@':       path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@assets': path.resolve(__dirname, 'client/src/assets'),
    },
  },
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../public',
    emptyOutDir: true,
  },
});