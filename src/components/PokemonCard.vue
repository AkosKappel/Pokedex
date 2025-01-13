<template>
  <router-link :to="{ name: 'pokemon', params: { id: pokemon.id } }">
    <li class="pokemon-card">
      <h3 class="pokemon-card-name">
        {{ pokemon.name }}<span> #{{ pokemon.id.toString().padStart(3, '0') }}</span>
      </h3>
      <div class="pokemon-card-image">
        <img :src="pokemon.image" :alt="pokemon.name" loading="lazy" @load="onImageLoad" @error="onImageError" />
      </div>
    </li>
  </router-link>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface Pokemon {
  id: string;
  name: string;
  url: string;
  image: string;
}

const props = defineProps<{ pokemon: Pokemon }>();

const onImageLoad = (event: Event) => {
  (event.target as HTMLImageElement).style.backgroundImage = 'none';
};

const onImageError = (event: Event) => {
  (event.target as HTMLImageElement).src = require('@/assets/pokeball.png');
};
</script>

<style scoped>
/* remove router-link decoration */
a {
  text-decoration: none;
}

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

.pokemon-card {
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
  flex-basis: calc(33.3333% - 1rem);
}

.pokemon-card:hover {
  cursor: pointer;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);
  transform: scale(1.05);
}

.pokemon-card-name {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 400;
  color: #466483;
}

.pokemon-card-name::first-letter {
  text-transform: uppercase;
}

.pokemon-card-name:hover {
  color: #f1c40f;
}

.pokemon-card-name span {
  font-size: 1rem;
  font-weight: 300;
}

.pokemon-card-image {
  width: 100%;
  max-width: 260px;
}

.pokemon-card-image img {
  width: 100%;
  height: auto;
  cursor: pointer;
  background-image: url('~@/assets/pokeball.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  min-width: 280px;
  min-height: 280px;
}
</style>
