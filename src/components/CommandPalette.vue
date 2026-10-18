<template>
  <button
    type="button"
    class="palette-button"
    aria-label="Quick find"
    title="Quick find (Ctrl+K)"
    aria-keyshortcuts="Control+K Meta+K"
    aria-haspopup="dialog"
    @click="open"
  >
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M5 5h14v14H5zM9 9h6M9 12h6M9 15h3"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>

  <!-- closedby="any" closes on a backdrop click; the click handler does the same where it is not supported. -->
  <dialog ref="dialog" class="palette" aria-label="Quick find" closedby="any" @click.self="close">
    <label class="field-row">
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2.4" />
        <path d="m16.5 16.5 4.5 4.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
      </svg>
      <span class="visually-hidden">Find a page or Pokémon</span>
      <input
        v-model="query"
        type="search"
        role="combobox"
        aria-controls="palette-list"
        aria-expanded="true"
        aria-autocomplete="list"
        :aria-activedescendant="selected >= 0 ? optionId(entries[selected]) : undefined"
        placeholder="Jump to a page or find a Pokémon"
        autocomplete="off"
        enterkeyhint="go"
        @keydown="onKeydown"
      />
    </label>

    <ul id="palette-list" ref="list" role="listbox" aria-label="Results" @click="close">
      <li v-for="(entry, index) in entries" :key="entry.key" role="presentation">
        <RouterLink
          :id="optionId(entry)"
          :to="entry.to"
          role="option"
          tabindex="-1"
          :aria-selected="index === selected"
          class="option"
          @mousemove="selected = index"
        >
          <img
            v-if="entry.species"
            :src="resizedArtworkUrl(entry.species.id, 80)"
            alt=""
            width="40"
            height="40"
            class="sprite"
          />
          <span v-else-if="entry.type" class="dot" :style="{ background: `var(--${entry.type})` }" />
          <span v-else class="dot" />
          <span class="label" :lang="entry.species ? lang : undefined">{{ entry.label }}</span>
          <span class="hint">{{ entry.hint }}</span>
        </RouterLink>
      </li>
    </ul>

    <p class="keys" aria-hidden="true">
      <kbd>↑</kbd> <kbd>↓</kbd> to move, <kbd>Enter</kbd> to open, <kbd>Esc</kbd> to close
    </p>
  </dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import { paletteEntries, stepIndex, type PaletteEntry } from '@/lib/palette';
import { resizedArtworkUrl } from '@/lib/pokedex';
import { useLanguage } from '@/lib/language';

const { translations, lang } = useLanguage();

const dialog = useTemplateRef('dialog');
const list = useTemplateRef('list');
const query = ref('');
const selected = ref(0);

const entries = computed(() => paletteEntries(query.value, translations.value.pokemon));
const optionId = (entry: PaletteEntry) => `palette-${entry.key}`;

watch(entries, () => (selected.value = entries.value.length ? 0 : -1));

const open = () => {
  query.value = '';
  selected.value = 0;
  dialog.value?.showModal();
};

const close = () => dialog.value?.close();

const select = async (index: number) => {
  selected.value = index;
  await nextTick();
  list.value?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    select(stepIndex(selected.value, event.key === 'ArrowDown' ? 1 : -1, entries.value.length));
  } else if (event.key === 'Enter' && selected.value >= 0) {
    event.preventDefault();
    // The option is a RouterLink, so clicking it navigates in the app and closes the palette.
    list.value?.querySelector<HTMLElement>('[aria-selected="true"]')?.click();
  } else if (event.key === 'Escape') {
    // A search field would only clear its text on the first Escape.
    event.preventDefault();
    close();
  }
};

const onShortcut = (event: KeyboardEvent) => {
  if (event.key.toLowerCase() !== 'k' || !(event.ctrlKey || event.metaKey)) return;
  event.preventDefault();
  if (dialog.value?.open) close();
  else open();
};

// Back and forward also leave the page the palette was opened on.
const route = useRoute();
watch(() => route.fullPath, close);

onMounted(() => window.addEventListener('keydown', onShortcut));
onUnmounted(() => window.removeEventListener('keydown', onShortcut));
</script>

<style scoped>
.palette-button {
  background: none;
  cursor: pointer;
}

.palette {
  width: min(34rem, 100% - 2rem);
  max-height: min(34rem, 100dvh - 4rem);
  margin: 12vh auto auto;
  padding: 0;
  border: 0;
  border-top: 6px solid var(--red);
  border-radius: var(--radius-m);
  background: var(--panel);
  color: var(--ink);
  box-shadow: 0 24px 64px rgb(0 0 0 / 0.35);
}

.palette[open] {
  display: flex;
  flex-direction: column;
}

.palette::backdrop {
  background: rgb(16 21 27 / 0.55);
}

.field-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem;
  border-bottom: 1px solid var(--line);
  color: var(--muted);
}

input {
  flex: 1;
  min-width: 0;
  height: 3.5rem;
  border: 0;
  background: transparent;
  color: var(--ink);
  font-size: 1.0625rem;
}

input:focus-visible {
  outline: none;
}

input::placeholder {
  color: var(--muted);
}

ul {
  flex: 1;
  margin: 0;
  padding: 0.4rem;
  overflow-y: auto;
  list-style: none;
}

.option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 2.75rem;
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-s);
  text-decoration: none;
}

.option[aria-selected='true'] {
  background: color-mix(in srgb, var(--red) 12%, transparent);
  color: light-dark(var(--red-deep), #ff8a9b);
}

.sprite {
  margin: -0.2rem 0;
}

.dot {
  flex: none;
  width: 0.75rem;
  height: 0.75rem;
  margin: 0 0.25rem 0 0.4rem;
  border-radius: 50%;
  background: var(--line);
}

.label {
  flex: 1;
  font-weight: 500;
}

.hint {
  color: var(--muted);
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
}

.keys {
  max-width: none;
  padding: 0.5rem 1rem;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.8125rem;
}

kbd {
  padding: 0 0.35rem;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: var(--paper);
  font-family: inherit;
  font-size: 0.75rem;
}
</style>
