<template>
  <div>
    <ul class="pokemon-list">
      <PokemonCard v-for="pokemon in pokemons" :key="pokemon.id" :pokemon="pokemon" />
    </ul>
    <ToTopButton />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import ToTopButton from '@/components/ToTopButton.vue';
import PokemonCard from '@/components/PokemonCard.vue';
import { transformPokemon, type Pokemon } from '@/utils/helpers';

const props = defineProps({
  pokemons: {
    type: Array,
    required: true,
  },
});

const pokemons: Pokemon[] = props.pokemons.map(transformPokemon);
</script>

<style scoped>
.pokemon-list {
  list-style: none;
  padding: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}
</style>
