import { describe, expect, it } from 'vitest';
import { isExactMatch, matchesQuery, normalize } from './search';

describe('normalize', () => {
  it('ignores case, accents, punctuation and full-width forms', () => {
    expect(normalize('Mr. Mime')).toBe('mrmime');
    expect(normalize('Flabébé')).toBe(normalize('flabebe'));
    expect(normalize('１０まんボルト')).toBe(normalize('10まんボルト'));
    expect(normalize('Nidoran♀')).toBe('nidoran♀');
  });
});

describe('matching', () => {
  it('matches any of the names', () => {
    expect(matchesQuery('pika', 'Pikachu', 'ピカチュウ')).toBe(true);
    expect(matchesQuery('ピカ', 'Pikachu', 'ピカチュウ')).toBe(true);
    expect(matchesQuery('', 'Pikachu')).toBe(true);
    expect(isExactMatch('pikachu', 'Pikachu')).toBe(true);
    expect(isExactMatch('pika', 'Pikachu')).toBe(false);
    expect(isExactMatch('', 'Pikachu')).toBe(false);
  });
});
