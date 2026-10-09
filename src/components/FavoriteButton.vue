<template>
  <button
    type="button"
    class="favorite"
    :aria-pressed="active"
    :aria-label="active ? `Remove ${name} from favorites` : `Add ${name} to favorites`"
    :title="active ? 'Remove from favorites' : 'Add to favorites'"
    @click.prevent.stop="toggle(id)"
  >
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M12 20.3 4.6 13.4a4.9 4.9 0 0 1-.4-6.6l.2-.3a4.6 4.6 0 0 1 7.6.9 4.6 4.6 0 0 1 7.6-.9l.2.3a4.9 4.9 0 0 1-.4 6.6Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
      />
    </svg>
    <span v-if="label">{{ active ? 'Favorite' : 'Add to favorites' }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFavorites } from '@/lib/favorites';

const props = defineProps<{ id: number; name: string; label?: boolean }>();
const { isFavorite, toggle } = useFavorites();
const active = computed(() => isFavorite(props.id));
</script>

<style scoped>
/* On cards it is a bare icon; with a label it takes the global .button look. */
.favorite:not(.button) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.75rem;
  min-height: 2.75rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
}

.favorite:hover {
  color: var(--red);
}

svg path {
  fill: transparent;
  transition: fill 0.15s;
}

.favorite[aria-pressed='true'] {
  color: var(--red);
}

.favorite[aria-pressed='true'] svg path {
  fill: currentColor;
}
</style>
