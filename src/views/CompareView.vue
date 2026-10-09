<template>
  <div>
    <header class="page-header">
      <h1>Compare Pokémon</h1>
      <p class="lead">Put up to {{ MAX }} Pokémon side by side. The highest value in each row is marked.</p>
    </header>

    <form v-if="ids.length < MAX" class="add" @submit.prevent="add">
      <label for="compare-add">Add a Pokémon</label>
      <div class="add-row">
        <input
          id="compare-add"
          v-model="query"
          class="field"
          type="text"
          list="compare-suggestions"
          placeholder="Name or number"
          autocomplete="off"
          :aria-invalid="invalid"
          aria-describedby="compare-error"
        />
        <datalist id="compare-suggestions">
          <option v-for="species in suggestions" :key="species.id" :value="speciesName(species)" />
        </datalist>
        <button type="submit" class="button primary">Add</button>
      </div>
      <p id="compare-error" class="error" role="status">
        <template v-if="invalid">No Pokémon is called “{{ query }}”. Pick one from the suggestions.</template>
      </p>
    </form>

    <StatusMessage v-if="!ids.length" title="Nothing to compare yet">
      Add a Pokémon above, or use Compare on any Pokémon page.
    </StatusMessage>
    <StatusMessage v-else-if="error" title="Stats did not load" :retry="load">
      PokéAPI did not answer. Check your connection and try again.
    </StatusMessage>

    <div v-else class="table-wrap">
      <table>
        <caption class="visually-hidden">
          Base stats
        </caption>
        <thead>
          <tr>
            <td></td>
            <th
              v-for="species in selected"
              :key="species.id"
              scope="col"
              :style="{ '--type': `var(--${species.types[0]})` }"
            >
              <RouterLink :to="{ name: 'pokemon', params: { id: species.id } }" class="head">
                <PokemonArtwork :id="species.id" :alt="''" :size="160" class="art" />
                <span class="number">{{ formatNumber(species.id) }}</span>
                <span class="name" :lang="lang">{{ speciesName(species) }}</span>
              </RouterLink>
              <span class="types">
                <TypeBadge v-for="type in species.types" :key="type" :type="type" />
              </span>
              <button type="button" class="remove" @click="remove(species.id)">Remove</button>
            </th>
          </tr>
        </thead>
        <tbody v-if="rows">
          <tr v-for="row in rows" :key="row.label" :class="{ total: row.label === 'Total' }">
            <th scope="row">{{ row.label }}</th>
            <td
              v-for="(value, index) in row.values"
              :key="index"
              :class="{ best: row.values.length > 1 && value === row.best }"
            >
              <span class="value">{{ value }}</span>
              <span v-if="row.label !== 'Total'" class="bar" aria-hidden="true">
                <span
                  :style="{ width: `${(value / MAX_STAT) * 100}%`, background: `var(--${selected[index].types[0]})` }"
                ></span>
              </span>
              <span v-if="row.values.length > 1 && value === row.best" class="visually-hidden">(highest)</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!rows" class="loading">Loading stats…</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PokemonArtwork from '@/components/PokemonArtwork.vue';
import TypeBadge from '@/components/TypeBadge.vue';
import StatusMessage from '@/components/StatusMessage.vue';
import { getPokemon, type Pokemon } from '@/lib/api';
import { MAX_STAT, STAT_LABELS } from '@/lib/format';
import { filterPokedex, findById, findExact, formatNumber, type Species } from '@/lib/pokedex';
import { useLanguage } from '@/lib/language';

const { speciesName, translations, lang } = useLanguage();

const MAX = 3;
const route = useRoute();
const router = useRouter();

const ids = computed(() =>
  [
    ...new Set(
      String(route.query.ids ?? '')
        .split(',')
        .map(Number),
    ),
  ]
    .filter(id => findById(id))
    .slice(0, MAX),
);
const selected = computed(() => ids.value.map(id => findById(id) as Species));

const setIds = (next: number[]) => router.replace({ query: next.length ? { ids: next.join(',') } : {} });
const remove = (id: number) => setIds(ids.value.filter(other => other !== id));

const query = ref('');
const invalid = ref(false);
const suggestions = computed(() =>
  query.value.trim().length < 2
    ? []
    : filterPokedex({ query: query.value, localNames: translations.value.pokemon }).slice(0, 8),
);

const add = () => {
  const species = findExact(query.value, translations.value.pokemon);
  invalid.value = !species;
  if (!species) return;
  query.value = '';
  if (!ids.value.includes(species.id)) setIds([...ids.value, species.id]);
};

watch(query, () => (invalid.value = false));

const pokemon = shallowRef<Pokemon[]>();
const error = ref(false);

const load = async () => {
  const wanted = ids.value;
  error.value = false;
  pokemon.value = undefined;
  try {
    const loaded = await Promise.all(wanted.map(getPokemon));
    if (wanted === ids.value) pokemon.value = loaded;
  } catch {
    error.value = true;
  }
};

watch(ids, load, { immediate: true });

const rows = computed(() => {
  if (!pokemon.value) return undefined;
  const statRows = pokemon.value[0]?.stats.map((stat, index) => ({
    label: STAT_LABELS[stat.stat.name] ?? stat.stat.name,
    values: pokemon.value!.map(p => p.stats[index].base_stat),
  }));
  const total = { label: 'Total', values: pokemon.value.map(p => p.stats.reduce((sum, s) => sum + s.base_stat, 0)) };
  return [...(statRows ?? []), total].map(row => ({ ...row, best: Math.max(...row.values) }));
});
</script>

<style scoped>
.add {
  display: grid;
  gap: 0.4rem;
  max-width: 32rem;
  margin-bottom: 1.5rem;
}

.add label {
  font-weight: 500;
}

.add-row {
  display: flex;
  gap: 0.5rem;
}

.add-row input {
  flex: 1;
  min-width: 0;
}

.error {
  min-height: 1.5em;
  color: var(--red);
  font-size: 0.9rem;
}

.table-wrap {
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  background: var(--panel);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.6rem 1rem;
  text-align: left;
  vertical-align: middle;
}

thead th {
  min-width: 11rem;
  vertical-align: top;
}

tbody tr + tr {
  border-top: 1px solid var(--line);
}

tbody th {
  color: var(--muted);
  font-weight: 400;
  white-space: nowrap;
}

.head {
  display: grid;
  text-decoration: none;
}

.art {
  width: 8rem;
  margin-bottom: 0.25rem;
  border-radius: var(--radius-m);
  background: color-mix(in oklab, var(--type) 18%, var(--panel));
}

.number {
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 400;
}

.name {
  font-size: 1.1rem;
}

.types {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin: 0.4rem 0;
  font-weight: 400;
}

.remove {
  padding: 0.3rem 0;
  border: 0;
  background: none;
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 400;
  text-decoration: underline;
  cursor: pointer;
}

td {
  min-width: 9rem;
}

td .value {
  display: inline-block;
  width: 2.5rem;
  font-variant-numeric: tabular-nums;
}

.bar {
  display: inline-block;
  width: calc(100% - 3rem);
  max-width: 10rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--line);
  overflow: hidden;
  vertical-align: middle;
}

.bar span {
  display: block;
  height: 100%;
}

td.best .value {
  font-weight: 700;
}

td.best .value::after {
  content: '▲';
  margin-left: 0.2rem;
  color: var(--muted);
  font-size: 0.6rem;
  vertical-align: middle;
}

.total {
  border-top: 2px solid var(--line);
}

.total th {
  color: var(--ink);
  font-weight: 600;
}

.loading {
  padding: 1rem;
  color: var(--muted);
}
</style>
