// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9000', // A porta do seu back-end
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
