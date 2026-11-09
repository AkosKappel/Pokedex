import { describe, expect, it } from 'vitest';
import { findById, type Species } from './pokedex';
import { coverage, defence, gaps, sharedWeaknesses, suggest } from './team';

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

describe('team gaps and suggestions', () => {
  it('finds uncovered types and weaknesses nobody resists', () => {
    // Two Pikachu: only water and flying are hit hard, both members are weak to ground.
    expect(gaps(team(25, 25))).toEqual({ offence: coverage(team(25)).uncovered, defence: ['ground'] });
    // Venusaur resists electric, so the shared electric weakness of Charizard and Blastoise is no gap.
    expect(gaps(team(6, 9, 3)).defence).toEqual([]);
  });

  it('suggests Pokémon that close the most gaps without new shared weaknesses', () => {
    const current = team(25, 25);
    const picks = suggest(current);
    expect(picks).toHaveLength(3);
    for (const { species, hits, resists } of picks) {
      expect(hits.length + resists.length).toBeGreaterThan(0);
      expect(species.legendary || species.mythical).toBeFalsy();
      expect(sharedWeaknesses([...current, species]).map(r => r.type)).toEqual(['ground']);
    }
    const scores = picks.map(p => p.hits.length + p.resists.length);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
    expect(new Set(picks.map(p => [...p.species.types].sort().join('/'))).size).toBe(3);
  });

  it('filters by generation and skips empty or full teams', () => {
    expect(suggest(team(25), { generation: 1 }).every(p => p.species.generation === 1)).toBe(true);
    expect(suggest([])).toEqual([]);
    expect(suggest(team(25, 25, 25, 25, 25, 25))).toEqual([]);
  });
});
