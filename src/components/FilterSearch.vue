<template>
  <div class="filter-search">
    <label :for="id">{{ label }}</label>
    <span class="control">
      <input
        :id="id"
        ref="input"
        class="field"
        type="search"
        :value="modelValue"
        :placeholder="placeholder"
        autocomplete="off"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <ClearButton v-if="modelValue" class="clear" @click="clear" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { useId, useTemplateRef } from 'vue';
import ClearButton from './ClearButton.vue';

defineProps<{ modelValue: string; label: string; placeholder?: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
const id = useId();
const input = useTemplateRef('input');

const clear = () => {
  emit('update:modelValue', '');
  input.value?.focus();
};
</script>

<style scoped>
.filter-search {
  display: grid;
  gap: 0.3rem;
  font-weight: 500;
}

.control {
  position: relative;
  display: flex;
  align-items: center;
}

input {
  width: 100%;
  min-width: min(100%, 18rem);
  padding-right: 2.75rem;
}

.clear {
  position: absolute;
  right: 0.45rem;
}
</style>
