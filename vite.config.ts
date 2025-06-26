import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Vite configuration for building the client in 'client'
// and outputting static assets to 'public' for the server to serve
export default defineConfig({
  root: 'client',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
    },
  },
  plugins: [react()],
  build: {
    outDir: '../public',
    emptyOutDir: true,
  },
});