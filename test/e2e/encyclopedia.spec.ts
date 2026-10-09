import { expect, test } from './fixtures';

test('the More menu opens as a popover and links to the other pages', async ({ page }) => {
  await page.goto('');
  await page.getByRole('button', { name: 'More' }).click();
  await page.getByRole('link', { name: 'Compare Pokémon' }).click();
  await expect(page).toHaveURL(/\/compare$/);
  await expect(page.getByRole('link', { name: 'Compare Pokémon' })).toBeHidden();
});

test('moves can be filtered and open a page with the Pokémon that learn them', async ({ page, checkA11y }) => {
  await page.goto('moves');
  await page.getByLabel('Type').selectOption('electric');
  await page.getByLabel('Name', { exact: true }).fill('thunderbolt');
  await expect(page).toHaveURL(/type=electric/);
  await page.getByRole('link', { name: 'Thunderbolt' }).click();

  await expect(page).toHaveURL(/\/moves\/85$/);
  await expect(page).toHaveTitle('Thunderbolt · Pokédex');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Thunderbolt');
  await expect(page.getByText('Power').locator('..')).toContainText('90');
  await expect(page.getByRole('heading', { name: /Pokémon that learn Thunderbolt \(\d+\)/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Pikachu' })).toBeVisible();
  await checkA11y();
});

test('a Pokémon page lists its moves by learn method and links its abilities', async ({ page, checkA11y }) => {
  await page.goto('pokemon/25');
  const moves = page.getByRole('region', { name: 'Moves' });
  await expect(moves.getByText('In Pokémon Scarlet and Violet')).toBeVisible();
  await expect(moves.getByRole('radio', { name: /Level up/ })).toBeChecked();
  await expect(moves.getByRole('link', { name: 'Thunder Shock' })).toBeVisible();
  await moves.locator('label', { hasText: 'TM' }).click();
  await expect(moves.getByRole('radio', { name: /TM/ })).toBeChecked();
  await expect(moves.getByRole('link', { name: 'Thunderbolt' })).toBeVisible();
  await checkA11y();

  await page.getByRole('link', { name: 'Static' }).click();
  await expect(page).toHaveURL(/\/abilities\/9$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Static');
  await expect(
    page.getByRole('region', { name: /Pokémon with this ability/ }).getByRole('link', { name: 'Pikachu' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /As a hidden ability/ })).toBeVisible();
  await checkA11y();
});

test('abilities can be searched by effect', async ({ page }) => {
  await page.goto('abilities');
  await page.getByLabel('Name or effect').fill('paralyze');
  await expect(page.getByRole('link', { name: /^Static/ })).toBeVisible();
});

test('items open in a dialog that is part of the URL', async ({ page, checkA11y }) => {
  await page.goto('items');
  await page.getByRole('button', { name: 'Poké Balls' }).click();
  await expect(page).toHaveURL(/pocket=pokeballs/);
  await page.getByRole('link', { name: 'Master Ball' }).click();

  const dialog = page.getByRole('dialog', { name: 'Master Ball' });
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(/item=master-ball/);
  await expect(dialog).toContainText('catch any wild Pokémon without fail');
  await checkA11y();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page).not.toHaveURL(/item=/);

  await page.goto('items?item=master-ball');
  await expect(page.getByRole('dialog', { name: 'Master Ball' })).toBeVisible();
});

test('the team builder finds shared weaknesses and remembers the team', async ({ page, checkA11y }) => {
  await page.goto('team');
  await expect(page.getByRole('heading', { name: 'Your team is empty' })).toBeVisible();
  for (const name of ['Charizard', 'Blastoise', 'Venusaur']) {
    await page.getByLabel('Add a Pokémon').fill(name);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
  }
  await expect(page).toHaveURL(/ids=6,9,3/);
  const shared = page.getByRole('heading', { name: 'Shared weaknesses' }).locator('..');
  await expect(shared).toContainText('Electric');
  await expect(shared).toContainText('2 weak, 1 resist');
  await checkA11y();

  await page.goto('pokemon/25');
  await page.getByRole('button', { name: 'Add to team' }).click();
  await expect(page.getByText('Pikachu joined your team.')).toBeVisible();
  await page.goto('team');
  await expect(page).toHaveURL(/ids=6,9,3,25/);
  await page.getByRole('button', { name: 'Remove Charizard' }).click();
  await expect(page).toHaveURL(/ids=9,3,25/);
});

test('Pokémon data can be shown in Japanese', async ({ page, checkA11y }) => {
  await page.goto('pokemon/25');
  await page.getByRole('button', { name: /Pokémon names: English/ }).click();
  await page.getByRole('radio', { name: '日本語' }).check();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ピカチュウ');
  await expect(page.getByRole('heading', { level: 1 })).toHaveAttribute('lang', 'ja');
  await expect(page.getByText('ねずみポケモン')).toBeVisible();
  await checkA11y();

  // The choice is remembered, and search accepts the Japanese name.
  await page.goto('');
  await page.getByRole('combobox', { name: 'Search by name or number' }).fill('フシギダネ');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/pokemon\/1$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('フシギダネ');
});
