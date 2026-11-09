import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        predictor: resolve(__dirname, 'predictor.html'),
        shipments: resolve(__dirname, 'shipments.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        features: resolve(__dirname, 'features.html'),
        register: resolve(__dirname, 'register.html'),
        contact: resolve(__dirname, 'contact.html')
      }
    }
  }
});
