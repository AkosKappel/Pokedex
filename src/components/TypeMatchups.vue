<template>
  <dl class="matchups">
    <div v-for="group in groups" :key="group.label">
      <dt>{{ group.label }}</dt>
      <dd>
        <span v-for="matchup in group.items" :key="matchup.type" class="matchup">
          <TypeBadge :type="matchup.type" />
          <span class="multiplier">{{ formatMultiplier(matchup.multiplier) }}</span>
        </span>
        <span v-if="!group.items.length" class="none">None</span>
      </dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TypeBadge from './TypeBadge.vue';
import { matchups, type TypeName } from '@/lib/types';

const props = defineProps<{ types: TypeName[] }>();

const groups = computed(() => {
  const { weak, resistant, immune } = matchups(props.types);
  return [
    { label: 'Weak to', items: weak },
    { label: 'Resists', items: resistant },
    { label: 'Immune to', items: immune },
  ];
});

const formatMultiplier = (value: number) => `×${value === 0.25 ? '¼' : value === 0.5 ? '½' : value}`;
</script>

<style scoped>
.matchups {
  display: grid;
  gap: 1rem;
  margin: 0;
}

dt {
  margin-bottom: 0.4rem;
  color: var(--muted);
}

dd {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
}

.matchup {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.multiplier {
  font-size: 0.85rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.none {
  color: var(--muted);
}
</style>
