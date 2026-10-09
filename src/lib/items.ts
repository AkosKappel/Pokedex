import { matchesQuery } from './search';

export const POCKETS = {
  medicine: 'Medicine',
  pokeballs: 'Poké Balls',
  battle: 'Battle items',
  berries: 'Berries',
  misc: 'Other items',
  key: 'Key items',
  mail: 'Mail',
} as const;
export type Pocket = keyof typeof POCKETS;

export interface Item {
  id: number;
  slug: string;
  name: string;
  pocket: Pocket;
  category: string;
  cost: number;
  description: string;
}

export const loadItems = () => import('@/data/items.json').then(module => module.default as Item[]);

export const itemSpriteUrl = (item: Item) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.slug}.png`;

export const filterItems = (
  items: Item[],
  { query = '', pocket, localNames = {} }: { query?: string; pocket?: Pocket; localNames?: Record<number, string> },
) =>
  items
    .filter(item => matchesQuery(query, item.name, localNames[item.id]) && (!pocket || item.pocket === pocket))
    .sort((a, b) => (localNames[a.id] ?? a.name).localeCompare(localNames[b.id] ?? b.name));
