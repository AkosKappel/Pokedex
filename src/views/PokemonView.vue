<template>
  <div class="pokemon-details">
    {{ pokemon }}
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon/';
const route = useRoute();
const pokemon = ref(null);

onMounted(async () => {
  const pokemonId = route.params.id;
  const response = await axios.get(`${POKEMON_API_URL}${pokemonId}`);
  pokemon.value = response.data;
});
</script>

<style scoped></style>
