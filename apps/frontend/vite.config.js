import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            const isConnRefused =
              err.code === 'ECONNREFUSED' ||
              (err.message && err.message.includes('ECONNREFUSED'));
            if (!isConnRefused) {
              console.warn('[vite proxy error]', err.message);
            }
          });
        },
      },
      '/uploads': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');
          if (normalizedId.includes('/node_modules/')) {
            if (normalizedId.includes('/three/')) return 'vendor-three';
            if (normalizedId.includes('/recharts/')) return 'vendor-charts';
            if (normalizedId.includes('/framer-motion/'))
              return 'vendor-motion';
            if (
              normalizedId.includes('/react/') ||
              normalizedId.includes('/react-dom/') ||
              normalizedId.includes('/@reduxjs/')
            )
              return 'vendor-react';
          }
        },
      },
    },
  },
});
