import { describe, expect, it } from 'vitest';
import { findById, type Species } from './pokedex';
import { coverage, defence, sharedWeaknesses } from './team';

const team = (...ids: number[]) => ids.map(id => findById(id) as Species);

describe('team analysis', () => {
  it('counts weak and resistant members per attacking type', () => {
    // Charizard (fire/flying), Blastoise (water), Venusaur (grass/poison)
    const rows = defence(team(6, 9, 3));
    expect(rows.find(r => r.type === 'electric')).toEqual({ type: 'electric', weak: 2, resist: 1 });
    expect(rows.find(r => r.type === 'ground')).toEqual({ type: 'ground', weak: 0, resist: 1 });
  });

  it('flags weaknesses that several members share', () => {
    expect(sharedWeaknesses(team(6, 9, 3)).map(r => r.type)).toEqual(['electric']);
    // Two Pikachu share their ground weakness.
    expect(sharedWeaknesses(team(25, 25)).map(r => r.type)).toEqual(['ground']);
    expect(sharedWeaknesses(team(25))).toEqual([]);
  });

  it('lists types the team hits super effectively', () => {
    const { covered, uncovered } = coverage(team(25));
    expect(covered).toEqual(['water', 'flying']);
    expect(uncovered).toHaveLength(16);
  });
});
