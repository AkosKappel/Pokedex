import { describe, expect, it } from 'vitest';
import {
  filterPokedex,
  findExact,
  formatNumber,
  LAST_ID,
  pageCount,
  paginate,
  POKEDEX,
  pokemonOfTheDay,
} from './pokedex';

describe('index', () => {
  it('has one entry per national number, in order', () => {
    expect(POKEDEX.every((species, index) => species.id === index + 1)).toBe(true);
    expect(LAST_ID).toBeGreaterThanOrEqual(1025);
  });
});

describe('findExact', () => {
  it.each([
    ['25', 'Pikachu'],
    ['#0025', 'Pikachu'],
    ['PIKACHU', 'Pikachu'],
    ['mr mime', 'Mr. Mime'],
    ['flabebe', 'Flabébé'],
  ])('finds %s', (query, name) => {
    expect(findExact(query)?.name).toBe(name);
  });

  it('returns nothing for partial names and unknown numbers', () => {
    expect(findExact('pika')).toBeUndefined();
    expect(findExact('99999')).toBeUndefined();
    expect(findExact('  ')).toBeUndefined();
  });
});

describe('filterPokedex', () => {
  it('matches names anywhere', () => {
    expect(filterPokedex({ query: 'chu' }).map(s => s.name)).toEqual(expect.arrayContaining(['Pikachu', 'Raichu']));
  });

  it('matches number prefixes', () => {
    expect(
      filterPokedex({ query: '15' })
        .map(s => s.id)
        .slice(0, 3),
    ).toEqual([15, 150, 151]);
  });

  it('combines types (both required), generation and sort', () => {
    const result = filterPokedex({ types: ['fire', 'flying'], generation: 1, sort: 'total' });
    expect(result.map(s => s.name)).toEqual(['Moltres', 'Charizard']);
  });
});

describe('pagination', () => {
  it('counts pages and slices them', () => {
    expect(pageCount(0)).toBe(1);
    expect(pageCount(49, 24)).toBe(3);
    expect(paginate([1, 2, 3, 4, 5], 2, 2)).toEqual([3, 4]);
  });
});

describe('helpers', () => {
  it('formats national numbers with four digits', () => {
    expect(formatNumber(7)).toBe('#0007');
  });

  it('picks the same Pokémon all day and a different one the next day', () => {
    const morning = pokemonOfTheDay(new Date('2026-10-09T01:00:00Z'));
    expect(pokemonOfTheDay(new Date('2026-10-09T23:00:00Z'))).toBe(morning);
    expect(pokemonOfTheDay(new Date('2026-10-10T01:00:00Z'))).not.toBe(morning);
  });
});
