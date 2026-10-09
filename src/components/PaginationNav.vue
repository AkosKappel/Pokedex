<template>
  <nav v-if="total > 1" class="pagination" aria-label="Pages">
    <RouterLink v-if="page > 1" :to="link(page - 1)" class="step" rel="prev">Previous</RouterLink>
    <ol>
      <li v-for="(item, index) in items" :key="index">
        <span v-if="item === null" class="gap" aria-hidden="true">…</span>
        <RouterLink
          v-else
          :to="link(item)"
          :aria-current="item === page ? 'page' : undefined"
          :aria-label="`Page ${item}`"
          >{{ item }}</RouterLink
        >
      </li>
    </ol>
    <RouterLink v-if="page < total" :to="link(page + 1)" class="step" rel="next">Next</RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{ page: number; total: number }>();
const route = useRoute();

const link = (page: number) => ({ query: { ...route.query, page: page === 1 ? undefined : String(page) } });

/** First, last, and the current page with one neighbour on each side; null marks a gap. */
const items = computed(() => {
  const pages = new Set([1, props.total, props.page - 1, props.page, props.page + 1]);
  const sorted = [...pages].filter(p => p >= 1 && p <= props.total).sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? [null, p] : [p]));
});
</script>

<style scoped>
.pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2.5rem;
}

ol {
  display: flex;
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

a {
  display: grid;
  place-items: center;
  min-width: 2.75rem;
  height: 2.75rem;
  padding: 0 0.75rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--panel);
  text-decoration: none;
  font-variant-numeric: tabular-nums;
}

a:hover {
  border-color: var(--muted);
}

a[aria-current='page'] {
  border-color: var(--ink);
  background: var(--ink);
  color: var(--paper);
}

.gap {
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 2.75rem;
  color: var(--muted);
}
</style>
