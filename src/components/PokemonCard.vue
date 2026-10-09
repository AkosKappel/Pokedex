<template>
  <li class="card" :style="{ '--type': `var(--${species.types[0]})` }">
    <RouterLink :to="{ name: 'pokemon', params: { id: species.id } }" class="link">
      <PokemonArtwork :id="species.id" :alt="species.name" :size="200" class="art" />
      <span class="number">{{ formatNumber(species.id) }}</span>
      <h3 class="name">{{ species.name }}</h3>
    </RouterLink>
    <div class="types">
      <TypeBadge v-for="type in species.types" :key="type" :type="type" compact />
    </div>
    <FavoriteButton :id="species.id" :name="species.name" class="favorite" />
  </li>
</template>

<script setup lang="ts">
import PokemonArtwork from './PokemonArtwork.vue';
import TypeBadge from './TypeBadge.vue';
import FavoriteButton from './FavoriteButton.vue';
import { formatNumber, type Species } from '@/lib/pokedex';

defineProps<{ species: Species }>();
</script>

<style scoped>
.card {
  position: relative;
  display: grid;
  align-content: start;
  gap: 0.6rem;
  padding: 0.75rem 0.75rem 1rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  background: var(--panel);
}

.card:hover {
  border-color: color-mix(in oklab, var(--type) 70%, var(--line));
}

.link {
  display: grid;
  gap: 0.1rem;
  text-decoration: none;
}

/* The whole card is clickable; the favourite button sits above the link. */
.link::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

.link:focus-visible {
  outline: none;
}

.card:has(.link:focus-visible) {
  outline: 3px solid var(--focus);
  outline-offset: 2px;
}

.art {
  margin-bottom: 0.4rem;
  padding: 0.5rem;
  border-radius: calc(var(--radius-m) - 4px);
  background: color-mix(in oklab, var(--type) 16%, var(--panel));
}

.number {
  color: var(--muted);
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
}

.name {
  font-size: 1.1rem;
}

.types {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.favorite {
  position: absolute;
  top: 0.35rem;
  right: 0.35rem;
  z-index: 1;
}
</style>
