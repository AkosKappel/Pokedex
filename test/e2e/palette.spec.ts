import { expect, test } from './fixtures';

test('quick find opens a Pokémon from the keyboard', async ({ page, checkA11y }) => {
  await page.goto('moves');
  await page.keyboard.press('ControlOrMeta+k');

  const dialog = page.getByRole('dialog', { name: 'Quick find' });
  const input = dialog.getByRole('combobox', { name: 'Find a page or Pokémon' });
  await expect(input).toBeFocused();
  await expect(dialog.getByRole('option')).toHaveCount(10);
  await checkA11y();

  await input.fill('pikachu');
  await expect(dialog.getByRole('option', { selected: true })).toContainText('Pikachu');
  await page.keyboard.press('ArrowUp');
  await expect(dialog.getByRole('option', { selected: true })).toHaveText(/Search Pokémon for “pikachu”/);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/\/pokemon\/25$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Pikachu' })).toBeVisible();
  await expect(dialog).toBeHidden();
});

test('quick find jumps to pages and filters, and Escape closes it', async ({ page }) => {
  await page.goto('');
  const dialog = page.getByRole('dialog', { name: 'Quick find' });

  await page.getByRole('button', { name: 'Quick find' }).click();
  await dialog.getByRole('combobox').fill('fire');
  await dialog.getByRole('option', { name: /Fire type/ }).click();
  await expect(page).toHaveURL(/\/pokemon\?type=fire$/);
  await expect(dialog).toBeHidden();

  await page.keyboard.press('ControlOrMeta+k');
  await dialog.getByRole('combobox').fill('team');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  await page.keyboard.press('ControlOrMeta+k');
  await expect(dialog.getByRole('combobox')).toHaveValue('');
  await dialog.getByRole('combobox').fill('chu');
  await dialog.getByRole('option').last().click();
  await expect(page).toHaveURL(/\/pokemon\?q=chu$/);
});
