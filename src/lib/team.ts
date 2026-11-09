import { POKEDEX, type Species } from './pokedex';
import { effectiveness, TYPES, type TypeName } from './types';

export const TEAM_SIZE = 6;

export interface DefenceRow {
  type: TypeName;
  /** Members that take more than normal damage from this attacking type. */
  weak: number;
  /** Members that take less (including immune). */
  resist: number;
}

/** How the team holds up against each attacking type. */
export const defence = (team: Species[]): DefenceRow[] =>
  TYPES.map(type => {
    const multipliers = team.map(member => effectiveness(type, member.types));
    return {
      type,
      weak: multipliers.filter(m => m > 1).length,
      resist: multipliers.filter(m => m < 1).length,
    };
  });

/** Attacking types the team should worry about: at least two members weak and more weak than resistant. */
export const sharedWeaknesses = (team: Species[]) =>
  defence(team).filter(row => row.weak >= 2 && row.weak > row.resist);

/**
 * Defending types that the team's own types (same-type attacks) hit super effectively, and the
 * ones none of them do.
 */
export const coverage = (team: Species[]) => {
  const attacking = [...new Set(team.flatMap(member => member.types))];
  const covered = TYPES.filter(defending => attacking.some(type => effectiveness(type, [defending]) > 1));
  return { covered, uncovered: TYPES.filter(type => !covered.includes(type)) };
};

export interface Gaps {
  /** Defending types no member's own type hits super effectively. */
  offence: TypeName[];
  /** Attacking types at least two members are weak to while none resists. */
  defence: TypeName[];
}

export const gaps = (team: Species[]): Gaps => ({
  offence: coverage(team).uncovered,
  defence: defence(team)
    .filter(row => row.weak >= 2 && row.resist === 0)
    .map(row => row.type),
});

export interface Suggestion {
  species: Species;
  /** Offensive gaps its types hit super effectively. */
  hits: TypeName[];
  /** Defensive gaps it resists. */
  resists: TypeName[];
}

const score = (suggestion: Suggestion) => suggestion.hits.length + suggestion.resists.length;

/**
 * Pokémon that close the most gaps without adding a shared weakness, strongest first. One per type
 * combination so the picks differ, and no legendary or mythical Pokémon.
 */
export const suggest = (team: Species[], { generation, limit = 3 }: { generation?: number; limit?: number } = {}) => {
  if (!team.length || team.length >= TEAM_SIZE) return [];
  const open = gaps(team);
  const shared = new Set(sharedWeaknesses(team).map(row => row.type));
  const best = new Map<string, Suggestion>();

  for (const species of POKEDEX) {
    if (species.legendary || species.mythical) continue;
    if (generation && species.generation !== generation) continue;
    if (team.some(member => member.id === species.id)) continue;

    const candidate = {
      species,
      hits: open.offence.filter(defending => species.types.some(type => effectiveness(type, [defending]) > 1)),
      resists: open.defence.filter(attacking => effectiveness(attacking, species.types) < 1),
    };
    if (!score(candidate)) continue;
    if (sharedWeaknesses([...team, species]).some(row => !shared.has(row.type))) continue;

    const key = [...species.types].sort().join('/');
    // The same types close the same gaps, so keep the strongest.
    if (species.total > (best.get(key)?.species.total ?? 0)) best.set(key, candidate);
  }

  return [...best.values()]
    .sort((a, b) => score(b) - score(a) || b.species.total - a.species.total || a.species.id - b.species.id)
    .slice(0, limit);
};
