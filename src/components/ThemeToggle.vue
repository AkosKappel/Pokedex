<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-label="dark ? 'Switch to light theme' : 'Switch to dark theme'"
    :aria-pressed="dark"
    @click="toggle"
  >
    <svg v-if="dark" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
      <path
        d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
    <svg v-else viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" fill="currentColor" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const root = document.documentElement;
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
const dark = ref(root.dataset.theme ? root.dataset.theme === 'dark' : systemDark.matches);

const toggle = () => {
  dark.value = !dark.value;
  root.dataset.theme = dark.value ? 'dark' : 'light';
  try {
    localStorage.setItem('theme', root.dataset.theme);
  } catch {
    // The choice then lasts only for this page view.
  }
};
</script>

<style scoped>
.theme-toggle {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 2px solid rgb(255 255 255 / 0.5);
  border-radius: 50%;
  background: transparent;
  color: #fff;
  cursor: pointer;
}

.theme-toggle:hover {
  border-color: #fff;
}

.theme-toggle:focus-visible {
  outline-color: #fff;
}
</style>
