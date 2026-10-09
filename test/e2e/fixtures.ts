import { readFileSync } from 'node:fs';
import { test as base, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const fixture = (name: string) => readFileSync(new URL(`fixtures/${name}.json`, import.meta.url), 'utf8');

// 1×1 transparent PNG for every artwork request.
const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64',
);

/** Serves PokéAPI from test/e2e/fixtures; anything without a fixture returns 404. */
export const mockApi = async (page: Page) => {
  await page.route('https://pokeapi.co/api/v2/**', route => {
    const name = new URL(route.request().url()).pathname.replace('/api/v2/', '').replace(/\/$/, '').replace('/', '-');
    try {
      return route.fulfill({ contentType: 'application/json', body: fixture(name) });
    } catch {
      return route.fulfill({ status: 404, body: 'Not Found' });
    }
  });
  await page.route('https://raw.githubusercontent.com/**', route =>
    route.fulfill({ contentType: 'image/png', body: PIXEL }),
  );
};

export const test = base.extend<{ checkA11y: () => Promise<void> }>({
  page: async ({ page }, use) => {
    await mockApi(page);
    await use(page);
  },
  checkA11y: async ({ page }, use) => {
    await use(async () => {
      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations.map(v => `${v.id}: ${v.nodes.map(n => n.target).join(', ')}`)).toEqual([]);
    });
  },
});

export { expect };
