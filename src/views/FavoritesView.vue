<template>
  <div>
    <header class="page-header">
      <h1>{{ shared ? 'Shared favorites' : 'Favorites' }}</h1>
      <p class="lead">
        <template v-if="shared">
          {{ countLabel(shared.length) }} someone shared with you.
          <RouterLink :to="{ name: 'favorites' }">Show my favorites</RouterLink>
        </template>
        <template v-else>{{ countLabel(favorites.length) }}, saved in this browser only.</template>
      </p>
    </header>

    <template v-if="shared">
      <div class="actions">
        <button type="button" class="button primary" @click="addShared">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" class="icon">
            <path
              d="M12 20.3 4.6 13.4a4.9 4.9 0 0 1-.4-6.6l.2-.3a4.6 4.6 0 0 1 7.6.9 4.6 4.6 0 0 1 7.6-.9l.2.3a4.9 4.9 0 0 1-.4 6.6Z"
            />
          </svg>
          Add all to my favorites
        </button>
        <span class="notice" role="status">{{ notice }}</span>
      </div>
      <ul v-if="shared.length" class="grid">
        <PokemonCard v-for="species in shared" :key="species.id" :species="species" />
      </ul>
      <StatusMessage v-else title="This link has no Pokémon"
        >The list may have been cut off when it was copied.</StatusMessage
      >
    </template>

    <template v-else>
      <section v-if="favorites.length" class="filters" aria-label="Filters">
        <FilterSearch
          :model-value="query"
          label="Name"
          placeholder="Search favorites"
          @update:model-value="update({ q: $event })"
        />
        <label>
          Type
          <select
            class="field"
            :value="type ?? ''"
            @change="update({ type: ($event.target as HTMLSelectElement).value })"
          >
            <option value="">All types</option>
            <option v-for="option in TYPES" :key="option" :value="option">{{ titleCase(option) }}</option>
          </select>
        </label>
        <label>
          Sort by
          <select class="field" :value="sort" @change="update({ sort: ($event.target as HTMLSelectElement).value })">
            <option v-for="(label, value) in FAVORITE_SORTS" :key="value" :value="value">{{ label }}</option>
          </select>
        </label>
      </section>

      <div class="actions">
        <template v-if="favorites.length">
          <button type="button" class="button" @click="share">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" class="icon">
              <path
                d="M9 15l6-6M10.5 6.5l1.8-1.8a4.2 4.2 0 0 1 6 6l-1.8 1.8M13.5 17.5l-1.8 1.8a4.2 4.2 0 0 1-6-6l1.8-1.8"
              />
            </svg>
            Share list
          </button>
          <button type="button" class="button" @click="download">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" class="icon">
              <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
            </svg>
            Export
          </button>
        </template>
        <button type="button" class="button" @click="fileInput?.click()">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" class="icon">
            <path d="M12 15V4M7 9l5-5 5 5M5 20h14" />
          </svg>
          Import
        </button>
        <button v-if="favorites.length" type="button" class="button" @click="removeAll">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" class="icon">
            <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
          </svg>
          Remove all
        </button>
        <input
          ref="fileInput"
          type="file"
          accept="application/json,.json"
          class="visually-hidden"
          tabindex="-1"
          aria-hidden="true"
          @change="importFile"
        />
        <span class="notice" role="status">{{ notice }}</span>
      </div>

      <template v-if="favorites.length">
        <h2 class="visually-hidden">Your favorites</h2>
        <ul v-if="visible.length" class="grid">
          <PokemonCard v-for="species in visible" :key="species.id" :species="species" />
        </ul>
        <StatusMessage v-else title="No favorites match">
          Try another name or type.
          <RouterLink :to="{ name: 'favorites' }">Show all favorites</RouterLink>
        </StatusMessage>
      </template>
      <StatusMessage v-else title="No favorites yet">
        Tap the heart on any Pokémon to keep it here, or import a list you exported before.
        <RouterLink :to="{ name: 'browse' }">Browse Pokémon</RouterLink>
      </StatusMessage>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import PokemonCard from '@/components/PokemonCard.vue';
import StatusMessage from '@/components/StatusMessage.vue';
import FilterSearch from '@/components/FilterSearch.vue';
import { exportFavorites, parseFavorites, useFavorites } from '@/lib/favorites';
import { findById, type Species } from '@/lib/pokedex';
import { matchesQuery } from '@/lib/search';
import { isTypeName, TYPES, type TypeName } from '@/lib/types';
import { titleCase } from '@/lib/format';
import { useLanguage } from '@/lib/language';
import { useListQuery } from '@/lib/useListQuery';

const FAVORITE_SORTS = { number: 'Number', name: 'Name', added: 'Recently added' } as const;
type FavoriteSort = keyof typeof FAVORITE_SORTS;

const route = useRoute();
const { addedOrder, addMany, clear } = useFavorites();
const { speciesName, translations } = useLanguage();
const { param, update } = useListQuery(ref(1));

const toSpecies = (ids: number[]) => ids.map(findById).filter((species): species is Species => Boolean(species));
const countLabel = (count: number) => (count === 1 ? '1 Pokémon' : `${count} Pokémon`);

// A shared list arrives as /favorites?ids=25,133 and is shown without touching your own favorites.
const shared = computed(() => (typeof route.query.ids === 'string' ? toSpecies(parseIds(route.query.ids)) : undefined));
const parseIds = (text: string) => [
  ...new Set(
    text
      .split(',')
      .map(Number)
      .filter(id => findById(id)),
  ),
];

const favorites = computed(() => toSpecies(addedOrder.value));

const query = computed(() => param('q'));
const type = computed(() => (isTypeName(param('type')) ? (param('type') as TypeName) : undefined));
const sort = computed<FavoriteSort>(() =>
  param('sort') in FAVORITE_SORTS ? (param('sort') as FavoriteSort) : 'number',
);

const visible = computed(() => {
  const matches = favorites.value.filter(
    species =>
      matchesQuery(query.value, species.name, translations.value.pokemon[species.id]) &&
      (!type.value || species.types.includes(type.value)),
  );
  if (sort.value === 'added') return matches.reverse();
  if (sort.value === 'name') return matches.sort((a, b) => speciesName(a).localeCompare(speciesName(b)));
  return matches.sort((a, b) => a.id - b.id);
});

const notice = ref('');
watch(
  () => route.fullPath,
  () => (notice.value = ''),
);

const addShared = () => {
  const added = addMany((shared.value ?? []).map(species => species.id));
  notice.value = added ? `Added ${countLabel(added)} to your favorites.` : 'All of them are already in your favorites.';
};

const share = async () => {
  const url = new URL(location.href);
  url.search = `?ids=${favorites.value.map(species => species.id).join(',')}`;
  try {
    await navigator.clipboard.writeText(url.href);
    notice.value = 'Link copied. Anyone with it sees this list and can add it to theirs.';
  } catch {
    notice.value = `Copy this link to share the list: ${url.href}`;
  }
};

const download = () => {
  const file = new Blob([exportFavorites(addedOrder.value)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = 'pokedex-favorites.json';
  link.click();
  URL.revokeObjectURL(link.href);
  notice.value = 'Saved pokedex-favorites.json.';
};

const fileInput = useTemplateRef('fileInput');
const importFile = async () => {
  const file = fileInput.value?.files?.[0];
  if (!file) return;
  try {
    const ids = parseFavorites(await file.text(), id => Boolean(findById(id)));
    const added = addMany(ids);
    notice.value = `Imported ${countLabel(ids.length)}: ${added} new, ${ids.length - added} already in your favorites.`;
  } catch (error) {
    notice.value = `Could not import ${file.name}. ${(error as Error).message}`;
  } finally {
    // Lets the same file be picked again.
    fileInput.value!.value = '';
  }
};

const removeAll = () => {
  if (!window.confirm(`Remove all ${countLabel(favorites.value.length)} from your favorites?`)) return;
  clear();
  notice.value = 'All favorites removed.';
};
</script>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1.25rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  background: var(--panel);
}

.filters label {
  display: grid;
  gap: 0.3rem;
  font-weight: 500;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.notice {
  color: var(--muted);
}

.icon {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
