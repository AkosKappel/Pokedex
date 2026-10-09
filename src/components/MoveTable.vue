<template>
  <div class="table-wrap">
    <table>
      <caption v-if="caption" class="visually-hidden">
        {{
          caption
        }}
      </caption>
      <thead>
        <tr>
          <th v-if="levels" scope="col" class="number">Level</th>
          <th scope="col">Move</th>
          <th scope="col">Type</th>
          <th scope="col">Category</th>
          <th scope="col" class="number">Power</th>
          <th scope="col" class="number">Accuracy</th>
          <th scope="col" class="number">PP</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(move, index) in moves" :key="`${move.id}-${index}`">
          <td v-if="levels" class="number">{{ levels[index] || '' }}</td>
          <th scope="row">
            <RouterLink :to="{ name: 'move', params: { id: move.id } }" :lang="lang">{{ moveName(move) }}</RouterLink>
          </th>
          <td><TypeBadge :type="move.type" compact /></td>
          <td><CategoryBadge :category="move.category" /></td>
          <td class="number">{{ move.power ?? '–' }}</td>
          <td class="number">{{ move.accuracy ? `${move.accuracy}%` : '–' }}</td>
          <td class="number">{{ move.pp ?? '–' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import TypeBadge from './TypeBadge.vue';
import CategoryBadge from './CategoryBadge.vue';
import type { Move } from '@/lib/moves';
import { useLanguage } from '@/lib/language';

defineProps<{ moves: Move[]; levels?: number[]; caption?: string }>();
const { moveName, lang } = useLanguage();
</script>

<style scoped>
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
  padding: 0.55rem 0.9rem;
  text-align: left;
  white-space: nowrap;
}

thead th {
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 500;
  border-bottom: 1px solid var(--line);
}

tbody tr + tr {
  border-top: 1px solid var(--line);
}

tbody th {
  font-weight: 600;
}

.number {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>
