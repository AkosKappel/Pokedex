<template>
  <div>
    <header class="page-header">
      <h1>Moves</h1>
      <p class="lead">{{ results ? `${results.length} moves` : 'Loading moves…' }}</p>
    </header>

    <section class="filters" aria-label="Filters">
      <FilterSearch
        :model-value="query"
        label="Name"
        placeholder="Search moves"
        @update:model-value="update({ q: $event })"
      />
      <label>
        Type
        <select
          class="field"
          :value="type ?? ''"
          @change="update({ type: ($event.target as HTMLSelectElement).value })"
        >
          <option value="">All types</option>
          <option v-for="option in TYPES" :key="option" :value="option">{{ titleCase(option) }}</option>
        </select>
      </label>
      <label>
        Category
        <select
          class="field"
          :value="category ?? ''"
          @change="update({ category: ($event.target as HTMLSelectElement).value })"
        >
          <option value="">All categories</option>
          <option v-for="(label, value) in CATEGORIES" :key="value" :value="value">{{ label }}</option>
        </select>
      </label>
      <label>
        Sort by
        <select class="field" :value="sort" @change="update({ sort: ($event.target as HTMLSelectElement).value })">
          <option v-for="(label, value) in MOVE_SORTS" :key="value" :value="value">{{ label }}</option>
        </select>
      </label>
    </section>

    <template v-if="results">
      <MoveTable v-if="visible.length" :moves="visible" />
      <StatusMessage v-else title="No moves match">Try another name or fewer filters.</StatusMessage>
      <PaginationNav :page="page" :total="totalPages" />
    </template>
    <div v-else class="skeleton-list" aria-busy="true">
      <SkeletonBlock v-for="n in 12" :key="n" height="2.6rem" radius="var(--radius-m)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue';
import FilterSearch from '@/components/FilterSearch.vue';
import MoveTable from '@/components/MoveTable.vue';
import PaginationNav from '@/components/PaginationNav.vue';
import StatusMessage from '@/components/StatusMessage.vue';
import SkeletonBlock from '@/components/SkeletonBlock.vue';
import { CATEGORIES, filterMoves, loadMoves, MOVE_SORTS, type Category, type Move, type MoveSort } from '@/lib/moves';
import { pageCount, paginate } from '@/lib/pokedex';
import { isTypeName, TYPES } from '@/lib/types';
import { titleCase } from '@/lib/format';
import { useLanguage } from '@/lib/language';
import { useListQuery } from '@/lib/useListQuery';

const PAGE_SIZE = 50;
const moves = shallowRef<Move[]>();
onMounted(async () => (moves.value = await loadMoves()));

const { translations } = useLanguage();
const totalPages = computed(() => pageCount(results.value?.length ?? 0, PAGE_SIZE));
const { param, page, update } = useListQuery(totalPages);

const query = computed(() => param('q'));
const type = computed(() => (isTypeName(param('type')) ? param('type') : undefined) as Move['type'] | undefined);
const category = computed(() => (param('category') in CATEGORIES ? (param('category') as Category) : undefined));
const sort = computed(() => (param('sort') in MOVE_SORTS ? (param('sort') as MoveSort) : 'name'));

const results = computed(
  () =>
    moves.value &&
    filterMoves(moves.value, {
      query: query.value,
      type: type.value,
      category: category.value,
      sort: sort.value,
      localNames: translations.value.moves,
    }),
);
const visible = computed(() => paginate(results.value ?? [], page.value, PAGE_SIZE));
</script>

<style scoped>
.skeleton-list {
  display: grid;
  gap: 0.5rem;
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
</style>
