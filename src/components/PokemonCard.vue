<template>
  <router-link :to="{ name: 'pokemon', params: { id: pokemon.id } }">
    <h2 class="name">
      {{ pokemon.name }} <span>#{{ pokemon.id.toString().padStart(3, '0') }}</span>
    </h2>
    <div>
      <img :src="pokemon.image" :alt="pokemon.name" :title="pokemon.name" />
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface Pokemon {
  id: number;
  name: string;
  image: string;
}

const props = defineProps<{ pokemon: Pokemon }>();
</script>

<style scoped>
h2:hover {
  color: #ecb64b;
}

.card.pokemon {
  width: 100%;
  max-width: 300px;
}

.card.pokemon a {
  text-decoration: none;
  color: #466483;
}

.card.pokemon img {
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
}

.card.pokemon h2 {
  margin-bottom: 0.5rem;
  text-transform: capitalize;
}

.card.pokemon h2 span {
  font-size: 1.5rem;
  font-weight: 400;
}
</style>
