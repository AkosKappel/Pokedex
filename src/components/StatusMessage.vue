<template>
  <div class="status" :role="retry ? 'alert' : undefined">
    <h2>{{ title }}</h2>
    <p><slot /></p>
    <button v-if="retry" type="button" class="button primary" @click="retry">Try again</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; retry?: () => void }>();
</script>

<style scoped>
.status {
  display: grid;
  justify-items: start;
  gap: 0.75rem;
  padding: 2rem;
  border: 1px dashed var(--line);
  border-radius: var(--radius-m);
}

p {
  color: var(--muted);
}
</style>
