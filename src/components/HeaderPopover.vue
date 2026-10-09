<template>
  <div class="popover">
    <button
      ref="button"
      type="button"
      class="popover-button"
      :popovertarget="id"
      :aria-expanded="open"
      :aria-label="label"
      :title="label"
    >
      <slot name="button" />
    </button>
    <div :id="id" ref="panel" popover class="popover-panel" @toggle="onToggle">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue';
import { useRoute } from 'vue-router';

defineProps<{ id: string; label?: string }>();

const button = useTemplateRef('button');
const panel = useTemplateRef('panel');
const open = ref(false);

// Native popovers sit in the top layer, centred by default: place it under its button, kept on screen.
const onToggle = (event: Event) => {
  open.value = (event as ToggleEvent).newState === 'open';
  if (!open.value || !button.value || !panel.value) return;
  const anchor = button.value.getBoundingClientRect();
  const width = panel.value.offsetWidth;
  const left = Math.min(Math.max(8, anchor.right - width), window.innerWidth - width - 8);
  panel.value.style.top = `${anchor.bottom + 8}px`;
  panel.value.style.left = `${left}px`;
};

const route = useRoute();
watch(
  () => route.fullPath,
  () => panel.value?.hidePopover?.(),
);

defineExpose({ close: () => panel.value?.hidePopover?.() });
</script>

<style scoped>
.popover-button {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
}

.popover-panel {
  position: fixed;
  inset: auto;
  margin: 0;
  min-width: 12rem;
  padding: 0.4rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  background: var(--panel);
  color: var(--ink);
  box-shadow: 0 12px 32px rgb(0 0 0 / 0.18);
}
</style>
