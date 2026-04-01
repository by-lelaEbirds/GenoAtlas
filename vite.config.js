import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,json,mp3}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/flagcdn\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'flag-cache',
              expiration: {
                maxEntries: 250,
                maxAgeSeconds: 60 * 60 * 24 * 30 
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      manifest: {
        name: 'GenoAtlas',
        short_name: 'GenoAtlas',
        description: 'Um jogo de exploração global',
        theme_color: '#38bdf8',
        background_color: '#1c1917',
        display: 'fullscreen',
        orientation: 'portrait',
        icons: [
          {
            src: '/assets/icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  base: './', 
  build: {
    // PERFORMANCE: Minificação agressiva para produção
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
