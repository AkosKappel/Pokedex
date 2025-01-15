<template>
  <router-link :to="{ name: 'pokemon', params: { id: pokemon.id } }">
    <li :id="pokemon.id" :class="['pokemon-card', { liked: isLiked }]">
      <div class="heart-icon" @click.prevent="toggleFavorite(pokemon.id)">
        <svg
          class="heart"
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.45067 13.9082L11.4033 20.4395C11.6428 20.6644 11.7625 20.7769 11.9037 20.8046C11.9673 20.8171 12.0327 20.8171 12.0963 20.8046C12.2375 20.7769 12.3572 20.6644 12.5967 20.4395L19.5493 13.9082C21.5055 12.0706 21.743 9.0466 20.0978 6.92607L19.7885 6.52734C17.8203 3.99058 13.8696 4.41601 12.4867 7.31365C12.2913 7.72296 11.7087 7.72296 11.5133 7.31365C10.1304 4.41601 6.17972 3.99058 4.21154 6.52735L3.90219 6.92607C2.25695 9.0466 2.4945 12.0706 4.45067 13.9082Z"
            stroke="#33363F"
            stroke-width="2"
          />
        </svg>
      </div>
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
import { ref, onMounted } from 'vue';

interface Pokemon {
  id: string;
  name: string;
  url: string;
  image: string;
}

const props = defineProps<{ pokemon: Pokemon }>();
const isLiked = ref(false);

const initializeFavorites = () => {
  const favoritePokemons = JSON.parse(localStorage.getItem('favoritePokemons') || '[]') as string[];
  isLiked.value = favoritePokemons.includes(props.pokemon.id);
};

const toggleFavorite = (pokemonId: string) => {
  const favoritePokemons = JSON.parse(localStorage.getItem('favoritePokemons') || '[]') as string[];
  const index = favoritePokemons.indexOf(pokemonId);
  const element = document.getElementById(pokemonId);

  if (index === -1) {
    favoritePokemons.push(pokemonId);
    element?.classList.add('liked');
  } else {
    favoritePokemons.splice(index, 1);
    element?.classList.remove('liked');
  }
  localStorage.setItem('favoritePokemons', JSON.stringify(favoritePokemons));
};

const onImageLoad = (event: Event) => {
  (event.target as HTMLImageElement).style.backgroundImage = 'none';
};

const onImageError = (event: Event) => {
  (event.target as HTMLImageElement).src = require('@/assets/pokeball.png');
};

onMounted(() => {
  initializeFavorites();
});
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
  position: relative;
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

.heart-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 24px;
  height: 24px;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.heart-icon .heart {
  width: 100%;
  height: 100%;
  transition: fill 0.2s ease-in-out;
}

.pokemon-card.liked .heart-icon,
.pokemon-card:hover .heart-icon {
  opacity: 1;
}

.pokemon-card.liked .heart {
  fill: #ff69b4;
}

.pokemon-card .heart-icon:hover .heart {
  fill: #ffafd7;
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
