<template>
  <dl class="stats" :style="{ '--type': `var(--${type})` }">
    <div v-for="stat in stats" :key="stat.stat.name" class="row">
      <dt>{{ STAT_LABELS[stat.stat.name] ?? titleCase(stat.stat.name) }}</dt>
      <dd>
        <span class="value">{{ stat.base_stat }}</span>
        <span class="bar" aria-hidden="true"
          ><span :style="{ width: `${(stat.base_stat / MAX_STAT) * 100}%` }"></span
        ></span>
      </dd>
    </div>
    <div class="row total">
      <dt>Total</dt>
      <dd>
        <span class="value">{{ total }}</span>
      </dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Pokemon } from '@/lib/api';
import type { TypeName } from '@/lib/types';
import { MAX_STAT, STAT_LABELS, titleCase } from '@/lib/format';

const props = defineProps<{ stats: Pokemon['stats']; type: TypeName }>();
const total = computed(() => props.stats.reduce((sum, stat) => sum + stat.base_stat, 0));
</script>

<style scoped>
.stats {
  display: grid;
  gap: 0.55rem;
  margin: 0;
}

.row {
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  align-items: center;
  gap: 1rem;
}

dt {
  color: var(--muted);
}

dd {
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
}

.value {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.bar {
  height: 0.6rem;
  border-radius: 999px;
  background: color-mix(in oklab, var(--type) 14%, var(--line));
  overflow: hidden;
}

.bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--type);
}

.total {
  padding-top: 0.55rem;
  border-top: 1px solid var(--line);
}

.total dt {
  color: var(--ink);
  font-weight: 600;
}
</style>
