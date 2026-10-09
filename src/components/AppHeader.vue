<template>
  <header class="header">
    <div class="bar">
      <RouterLink to="/" class="brand">
        <span class="lens" aria-hidden="true"></span>
        <span class="leds" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="name">Pokédex</span>
      </RouterLink>

      <nav aria-label="Main">
        <RouterLink :to="{ name: 'browse' }">Pokémon</RouterLink>
        <RouterLink :to="{ name: 'moves' }">Moves</RouterLink>
        <RouterLink :to="{ name: 'abilities' }">Abilities</RouterLink>
        <RouterLink :to="{ name: 'items' }">Items</RouterLink>
        <RouterLink :to="{ name: 'team' }">Team</RouterLink>
        <HeaderPopover id="more-menu" :class="{ 'router-link-active': moreActive }">
          <template #button>
            More
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
            </svg>
          </template>
          <ul class="menu">
            <li><RouterLink :to="{ name: 'compare' }">Compare Pokémon</RouterLink></li>
            <li><RouterLink :to="{ name: 'quiz' }">Who's that Pokémon?</RouterLink></li>
            <li><RouterLink :to="{ name: 'about' }">About</RouterLink></li>
          </ul>
        </HeaderPopover>
      </nav>

      <SearchBox ref="search" class="search" />

      <div class="tools">
        <RouterLink
          :to="{ name: 'favorites' }"
          class="icon-link"
          :aria-label="favoriteCount ? `Favorites (${favoriteCount})` : 'Favorites'"
          title="Favorites"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M12 20.3 4.6 13.4a4.9 4.9 0 0 1-.4-6.6l.2-.3a4.6 4.6 0 0 1 7.6.9 4.6 4.6 0 0 1 7.6-.9l.2.3a4.9 4.9 0 0 1-.4 6.6Z"
              fill="currentColor"
            />
          </svg>
          <span v-if="favoriteCount" class="count" aria-hidden="true">{{ favoriteCount }}</span>
        </RouterLink>
        <LanguagePicker />
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, useTemplateRef } from 'vue';
import SearchBox from './SearchBox.vue';
import ThemeToggle from './ThemeToggle.vue';
import HeaderPopover from './HeaderPopover.vue';
import LanguagePicker from './LanguagePicker.vue';
import { useRoute } from 'vue-router';
import { useFavorites } from '@/lib/favorites';

const { ids } = useFavorites();
const favoriteCount = computed(() => ids.value.length);
const search = useTemplateRef('search');
const route = useRoute();
const moreActive = computed(() => ['compare', 'quiz', 'about'].includes(String(route.name)));

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
  grid-template-columns: auto 1fr minmax(12rem, 17rem) auto;
  grid-template-areas: 'brand nav search tools';
  align-items: center;
  gap: 0.75rem 1.25rem;
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
  align-items: center;
  gap: 0.15rem;
}

nav > a,
nav :deep(.popover-button) {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  min-height: 2.4rem;
  padding: 0 0.75rem;
  border-radius: 999px;
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  white-space: nowrap;
}

nav > a:hover,
nav :deep(.popover-button):hover {
  background: rgb(255 255 255 / 0.14);
}

nav > a.router-link-active,
nav .router-link-active :deep(.popover-button) {
  background: #fff;
  color: var(--red-deep);
}

.menu {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}

.menu a {
  display: block;
  padding: 0.6rem 0.75rem;
  border-radius: var(--radius-s);
  text-decoration: none;
}

.menu a:hover,
.menu a.router-link-active {
  background: var(--paper);
}

.menu a.router-link-active {
  font-weight: 600;
}

.search {
  grid-area: search;
}

.tools {
  grid-area: tools;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.icon-link,
.tools :deep(.popover-button) {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  min-width: 2.75rem;
  height: 2.75rem;
  padding: 0 0.6rem;
  border: 2px solid rgb(255 255 255 / 0.5);
  border-radius: 999px;
  color: #fff;
  text-decoration: none;
}

.icon-link:hover,
.icon-link.router-link-active,
.tools :deep(.popover-button):hover {
  border-color: #fff;
}

.count {
  min-width: 1.3rem;
  padding: 0 0.3rem;
  border-radius: 999px;
  background: #fff;
  color: var(--red-deep);
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;
}

.tools :deep(.popover-button):focus-visible,
.icon-link:focus-visible,
nav a:focus-visible,
nav :deep(.popover-button):focus-visible {
  outline-color: #fff;
}

@media (max-width: 1140px) {
  .bar {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'brand tools'
      'search search'
      'nav nav';
  }

  nav {
    flex-wrap: wrap;
    margin: 0 -0.5rem;
  }
}

@media (max-width: 480px) {
  .leds {
    display: none;
  }

  .tools {
    gap: 0.3rem;
  }

  .tools :deep(.code) {
    display: none;
  }
}
</style>
