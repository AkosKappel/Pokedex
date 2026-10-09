<template>
  <span class="category" :class="category">{{ CATEGORIES[category] }}</span>
</template>

<script setup lang="ts">
import { CATEGORIES, type Category } from '@/lib/moves';

defineProps<{ category: Category }>();
</script>

<style scoped>
.category {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  white-space: nowrap;
}

/* Shapes rather than colours tell the categories apart: burst, rings, half circle. */
.category::before {
  content: '';
  width: 0.75rem;
  height: 0.75rem;
  background: currentColor;
}

.physical::before {
  clip-path: polygon(50% 0, 63% 35%, 100% 50%, 63% 65%, 50% 100%, 37% 65%, 0 50%, 37% 35%);
}

.special::before {
  border-radius: 50%;
  background: radial-gradient(circle, currentColor 0 25%, transparent 26% 45%, currentColor 46%);
}

.status::before {
  border-radius: 50%;
  background: linear-gradient(to right, currentColor 50%, transparent 50%);
  box-shadow: inset 0 0 0 1.5px currentColor;
}
</style>
