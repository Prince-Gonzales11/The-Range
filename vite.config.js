import { defineConfig } from 'vite';

export default defineConfig({
  root: './', // project root
  server: {
    port: 5173,
    open: true, // <-- this will open the browser automatically
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
});