import { describe, expect, it } from 'vitest';
import { filterMoves, loadMoves } from './moves';
import { filterAbilities, loadAbilities } from './abilities';
import { filterItems, loadItems } from './items';
import { filterPokedex, findExact } from './pokedex';

describe('moves', () => {
  it('filters by type and category and sorts by power, status moves last', async () => {
    const moves = await loadMoves();
    const electric = filterMoves(moves, { type: 'electric', category: 'special', sort: 'power' });
    expect(electric.every(m => m.type === 'electric' && m.category === 'special')).toBe(true);
    expect(electric[0].power).toBeGreaterThanOrEqual(electric[electric.length - 1].power ?? 0);
    const all = filterMoves(moves, { sort: 'power' });
    expect(all[all.length - 1].power).toBeNull();
  });

  it('finds moves by English or local name', async () => {
    const moves = await loadMoves();
    expect(filterMoves(moves, { query: 'thunderbolt' }).map(m => m.id)).toContain(85);
    expect(filterMoves(moves, { query: 'blitz', localNames: { 85: 'Donnerblitz' } }).map(m => m.id)).toContain(85);
  });
});

describe('abilities and items', () => {
  it('searches ability names and descriptions', async () => {
    const abilities = await loadAbilities();
    expect(filterAbilities(abilities, { query: 'levitate' }).map(a => a.name)).toContain('Levitate');
    expect(filterAbilities(abilities, { generation: 3 }).every(a => a.generation === 3)).toBe(true);
  });

  it('filters items by pocket', async () => {
    const items = await loadItems();
    const balls = filterItems(items, { pocket: 'pokeballs' });
    expect(balls.map(i => i.name)).toContain('Master Ball');
    expect(balls.every(i => i.pocket === 'pokeballs')).toBe(true);
  });
});

describe('local Pokémon names', () => {
  it('finds and sorts by them', () => {
    const localNames = { 25: 'ピカチュウ', 26: 'ライチュウ' };
    expect(findExact('ピカチュウ', localNames)?.id).toBe(25);
    expect(filterPokedex({ query: 'チュウ', localNames }).map(s => s.id)).toEqual([25, 26]);
  });
});
