<template>
  <p v-if="stages.length < 2" class="none">{{ name }} does not evolve.</p>
  <ol v-else class="chain">
    <li v-for="(stage, index) in stages" :key="index" class="stage">
      <ul>
        <li v-for="evolution in stage" :key="evolution.id" class="evolution">
          <p v-if="evolution.condition" class="condition">{{ evolution.condition }}</p>
          <RouterLink
            :to="{ name: 'pokemon', params: { id: evolution.id } }"
            class="member"
            :aria-current="evolution.id === currentId ? 'page' : undefined"
          >
            <PokemonArtwork :id="evolution.id" :alt="''" :size="120" class="art" />
            <span class="number">{{ formatNumber(evolution.id) }}</span>
            <span class="member-name">{{ findById(evolution.id)?.name ?? '' }}</span>
          </RouterLink>
        </li>
      </ul>
    </li>
  </ol>
</template>

<script setup lang="ts">
import PokemonArtwork from './PokemonArtwork.vue';
import { findById, formatNumber } from '@/lib/pokedex';
import type { Evolution } from '@/lib/evolution';

defineProps<{ stages: Evolution[][]; currentId: number; name: string }>();
</script>

<style scoped>
.chain {
  display: flex;
  align-items: end;
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-x: auto;
}

.stage ul {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.stage:has(li:nth-child(4)) {
  flex: 1;
}

.evolution {
  display: grid;
  align-content: end;
  gap: 0.4rem;
  min-width: 8.5rem;
}

.condition {
  color: var(--muted);
  font-size: 0.85rem;
  line-height: 1.3;
}

.condition::before {
  content: '↳ ';
}

.member {
  display: grid;
  justify-items: center;
  padding: 0.6rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  background: var(--panel);
  text-decoration: none;
}

.member:hover {
  border-color: var(--muted);
}

.member[aria-current='page'] {
  border: 2px solid var(--ink);
}

.art {
  width: 6rem;
}

.number {
  color: var(--muted);
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
}

.member-name {
  font-weight: 600;
}

.none {
  color: var(--muted);
}

@media (max-width: 640px) {
  .chain {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
