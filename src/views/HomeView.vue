<template>
  <div class="content">
    <div class="card about">
      <h2>About</h2>
      <p>
        This is a simple Pokédex app built with Vue 3 and TypeScript. It uses the
        <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">PokéAPI</a> to fetch data about
        pokemons.
      </p>
    </div>
    <div class="card technologies">
      <h2>Technologies</h2>
      <p>
        This app uses the following technologies:
        <br />
      </p>
      <ul>
        <li>
          <a href="https://v3.vuejs.org/" target="_blank" rel="noopener noreferrer">Vue 3</a>
        </li>
        <li>
          <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">TypeScript</a>
        </li>
      </ul>
    </div>
    <div v-for="pokemon in pokemons" :key="pokemon.name" class="card pokemon">
      <router-link :to="{ name: 'pokemon', params: { id: pokemon.id } }">
        <h2>
          {{ pokemon.name }} <span>#{{ pokemon.id.toString().padStart(3, '0') }}</span>
        </h2>
        <div>
          <img :src="pokemon.image" :alt="pokemon.name" />
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchPokemonById } from '@/utils/helpers';

interface Pokemon {
  id: number;
  name: string;
  image: string;
}

const pokemons = ref<Pokemon[]>([]);

onMounted(async () => await fetchRandomPokemons(3));

const fetchRandomPokemons = async (n: number, min: number = 1, max: number = 151) => {
  const pokemonIds = Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  try {
    pokemons.value = await Promise.all(pokemonIds.map(id => fetchPokemonById(id)));
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  margin: 1rem auto;
  min-height: 80vh;
}

.card {
  margin: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  background-color: #fff;
  color: #466483;
  font-size: 1.2rem;
  font-weight: 700;
  text-align: center;
  width: 400px;
}

.card.about,
.card.technologies {
  width: 100%;
  max-width: 600px;
}

.card.technologies ul {
  list-style: none;
  padding: 0;
}

.card.technologies ul li {
  margin-bottom: 0.5rem;
}

.card a {
  text-decoration: none;
  color: #ecb64b;
}

.card a:visited {
  color: #4878e8;
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
