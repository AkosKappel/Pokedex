<template>
  <div v-if="loading" class="loading-screen">
    <h3>Loading ...</h3>
    <div class="spinner"></div>
  </div>
  <div v-else class="pokemon-container">
    <ul class="pokemon-list">
      <li
        v-for="pokemon in pokemonList"
        :key="pokemon.id"
        class="pokemon-list-item"
        @click="
          () => {
            console.log('clicked pokemon', pokemon.name, pokemon.id);
          }
        "
      >
        <h3 class="pokemon-list-item-name">
          {{ pokemon.name }}
          <span class="pokemon-list-item-id"> #{{ pokemon.id }}</span>
        </h3>
        <div class="pokemon-list-item-image">
          <img :src="pokemon.image" :alt="pokemon.name" @load="handleImageLoad" @error="handleImageError" />
        </div>
      </li>
    </ul>
    <div v-if="sidenav" class="side-pagination prev">
      <button @click="goToPrevPage" :disabled="currentPage === 1">&#60;</button>
    </div>
    <div v-if="sidenav" class="side-pagination next">
      <button @click="goToNextPage" :disabled="currentPage === totalPages">&#62;</button>
    </div>
    <vue-awesome-paginate
      v-model="currentPage"
      :total-items="fetchedData.count"
      :items-per-page="20"
      :max-pages-shown="5"
      :on-click="
        () => {
          console.log('clicked pagination');
        }
      "
      :hide-prev-next-when-ends="true"
      active-page-class="active-page"
    />
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, watch, onMounted } from 'vue';

const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon/';
const POKEMON_IMAGE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

interface Pokemon {
  id: string;
  name: string;
  url: string;
  image: string;
}

const fetchedData = ref<any>(null);

const transformPokemon = (pokemon: any): Pokemon => {
  const id = pokemon.url.split('/').slice(-2, -1)[0];
  return {
    id: id.padStart(3, '0'),
    ...pokemon,
    image: `${POKEMON_IMAGE_URL}${id}.png`,
  };
};

const pokemonList = ref<Pokemon[]>([]);
const currentPage = ref<number>(1);
const totalPages = ref<number>(15);
const sidenav = ref<boolean>(true);
const loading = ref<boolean>(true);

onMounted(async () => {
  try {
    const { data } = await axios.get(POKEMON_API_URL);
    fetchedData.value = data;
    totalPages.value = Math.ceil(data.count / data.results.length);
    currentPage.value = data.next ? currentPage.value : totalPages.value;
    pokemonList.value = data.results.map(transformPokemon);
    loading.value = false;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const goToPrevPage = () => {
  currentPage.value -= 1;
};
const goToNextPage = () => {
  currentPage.value += 1;
};

const fetchPage = async (page: number, perPage: number = 20) => {
  try {
    loading.value = true;
    const { data } = await axios.get(`${POKEMON_API_URL}?offset=${(page - 1) * perPage}&limit=${perPage}`);
    fetchedData.value = data;
    pokemonList.value = data.results.map(transformPokemon);
    loading.value = false;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

watch(currentPage, (newPage, oldPage) => {
  console.log(`Page changed from ${oldPage} to ${newPage}`);
  fetchedData.value = null;
  fetchPage(newPage);
});

const handleImageLoad = (event: any) => {
  event.target.style.opacity = 1;
};

const handleImageError = (event: any) => {
  event.target.src = require('@/assets/pokeball.png');
};
</script>

<style>
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5rem 0 2rem 0;
  column-gap: 10px;
}

.paginate-buttons {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  cursor: pointer;
  background-color: #5c82a9;
  color: #fff;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  font-weight: 700;
  border: none;
}

.paginate-buttons:hover {
  background-color: #466483;
  color: #f1c40f;
}

.active-page {
  background-color: #466483;
  color: #f1c40f;
}

.pokemon-list {
  list-style: none;
  padding: 0;
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
  cursor: pointer;
}

.side-pagination {
  position: fixed;
  top: 50%;
}

.side-pagination button {
  background-color: #5c82a9;
  color: #fff;
  border: none;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
  margin: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 0.5rem;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease-in-out;
  border-radius: 50%;
  opacity: 0.8;
}

.side-pagination button:hover {
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);
  background-color: #466483;
  color: #f1c40f;
  opacity: 1;
}

.side-pagination button:disabled {
  display: none;
}

.side-pagination.prev {
  left: 0;
}

.side-pagination.next {
  right: 0;
}

.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  margin: -50px 0 0 -50px;
  border-radius: 50%;
  border: 5px solid transparent;
  border-top-color: #466483;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
