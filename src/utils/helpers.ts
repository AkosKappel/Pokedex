import axios from 'axios';
import { ref } from 'vue';
import { POKEMON_API_URL, POKEMON_IMAGE_URL } from '../config/constants';

const cache = ref<any>({});

export const useFetch = async (url: string, useCache: boolean = true) => {
  const cached = cache.value[url];
  if (useCache && cached) {
    return cached;
  }

  const response = await axios.get(url);
  cache.value[url] = response.data;
  return response.data;
};

export const clearCache = () => {
  cache.value = {};
};

export const fetchPokemonById = async (id: number) => {
  const response = await useFetch(`${POKEMON_API_URL}/pokemon/${id}`);
  response.image = `${POKEMON_IMAGE_URL}/${id}.png`; // add image to result
  return response;
};

export const fetchPokemonByName = async (name: string) => {
  const response = await useFetch(`${POKEMON_API_URL}/pokemon/${name}`);
  response.image = `${POKEMON_IMAGE_URL}/${response.id}.png`;
  return response;
};

export const fetchPokemonList = async (limit: number, offset: number) => {
  const response = await useFetch(`${POKEMON_API_URL}/pokemon/?limit=${limit}&offset=${offset}`);
  return response;
};

// TODO: implement items page
export const fetchItemList = async (limit: number, offset: number) => {
  const response = await useFetch(`${POKEMON_API_URL}/item/?limit=${limit}&offset=${offset}`);
  return response;
};
