import { computed, ref } from 'vue';

const STORAGE_KEY = 'favoritePokemons';

const read = (): number[] => {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    // Earlier versions stored the ids as strings.
    return Array.isArray(stored) ? [...new Set(stored.map(Number).filter(Number.isInteger))] : [];
  } catch {
    return [];
  }
};

const ids = ref<number[]>(read());

const write = (next: number[]) => {
  ids.value = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode or full storage: favourites still work until the tab closes.
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('storage', event => {
    if (event.key === STORAGE_KEY) ids.value = read();
  });
}

export const useFavorites = () => ({
  ids: computed(() => [...ids.value].sort((a, b) => a - b)),
  isFavorite: (id: number) => ids.value.includes(id),
  toggle: (id: number) => write(ids.value.includes(id) ? ids.value.filter(x => x !== id) : [...ids.value, id]),
});
