<template>
  <div>
    <LoadingWidget v-if="loading" />
    <div v-else-if="favoritePokemons.length > 0">
      <PokemonList :pokemons="favoritePokemons" />
    </div>
    <div v-else>
      <p>
        You have no favorite Pokémons yet.<br />
        Go to the <router-link :to="{ name: 'pokemons' }">Pokémon</router-link> page to add some.
      </p>
      <img :src="require('@/assets/pokeball.png')" alt="Pokeball" loading="lazy" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import LoadingWidget from '@/components/LoadingWidget.vue';
import PokemonList from '@/components/PokemonList.vue';
import { fetchPokemonById, type Pokemon } from '@/utils/helpers';

const loading = ref(true);
const favoritePokemons = ref<Pokemon[]>([]);

const loadFavorites = async () => {
  const favoriteIds = JSON.parse(localStorage.getItem('favoritePokemons') || '[]') as string[];
  const pokemons = await Promise.all(favoriteIds.map(id => fetchPokemonById(+id)));
  favoritePokemons.value = pokemons;
  loading.value = false;
};

onMounted(loadFavorites);
</script>

<style scoped>
p {
  text-align: center;
  margin-top: 50px;
  font-size: 1.2rem;
  font-weight: bold;
}

img {
  width: 420px;
  height: auto;
  margin: 1rem 0;
}
</style>
