<template>
  <div class="quiz">
    <header class="page-header">
      <h1>Who's that Pokémon?</h1>
      <p class="lead">Name the Pokémon from its silhouette. Wrong guesses unlock hints.</p>
    </header>

    <div class="board">
      <div class="screen" :class="{ revealed }">
        <PokemonArtwork
          :id="current.id"
          :key="current.id"
          :alt="revealed ? current.name : 'Silhouette of a mystery Pokémon'"
          :size="320"
          eager
          class="art"
        />
      </div>

      <div class="panel">
        <dl class="score">
          <div>
            <dt>Streak</dt>
            <dd>{{ streak }}</dd>
          </div>
          <div>
            <dt>Best</dt>
            <dd>{{ best }}</dd>
          </div>
        </dl>

        <label class="region">
          Pokémon from
          <select v-model.number="generation" class="field" @change="next(false)">
            <option :value="0">All regions</option>
            <option v-for="(region, index) in REGIONS" :key="region" :value="index + 1">{{ region }}</option>
          </select>
        </label>

        <form v-if="!revealed" class="guess" @submit.prevent="guess">
          <label for="quiz-guess">Your guess</label>
          <div class="guess-row">
            <input
              id="quiz-guess"
              ref="input"
              v-model="answer"
              class="field"
              type="text"
              list="quiz-suggestions"
              autocomplete="off"
              placeholder="Pokémon name"
              required
            />
            <datalist id="quiz-suggestions">
              <option v-for="species in suggestions" :key="species.id" :value="species.name" />
            </datalist>
            <button type="submit" class="button primary">Guess</button>
          </div>
          <button type="button" class="link-button" @click="giveUp">Show the answer</button>
        </form>

        <div v-else class="result">
          <p class="verdict">
            <template v-if="won">Correct, it's {{ current.name }}!</template>
            <template v-else>It's {{ current.name }}.</template>
          </p>
          <div class="result-actions">
            <button ref="nextButton" type="button" class="button primary" @click="next(won)">Next Pokémon</button>
            <RouterLink :to="{ name: 'pokemon', params: { id: current.id } }" class="button">
              See {{ current.name }}
            </RouterLink>
          </div>
        </div>

        <ul v-if="hints.length && !revealed" class="hints" aria-label="Hints">
          <li v-for="hint in hints" :key="hint">{{ hint }}</li>
        </ul>
        <p class="feedback" role="status">{{ feedback }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from 'vue';
import PokemonArtwork from '@/components/PokemonArtwork.vue';
import { filterPokedex, findExact, POKEDEX, REGIONS, regionOf, type Species } from '@/lib/pokedex';
import { titleCase } from '@/lib/format';

const BEST_KEY = 'quizBest';

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
};

const generation = ref(0);
const pick = () => {
  const pool = generation.value ? POKEDEX.filter(s => s.generation === generation.value) : POKEDEX;
  return pool[Math.floor(Math.random() * pool.length)];
};

const current = ref<Species>(pick());
const answer = ref('');
const wrongGuesses = ref(0);
const revealed = ref(false);
const won = ref(false);
const feedback = ref('');
const streak = ref(0);
const best = ref(readBest());
const input = useTemplateRef('input');
const nextButton = useTemplateRef('nextButton');

const suggestions = computed(() =>
  answer.value.trim().length < 2 ? [] : filterPokedex({ query: answer.value }).slice(0, 8),
);

const hints = computed(() =>
  [
    `Type: ${current.value.types.map(titleCase).join(' and ')}`,
    `Region: ${regionOf(current.value.generation)}`,
    `Starts with “${current.value.name.charAt(0)}” and has ${current.value.name.length} letters`,
  ].slice(0, wrongGuesses.value),
);

const reveal = async (correct: boolean) => {
  revealed.value = true;
  won.value = correct;
  if (correct) {
    streak.value++;
    if (streak.value > best.value) {
      best.value = streak.value;
      try {
        localStorage.setItem(BEST_KEY, String(best.value));
      } catch {
        // The best streak then lasts only for this visit.
      }
    }
  } else {
    streak.value = 0;
  }
  await nextTick();
  nextButton.value?.focus();
};

const guess = () => {
  const species = findExact(answer.value);
  if (species?.id === current.value.id) {
    feedback.value = '';
    return reveal(true);
  }
  wrongGuesses.value++;
  feedback.value = species ? `Not ${species.name}. Try again.` : `There is no Pokémon called “${answer.value}”.`;
  answer.value = '';
};

const giveUp = () => {
  feedback.value = '';
  reveal(false);
};

const next = async (keepStreak: boolean) => {
  if (!keepStreak) streak.value = 0;
  current.value = pick();
  answer.value = '';
  wrongGuesses.value = 0;
  revealed.value = false;
  won.value = false;
  feedback.value = '';
  await nextTick();
  input.value?.focus();
};
</script>

<style scoped>
.board {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 2.5rem;
  align-items: start;
}

.screen {
  padding: 2rem;
  border: 6px solid var(--panel);
  border-radius: var(--radius-l);
  background: radial-gradient(circle, color-mix(in oklab, var(--lens) 30%, var(--panel)) 0 40%, var(--paper) 75%);
  box-shadow: 0 0 0 1px var(--line);
}

.art :deep(img) {
  filter: brightness(0);
  transition:
    filter 0.5s,
    opacity 0.25s;
}

.revealed .art :deep(img) {
  filter: none;
}

.panel {
  display: grid;
  gap: 1.25rem;
}

.score {
  display: flex;
  gap: 2.5rem;
  margin: 0;
}

.score dt {
  color: var(--muted);
}

.score dd {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.region,
.guess {
  display: grid;
  gap: 0.35rem;
  font-weight: 500;
}

.region select {
  max-width: 14rem;
}

.guess-row {
  display: flex;
  gap: 0.5rem;
}

.guess-row input {
  flex: 1;
  min-width: 0;
}

.link-button {
  justify-self: start;
  padding: 0.5rem 0;
  border: 0;
  background: none;
  color: var(--muted);
  font-weight: 400;
  text-decoration: underline;
  cursor: pointer;
}

.verdict {
  font-size: 1.5rem;
  font-weight: 600;
}

.result {
  display: grid;
  gap: 1rem;
}

.result-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.hints {
  display: grid;
  gap: 0.35rem;
  margin: 0;
  padding: 1rem 1rem 1rem 2rem;
  border: 1px dashed var(--line);
  border-radius: var(--radius-m);
}

.feedback {
  min-height: 1.5em;
  color: var(--muted);
}

@media (max-width: 760px) {
  .board {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
