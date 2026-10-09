<template>
  <article v-if="move" :style="{ '--type': `var(--${move.type})` }">
    <p class="crumb"><RouterLink :to="{ name: 'moves' }">Moves</RouterLink></p>
    <header class="head">
      <h1 :lang="lang">{{ moveName(move) }}</h1>
      <p v-if="lang" class="english">{{ move.name }}</p>
      <div class="badges">
        <TypeBadge :type="move.type" :to="{ name: 'moves', query: { type: move.type } }" />
        <CategoryBadge :category="move.category" />
      </div>
      <p class="description" :lang="details && lang ? lang : undefined">{{ description }}</p>
    </header>

    <dl class="facts">
      <div>
        <dt>Power</dt>
        <dd>{{ move.power ?? '–' }}</dd>
      </div>
      <div>
        <dt>Accuracy</dt>
        <dd>{{ move.accuracy ? `${move.accuracy}%` : '–' }}</dd>
      </div>
      <div>
        <dt>PP</dt>
        <dd>{{ move.pp ?? '–' }}</dd>
      </div>
      <div>
        <dt>Introduced in</dt>
        <dd>{{ regionOf(move.generation) }}</dd>
      </div>
    </dl>

    <section aria-labelledby="learners-heading" class="learners">
      <h2 id="learners-heading">
        Pokémon that learn {{ moveName(move) }}<span v-if="learners" class="count"> ({{ learners.length }})</span>
      </h2>
      <StatusMessage v-if="error" title="The Pokémon list did not load" :retry="load">
        PokéAPI did not answer. Check your connection and try again.
      </StatusMessage>
      <p v-else-if="!learners" class="loading">Loading…</p>
      <template v-else>
        <ul class="grid">
          <PokemonCard v-for="species in visible" :key="species.id" :species="species" />
        </ul>
        <PaginationNav :page="page" :total="totalPages" />
      </template>
    </section>
  </article>
  <StatusMessage v-else-if="loadFailed" title="Moves did not load" :retry="loadIndex">
    Check your connection and try again.
  </StatusMessage>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue';
import TypeBadge from '@/components/TypeBadge.vue';
import CategoryBadge from '@/components/CategoryBadge.vue';
import PokemonCard from '@/components/PokemonCard.vue';
import PaginationNav from '@/components/PaginationNav.vue';
import StatusMessage from '@/components/StatusMessage.vue';
import { getMove, type MoveDetails } from '@/lib/api';
import { loadMoves, type Move } from '@/lib/moves';
import { findById, pageCount, paginate, regionOf, type Species } from '@/lib/pokedex';
import { cleanFlavorText, idFromUrl } from '@/lib/format';
import { pickText, useLanguage } from '@/lib/language';
import { useListQuery } from '@/lib/useListQuery';

const props = defineProps<{ id: number }>();
const { language, lang, moveName } = useLanguage();

const move = shallowRef<Move>();
const loadFailed = ref(false);
const loadIndex = async () => {
  loadFailed.value = false;
  try {
    move.value = (await loadMoves()).find(m => m.id === props.id);
  } catch {
    loadFailed.value = true;
  }
};

const details = shallowRef<MoveDetails>();
const error = ref(false);
const load = async () => {
  const id = props.id;
  error.value = false;
  try {
    const loaded = await getMove(id);
    if (id === props.id) details.value = loaded;
  } catch {
    if (id === props.id) error.value = true;
  }
};

watch(
  () => props.id,
  () => {
    details.value = undefined;
    loadIndex();
    load();
  },
  { immediate: true },
);

const description = computed(() => {
  const text = details.value && pickText(details.value.flavor_text_entries, language.value);
  return text ? cleanFlavorText(text.flavor_text) : move.value?.description;
});

// Forms (Alolan, Mega, ...) have their own entries; list each species once.
const learners = computed(() => {
  if (!details.value) return undefined;
  const ids = new Set(details.value.learned_by_pokemon.map(p => idFromUrl(p.url)));
  return [...ids]
    .map(findById)
    .filter((s): s is Species => Boolean(s))
    .sort((a, b) => a.id - b.id);
});

const totalPages = computed(() => pageCount(learners.value?.length ?? 0));
const { page } = useListQuery(totalPages);
const visible = computed(() => paginate(learners.value ?? [], page.value));
</script>

<style scoped>
.crumb {
  margin-bottom: 1rem;
  color: var(--muted);
}

.head {
  display: grid;
  gap: 0.6rem;
  padding: 1.75rem;
  border-radius: var(--radius-l);
  background: color-mix(in oklab, var(--type) 20%, var(--paper));
}

.english {
  margin-top: -0.4rem;
  color: var(--muted);
}

.badges {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.description {
  font-size: 1.125rem;
}

.facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  gap: 1rem;
  margin: 1.5rem 0 0;
}

.facts div {
  padding: 1rem 1.25rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  background: var(--panel);
}

.facts dt {
  color: var(--muted);
  font-size: 0.9rem;
}

.facts dd {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.learners {
  display: grid;
  gap: 1rem;
  margin-top: 2.5rem;
}

.count,
.loading {
  color: var(--muted);
  font-weight: 400;
}
</style>
