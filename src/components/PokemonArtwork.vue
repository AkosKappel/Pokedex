<template>
  <div class="artwork" :class="{ loaded, failed }">
    <img
      v-if="!failed"
      :src="artworkUrl(id, shiny)"
      :alt="alt"
      :width="size"
      :height="size"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : undefined"
      decoding="async"
      @load="loaded = true"
      @error="failed = true"
    />
    <svg v-else viewBox="0 0 100 100" role="img" :aria-label="`${alt} (artwork not available)`">
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="6" />
      <path d="M4 50h32M64 50h32" stroke="currentColor" stroke-width="6" />
      <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" stroke-width="6" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { artworkUrl } from '@/lib/pokedex';

const props = withDefaults(
  defineProps<{ id: number; alt: string; shiny?: boolean; size?: number; eager?: boolean }>(),
  {
    shiny: false,
    size: 475,
    eager: false,
  },
);

const loaded = ref(false);
const failed = ref(false);

watch(
  () => [props.id, props.shiny],
  () => {
    loaded.value = false;
    failed.value = false;
  },
);
</script>

<style scoped>
.artwork {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
}

img,
svg {
  grid-area: 1 / 1;
  width: 100%;
  height: auto;
}

img {
  opacity: 0;
  transition: opacity 0.25s;
}

.loaded img {
  opacity: 1;
}

/* A faint Poké Ball outline holds the space while the artwork loads. */
.artwork:not(.loaded):not(.failed) {
  background: radial-gradient(
    circle,
    transparent 58%,
    color-mix(in oklab, currentColor 10%, transparent) 59% 62%,
    transparent 63%
  );
}

svg {
  width: 45%;
  opacity: 0.25;
}
</style>
