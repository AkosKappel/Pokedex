<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <AppHeader />
  <main id="main" tabindex="-1">
    <RouterView />
  </main>
  <AppFooter />
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
</script>

<style scoped>
.skip-link {
  position: absolute;
  left: 1rem;
  top: -4rem;
  z-index: 10;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-s);
  background: var(--panel);
}

.skip-link:focus {
  top: 1rem;
}

main:focus {
  outline: none;
}
</style>
