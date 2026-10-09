<template>
  <article class="pokemon" :style="{ '--type': `var(--${species.types[0]})` }">
    <nav class="neighbours" aria-label="Previous and next Pokémon">
      <RouterLink v-if="previous" :to="{ name: 'pokemon', params: { id: previous.id } }" rel="prev" class="neighbour">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        <span class="number">{{ formatNumber(previous.id) }}</span>
        <span :lang="lang">{{ speciesName(previous) }}</span>
      </RouterLink>
      <RouterLink v-if="next" :to="{ name: 'pokemon', params: { id: next.id } }" rel="next" class="neighbour next">
        <span class="number">{{ formatNumber(next.id) }}</span> <span :lang="lang">{{ speciesName(next) }}</span>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
      </RouterLink>
    </nav>

    <section class="hero">
      <div class="screen">
        <span class="big-number" :data-number="String(id).padStart(4, '0')"></span>
        <PokemonArtwork
          :id="id"
          :alt="shiny ? `Shiny ${speciesName(species)}` : speciesName(species)"
          :shiny="shiny"
          eager
          class="hero-art"
          :style="{ viewTransitionName: `pokemon-${id}` }"
        />
      </div>

      <div class="summary">
        <p class="number">{{ formatNumber(id) }}</p>
        <h1 :lang="lang">{{ speciesName(species) }}</h1>
        <p v-if="lang" class="english-name">{{ species.name }}</p>
        <p v-if="genus" class="genus" :lang="lang">{{ genus }}</p>
        <div class="types">
          <TypeBadge v-for="type in species.types" :key="type" :type="type" :to="{ name: 'browse', query: { type } }" />
        </div>
        <p v-if="flavorText" class="flavor" :lang="lang">{{ flavorText }}</p>

        <div class="actions">
          <FavoriteButton :id="id" :name="speciesName(species)" label class="button" />
          <button type="button" class="button" :aria-pressed="shiny" @click="shiny = !shiny">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M12 2 14 10l8 2-8 2-2 8-2-8-8-2 8-2Z" fill="currentColor" />
            </svg>
            Shiny
          </button>
          <button v-if="pokemon?.cries.latest" type="button" class="button" @click="playCry">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9Z" fill="currentColor" />
              <path
                d="M16 8.5a5 5 0 0 1 0 7"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            Play cry
          </button>
          <button type="button" class="button" @click="share">Share</button>
          <RouterLink :to="{ name: 'compare', query: { ids: String(id) } }" class="button">Compare</RouterLink>
          <button type="button" class="button" @click="addToTeamAndNotify">Add to team</button>
        </div>
        <p class="notice" role="status">{{ notice }}</p>

        <dl v-if="pokemon" class="facts">
          <div>
            <dt>Height</dt>
            <dd>{{ formatHeight(pokemon.height) }}</dd>
          </div>
          <div>
            <dt>Weight</dt>
            <dd>{{ formatWeight(pokemon.weight) }}</dd>
          </div>
          <div>
            <dt>Region</dt>
            <dd>
              <RouterLink :to="{ name: 'browse', query: { gen: String(species.generation) } }">
                {{ regionOf(species.generation) }}
              </RouterLink>
            </dd>
          </div>
          <div>
            <dt>Abilities</dt>
            <dd>
              <span v-for="(entry, index) in pokemon.abilities" :key="entry.ability.name">
                <RouterLink :to="{ name: 'ability', params: { id: idFromUrl(entry.ability.url) } }" :lang="lang">{{
                  abilityName({ id: idFromUrl(entry.ability.url), name: titleCase(entry.ability.name) })
                }}</RouterLink
                ><template v-if="entry.is_hidden"> (hidden)</template
                ><template v-if="index < pokemon.abilities.length - 1">, </template>
              </span>
            </dd>
          </div>
          <div v-if="species.legendary || species.mythical">
            <dt>Status</dt>
            <dd>{{ species.mythical ? 'Mythical' : 'Legendary' }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <StatusMessage v-if="error" title="The details did not load" :retry="load">
      PokéAPI did not answer. Check your connection and try again.
    </StatusMessage>

    <div v-else-if="pokemon" class="sections">
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading">Base stats</h2>
        <StatBars :stats="pokemon.stats" :type="species.types[0]" />
      </section>

      <section aria-labelledby="matchups-heading">
        <h2 id="matchups-heading">Type matchups</h2>
        <p class="hint">Damage taken from attacks of each type.</p>
        <TypeMatchups :types="species.types" />
      </section>

      <section v-if="stages" aria-labelledby="evolution-heading" class="wide">
        <h2 id="evolution-heading">Evolution</h2>
        <EvolutionChain :stages="stages" :current-id="id" :name="speciesName(species)" />
      </section>

      <section v-if="pokemon.moves.length" aria-labelledby="moves-heading" class="wide">
        <h2 id="moves-heading">Moves</h2>
        <PokemonMoves :moves="pokemon.moves" />
      </section>

      <section v-if="forms.length" aria-labelledby="forms-heading" class="wide">
        <h2 id="forms-heading">Other forms</h2>
        <ul class="forms">
          <li v-for="form in forms" :key="form.id">
            <PokemonArtwork :id="form.id" :alt="''" :size="160" class="form-art" />
            <span>{{ form.name }}</span>
          </li>
        </ul>
      </section>
    </div>

    <div v-else class="sections" aria-busy="true">
      <p class="loading">Loading details…</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import PokemonArtwork from '@/components/PokemonArtwork.vue';
import TypeBadge from '@/components/TypeBadge.vue';
import FavoriteButton from '@/components/FavoriteButton.vue';
import StatBars from '@/components/StatBars.vue';
import TypeMatchups from '@/components/TypeMatchups.vue';
import EvolutionChain from '@/components/EvolutionChain.vue';
import StatusMessage from '@/components/StatusMessage.vue';
import PokemonMoves from '@/components/PokemonMoves.vue';
import { getEvolutionChain, getPokemon, getSpecies, type Pokemon, type PokemonSpecies } from '@/lib/api';
import { evolutionStages, type Evolution } from '@/lib/evolution';
import { cleanFlavorText, formatHeight, formatWeight, idFromUrl, titleCase } from '@/lib/format';
import { findById, formatNumber, regionOf, type Species } from '@/lib/pokedex';
import { pickText, useLanguage } from '@/lib/language';
import { addToTeam } from '@/lib/teamStore';
import { TEAM_SIZE } from '@/lib/team';

const props = defineProps<{ id: number }>();
const router = useRouter();
const { language, lang, speciesName, abilityName } = useLanguage();

// The router only enters this page for numbers in the index.
const species = computed(() => findById(props.id) as Species);
const previous = computed(() => findById(props.id - 1));
const next = computed(() => findById(props.id + 1));

const pokemon = shallowRef<Pokemon>();
const details = shallowRef<PokemonSpecies>();
const stages = shallowRef<Evolution[][]>();
const error = ref(false);
const shiny = ref(false);
const notice = ref('');

const load = async () => {
  const id = props.id;
  error.value = false;
  try {
    const [loadedPokemon, loadedSpecies] = await Promise.all([getPokemon(id), getSpecies(id)]);
    const chain = loadedSpecies.evolution_chain && (await getEvolutionChain(loadedSpecies.evolution_chain.url));
    if (id !== props.id) return;
    pokemon.value = loadedPokemon;
    details.value = loadedSpecies;
    stages.value = chain ? evolutionStages(chain.chain) : [];
  } catch {
    if (id === props.id) error.value = true;
  }
};

watch(
  () => props.id,
  () => {
    pokemon.value = details.value = stages.value = undefined;
    shiny.value = false;
    notice.value = '';
    load();
  },
  { immediate: true },
);

const genus = computed(() => details.value && pickText(details.value.genera, language.value)?.genus);
const flavorText = computed(() => {
  const entry = details.value && pickText(details.value.flavor_text_entries, language.value);
  return entry ? cleanFlavorText(entry.flavor_text) : '';
});

const addToTeamAndNotify = () => {
  notice.value = addToTeam(props.id, TEAM_SIZE)
    ? `${speciesName(species.value)} joined your team.`
    : 'Your team already has six Pokémon. Remove one in the team builder first.';
};

const forms = computed(() =>
  (details.value?.varieties ?? [])
    .filter(variety => !variety.is_default)
    .slice(0, 12)
    .map(variety => ({
      id: idFromUrl(variety.pokemon.url),
      name: titleCase(variety.pokemon.name),
    })),
);

const playCry = () => {
  const url = pokemon.value?.cries.latest;
  if (!url) return;
  new Audio(url).play().catch(() => (notice.value = 'This browser cannot play the cry (OGG audio).'));
};

const share = async () => {
  const data = { title: `${speciesName(species.value)} · Pokédex`, url: location.href };
  try {
    if (navigator.share) return await navigator.share(data);
    await navigator.clipboard.writeText(data.url);
    notice.value = 'Link copied.';
  } catch (shareError) {
    if ((shareError as DOMException).name !== 'AbortError') notice.value = 'Could not share this page.';
  }
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if ((event.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return;
  const target = event.key === 'ArrowLeft' ? previous.value : event.key === 'ArrowRight' ? next.value : undefined;
  if (target) router.push({ name: 'pokemon', params: { id: target.id } });
};

onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => window.removeEventListener('keydown', onKeydown));
</script>

<style scoped>
.neighbours {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.neighbour {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 2.75rem;
  color: var(--muted);
  text-decoration: none;
}

.neighbour:hover {
  color: var(--ink);
}

.neighbour.next {
  margin-left: auto;
}

.neighbour svg path {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 2.5rem;
  align-items: start;
}

.screen {
  position: relative;
  overflow: hidden;
  padding: 3rem 2rem 2rem;
  border: 6px solid var(--panel);
  border-radius: var(--radius-l);
  background: color-mix(in oklab, var(--type) 26%, var(--paper));
  box-shadow: 0 0 0 1px var(--line);
}

/* Generated content keeps the decorative number out of the accessibility tree and contrast checks. */
.big-number::before {
  content: attr(data-number);
  position: absolute;
  top: -0.12em;
  left: 0.05em;
  color: color-mix(in oklab, var(--type) 45%, var(--paper));
  font-size: clamp(6rem, 17vw, 13rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
  user-select: none;
}

.hero-art {
  position: relative;
}

.summary {
  display: grid;
  gap: 0.75rem;
}

.summary > .number {
  color: var(--muted);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.english-name {
  margin-top: -0.4rem;
  color: var(--muted);
}

.genus {
  margin-top: -0.4rem;
  color: var(--muted);
  font-size: 1.125rem;
}

.types {
  display: flex;
  gap: 0.5rem;
}

.flavor {
  font-size: 1.125rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.actions .button {
  padding: 0 0.9rem;
}

.actions .button[aria-pressed='true'] {
  border-color: var(--ink);
  background: var(--ink);
  color: var(--paper);
}

.notice {
  min-height: 1.5em;
  color: var(--muted);
  font-size: 0.9rem;
}

.facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem 2rem;
  margin: 0;
  padding-top: 1.25rem;
  border-top: 1px solid var(--line);
}

.facts dt {
  color: var(--muted);
  font-size: 0.9rem;
}

.facts dd {
  margin: 0;
  font-weight: 500;
}

.sections {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
  margin-top: 3rem;
}

.sections section {
  display: grid;
  align-content: start;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  background: var(--panel);
}

.sections .wide {
  grid-column: 1 / -1;
}

.hint,
.loading {
  color: var(--muted);
}

.hint {
  margin-top: -0.6rem;
}

.forms {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.forms li {
  display: grid;
  justify-items: center;
  gap: 0.25rem;
  text-align: center;
  font-size: 0.9rem;
}

.form-art {
  width: 100%;
}

@media (max-width: 800px) {
  .sections {
    grid-template-columns: 1fr;
  }

  .hero {
    gap: 1.5rem;
  }
}

@media (max-width: 640px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .screen {
    justify-self: center;
    width: min(100%, 26rem);
  }

  .neighbour .number {
    display: none;
  }
}
</style>
