<template>
  <header class="header">
    <div class="bar">
      <RouterLink to="/" class="brand">
        <span class="lens" aria-hidden="true"></span>
        <span class="leds" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="name">Pokédex</span>
      </RouterLink>

      <nav aria-label="Main">
        <RouterLink :to="{ name: 'browse' }">Browse</RouterLink>
        <RouterLink :to="{ name: 'favorites' }">
          Favorites<span v-if="favoriteCount" class="count">{{ favoriteCount }}</span>
        </RouterLink>
        <RouterLink :to="{ name: 'compare' }">Compare</RouterLink>
        <RouterLink :to="{ name: 'quiz' }">Quiz</RouterLink>
        <RouterLink :to="{ name: 'about' }">About</RouterLink>
      </nav>

      <SearchBox ref="search" class="search" />
      <ThemeToggle class="theme" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, useTemplateRef } from 'vue';
import SearchBox from './SearchBox.vue';
import ThemeToggle from './ThemeToggle.vue';
import { useFavorites } from '@/lib/favorites';

const { ids } = useFavorites();
const favoriteCount = computed(() => ids.value.length);
const search = useTemplateRef('search');

const onKeydown = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement;
  if (event.key !== '/' || target.closest('input, textarea, select, [contenteditable]')) return;
  event.preventDefault();
  search.value?.focus();
};

onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => window.removeEventListener('keydown', onKeydown));
</script>

<style scoped>
.header {
  background: var(--red);
  color: #fff;
  border-bottom: 4px solid var(--red-deep);
}

.bar {
  width: var(--page);
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto 1fr minmax(14rem, 20rem) auto;
  grid-template-areas: 'brand nav search theme';
  align-items: center;
  gap: 0.75rem 1.5rem;
  padding: 0.85rem 0;
}

.brand {
  grid-area: brand;
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  text-decoration: none;
}

.lens {
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  border: 3px solid #fff;
  background: radial-gradient(circle at 32% 30%, #bfe6ff 0 12%, var(--lens) 30%, #12558f 100%);
  box-shadow: 0 0 0 2px var(--red-deep);
}

.leds {
  display: flex;
  gap: 0.25rem;
  padding-top: 0.15rem;
}

.leds i {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  border: 1px solid rgb(0 0 0 / 0.35);
  background: #ff5a5f;
}

.leds i:nth-child(2) {
  background: #ffd23f;
}

.leds i:nth-child(3) {
  background: #5bd16d;
}

.name {
  align-self: center;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

nav {
  grid-area: nav;
  display: flex;
  gap: 0.25rem;
}

nav a {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 500;
  white-space: nowrap;
}

nav a:hover {
  background: rgb(255 255 255 / 0.14);
}

nav a.router-link-active {
  background: #fff;
  color: var(--red-deep);
}

.count {
  min-width: 1.4rem;
  padding: 0 0.35rem;
  border-radius: 999px;
  background: var(--red-deep);
  color: #fff;
  font-size: 0.8rem;
  text-align: center;
}

.search {
  grid-area: search;
}

.theme {
  grid-area: theme;
}

@media (max-width: 960px) {
  .bar {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'brand theme'
      'search search'
      'nav nav';
  }

  nav {
    overflow-x: auto;
    margin: 0 -0.25rem;
    padding: 0 0.25rem;
  }
}
</style>
