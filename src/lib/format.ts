/** "solar-power" → "Solar Power" */
export const titleCase = (slug: string) =>
  slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

/** PokéAPI stores height in decimetres and weight in hectograms. */
export const formatHeight = (decimetres: number) => `${(decimetres / 10).toFixed(1)} m`;
export const formatWeight = (hectograms: number) => `${(hectograms / 10).toFixed(1)} kg`;

/** Flavour text keeps the line and page breaks of the original game screens. */
export const cleanFlavorText = (text: string) =>
  text
    .replace(/[\f\n\r­]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

/** Highest base stat of any Pokémon (Blissey's HP), used as the full width of stat bars. */
export const MAX_STAT = 255;

export const idFromUrl = (url: string) => Number(url.split('/').filter(Boolean).pop());
