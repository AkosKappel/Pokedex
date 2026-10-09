// Snapshots every species (number, English name, generation, types of the default form,
// base stat total, legendary or mythical) into src/data/pokedex.json. The list changes only
// when new games add Pokémon, so it ships with the app instead of being fetched on each visit.
// Run with `npm run data`.
import { writeFile } from 'node:fs/promises';

const ENDPOINT = 'https://beta.pokeapi.co/graphql/v1beta';
const query = `{
  species: pokemon_v2_pokemonspecies(order_by: {id: asc}) {
    id
    generation_id
    is_legendary
    is_mythical
    names: pokemon_v2_pokemonspeciesnames(where: {language_id: {_eq: 9}}) { name }
    pokemon: pokemon_v2_pokemons(where: {is_default: {_eq: true}}) {
      types: pokemon_v2_pokemontypes(order_by: {slot: asc}) { type: pokemon_v2_type { name } }
      stats: pokemon_v2_pokemonstats { base_stat }
    }
  }
}`;

const response = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ query }),
});
if (!response.ok) throw new Error(`PokéAPI GraphQL returned ${response.status}`);
const { data, errors } = await response.json();
if (errors) throw new Error(JSON.stringify(errors));

const entries = data.species.map(species => {
  const [pokemon] = species.pokemon;
  if (!species.names[0] || !pokemon) throw new Error(`Incomplete data for species ${species.id}`);
  return {
    id: species.id,
    name: species.names[0].name,
    generation: species.generation_id,
    types: pokemon.types.map(t => t.type.name),
    total: pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0),
    ...(species.is_legendary && { legendary: true }),
    ...(species.is_mythical && { mythical: true }),
  };
});

const json = '[\n' + entries.map(entry => JSON.stringify(entry)).join(',\n') + '\n]\n';
await writeFile(new URL('../src/data/pokedex.json', import.meta.url), json);
console.log(`Wrote ${entries.length} species`);
