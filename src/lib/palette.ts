import type { RouteLocationRaw } from 'vue-router';
import { filterPokedex, findExact, formatNumber, REGIONS, type LocalNames, type Species } from './pokedex';
import { matchesQuery } from './search';
import { titleCase } from './format';
import { TYPES, type TypeName } from './types';

export interface PaletteEntry {
  /** Unique within the list, used for the option's element id. */
  key: string;
  label: string;
  /** Shown beside the label and searched along with it. */
  hint: string;
  to: RouteLocationRaw;
  type?: TypeName;
  species?: Species;
}

const PAGES: PaletteEntry[] = [
  { key: 'home', label: 'Home', hint: 'Pokémon of the day', to: { name: 'home' } },
  { key: 'browse', label: 'Browse Pokémon', hint: 'All Pokémon', to: { name: 'browse' } },
  { key: 'moves', label: 'Moves', hint: 'Page', to: { name: 'moves' } },
  { key: 'abilities', label: 'Abilities', hint: 'Page', to: { name: 'abilities' } },
  { key: 'items', label: 'Items', hint: 'Page', to: { name: 'items' } },
  { key: 'team', label: 'Team builder', hint: 'Page', to: { name: 'team' } },
  { key: 'favorites', label: 'Favorites', hint: 'Page', to: { name: 'favorites' } },
  { key: 'compare', label: 'Compare Pokémon', hint: 'Page', to: { name: 'compare' } },
  { key: 'quiz', label: "Who's that Pokémon?", hint: 'Quiz', to: { name: 'quiz' } },
  { key: 'about', label: 'About', hint: 'Page', to: { name: 'about' } },
];

const FILTERS: PaletteEntry[] = [
  ...TYPES.map(type => ({
    key: `type-${type}`,
    label: `${titleCase(type)} type`,
    hint: 'Type',
    to: { name: 'browse', query: { type } },
    type,
  })),
  ...REGIONS.map((region, index) => ({
    key: `region-${index + 1}`,
    label: region,
    hint: `Generation ${index + 1}`,
    to: { name: 'browse', query: { gen: index + 1 } },
  })),
];

export const SPECIES_LIMIT = 5;

/**
 * The palette's options for a query: the pages when empty, otherwise matching pages, types and regions,
 * the best Pokémon matches (an exact name or number first) and a search of the Pokédex for the query.
 */
export const paletteEntries = (query: string, localNames: LocalNames = {}): PaletteEntry[] => {
  const text = query.trim();
  if (!text) return PAGES;

  const exact = findExact(text, localNames);
  const matches = filterPokedex({ query: text, localNames }).filter(species => species !== exact);
  const species = (exact ? [exact, ...matches] : matches).slice(0, SPECIES_LIMIT);

  return [
    ...[...PAGES, ...FILTERS].filter(entry => matchesQuery(text, entry.label, entry.hint)),
    ...species.map(entry => ({
      key: `pokemon-${entry.id}`,
      label: localNames[entry.id] ?? entry.name,
      hint: formatNumber(entry.id),
      to: { name: 'pokemon', params: { id: entry.id } },
      species: entry,
    })),
    {
      key: 'search',
      label: `Search Pokémon for “${text}”`,
      hint: 'Search',
      to: { name: 'browse', query: { q: text } },
    },
  ];
};

/** The next option index for ↑ (-1) or ↓ (1), wrapping around both ends. */
export const stepIndex = (current: number, step: number, length: number) =>
  length ? (current + step + length) % length : -1;
