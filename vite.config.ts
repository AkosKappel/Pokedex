import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

const versionOf = (name: string) =>
  JSON.parse(readFileSync(new URL(`./node_modules/${name}/package.json`, import.meta.url), 'utf8')).version;

const MONTH = 60 * 60 * 24 * 30;

export default defineConfig({
  base: '/Pokedex/',
  define: {
    __VERSIONS__: JSON.stringify({
      vue: versionOf('vue'),
      router: versionOf('vue-router'),
      typescript: versionOf('typescript'),
      vite: versionOf('vite'),
    }),
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        // Prerendered Pokémon pages are only needed when visited.
        globIgnores: ['pokemon/**'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            // PokéAPI data changes only with new games.
            urlPattern: ({ url }) => url.origin === 'https://pokeapi.co',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'pokeapi', expiration: { maxEntries: 600, maxAgeSeconds: MONTH } },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://raw.githubusercontent.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'artwork',
              expiration: { maxEntries: 800, maxAgeSeconds: MONTH },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    include: ['src/**/*.test.ts'],
    // The favourites store reads localStorage and listens to window events.
    environment: 'jsdom',
  },
});
