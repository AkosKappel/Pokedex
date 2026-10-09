import { matchesQuery } from './search';

export interface Ability {
  id: number;
  name: string;
  generation: number;
  description: string;
}

export const loadAbilities = () => import('@/data/abilities.json').then(module => module.default as Ability[]);

export const filterAbilities = (
  abilities: Ability[],
  {
    query = '',
    generation,
    localNames = {},
  }: { query?: string; generation?: number; localNames?: Record<number, string> },
) =>
  abilities
    .filter(
      ability =>
        matchesQuery(query, ability.name, localNames[ability.id], ability.description) &&
        (!generation || ability.generation === generation),
    )
    .sort((a, b) => (localNames[a.id] ?? a.name).localeCompare(localNames[b.id] ?? b.name));
