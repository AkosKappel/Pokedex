<template>
  <div class="home">
    <section class="intro">
      <div class="intro-text">
        <h1>Every Pokémon, from Bulbasaur to {{ lastSpecies.name }}.</h1>
        <p class="lead">
          Look up any of the {{ POKEDEX.length }} Pokémon by name or number. Check their stats, evolutions and which
          types hit them hardest, and keep your favorites in one list.
        </p>
        <div class="intro-actions">
          <RouterLink :to="{ name: 'browse' }" class="button primary">Browse all Pokémon</RouterLink>
          <button type="button" class="button" @click="openRandom">Surprise me</button>
        </div>
      </div>

      <RouterLink
        :to="{ name: 'pokemon', params: { id: featured.id } }"
        class="featured"
        :style="{ '--type': `var(--${featured.types[0]})` }"
      >
        <span class="featured-label">Pokémon of the day</span>
        <PokemonArtwork :id="featured.id" :alt="featured.name" :size="320" eager class="featured-art" />
        <span class="featured-number">{{ formatNumber(featured.id) }}</span>
        <span class="featured-name">{{ featured.name }}</span>
      </RouterLink>
    </section>

    <section aria-labelledby="types-heading" class="block">
      <h2 id="types-heading">Browse by type</h2>
      <ul class="tiles types">
        <li v-for="type in TYPES" :key="type">
          <RouterLink
            :to="{ name: 'browse', query: { type } }"
            class="tile type-tile"
            :style="{ '--type': `var(--${type})` }"
          >
            <span class="tile-name">{{ titleCase(type) }}</span>
            <span class="tile-meta">{{ typeCounts[type] }}</span>
          </RouterLink>
        </li>
      </ul>
    </section>

    <section aria-labelledby="regions-heading" class="block">
      <h2 id="regions-heading">Browse by region</h2>
      <ul class="tiles regions">
        <li v-for="region in regions" :key="region.name">
          <RouterLink :to="{ name: 'browse', query: { gen: String(region.generation) } }" class="tile region-tile">
            <span class="tile-name">{{ region.name }}</span>
            <span class="tile-meta">{{ formatNumber(region.first) }} to {{ formatNumber(region.last) }}</span>
          </RouterLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import PokemonArtwork from '@/components/PokemonArtwork.vue';
import { formatNumber, LAST_ID, POKEDEX, pokemonOfTheDay, REGIONS } from '@/lib/pokedex';
import { TYPES } from '@/lib/types';
import { titleCase } from '@/lib/format';

const router = useRouter();
const featured = pokemonOfTheDay();
const lastSpecies = POKEDEX[LAST_ID - 1];

const typeCounts = Object.fromEntries(
  TYPES.map(type => [type, POKEDEX.filter(species => species.types.includes(type)).length]),
);

const regions = REGIONS.map((name, index) => {
  const members = POKEDEX.filter(species => species.generation === index + 1);
  return { name, generation: index + 1, first: members[0].id, last: members[members.length - 1].id };
});

const openRandom = () => router.push({ name: 'pokemon', params: { id: Math.ceil(Math.random() * LAST_ID) } });
</script>

<style scoped>
.intro {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  align-items: center;
  gap: 3rem;
  padding: 1rem 0 2rem;
}

.intro-text {
  display: grid;
  gap: 1.25rem;
}

h1 {
  font-size: clamp(2.25rem, 1.5rem + 3vw, 4rem);
  max-width: 14ch;
}

.intro-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.featured {
  position: relative;
  display: grid;
  justify-items: center;
  padding: 1.25rem 1.5rem 1.5rem;
  border: 6px solid var(--panel);
  border-radius: var(--radius-l);
  background: color-mix(in oklab, var(--type) 26%, var(--paper));
  box-shadow: 0 0 0 1px var(--line);
  text-decoration: none;
}

.featured:hover {
  box-shadow: 0 0 0 2px var(--type);
}

.featured-label {
  justify-self: start;
  padding: 0.15rem 0.7rem;
  border-radius: 999px;
  background: var(--panel);
  font-size: 0.85rem;
  font-weight: 500;
}

.featured-art {
  width: min(100%, 18rem);
}

.featured-number {
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.featured-name {
  font-size: 1.75rem;
  font-weight: 700;
}

.block {
  display: grid;
  gap: 1rem;
  margin-top: 3rem;
}

.tiles {
  display: grid;
  gap: 0.6rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.types {
  /* At most six columns, so the 18 types fill three full rows. */
  grid-template-columns: repeat(auto-fill, minmax(max(9.5rem, (100% - 3rem) / 6), 1fr));
}

.regions {
  grid-template-columns: repeat(auto-fill, minmax(max(12rem, (100% - 1.2rem) / 3), 1fr));
}

.tile {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  background: var(--panel);
  text-decoration: none;
}

.tile:hover {
  border-color: var(--muted);
}

.type-tile {
  border-left: 6px solid var(--type);
}

.type-tile:hover {
  border-color: var(--type);
  background: color-mix(in oklab, var(--type) 14%, var(--panel));
}

.region-tile {
  flex-direction: column;
  gap: 0.1rem;
}

.tile-name {
  font-weight: 600;
}

.tile-meta {
  color: var(--muted);
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 760px) {
  .intro {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
