// Snapshots the PokéAPI data that lists, search and filters need into src/data/, so pages work
// without a request per entry. The data changes only when new games are released.
// Run with `npm run data`.
//
//   pokedex.json        every species: number, English name, generation, types, base stat total
//   moves.json          moves that at least one Pokémon learns
//   abilities.json      main-series abilities that at least one Pokémon has
//   items.json          items with an English name, without TMs, data cards and unused items
//   names/<lang>.json   names of species, moves, abilities and items in other languages
import { mkdir, writeFile } from 'node:fs/promises';

const ENDPOINT = 'https://beta.pokeapi.co/graphql/v1beta';
const ENGLISH = 9;

// App language code and PokéAPI language ids, best first. Japanese names come from the katakana set.
export const LANGUAGES = {
  de: [6],
  fr: [5],
  es: [7],
  it: [8],
  ja: [1, 11],
  ko: [3],
  'zh-Hans': [12],
  'zh-Hant': [4],
};
const languageIds = [...new Set(Object.values(LANGUAGES).flat())];

const query = async text => {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: text }),
  });
  if (!response.ok) throw new Error(`PokéAPI GraphQL returned ${response.status}`);
  const { data, errors } = await response.json();
  if (errors) throw new Error(JSON.stringify(errors));
  return data;
};

const names = `names(where: {language_id: {_in: [${[ENGLISH, ...languageIds]}]}}) { name language_id }`;
const english = entry => entry.names.find(n => n.language_id === ENGLISH)?.name;
const clean = text =>
  text
    ?.replace(/[\f\n\r­]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const { species } = await query(`{
  species: pokemon_v2_pokemonspecies(order_by: {id: asc}) {
    id
    generation_id
    is_legendary
    is_mythical
    names: pokemon_v2_pokemonspeciesnames(where: {language_id: {_in: [${[ENGLISH, ...languageIds]}]}}) { name language_id }
    pokemon: pokemon_v2_pokemons(where: {is_default: {_eq: true}}) {
      types: pokemon_v2_pokemontypes(order_by: {slot: asc}) { type: pokemon_v2_type { name } }
      stats: pokemon_v2_pokemonstats { base_stat }
    }
  }
}`);

const { moves } = await query(`{
  moves: pokemon_v2_move(
    where: {id: {_lt: 10000}, pokemon_v2_pokemonmoves: {id: {_is_null: false}}}
    order_by: {id: asc}
  ) {
    id
    power
    accuracy
    pp
    priority
    generation_id
    type: pokemon_v2_type { name }
    damageClass: pokemon_v2_movedamageclass { name }
    ${names.replace('names(', 'names: pokemon_v2_movenames(')}
    effect: pokemon_v2_moveeffect {
      texts: pokemon_v2_moveeffecteffecttexts(where: {language_id: {_eq: ${ENGLISH}}}) { short_effect }
    }
    flavor: pokemon_v2_moveflavortexts(where: {language_id: {_eq: ${ENGLISH}}}, order_by: {version_group_id: desc}, limit: 5) {
      flavor_text
    }
  }
}`);

const { abilities } = await query(`{
  abilities: pokemon_v2_ability(
    where: {is_main_series: {_eq: true}, pokemon_v2_pokemonabilities: {id: {_is_null: false}}}
    order_by: {id: asc}
  ) {
    id
    generation_id
    ${names.replace('names(', 'names: pokemon_v2_abilitynames(')}
    effect: pokemon_v2_abilityeffecttexts(where: {language_id: {_eq: ${ENGLISH}}}) { short_effect }
    flavor: pokemon_v2_abilityflavortexts(where: {language_id: {_eq: ${ENGLISH}}}, order_by: {version_group_id: desc}, limit: 5) {
      flavor_text
    }
  }
}`);

const { items } = await query(`{
  items: pokemon_v2_item(
    where: {item_category_id: {_nin: [23, 37, 41]}, pokemon_v2_itemnames: {language_id: {_eq: ${ENGLISH}}}}
    order_by: {id: asc}
  ) {
    id
    name
    cost
    category: pokemon_v2_itemcategory { name pocket: pokemon_v2_itempocket { name } }
    ${names.replace('names(', 'names: pokemon_v2_itemnames(')}
    effect: pokemon_v2_itemeffecttexts(where: {language_id: {_eq: ${ENGLISH}}}) { short_effect }
    flavor: pokemon_v2_itemflavortexts(where: {language_id: {_eq: ${ENGLISH}}}, order_by: {version_group_id: desc}, limit: 5) {
      flavor_text
    }
  }
}`);

const pokedex = species.map(entry => {
  const [pokemon] = entry.pokemon;
  if (!english(entry) || !pokemon) throw new Error(`Incomplete data for species ${entry.id}`);
  return {
    id: entry.id,
    name: english(entry),
    generation: entry.generation_id,
    types: pokemon.types.map(t => t.type.name),
    total: pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0),
    ...(entry.is_legendary && { legendary: true }),
    ...(entry.is_mythical && { mythical: true }),
  };
});

// The newest games describe moves they dropped as "can't be used"; take the latest real description.
const UNUSABLE = /can.t be used/i;
const description = entry =>
  clean(
    entry.flavor.find(f => !UNUSABLE.test(f.flavor_text))?.flavor_text ??
      entry.effect?.texts?.[0]?.short_effect ??
      entry.effect?.[0]?.short_effect,
  ) ?? '';

const moveIndex = moves.map(move => ({
  id: move.id,
  name: english(move),
  type: move.type.name,
  category: move.damageClass.name,
  power: move.power,
  accuracy: move.accuracy,
  pp: move.pp,
  generation: move.generation_id,
  description: description(move),
}));

const abilityIndex = abilities.map(ability => ({
  id: ability.id,
  name: english(ability),
  generation: ability.generation_id,
  description: description(ability),
}));

const itemIndex = items.map(item => ({
  id: item.id,
  slug: item.name,
  name: english(item),
  pocket: item.category.pocket.name,
  category: item.category.name,
  cost: item.cost,
  description: description(item),
}));

const localized = (entries, ids) => {
  const result = {};
  for (const entry of entries) {
    const name = ids.map(id => entry.names.find(n => n.language_id === id)?.name).find(Boolean);
    if (name && name !== english(entry)) result[entry.id] = name;
  }
  return result;
};

const dataDir = new URL('../src/data/', import.meta.url);
const lines = entries => '[\n' + entries.map(entry => JSON.stringify(entry)).join(',\n') + '\n]\n';

await mkdir(new URL('names/', dataDir), { recursive: true });
await writeFile(new URL('pokedex.json', dataDir), lines(pokedex));
await writeFile(new URL('moves.json', dataDir), lines(moveIndex));
await writeFile(new URL('abilities.json', dataDir), lines(abilityIndex));
await writeFile(new URL('items.json', dataDir), lines(itemIndex));
for (const [code, ids] of Object.entries(LANGUAGES)) {
  const translations = {
    pokemon: localized(species, ids),
    moves: localized(moves, ids),
    abilities: localized(abilities, ids),
    items: localized(items, ids),
  };
  await writeFile(new URL(`names/${code}.json`, dataDir), JSON.stringify(translations) + '\n');
}

console.log(
  `Wrote ${pokedex.length} species, ${moveIndex.length} moves, ${abilityIndex.length} abilities, ${itemIndex.length} items and ${Object.keys(LANGUAGES).length} languages`,
);
