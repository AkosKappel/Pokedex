import { describe, expect, it } from 'vitest';
import { paletteEntries, SPECIES_LIMIT, stepIndex } from './palette';

const labels = (query: string, localNames = {}) => paletteEntries(query, localNames).map(entry => entry.label);

describe('paletteEntries', () => {
  it('lists the pages for an empty query', () => {
    expect(labels('  ')).toEqual([
      'Home',
      'Browse Pokémon',
      'Moves',
      'Abilities',
      'Items',
      'Team builder',
      'Favorites',
      'Compare Pokémon',
      "Who's that Pokémon?",
      'About',
    ]);
  });

  it('matches pages, types and regions, and ends with a search of the Pokédex', () => {
    const entries = paletteEntries('fire');
    expect(entries[0]).toMatchObject({ label: 'Fire type', to: { name: 'browse', query: { type: 'fire' } } });
    expect(entries.at(-1)).toMatchObject({
      label: 'Search Pokémon for “fire”',
      to: { name: 'browse', query: { q: 'fire' } },
    });
    expect(labels('kanto')[0]).toBe('Kanto');
    expect(labels('team')[0]).toBe('Team builder');
  });

  it('puts an exact name or number first and limits the Pokémon', () => {
    const mew = paletteEntries('mew').filter(entry => entry.species);
    expect(mew[0]).toMatchObject({ label: 'Mew', hint: '#0151', to: { name: 'pokemon', params: { id: 151 } } });
    expect(mew.map(entry => entry.label)).toEqual(['Mew', 'Mewtwo']);
    expect(paletteEntries('on').filter(entry => entry.species)).toHaveLength(SPECIES_LIMIT);
    expect(paletteEntries('#25').find(entry => entry.species)?.label).toBe('Pikachu');
  });

  it('finds Pokémon by their name in the chosen language', () => {
    expect(labels('ピカチュウ', { 25: 'ピカチュウ' })).toContain('ピカチュウ');
  });
});

describe('stepIndex', () => {
  it('wraps around both ends', () => {
    expect(stepIndex(0, 1, 3)).toBe(1);
    expect(stepIndex(2, 1, 3)).toBe(0);
    expect(stepIndex(0, -1, 3)).toBe(2);
    expect(stepIndex(0, 1, 0)).toBe(-1);
  });
});
