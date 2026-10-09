<template>
  <nav class="pagination-container" aria-label="Pagination">
    <button
      v-for="page in pages"
      :key="page"
      :class="['paginate-buttons', { 'active-page': page === modelValue }]"
      :aria-current="page === modelValue ? 'page' : undefined"
      @click="emit('update:modelValue', page)"
    >
      {{ page }}
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ modelValue: number; totalPages: number }>();
const emit = defineEmits<{ 'update:modelValue': [page: number] }>();

const pages = computed(() => {
  const first = Math.max(1, Math.min(props.modelValue - 1, props.totalPages - 2));
  const last = Math.min(props.totalPages, first + 2);
  return Array.from({ length: last - first + 1 }, (_, i) => first + i);
});
</script>
