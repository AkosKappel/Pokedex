import { describe, expect, it } from 'vitest';
import { effectiveness, matchups } from './types';

describe('effectiveness', () => {
  it('multiplies across both types', () => {
    expect(effectiveness('ice', ['dragon', 'flying'])).toBe(4);
    expect(effectiveness('fire', ['water', 'rock'])).toBe(0.25);
  });

  it('returns 0 for immunities even against a weakness', () => {
    expect(effectiveness('ground', ['electric', 'flying'])).toBe(0);
  });
});

describe('matchups', () => {
  it('groups Charizard (fire, flying)', () => {
    const { weak, resistant, immune } = matchups(['fire', 'flying']);
    expect(weak).toEqual([
      { type: 'rock', multiplier: 4 },
      { type: 'water', multiplier: 2 },
      { type: 'electric', multiplier: 2 },
    ]);
    expect(resistant.map(m => m.type)).toEqual(['fire', 'fighting', 'steel', 'fairy', 'grass', 'bug']);
    expect(immune).toEqual([{ type: 'ground', multiplier: 0 }]);
  });
});
