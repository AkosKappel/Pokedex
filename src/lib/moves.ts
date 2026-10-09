import type { TypeName } from './types';
import { matchesQuery } from './search';

export const CATEGORIES = { physical: 'Physical', special: 'Special', status: 'Status' } as const;
export type Category = keyof typeof CATEGORIES;

export interface Move {
  id: number;
  name: string;
  type: TypeName;
  category: Category;
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  generation: number;
  description: string;
}

/** The move list is a separate chunk, loaded by the pages that need it. */
export const loadMoves = () => import('@/data/moves.json').then(module => module.default as Move[]);

export const MOVE_SORTS = { name: 'Name', power: 'Power', accuracy: 'Accuracy', pp: 'PP' } as const;
export type MoveSort = keyof typeof MOVE_SORTS;

export interface MoveFilters {
  query?: string;
  type?: TypeName;
  category?: Category;
  sort?: MoveSort;
  localNames?: Record<number, string>;
}

export const filterMoves = (
  moves: Move[],
  { query = '', type, category, sort = 'name', localNames = {} }: MoveFilters,
) => {
  const nameOf = (move: Move) => localNames[move.id] ?? move.name;
  const results = moves.filter(
    move =>
      matchesQuery(query, move.name, localNames[move.id]) &&
      (!type || move.type === type) &&
      (!category || move.category === category),
  );
  // Moves without a value (status moves have no power) go last.
  const byValue = (key: 'power' | 'accuracy' | 'pp') => (a: Move, b: Move) =>
    (b[key] ?? -1) - (a[key] ?? -1) || nameOf(a).localeCompare(nameOf(b));
  return results.sort(sort === 'name' ? (a, b) => nameOf(a).localeCompare(nameOf(b)) : byValue(sort));
};
