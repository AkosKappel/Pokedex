<template>
  <header>
    <h1>
      <router-link to="/">{{ props.title }}</router-link>
    </h1>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        |
        <li><router-link to="/pokemons">Pokémons</router-link></li>
        |
        <li><router-link to="/items">Items</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  title: String,
});
</script>

<style scoped>
header {
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 1rem;
  text-align: center;
}

h1 {
  margin: 0.5rem;
  color: #f1c40f;
  font-size: 2.2r em;
  cursor: pointer;
}

/* remove router-link decorations */
h1 a {
  color: #f1c40f;
  text-decoration: none;
}

nav ul {
  list-style-type: none;
  padding: 0;
  margin: 1rem 0 0.5rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

nav ul li {
  margin: 0 1rem;
}

nav ul li a {
  color: #ecf0f1;
  text-decoration: none;
}

nav ul li a:hover {
  text-decoration: underline;
}
</style>
