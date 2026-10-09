<template>
  <div class="artwork" :class="{ loaded, failed }">
    <img
      v-if="!failed"
      ref="image"
      :src="fallback ? artworkUrl(id, shiny) : resizedArtworkUrl(id, size, shiny)"
      :srcset="
        fallback ? undefined : `${resizedArtworkUrl(id, size, shiny)} 1x, ${resizedArtworkUrl(id, size * 2, shiny)} 2x`
      "
      :alt="alt"
      :width="size"
      :height="size"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : undefined"
      decoding="async"
      @load="loaded = true"
      @error="onError"
    />
    <svg v-else viewBox="0 0 100 100" role="img" :aria-label="`${alt} (artwork not available)`">
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="6" />
      <path d="M4 50h32M64 50h32" stroke="currentColor" stroke-width="6" />
      <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" stroke-width="6" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import { artworkUrl, resizedArtworkUrl } from '@/lib/pokedex';

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
// If the image CDN fails, try the original PNG once before showing the placeholder.
const fallback = ref(false);
const onError = () => {
  if (fallback.value) failed.value = true;
  else fallback.value = true;
};
const image = useTemplateRef('image');

// Artwork already in the browser cache shows at once, without the fade (and in page transitions).
onMounted(() => {
  if (image.value?.complete && image.value.naturalWidth) loaded.value = true;
});

watch(
  () => [props.id, props.shiny],
  () => {
    loaded.value = false;
    failed.value = false;
    fallback.value = false;
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
