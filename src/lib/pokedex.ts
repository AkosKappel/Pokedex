import entries from '@/data/pokedex.json';
import type { TypeName } from './types';

export interface Species {
  id: number;
  name: string;
  generation: number;
  types: TypeName[];
  /** Base stat total of the default form. */
  total: number;
  legendary?: boolean;
  mythical?: boolean;
}

export const POKEDEX = entries as Species[];
export const LAST_ID = POKEDEX.length;
export const PAGE_SIZE = 24;

export const REGIONS = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar', 'Paldea'] as const;
export const regionOf = (generation: number) => REGIONS[generation - 1];

export const SORTS = { number: 'Number', name: 'Name', total: 'Strongest first' } as const;
export type Sort = keyof typeof SORTS;

const ARTWORK_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';
export const artworkUrl = (id: number, shiny = false) => `${ARTWORK_URL}${shiny ? '/shiny' : ''}/${id}.png`;

export const formatNumber = (id: number) => `#${String(id).padStart(4, '0')}`;

export const findById = (id: number): Species | undefined => POKEDEX[id - 1];

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9♀♂]/g, '');

/** Exact match by number ("25", "#025") or by name, ignoring case, accents and punctuation ("mr mime"). */
export const findExact = (query: string): Species | undefined => {
  const number = query.trim().replace(/^#/, '');
  if (/^\d+$/.test(number)) return findById(Number(number));
  const wanted = normalize(query);
  return wanted ? POKEDEX.find(species => normalize(species.name) === wanted) : undefined;
};

export interface Filters {
  query?: string;
  types?: TypeName[];
  generation?: number;
  sort?: Sort;
}

export const filterPokedex = ({ query = '', types = [], generation, sort = 'number' }: Filters): Species[] => {
  const wanted = normalize(query);
  const number = query.trim().replace(/^#/, '');
  const byNumber = /^\d+$/.test(number);

  const results = POKEDEX.filter(
    species =>
      (!wanted ||
        (byNumber
          ? String(species.id).startsWith(String(Number(number)))
          : normalize(species.name).includes(wanted))) &&
      types.every(type => species.types.includes(type)) &&
      (!generation || species.generation === generation),
  );

  if (sort === 'name') return results.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'total') return results.sort((a, b) => b.total - a.total || a.id - b.id);
  return results;
};

export const pageCount = (itemCount: number, pageSize = PAGE_SIZE) => Math.max(1, Math.ceil(itemCount / pageSize));

export const paginate = <T>(items: T[], page: number, pageSize = PAGE_SIZE) =>
  items.slice((page - 1) * pageSize, page * pageSize);

/** The same Pokémon for everyone on a given calendar day (UTC). */
export const pokemonOfTheDay = (date = new Date()): Species => {
  const day = Math.floor(date.getTime() / 86_400_000);
  // Multiplying by a prime larger than the Pokédex spreads consecutive days across it.
  return POKEDEX[(day * 7919) % POKEDEX.length];
};
