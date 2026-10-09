<template>
  <div>
    <header class="page-header">
      <h1>{{ heading }}</h1>
      <p class="lead summary">
        <span>{{ results.length === 1 ? '1 Pokémon' : `${results.length} Pokémon` }}</span>
        <RouterLink v-if="hasFilters" :to="{ name: 'browse' }">Clear filters</RouterLink>
      </p>
    </header>

    <section class="filters" aria-label="Filters">
      <fieldset class="type-filter">
        <legend>Type <span class="hint">(pick up to two)</span></legend>
        <button
          v-for="type in TYPES"
          :key="type"
          type="button"
          class="type-toggle"
          :style="{ '--type': `var(--${type})` }"
          :aria-pressed="types.includes(type)"
          @click="toggleType(type)"
        >
          {{ titleCase(type) }}
        </button>
      </fieldset>

      <div class="selects">
        <label>
          Region
          <select
            class="field"
            :value="generation ?? ''"
            @change="update({ gen: ($event.target as HTMLSelectElement).value })"
          >
            <option value="">All regions</option>
            <option v-for="(region, index) in REGIONS" :key="region" :value="index + 1">{{ region }}</option>
          </select>
        </label>
        <label>
          Sort by
          <select class="field" :value="sort" @change="update({ sort: ($event.target as HTMLSelectElement).value })">
            <option v-for="(label, value) in SORTS" :key="value" :value="value">{{ label }}</option>
          </select>
        </label>
      </div>
    </section>

    <h2 class="visually-hidden">Results</h2>
    <ul v-if="visible.length" class="grid">
      <PokemonCard v-for="species in visible" :key="species.id" :species="species" />
    </ul>
    <StatusMessage v-else title="No Pokémon match">
      Try fewer filters, or check the spelling.
      <RouterLink :to="{ name: 'browse' }">Show all Pokémon</RouterLink>
    </StatusMessage>

    <PaginationNav :page="page" :total="totalPages" />
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router';
import PokemonCard from '@/components/PokemonCard.vue';
import PaginationNav from '@/components/PaginationNav.vue';
import StatusMessage from '@/components/StatusMessage.vue';
import { filterPokedex, pageCount, paginate, REGIONS, SORTS, type Sort } from '@/lib/pokedex';
import { isTypeName, TYPES, type TypeName } from '@/lib/types';
import { titleCase } from '@/lib/format';
import { useLanguage } from '@/lib/language';

const { translations } = useLanguage();

const route = useRoute();
const router = useRouter();

const text = (value: unknown) => (typeof value === 'string' ? value : '');

const query = computed(() => text(route.query.q).trim());
const types = computed(() => text(route.query.type).split(',').filter(isTypeName).slice(0, 2));
const generation = computed(() => {
  const value = Number(route.query.gen);
  return value >= 1 && value <= REGIONS.length ? value : undefined;
});
const sort = computed<Sort>(() => (text(route.query.sort) in SORTS ? (text(route.query.sort) as Sort) : 'number'));

const results = computed(() =>
  filterPokedex({
    query: query.value,
    types: types.value,
    generation: generation.value,
    sort: sort.value,
    localNames: translations.value.pokemon,
  }),
);
const totalPages = computed(() => pageCount(results.value.length));
const requestedPage = computed(() => Math.max(1, Math.floor(Number(route.query.page)) || 1));
const page = computed(() => Math.min(requestedPage.value, totalPages.value));
const visible = computed(() => paginate(results.value, page.value));

// Out-of-range pages (an old link, or fewer results after a data update) show the last page.
watchEffect(() => {
  if (route.query.page && String(page.value) !== route.query.page) {
    router.replace({ query: { ...route.query, page: page.value === 1 ? undefined : String(page.value) } });
  }
});

const hasFilters = computed(() =>
  Boolean(query.value || types.value.length || generation.value || sort.value !== 'number'),
);

const heading = computed(() => {
  if (query.value) return `Results for “${query.value}”`;
  const parts = [
    types.value.map(titleCase).join(' and '),
    'Pokémon',
    generation.value && `from ${REGIONS[generation.value - 1]}`,
  ];
  return parts.filter(Boolean).join(' ');
});

const update = (changes: LocationQueryRaw) => {
  const next: LocationQueryRaw = { ...route.query, ...changes, page: undefined };
  for (const key of Object.keys(next)) if (!next[key] || next[key] === 'number') delete next[key];
  router.replace({ query: next });
};

const toggleType = (type: TypeName) => {
  const current = types.value;
  const next = current.includes(type) ? current.filter(t => t !== type) : [...current, type].slice(-2);
  update({ type: next.join(',') });
};
</script>

<style scoped>
.summary {
  display: flex;
  gap: 1.25rem;
}

.filters {
  display: grid;
  gap: 1.25rem;
  margin-bottom: 2rem;
  padding: 1.25rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  background: var(--panel);
}

.type-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  border: 0;
}

legend {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.hint {
  color: var(--muted);
  font-weight: 400;
}

.type-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 2.25rem;
  padding: 0 0.8rem 0 0.55rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--panel);
  cursor: pointer;
}

.type-toggle::before {
  content: '';
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: var(--type);
}

.type-toggle:hover {
  border-color: var(--type);
}

.type-toggle[aria-pressed='true'] {
  border-color: var(--type);
  background: color-mix(in oklab, var(--type) 30%, var(--panel));
  font-weight: 600;
}

.selects {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.selects label {
  display: grid;
  gap: 0.3rem;
  font-weight: 500;
}

.selects select {
  min-width: 12rem;
}
</style>
