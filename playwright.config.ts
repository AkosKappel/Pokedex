import { defineConfig, devices } from '@playwright/test';

// End-to-end tests run against the production build (`npm run build` first),
// with PokéAPI served from test/e2e/fixtures.
export default defineConfig({
  testDir: 'test/e2e',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4174/Pokedex/',
    trace: 'retain-on-failure',
    // Requests from a service worker bypass page.route, so keep it out of the tests.
    serviceWorkers: 'block',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npx vite preview --port 4174 --strictPort',
    url: 'http://localhost:4174/Pokedex/',
    reuseExistingServer: !process.env.CI,
  },
});
