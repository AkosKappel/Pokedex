<template>
  <img
    v-if="!failed"
    :src="itemSpriteUrl(item)"
    alt=""
    :width="size"
    :height="size"
    loading="lazy"
    @error="failed = true"
  />
  <svg v-else :width="size" :height="size" viewBox="0 0 30 30" aria-hidden="true">
    <rect x="7" y="9" width="16" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="2" opacity="0.35" />
    <path d="M11 9V7h8v2" fill="none" stroke="currentColor" stroke-width="2" opacity="0.35" />
  </svg>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { itemSpriteUrl, type Item } from '@/lib/items';

const props = withDefaults(defineProps<{ item: Item; size?: number }>(), { size: 30 });
const failed = ref(false);
watch(
  () => props.item.id,
  () => (failed.value = false),
);
</script>

<style scoped>
img {
  image-rendering: pixelated;
}
</style>
