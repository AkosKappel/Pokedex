import type { Species } from './pokedex';
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
