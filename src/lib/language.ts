import { computed, ref, shallowRef } from 'vue';
import type { Species } from './pokedex';

/** Pokémon data (names and descriptions) can be shown in these languages; the interface stays English. */
export const LANGUAGES = {
  en: { label: 'English', api: ['en'] },
  de: { label: 'Deutsch', api: ['de'] },
  fr: { label: 'Français', api: ['fr'] },
  es: { label: 'Español', api: ['es'] },
  it: { label: 'Italiano', api: ['it'] },
  ja: { label: '日本語', api: ['ja-Hrkt', 'ja'] },
  ko: { label: '한국어', api: ['ko'] },
  'zh-Hans': { label: '简体中文', api: ['zh-Hans'] },
  'zh-Hant': { label: '繁體中文', api: ['zh-Hant'] },
} as const;
export type Language = keyof typeof LANGUAGES;

export const isLanguage = (value: unknown): value is Language => typeof value === 'string' && value in LANGUAGES;

export interface Translations {
  pokemon: Record<number, string>;
  moves: Record<number, string>;
  abilities: Record<number, string>;
  items: Record<number, string>;
}

const EMPTY: Translations = { pokemon: {}, moves: {}, abilities: {}, items: {} };
const STORAGE_KEY = 'language';

const files = import.meta.glob<Translations>('../data/names/*.json', { import: 'default' });

const stored = (): Language => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return isLanguage(value) ? value : 'en';
  } catch {
    return 'en';
  }
};

const language = ref<Language>('en');
const translations = shallowRef<Translations>(EMPTY);

const setLanguage = async (next: Language) => {
  const loaded = next === 'en' ? EMPTY : await files[`../data/names/${next}.json`]();
  language.value = next;
  translations.value = loaded;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // The choice then lasts only for this page view.
  }
};

if (typeof window !== 'undefined' && stored() !== 'en') setLanguage(stored());

/**
 * Picks the entry in the chosen language from a PokéAPI list of texts (flavour text, genus, names),
 * falling back to English.
 */
export const pickText = <T extends { language: { name: string } }>(entries: readonly T[], lang: Language) => {
  for (const code of [...LANGUAGES[lang].api, 'en']) {
    const matches = entries.filter(entry => entry.language.name === code);
    // PokéAPI lists texts oldest game first.
    if (matches.length) return matches[matches.length - 1];
  }
  return undefined;
};

export const useLanguage = () => ({
  language: computed(() => language.value),
  /** BCP 47 tag for the `lang` attribute of translated names, undefined when it matches the page. */
  lang: computed(() => (language.value === 'en' ? undefined : language.value)),
  translations: computed(() => translations.value),
  setLanguage,
  speciesName: (species: Pick<Species, 'id' | 'name'>) => translations.value.pokemon[species.id] ?? species.name,
  moveName: (move: { id: number; name: string }) => translations.value.moves[move.id] ?? move.name,
  abilityName: (ability: { id: number; name: string }) => translations.value.abilities[ability.id] ?? ability.name,
  itemName: (item: { id: number; name: string }) => translations.value.items[item.id] ?? item.name,
});
