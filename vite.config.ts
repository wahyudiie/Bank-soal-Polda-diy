import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['logo-polda.jpeg', 'logo-tik.jpeg'],
        manifest: {
          name: 'Bank Soal Polda DIY',
          short_name: 'Bank Soal',
          description: 'Aplikasi Bank Soal Digital untuk Personel Polda D.I. Yogyakarta',
          theme_color: '#002147',
          background_color: '#F8FAFC',
          display: 'standalone',
          icons: [
            {
              src: '/app-icon.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/app-icon.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
