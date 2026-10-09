import { expect, test } from './fixtures';

test('home page shows the Pokémon of the day and links to every type', async ({ page, checkA11y }) => {
  await page.goto('');
  await expect(page).toHaveTitle('Pokédex: every Pokémon at a glance');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Every Pokémon');
  await expect(page.getByRole('link', { name: /Pokémon of the day/ })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Browse by type' }).getByRole('link')).toHaveCount(18);
  await checkA11y();
});

test('searching by name opens the Pokémon', async ({ page }) => {
  await page.goto('');
  await page.getByRole('combobox', { name: 'Search by name or number' }).fill('pikachu');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/pokemon\/25$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Pikachu' })).toBeVisible();
});

test('a partial search lists the matches', async ({ page }) => {
  await page.goto('');
  await page.getByRole('combobox', { name: 'Search by name or number' }).fill('chu');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/pokemon\?q=chu$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Results for “chu”');
  await expect(page.getByRole('link', { name: 'Raichu' })).toBeVisible();
});

test('detail page shows stats, matchups and evolutions from a deep link', async ({ page, checkA11y }) => {
  await page.goto('pokemon/25');
  await expect(page).toHaveTitle('Pikachu #0025 · Pokédex');
  await expect(page.getByText('Mouse Pokémon')).toBeVisible();
  await expect(page.getByText('0.4 m')).toBeVisible();
  await expect(page.getByText('6.0 kg')).toBeVisible();

  const stats = page.getByRole('region', { name: 'Base stats' });
  await expect(stats.getByText('Total')).toBeVisible();
  await expect(stats).toContainText('320');

  const matchups = page.getByRole('region', { name: 'Type matchups' });
  await expect(matchups.getByText('Ground')).toBeVisible();

  const evolution = page.getByRole('region', { name: 'Evolution' });
  await expect(evolution.getByRole('link', { name: /Raichu/ })).toBeVisible();
  await expect(evolution.getByText('Use Thunder Stone')).toBeVisible();
  await checkA11y();
});

test('previous and next links and arrow keys step through the Pokédex', async ({ page }) => {
  await page.goto('pokemon/25');
  await expect(page.getByRole('link', { name: /Arbok/ })).toBeVisible();
  await page
    .getByRole('link', { name: /Raichu/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/pokemon\/26$/);
  await page.keyboard.press('ArrowLeft');
  await expect(page).toHaveURL(/\/pokemon\/25$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/pokemon\/26$/);
});

test('a failed request shows a retry button', async ({ page }) => {
  await page.goto('pokemon/26');
  await expect(page.getByRole('heading', { name: 'The details did not load' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: 'Raichu' })).toBeVisible();
});

test('browse filters by two types and keeps them in the URL', async ({ page, checkA11y }) => {
  await page.goto('pokemon');
  await expect(page.getByText('1025 Pokémon')).toBeVisible();
  await page.getByRole('button', { name: 'Fire' }).click();
  await page.getByRole('button', { name: 'Flying' }).click();
  await expect(page).toHaveURL(/type=fire,flying/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Fire and Flying Pokémon');
  await expect(page.getByText('6 Pokémon')).toBeVisible();
  await page.getByLabel('Region').selectOption('Kanto');
  await expect(page.getByRole('heading', { level: 3 })).toHaveText(['Charizard', 'Moltres']);
  await checkA11y();
});

test('pagination links work and out-of-range pages show the last page', async ({ page }) => {
  await page.goto('pokemon');
  await page.getByRole('link', { name: 'Next' }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.getByRole('link', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('heading', { level: 3 }).first()).toHaveText('Pikachu');

  await page.goto('pokemon?page=999');
  await expect(page).toHaveURL(/page=43/);
  await expect(page.getByRole('heading', { level: 3 }).last()).toHaveText('Pecharunt');
});

test('favorites are saved and listed', async ({ page }) => {
  await page.goto('pokemon');
  await page.getByRole('button', { name: 'Add Bulbasaur to favorites' }).click();
  await expect(page.getByRole('button', { name: 'Remove Bulbasaur from favorites' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('link', { name: /^Favorites/ }).click();
  await expect(page.getByRole('heading', { level: 3 })).toHaveText(['Bulbasaur']);

  await page.reload();
  await page.getByRole('button', { name: 'Remove Bulbasaur from favorites' }).click();
  await expect(page.getByRole('heading', { name: 'No favorites yet' })).toBeVisible();
});

test('compare puts stats side by side and marks the highest', async ({ page, checkA11y }) => {
  await page.goto('compare?ids=25');
  await page.getByLabel('Add a Pokémon').fill('Eevee');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await expect(page).toHaveURL(/ids=25,133/);
  const total = page.getByRole('row', { name: /Total/ });
  await expect(total).toContainText('320');
  await expect(total).toContainText('325(highest)');
  await checkA11y();

  await page.getByLabel('Add a Pokémon').fill('Agumon');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await expect(page.getByText('No Pokémon is called “Agumon”')).toBeVisible();
});

test('unknown pages and numbers show the 404 page', async ({ page, checkA11y }) => {
  await page.goto('nowhere');
  await expect(page.getByRole('heading', { name: 'A wild 404 appeared' })).toBeVisible();
  await checkA11y();
  await page.goto('pokemon/99999');
  await expect(page.getByRole('heading', { name: 'A wild 404 appeared' })).toBeVisible();
});

test('about page and dark theme pass accessibility checks', async ({ page, checkA11y }) => {
  await page.goto('about');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('About this Pokédex');
  await checkA11y();
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.goto('pokemon/25');
  await expect(page.getByRole('region', { name: 'Base stats' })).toBeVisible();
  await checkA11y();
});

test('quiz gives hints after a wrong guess and counts the streak', async ({ page, checkA11y }) => {
  // Always pick the first Pokémon of the pool: Bulbasaur.
  await page.addInitScript(() => (Math.random = () => 0));
  await page.goto('quiz');
  const guess = page.getByLabel('Your guess');
  await guess.fill('Pikachu');
  await page.getByRole('button', { name: 'Guess' }).click();
  await expect(page.getByText('Not Pikachu. Try again.')).toBeVisible();
  await expect(page.getByText('Type: Grass and Poison')).toBeVisible();
  await checkA11y();

  await guess.fill('bulbasaur');
  await page.getByRole('button', { name: 'Guess' }).click();
  await expect(page.getByText("Correct, it's Bulbasaur!")).toBeVisible();
  await expect(page.getByRole('definition').first()).toHaveText('1');
  await expect(page.getByRole('button', { name: 'Next Pokémon' })).toBeFocused();
});

test('search fields have their own clear button', async ({ page }) => {
  await page.goto('moves');
  const name = page.getByLabel('Name', { exact: true });
  await name.fill('thunder');
  await expect(page).toHaveURL(/q=thunder/);
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(name).toHaveValue('');
  await expect(name).toBeFocused();
  await expect(page).not.toHaveURL(/q=/);

  const search = page.getByRole('combobox', { name: 'Search by name or number' });
  await search.fill('pika');
  await page.getByRole('search').getByRole('button', { name: 'Clear search' }).click();
  await expect(search).toHaveValue('');
});

test('favorites can be filtered, sorted, shared, exported and imported', async ({ page, context, checkA11y }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('favorites');
  await page.evaluate(() => localStorage.setItem('favoritePokemons', '[25, 1, 6]'));
  await page.reload();

  const names = page.getByRole('heading', { level: 3 });
  await expect(names).toHaveText(['Bulbasaur', 'Charizard', 'Pikachu']);
  await page.getByLabel('Sort by').selectOption('added');
  await expect(names).toHaveText(['Charizard', 'Bulbasaur', 'Pikachu']);
  await page.getByLabel('Type').selectOption('fire');
  await expect(names).toHaveText(['Charizard']);
  await checkA11y();

  await page.getByRole('button', { name: 'Share list' }).click();
  await expect(page.getByText('Link copied.')).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/\/Pokedex\/favorites\?ids=25,1,6$/);

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export' }).click(),
  ]);
  expect(download.suggestedFilename()).toBe('pokedex-favorites.json');
  const exported = await (await download.createReadStream()).toArray();
  const file = Buffer.concat(exported);
  expect(JSON.parse(file.toString()).favorites).toEqual([25, 1, 6]);

  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Remove all' }).click();
  await expect(page.getByRole('heading', { name: 'No favorites yet' })).toBeVisible();

  await page
    .locator('input[type="file"]')
    .setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: file });
  await expect(page.getByText('Imported 3 Pokémon: 3 new, 0 already in your favorites.')).toBeVisible();
  await page
    .locator('input[type="file"]')
    .setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{nope') });
  await expect(page.getByText('Could not import broken.json. The file is not valid JSON.')).toBeVisible();

  await page.goto('favorites?ids=4,7,25');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Shared favorites');
  await page.getByRole('button', { name: 'Add all to my favorites' }).click();
  await expect(page.getByText('Added 2 Pokémon to your favorites.')).toBeVisible();
  await page.getByRole('link', { name: 'Show my favorites' }).click();
  await expect(page.getByRole('heading', { level: 3 })).toHaveCount(5);
});
