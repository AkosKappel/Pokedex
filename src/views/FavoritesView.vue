<template>
  <div>
    <header class="page-header">
      <h1>Favorites</h1>
      <p class="lead">Saved in this browser only.</p>
    </header>

    <ul v-if="favorites.length" class="grid">
      <PokemonCard v-for="species in favorites" :key="species.id" :species="species" />
    </ul>
    <StatusMessage v-else title="No favorites yet">
      Tap the heart on any Pokémon to keep it here.
      <RouterLink :to="{ name: 'browse' }">Browse Pokémon</RouterLink>
    </StatusMessage>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import PokemonCard from '@/components/PokemonCard.vue';
import StatusMessage from '@/components/StatusMessage.vue';
import { useFavorites } from '@/lib/favorites';
import { findById, type Species } from '@/lib/pokedex';

const { ids } = useFavorites();
const favorites = computed(() => ids.value.map(findById).filter((species): species is Species => Boolean(species)));
</script>
