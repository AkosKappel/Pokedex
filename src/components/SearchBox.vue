<template>
  <form role="search" class="search-box" @submit.prevent="submit">
    <label for="search" class="visually-hidden">Search by name or number</label>
    <input
      id="search"
      ref="input"
      v-model="query"
      type="search"
      list="search-suggestions"
      placeholder="Name or number"
      autocomplete="off"
      enterkeyhint="search"
      aria-keyshortcuts="/"
      @input="onInput"
    />
    <datalist id="search-suggestions">
      <option v-for="species in suggestions" :key="species.id" :value="speciesName(species)">
        {{ formatNumber(species.id) }}
      </option>
    </datalist>
    <button type="submit" aria-label="Search">
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2.4" />
        <path d="m16.5 16.5 4.5 4.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
      </svg>
    </button>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { filterPokedex, findExact, formatNumber } from '@/lib/pokedex';
import { useLanguage } from '@/lib/language';

const { speciesName, translations } = useLanguage();

const route = useRoute();
const router = useRouter();
const input = useTemplateRef('input');
const query = ref('');

// Keep the box in sync with the browse page's query, and clear it elsewhere.
watch(
  () => route.query.q,
  q => (query.value = route.name === 'browse' && typeof q === 'string' ? q : ''),
  { immediate: true },
);

const suggestions = computed(() =>
  query.value.trim().length < 2
    ? []
    : filterPokedex({ query: query.value, localNames: translations.value.pokemon }).slice(0, 8),
);

const openSpecies = (id: number) => {
  query.value = '';
  input.value?.blur();
  router.push({ name: 'pokemon', params: { id } });
};

const submit = () => {
  const text = query.value.trim();
  const exact = findExact(text, translations.value.pokemon);
  if (exact) return openSpecies(exact.id);
  router.push({ name: 'browse', query: text ? { q: text } : {} });
};

// Picking a datalist suggestion replaces the whole value: open that Pokémon straight away.
const onInput = (event: Event) => {
  const type = (event as InputEvent).inputType;
  if (type && type !== 'insertReplacementText') return;
  const exact = findExact(query.value, translations.value.pokemon);
  if (exact && speciesName(exact) === query.value) openSpecies(exact.id);
};

defineExpose({ focus: () => input.value?.focus() });
</script>

<style scoped>
.search-box {
  display: flex;
  border-radius: 999px;
  background: #fff;
  color: #1b2a3a;
  box-shadow: inset 0 2px 0 rgb(0 0 0 / 0.12);
}

input {
  flex: 1;
  min-width: 0;
  height: 2.75rem;
  padding: 0 0 0 1.1rem;
  border: 0;
  border-radius: 999px 0 0 999px;
  background: transparent;
  color: inherit;
}

input::placeholder {
  color: #5f6b78;
}

input:focus-visible {
  outline: none;
}

.search-box:focus-within {
  outline: 3px solid #fff;
  outline-offset: 2px;
}

button {
  display: grid;
  place-items: center;
  width: 2.9rem;
  border: 0;
  border-radius: 0 999px 999px 0;
  background: transparent;
  color: var(--red);
  cursor: pointer;
}
</style>
