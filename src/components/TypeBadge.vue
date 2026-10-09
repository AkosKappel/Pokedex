<template>
  <component
    :is="to ? RouterLink : 'span'"
    :to="to"
    class="type-badge"
    :class="{ compact }"
    :style="{ '--type': `var(--${type})` }"
  >
    {{ titleCase(type) }}
  </component>
</template>

<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router';
import type { TypeName } from '@/lib/types';
import { titleCase } from '@/lib/format';

defineProps<{ type: TypeName; to?: RouteLocationRaw; compact?: boolean }>();
</script>

<style scoped>
.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.15rem 0.65rem 0.15rem 0.45rem;
  border: 1px solid color-mix(in oklab, var(--type) 60%, var(--panel));
  border-radius: 999px;
  background: color-mix(in oklab, var(--type) 18%, var(--panel));
  color: var(--ink);
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.4;
  text-decoration: none;
  white-space: nowrap;
}

.type-badge::before {
  content: '';
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 50%;
  background: var(--type);
}

.compact {
  gap: 0.3rem;
  padding-inline: 0.35rem 0.5rem;
  font-size: 0.8rem;
}

.compact::before {
  width: 0.55rem;
  height: 0.55rem;
}

a.type-badge:hover {
  background: color-mix(in oklab, var(--type) 32%, var(--panel));
}
</style>
