import axios from 'axios';
import { ref } from 'vue';
import { POKEMON_API_URL, POKEMON_IMAGE_URL } from '../config/constants';

export interface Pokemon {
  id: string;
  name: string;
  url: string;
  image: string;
}

export const transformPokemon = (pokemon: any): Pokemon => {
  const id = pokemon.id ? pokemon.id : pokemon.url.split('/').slice(-2, -1)[0];
  return {
    ...pokemon,
    id: id.toString(),
    image: `${POKEMON_IMAGE_URL}/${id}.png`, // add image to result because its not part of the API
  };
};

const cache = ref<any>({});

export const useFetch = async (url: string, useCache: boolean = true) => {
  const cached = cache.value[url];
  if (useCache && cached) return cached;

  const response = await axios.get(url);
  cache.value[url] = response.data;
  return response.data;
};

export const clearCache = () => {
  cache.value = {};
};

export const fetchPokemonById = async (id: number): Promise<Pokemon> => {
  const response = await useFetch(`${POKEMON_API_URL}/pokemon/${id}`);
  return transformPokemon(response);
};

export const fetchPokemonByName = async (name: string): Promise<Pokemon> => {
  const response = await useFetch(`${POKEMON_API_URL}/pokemon/${name}`);
  return transformPokemon(response);
};

export const fetchPokemonList = async (limit: number, offset: number): Promise<any> => {
  const response = await useFetch(`${POKEMON_API_URL}/pokemon/?limit=${limit}&offset=${offset}`);
  return response;
};

export const fetchRandomPokemons = async (n: number, min: number = 1, max: number = 151): Promise<Pokemon[]> => {
  const pokemonIds = Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  const pokemons = await Promise.all(pokemonIds.map(id => fetchPokemonById(id)));
  return pokemons.map(transformPokemon);
};

// TODO: implement items page
export const fetchItemList = async (limit: number, offset: number) => {
  const response = await useFetch(`${POKEMON_API_URL}/item/?limit=${limit}&offset=${offset}`);
  return response;
};
