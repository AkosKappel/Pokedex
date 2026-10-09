<template>
  <div>
    <header class="page-header">
      <h1>Team builder</h1>
      <p class="lead">
        Pick up to six Pokémon and see which attack types your team handles well, and which it does not.
      </p>
    </header>

    <div class="layout">
      <section aria-labelledby="members-heading" class="members">
        <h2 id="members-heading" class="visually-hidden">Members</h2>
        <ol class="slots">
          <li v-for="(member, index) in slots" :key="index" class="slot">
            <template v-if="member">
              <RouterLink
                :to="{ name: 'pokemon', params: { id: member.id } }"
                class="member"
                :style="{ '--type': `var(--${member.types[0]})` }"
              >
                <PokemonArtwork :id="member.id" alt="" :size="120" class="art" />
                <span class="name" :lang="lang">{{ speciesName(member) }}</span>
              </RouterLink>
              <span class="types">
                <TypeBadge v-for="type in member.types" :key="type" :type="type" compact />
              </span>
              <button type="button" class="remove" @click="remove(index)">
                Remove<span class="visually-hidden"> {{ speciesName(member) }}</span>
              </button>
            </template>
            <span v-else class="empty" aria-hidden="true">{{ index + 1 }}</span>
          </li>
        </ol>

        <form v-if="team.length < TEAM_SIZE" class="add" @submit.prevent="add">
          <label for="team-add">Add a Pokémon</label>
          <div class="add-row">
            <input
              id="team-add"
              v-model="query"
              class="field"
              type="text"
              list="team-suggestions"
              placeholder="Name or number"
              autocomplete="off"
              :aria-invalid="invalid"
              aria-describedby="team-error"
            />
            <datalist id="team-suggestions">
              <option v-for="species in suggestions" :key="species.id" :value="speciesName(species)" />
            </datalist>
            <button type="submit" class="button primary">Add</button>
          </div>
          <p id="team-error" class="error" role="status">
            <template v-if="invalid">No Pokémon is called “{{ query }}”. Pick one from the suggestions.</template>
          </p>
        </form>

        <div v-if="team.length" class="team-actions">
          <button type="button" class="button" @click="share">Share team</button>
          <button type="button" class="button" @click="clear">Clear team</button>
          <span class="notice" role="status">{{ notice }}</span>
        </div>
      </section>

      <section v-if="team.length" aria-labelledby="analysis-heading" class="analysis">
        <h2 id="analysis-heading">Analysis</h2>

        <div class="block">
          <h3>Shared weaknesses</h3>
          <p v-if="!weaknesses.length" class="muted">No attack type hits more than one member hard. Nicely balanced.</p>
          <ul v-else class="chips">
            <li v-for="row in weaknesses" :key="row.type">
              <TypeBadge :type="row.type" /> <span class="muted">{{ row.weak }} weak, {{ row.resist }} resist</span>
            </li>
          </ul>
        </div>

        <div class="block">
          <h3>Attack coverage</h3>
          <p class="muted">Types your members' own types hit super effectively.</p>
          <ul class="chips">
            <li v-for="type in reach.covered" :key="type"><TypeBadge :type="type" compact /></li>
          </ul>
          <template v-if="reach.uncovered.length">
            <p class="muted">Not covered:</p>
            <ul class="chips">
              <li v-for="type in reach.uncovered" :key="type"><TypeBadge :type="type" compact /></li>
            </ul>
          </template>
        </div>

        <div class="block">
          <h3>Against each attack type</h3>
          <table class="defence">
            <thead>
              <tr>
                <th scope="col">Attack type</th>
                <th scope="col">Weak</th>
                <th scope="col">Resist</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.type" :class="{ alert: row.weak >= 2 && row.weak > row.resist }">
                <th scope="row"><TypeBadge :type="row.type" compact /></th>
                <td>
                  <span class="dots" aria-hidden="true">
                    <i v-for="n in row.weak" :key="n" class="dot weak"></i>
                  </span>
                  <span class="visually-hidden">{{ row.weak }}</span>
                </td>
                <td>
                  <span class="dots" aria-hidden="true">
                    <i v-for="n in row.resist" :key="n" class="dot resist"></i>
                  </span>
                  <span class="visually-hidden">{{ row.resist }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <StatusMessage v-else title="Your team is empty">
        Add a Pokémon on the left, or use “Add to team” on any Pokémon page.
      </StatusMessage>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PokemonArtwork from '@/components/PokemonArtwork.vue';
import TypeBadge from '@/components/TypeBadge.vue';
import StatusMessage from '@/components/StatusMessage.vue';
import { filterPokedex, findById, findExact, type Species } from '@/lib/pokedex';
import { coverage, defence, sharedWeaknesses, TEAM_SIZE } from '@/lib/team';
import { readTeam, saveTeam } from '@/lib/teamStore';
import { useLanguage } from '@/lib/language';

const route = useRoute();
const router = useRouter();
const { speciesName, translations, lang } = useLanguage();

const parse = (value: unknown) =>
  String(value ?? '')
    .split(',')
    .map(Number)
    .filter(id => findById(id))
    .slice(0, TEAM_SIZE);

// The URL is the source of truth, so a team can be shared; the last team is remembered for next time.
const ids = computed(() => parse(route.query.ids));
if (!route.query.ids && readTeam().length) router.replace({ query: { ids: readTeam().join(',') } });
watch(ids, saveTeam);

const team = computed(() => ids.value.map(id => findById(id) as Species));
const slots = computed(() => Array.from({ length: TEAM_SIZE }, (_, index) => team.value[index]));
const setIds = (next: number[]) => router.replace({ query: next.length ? { ids: next.join(',') } : {} });
const remove = (index: number) => setIds(ids.value.filter((_, i) => i !== index));
const clear = () => setIds([]);

const query = ref('');
const invalid = ref(false);
const suggestions = computed(() =>
  query.value.trim().length < 2
    ? []
    : filterPokedex({ query: query.value, localNames: translations.value.pokemon }).slice(0, 8),
);
watch(query, () => (invalid.value = false));

// The same Pokémon may appear more than once, as in the games.
const add = () => {
  const species = findExact(query.value, translations.value.pokemon);
  invalid.value = !species;
  if (!species) return;
  query.value = '';
  setIds([...ids.value, species.id]);
};

const rows = computed(() => defence(team.value));
const weaknesses = computed(() => sharedWeaknesses(team.value));
const reach = computed(() => coverage(team.value));

const notice = ref('');
const share = async () => {
  try {
    await navigator.clipboard.writeText(location.href);
    notice.value = 'Link copied.';
  } catch {
    notice.value = 'Copy the address from the address bar to share this team.';
  }
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 2rem;
  align-items: start;
}

.slots {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 0 0 1.5rem;
  padding: 0;
  list-style: none;
}

.slot {
  display: grid;
  align-content: start;
  gap: 0.4rem;
  min-height: 12rem;
  padding: 0.6rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  background: var(--panel);
}

.slot:has(.empty) {
  place-items: center;
  border-style: dashed;
  background: transparent;
}

.empty {
  color: var(--muted);
  font-size: 2rem;
  font-weight: 700;
  opacity: 0.5;
}

.member {
  display: grid;
  gap: 0.2rem;
  text-decoration: none;
}

.art {
  border-radius: calc(var(--radius-m) - 4px);
  background: color-mix(in oklab, var(--type) 16%, var(--panel));
}

.name {
  font-weight: 600;
}

.types {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.remove {
  justify-self: start;
  padding: 0.25rem 0;
  border: 0;
  background: none;
  color: var(--muted);
  font-size: 0.85rem;
  text-decoration: underline;
  cursor: pointer;
}

.add {
  display: grid;
  gap: 0.4rem;
}

.add label {
  font-weight: 500;
}

.add-row {
  display: flex;
  gap: 0.5rem;
}

.add-row input {
  flex: 1;
  min-width: 0;
}

.error {
  min-height: 1.5em;
  color: var(--red);
  font-size: 0.9rem;
}

.team-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.notice,
.muted {
  color: var(--muted);
}

.analysis {
  display: grid;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  background: var(--panel);
}

.block {
  display: grid;
  gap: 0.6rem;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.defence {
  border-collapse: collapse;
}

.defence th,
.defence td {
  padding: 0.3rem 1rem 0.3rem 0;
  text-align: left;
}

.defence thead th {
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 500;
}

.defence tr.alert th {
  box-shadow: inset 3px 0 0 var(--red);
  padding-left: 0.5rem;
}

.dots {
  display: inline-flex;
  gap: 0.2rem;
  min-height: 0.7rem;
}

.dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
}

.dot.weak {
  background: var(--red);
}

.dot.resist {
  background: var(--grass);
}

@media (max-width: 860px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .slots {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
