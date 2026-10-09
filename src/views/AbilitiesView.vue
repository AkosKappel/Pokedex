<template>
  <div>
    <header class="page-header">
      <h1>Abilities</h1>
      <p class="lead">{{ results ? `${results.length} abilities` : 'Loading abilities…' }}</p>
    </header>

    <section class="filters" aria-label="Filters">
      <FilterSearch
        :model-value="query"
        label="Name or effect"
        placeholder="Levitate, rain, speed…"
        @update:model-value="update({ q: $event })"
      />
      <label>
        Introduced in
        <select
          class="field"
          :value="generation ?? ''"
          @change="update({ gen: ($event.target as HTMLSelectElement).value })"
        >
          <option value="">All regions</option>
          <option v-for="(region, index) in REGIONS.slice(2)" :key="region" :value="index + 3">{{ region }}</option>
        </select>
      </label>
    </section>

    <template v-if="results">
      <ul v-if="visible.length" class="abilities">
        <li v-for="ability in visible" :key="ability.id">
          <RouterLink :to="{ name: 'ability', params: { id: ability.id } }" class="ability">
            <span class="name" :lang="lang">{{ abilityName(ability) }}</span>
            <span class="description">{{ ability.description }}</span>
          </RouterLink>
        </li>
      </ul>
      <StatusMessage v-else title="No abilities match">Try another word or region.</StatusMessage>
      <PaginationNav :page="page" :total="totalPages" />
    </template>
    <div v-else class="skeleton-list abilities-skeleton" aria-busy="true">
      <SkeletonBlock v-for="n in 10" :key="n" height="4.6rem" radius="var(--radius-m)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue';
import FilterSearch from '@/components/FilterSearch.vue';
import PaginationNav from '@/components/PaginationNav.vue';
import StatusMessage from '@/components/StatusMessage.vue';
import SkeletonBlock from '@/components/SkeletonBlock.vue';
import { filterAbilities, loadAbilities, type Ability } from '@/lib/abilities';
import { pageCount, paginate, REGIONS } from '@/lib/pokedex';
import { useLanguage } from '@/lib/language';
import { useListQuery } from '@/lib/useListQuery';

const PAGE_SIZE = 40;
const abilities = shallowRef<Ability[]>();
onMounted(async () => (abilities.value = await loadAbilities()));

const { translations, abilityName, lang } = useLanguage();
const totalPages = computed(() => pageCount(results.value?.length ?? 0, PAGE_SIZE));
const { param, page, update } = useListQuery(totalPages);

const query = computed(() => param('q'));
// Abilities were introduced in generation 3 (Hoenn).
const generation = computed(() => {
  const value = Number(param('gen'));
  return value >= 3 && value <= REGIONS.length ? value : undefined;
});

const results = computed(
  () =>
    abilities.value &&
    filterAbilities(abilities.value, {
      query: query.value,
      generation: generation.value,
      localNames: translations.value.abilities,
    }),
);
const visible = computed(() => paginate(results.value ?? [], page.value, PAGE_SIZE));
</script>

<style scoped>
.skeleton-list {
  display: grid;
  gap: 0.5rem;
}

.abilities-skeleton {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
}

.items-skeleton {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));
}

.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  background: var(--panel);
}

.filters label {
  display: grid;
  gap: 0.3rem;
  font-weight: 500;
}

.abilities {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ability {
  display: grid;
  gap: 0.3rem;
  height: 100%;
  padding: 1rem 1.25rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  background: var(--panel);
  text-decoration: none;
}

.ability:hover {
  border-color: var(--muted);
}

.name {
  font-weight: 600;
}

.description {
  color: var(--muted);
  font-size: 0.95rem;
}
</style>
