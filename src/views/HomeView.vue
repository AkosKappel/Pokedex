<template>
  <ul class="pokemon-list">
    <li class="pokemon-list-item" v-for="pokemon in pokemonList" :key="pokemon.id">
      <h3 class="pokemon-list-item-name">{{ pokemon.name }}
        <span class="pokemon-list-item-id"> #{{ pokemon.id }}</span>
      </h3>
      <div class="pokemon-list-item-image">
        <img :src="pokemon.image" />
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';

interface Pokemon {
  id: string;
  name: string;
  url: string;
  image: string;
}

const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon/';
const POKEMON_IMAGE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';
const pokemonList = ref<Pokemon[]>([]);

const transformPokemon = (pokemon: any): Pokemon => {
  const id = pokemon.url.split('/').slice(-2, -1)[0];
  return {
    id: id.padStart(3, '0'),
    ...pokemon,
    image: `${POKEMON_IMAGE_URL}${id}.png`,
  };
};

onMounted(async () => {
  try {
    const { data } = await axios.get(POKEMON_API_URL);
    pokemonList.value = data.results.map(transformPokemon);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});
</script>


<style scoped>
.pokemon-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.pokemon-list-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  margin: 1rem 0.5rem;
  background-color: #fff;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease-in-out;
}

.pokemon-list-item:hover {
  cursor: pointer;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);
  transform: scale(1.05);
}

.pokemon-list-item-name {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 400;
  color: #466483;
}

.pokemon-list-item-name:hover {
  color: #f00;
}

.pokemon-list-item-name::first-letter {
  text-transform: uppercase;
}

.pokemon-list-item-name span {
  font-size: 1rem;
  font-weight: 300;
}

.pokemon-list-item-image {
  width: 100%;
  max-width: 260px;
}

.pokemon-list-item-image img {
  width: 100%;
  height: auto;
}
</style>
