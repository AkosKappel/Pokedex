<template>
  <div class="content">
    <AboutCard />
    <TechStackCard />

    <div class="cards">
      <div v-for="pokemon in pokemons" :key="pokemon.name" class="card pokemon">
        <PokemonCard :pokemon="pokemon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchPokemonById } from '@/utils/helpers';
import AboutCard from '@/components/AboutCard.vue';
import TechStackCard from '@/components/TechStackCard.vue';
import PokemonCard from '@/components/PokemonCard.vue';

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

<style>
.content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  margin: 1rem auto;
  min-height: 80vh;
}

.cards {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
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

.card a {
  text-decoration: none;
  color: #ecb64b;
}

.card a:hover {
  text-decoration: underline;
}

.card a:visited {
  color: #4878e8;
}

.about,
.technologies {
  width: 100%;
  max-width: 600px;
}
</style>
