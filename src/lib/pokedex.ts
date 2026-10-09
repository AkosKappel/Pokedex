import entries from '@/data/pokedex.json';
import type { TypeName } from './types';
import { isExactMatch, matchesQuery } from './search';

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

// jsDelivr serves the PokéAPI sprites repository with a week of browser caching (GitHub's raw files: 5 minutes).
const ARTWORK_URL = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork';
/** Width of the official artwork PNGs. */
export const ARTWORK_SIZE = 475;

/** The original PNG, 115 to 200 kB. */
export const artworkUrl = (id: number, shiny = false) => `${ARTWORK_URL}${shiny ? '/shiny' : ''}/${id}.png`;

/**
 * The artwork resized to `width` as WebP by the wsrv.nl image CDN: about 10 kB at 200 px and 25 kB at
 * full size instead of 115 to 200 kB, cached for a year. Never enlarged beyond the original.
 */
export const resizedArtworkUrl = (id: number, width: number, shiny = false) =>
  `https://wsrv.nl/?url=${encodeURIComponent(artworkUrl(id, shiny))}&w=${Math.min(width, ARTWORK_SIZE)}&output=webp`;

export const formatNumber = (id: number) => `#${String(id).padStart(4, '0')}`;

export const findById = (id: number): Species | undefined => POKEDEX[id - 1];

/** Names in the chosen language, by national number; only names that differ from English. */
export type LocalNames = Record<number, string>;

/** Exact match by number ("25", "#025") or by English or local name, ignoring case, accents and punctuation ("mr mime"). */
export const findExact = (query: string, localNames: LocalNames = {}): Species | undefined => {
  const number = query.trim().replace(/^#/, '');
  if (/^\d+$/.test(number)) return findById(Number(number));
  return POKEDEX.find(species => isExactMatch(query, species.name, localNames[species.id]));
};

export interface Filters {
  query?: string;
  types?: TypeName[];
  generation?: number;
  sort?: Sort;
  localNames?: LocalNames;
}

export const filterPokedex = ({
  query = '',
  types = [],
  generation,
  sort = 'number',
  localNames = {},
}: Filters): Species[] => {
  const number = query.trim().replace(/^#/, '');
  const byNumber = /^\d+$/.test(number);

  const results = POKEDEX.filter(
    species =>
      (byNumber
        ? String(species.id).startsWith(String(Number(number)))
        : matchesQuery(query, species.name, localNames[species.id])) &&
      types.every(type => species.types.includes(type)) &&
      (!generation || species.generation === generation),
  );

  const nameOf = (species: Species) => localNames[species.id] ?? species.name;
  if (sort === 'name') return results.sort((a, b) => nameOf(a).localeCompare(nameOf(b)));
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
