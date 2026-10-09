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

describe('adding, exporting and importing', () => {
  it('adds only new ids, keeps the order they were added and clears', async () => {
    const favorites = await load();
    favorites.toggle(133);
    expect(favorites.addMany([25, 133, 1])).toBe(2);
    expect(favorites.addedOrder.value).toEqual([133, 25, 1]);
    expect(favorites.ids.value).toEqual([1, 25, 133]);
    favorites.clear();
    expect(favorites.ids.value).toEqual([]);
  });

  it('reads its own export and plain arrays, dropping invalid numbers', async () => {
    const { exportFavorites, parseFavorites } = await import('./favorites');
    const valid = (id: number) => id >= 1 && id <= 1025;
    expect(parseFavorites(exportFavorites([25, 133]), valid)).toEqual([25, 133]);
    expect(parseFavorites('[4, "7", 7, 0, 99999, "x", 1.5]', valid)).toEqual([4, 7]);
  });

  it('rejects files that are not a favorites list', async () => {
    const { parseFavorites } = await import('./favorites');
    expect(() => parseFavorites('{nope', () => true)).toThrow('not valid JSON');
    expect(() => parseFavorites('{"team": [1]}', () => true)).toThrow('no list of favorites');
  });
});
