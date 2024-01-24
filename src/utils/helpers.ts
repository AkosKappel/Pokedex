import axios from 'axios';
import { ref } from 'vue';

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
