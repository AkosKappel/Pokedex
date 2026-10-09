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

const EXPORT_VERSION = 1;

/** The file "Export" downloads: `{ "app": "pokedex", "version": 1, "favorites": [25, 133] }`. */
export const exportFavorites = (favorites: number[]) =>
  JSON.stringify({ app: 'pokedex', version: EXPORT_VERSION, favorites }, null, 2) + '\n';

/**
 * Reads an exported file, or a plain JSON array of numbers. Keeps only valid national numbers
 * (`isValid`), once each; throws when the file is not a favorites list at all.
 */
export const parseFavorites = (text: string, isValid: (id: number) => boolean): number[] => {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('The file is not valid JSON.');
  }
  const list = Array.isArray(data) ? data : (data as { favorites?: unknown })?.favorites;
  if (!Array.isArray(list)) throw new Error('The file has no list of favorites.');
  return [...new Set(list.map(Number).filter(id => Number.isInteger(id) && isValid(id)))];
};

export const useFavorites = () => ({
  ids: computed(() => [...ids.value].sort((a, b) => a - b)),
  /** Oldest first, as they were added. */
  addedOrder: computed(() => ids.value),
  isFavorite: (id: number) => ids.value.includes(id),
  toggle: (id: number) => write(ids.value.includes(id) ? ids.value.filter(x => x !== id) : [...ids.value, id]),
  /** Adds the ids that are not favorites yet and returns how many that were. */
  addMany: (added: number[]) => {
    const missing = added.filter(id => !ids.value.includes(id));
    write([...ids.value, ...missing]);
    return missing.length;
  },
  clear: () => write([]),
});
