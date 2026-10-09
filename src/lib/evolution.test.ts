import { describe, expect, it } from 'vitest';
import eevee from '../../test/e2e/fixtures/evolution-chain-67.json';
import pikachu from '../../test/e2e/fixtures/evolution-chain-10.json';
import type { EvolutionChain } from './api';
import { evolutionStages } from './evolution';

describe('evolutionStages', () => {
  it('lists a linear chain with level conditions', () => {
    expect(evolutionStages((pikachu as EvolutionChain).chain)).toEqual([
      [{ id: 172, condition: '' }],
      [{ id: 25, condition: 'Level up with high friendship' }],
      [{ id: 26, condition: 'Use Thunder Stone' }],
    ]);
  });

  it('puts branches in one stage and prefers items over locations', () => {
    const [first, second] = evolutionStages((eevee as EvolutionChain).chain);
    expect(first).toEqual([{ id: 133, condition: '' }]);
    expect(second).toHaveLength(8);
    expect(second).toContainEqual({ id: 470, condition: 'Use Leaf Stone' });
    expect(second).toContainEqual({ id: 197, condition: 'Level up with high friendship at night' });
    expect(second).toContainEqual({ id: 700, condition: 'Level up knowing a Fairy move with high affection' });
  });
});
