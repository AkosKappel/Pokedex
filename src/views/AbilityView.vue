<template>
  <article v-if="ability">
    <p class="crumb"><RouterLink :to="{ name: 'abilities' }">Abilities</RouterLink></p>
    <header class="head">
      <h1 :lang="lang">{{ abilityName(ability) }}</h1>
      <p v-if="lang" class="english">{{ ability.name }}</p>
      <p class="description" :lang="details && lang ? lang : undefined">{{ description }}</p>
      <p class="meta">Introduced in {{ regionOf(ability.generation) }}</p>
    </header>

    <section v-if="effect" aria-labelledby="effect-heading" class="block">
      <h2 id="effect-heading">In battle</h2>
      <p>{{ effect }}</p>
    </section>

    <StatusMessage v-if="error" title="The Pokémon list did not load" :retry="load">
      PokéAPI did not answer. Check your connection and try again.
    </StatusMessage>
    <div v-else-if="!details" class="block" aria-busy="true">
      <p class="visually-hidden">Loading…</p>
      <SkeletonCards :count="6" />
    </div>
    <template v-else>
      <section v-for="group in groups" :key="group.title" :aria-labelledby="group.id" class="block">
        <h2 :id="group.id">
          {{ group.title }} <span class="count">({{ group.members.length }})</span>
        </h2>
        <ul v-if="group.members.length" class="grid">
          <PokemonCard v-for="species in group.members" :key="species.id" :species="species" />
        </ul>
        <p v-else class="loading">None.</p>
      </section>
    </template>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue';
import PokemonCard from '@/components/PokemonCard.vue';
import StatusMessage from '@/components/StatusMessage.vue';
import SkeletonCards from '@/components/SkeletonCards.vue';
import { getAbility, type AbilityDetails } from '@/lib/api';
import { loadAbilities, type Ability } from '@/lib/abilities';
import { findById, regionOf, type Species } from '@/lib/pokedex';
import { cleanFlavorText, idFromUrl } from '@/lib/format';
import { pickText, useLanguage } from '@/lib/language';

const props = defineProps<{ id: number }>();
const { language, lang, abilityName } = useLanguage();

const ability = shallowRef<Ability>();
const details = shallowRef<AbilityDetails>();
const error = ref(false);

const load = async () => {
  const id = props.id;
  error.value = false;
  try {
    const loaded = await getAbility(id);
    if (id === props.id) details.value = loaded;
  } catch {
    if (id === props.id) error.value = true;
  }
};

watch(
  () => props.id,
  async id => {
    details.value = undefined;
    load();
    ability.value = (await loadAbilities()).find(a => a.id === id);
  },
  { immediate: true },
);

const description = computed(() => {
  const text = details.value && pickText(details.value.flavor_text_entries, language.value);
  return text ? cleanFlavorText(text.flavor_text) : ability.value?.description;
});

// The long effect text exists in English only.
const effect = computed(() => {
  const entry = details.value?.effect_entries.find(e => e.language.name === 'en');
  return entry && cleanFlavorText(entry.effect);
});

const speciesFor = (hidden: boolean) => {
  const ids = new Set(
    (details.value?.pokemon ?? []).filter(p => p.is_hidden === hidden).map(p => idFromUrl(p.pokemon.url)),
  );
  return [...ids].map(findById).filter((s): s is Species => Boolean(s));
};

const groups = computed(() => [
  { id: 'regular-heading', title: 'Pokémon with this ability', members: speciesFor(false) },
  { id: 'hidden-heading', title: 'As a hidden ability', members: speciesFor(true) },
]);
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
  border: 1px solid var(--line);
  border-radius: var(--radius-l);
  background: var(--panel);
}

.english,
.meta {
  color: var(--muted);
}

.english {
  margin-top: -0.4rem;
}

.description {
  font-size: 1.125rem;
}

.block {
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
