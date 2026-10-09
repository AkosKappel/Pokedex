import type { TypeName } from './types';

const API_URL = 'https://pokeapi.co/api/v2';

interface NamedResource {
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { slot: number; type: { name: TypeName } }[];
  stats: { base_stat: number; stat: NamedResource }[];
  abilities: { is_hidden: boolean; ability: NamedResource }[];
  cries: { latest: string | null; legacy: string | null };
  species: NamedResource;
  moves: {
    move: NamedResource;
    version_group_details: {
      level_learned_at: number;
      move_learn_method: NamedResource;
      version_group: NamedResource;
    }[];
  }[];
}

export interface PokemonSpecies {
  id: number;
  is_legendary: boolean;
  is_mythical: boolean;
  genera: { genus: string; language: NamedResource }[];
  flavor_text_entries: { flavor_text: string; language: NamedResource; version: NamedResource }[];
  evolution_chain: { url: string } | null;
  varieties: { is_default: boolean; pokemon: NamedResource }[];
}

interface LocalizedText {
  language: NamedResource;
}

export interface MoveDetails {
  id: number;
  learned_by_pokemon: NamedResource[];
  flavor_text_entries: (LocalizedText & { flavor_text: string })[];
}

export interface AbilityDetails {
  id: number;
  pokemon: { is_hidden: boolean; pokemon: NamedResource }[];
  flavor_text_entries: (LocalizedText & { flavor_text: string })[];
  effect_entries: (LocalizedText & { effect: string; short_effect: string })[];
}

export interface EvolutionDetail {
  trigger: NamedResource;
  min_level: number | null;
  item: NamedResource | null;
  held_item: NamedResource | null;
  known_move: NamedResource | null;
  known_move_type: NamedResource | null;
  location: NamedResource | null;
  min_happiness: number | null;
  min_affection: number | null;
  time_of_day: string;
  trade_species: NamedResource | null;
}

export interface ChainLink {
  species: NamedResource;
  evolution_details: EvolutionDetail[];
  evolves_to: ChainLink[];
}

export interface EvolutionChain {
  id: number;
  chain: ChainLink;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    url: string,
  ) {
    super(`PokéAPI returned ${status} for ${url}`);
  }
}

// One request per URL for the lifetime of the page; the service worker keeps responses across visits.
const requests = new Map<string, Promise<unknown>>();

const get = <T>(path: string): Promise<T> => {
  const url = `${API_URL}/${path}`;
  if (!requests.has(url)) {
    const request = fetch(url).then(response => {
      if (!response.ok) throw new ApiError(response.status, url);
      return response.json();
    });
    // A failed request should be retried on the next call instead of failing forever.
    request.catch(() => requests.delete(url));
    requests.set(url, request);
  }
  return requests.get(url) as Promise<T>;
};

export const getPokemon = (id: number) => get<Pokemon>(`pokemon/${id}`);
export const getSpecies = (id: number) => get<PokemonSpecies>(`pokemon-species/${id}`);
export const getMove = (id: number) => get<MoveDetails>(`move/${id}`);
export const getAbility = (id: number) => get<AbilityDetails>(`ability/${id}`);
export const getEvolutionChain = (url: string) => get<EvolutionChain>(url.replace(`${API_URL}/`, ''));
