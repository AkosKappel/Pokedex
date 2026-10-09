<template>
  <label class="filter-search">
    {{ label }}
    <input
      class="field"
      type="search"
      :value="modelValue"
      :placeholder="placeholder"
      autocomplete="off"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </label>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string; label: string; placeholder?: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<style scoped>
.filter-search {
  display: grid;
  gap: 0.3rem;
  font-weight: 500;
}

input {
  min-width: min(100%, 18rem);
}
</style>
