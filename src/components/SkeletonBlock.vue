<template>
  <span class="skeleton" aria-hidden="true" :style="{ width, height, borderRadius: radius }"></span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ width?: string; height?: string; radius?: string }>(), {
  width: '100%',
  height: '1rem',
  radius: 'var(--radius-s)',
});
</script>

<style scoped>
.skeleton {
  display: block;
  background: linear-gradient(
      90deg,
      transparent 0%,
      color-mix(in oklab, var(--panel) 70%, transparent) 50%,
      transparent 100%
    )
    var(--line);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  from {
    background-position: 150% 0;
  }

  to {
    background-position: -50% 0;
  }
}
</style>
