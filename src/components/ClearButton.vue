<template>
  <button type="button" class="clear-button" :aria-label="label" :title="label">
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
    </svg>
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'Clear search' });
</script>

<style scoped>
.clear-button {
  display: grid;
  place-items: center;
  flex: none;
  width: 1.9rem;
  height: 1.9rem;
  border: 0;
  border-radius: 50%;
  background: color-mix(in oklab, currentColor 12%, transparent);
  color: inherit;
  cursor: pointer;
  opacity: 0.75;
}

.clear-button:hover {
  opacity: 1;
}
</style>
