<template>
  <ul class="grid" aria-hidden="true">
    <li v-for="n in count" :key="n" class="card">
      <SkeletonBlock height="auto" class="art" radius="calc(var(--radius-m) - 4px)" />
      <SkeletonBlock width="40%" height="0.8rem" />
      <SkeletonBlock width="70%" height="1.1rem" />
      <SkeletonBlock width="55%" height="1.2rem" radius="999px" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import SkeletonBlock from './SkeletonBlock.vue';

withDefaults(defineProps<{ count?: number }>(), { count: 12 });
</script>

<style scoped>
.card {
  display: grid;
  gap: 0.6rem;
  padding: 0.75rem 0.75rem 1rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  background: var(--panel);
}

.art {
  aspect-ratio: 1;
}
</style>
