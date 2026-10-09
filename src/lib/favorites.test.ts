import { beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  localStorage.clear();
  vi.resetModules();
});

const load = async () => (await import('./favorites')).useFavorites();

describe('useFavorites', () => {
  it('toggles and persists ids, sorted', async () => {
    const favorites = await load();
    favorites.toggle(25);
    favorites.toggle(1);
    expect(favorites.ids.value).toEqual([1, 25]);
    expect(favorites.isFavorite(25)).toBe(true);
    favorites.toggle(25);
    expect(favorites.isFavorite(25)).toBe(false);
    expect(JSON.parse(localStorage.getItem('favoritePokemons')!)).toEqual([1]);
  });

  it('reads string ids from earlier versions and ignores broken data', async () => {
    localStorage.setItem('favoritePokemons', '["4","7","7","oops"]');
    expect((await load()).ids.value).toEqual([4, 7]);
    vi.resetModules();
    localStorage.setItem('favoritePokemons', '{broken');
    expect((await load()).ids.value).toEqual([]);
  });
});
