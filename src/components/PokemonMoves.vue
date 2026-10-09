<template>
  <div class="pokemon-moves">
    <div class="toolbar">
      <fieldset class="methods">
        <legend class="visually-hidden">How the moves are learned</legend>
        <label v-for="option in methods" :key="option.key" class="method">
          <input v-model="method" type="radio" name="learn-method" :value="option.key" />
          {{ option.label }} <span class="count">{{ option.count }}</span>
        </label>
      </fieldset>
      <p class="game">In Pokémon {{ gameName }}</p>
    </div>
    <div v-if="!index" class="skeleton-table" aria-busy="true">
      <p class="visually-hidden">Loading moves…</p>
      <SkeletonBlock v-for="n in 8" :key="n" height="2.1rem" />
    </div>
    <MoveTable
      v-else-if="rows.length"
      :moves="rows.map(row => row.move)"
      :levels="method === 'level-up' ? rows.map(row => row.level) : undefined"
      :caption="`Moves learned by ${method}`"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import MoveTable from './MoveTable.vue';
import SkeletonBlock from './SkeletonBlock.vue';
import type { Pokemon } from '@/lib/api';
import { loadMoves, type Move } from '@/lib/moves';
import { idFromUrl, titleCase } from '@/lib/format';
import { useLanguage } from '@/lib/language';
import VERSION_GROUPS from '@/data/version-groups.json';

const props = defineProps<{ moves: Pokemon['moves'] }>();
const { moveName } = useLanguage();

const index = shallowRef<Map<number, Move>>();
onMounted(async () => (index.value = new Map((await loadMoves()).map(move => [move.id, move]))));

const METHODS = { 'level-up': 'Level up', machine: 'TM', egg: 'Egg', tutor: 'Tutor' } as const;
type Method = keyof typeof METHODS;

// Learnsets differ per game; show the newest game with a level-up learnset (some newer games
// list only a handful of moves for a Pokémon). Games newer than the bundled order count as newest.
const releaseOrder = (name: string) => (VERSION_GROUPS as Record<string, number>)[name] ?? Number.MAX_SAFE_INTEGER;

const latestGroup = computed(() => {
  const groups = (levelUpOnly: boolean) =>
    props.moves.flatMap(entry =>
      entry.version_group_details
        .filter(d => (levelUpOnly ? d.move_learn_method.name === 'level-up' : d.move_learn_method.name in METHODS))
        .map(d => d.version_group.name),
    );
  const candidates = groups(true).length ? groups(true) : groups(false);
  return candidates.reduce(
    (latest, name) => (releaseOrder(name) > releaseOrder(latest) ? name : latest),
    candidates[0],
  );
});

const GAME_NAMES: Record<string, string> = {
  'mega-dimension': 'Legends: Z-A, Mega Dimension',
  'legends-za': 'Legends: Z-A',
  'the-indigo-disk': 'Scarlet and Violet, The Indigo Disk',
  'the-teal-mask': 'Scarlet and Violet, The Teal Mask',
  'scarlet-violet': 'Scarlet and Violet',
  'legends-arceus': 'Legends: Arceus',
  'brilliant-diamond-shining-pearl': 'Brilliant Diamond and Shining Pearl',
  'the-crown-tundra': 'Sword and Shield, The Crown Tundra',
  'the-isle-of-armor': 'Sword and Shield, The Isle of Armor',
  'sword-shield': 'Sword and Shield',
  'lets-go-pikachu-lets-go-eevee': "Let's Go, Pikachu! and Let's Go, Eevee!",
  'ultra-sun-ultra-moon': 'Ultra Sun and Ultra Moon',
  'sun-moon': 'Sun and Moon',
  'omega-ruby-alpha-sapphire': 'Omega Ruby and Alpha Sapphire',
  'x-y': 'X and Y',
  'black-2-white-2': 'Black 2 and White 2',
  'black-white': 'Black and White',
  'heartgold-soulsilver': 'HeartGold and SoulSilver',
  'diamond-pearl': 'Diamond and Pearl',
  'firered-leafgreen': 'FireRed and LeafGreen',
  'ruby-sapphire': 'Ruby and Sapphire',
  'gold-silver': 'Gold and Silver',
  'red-blue': 'Red and Blue',
};
const gameName = computed(() => GAME_NAMES[latestGroup.value] ?? titleCase(latestGroup.value ?? ''));

const learned = computed(() =>
  props.moves.flatMap(entry =>
    entry.version_group_details
      .filter(d => d.version_group.name === latestGroup.value && d.move_learn_method.name in METHODS)
      .map(d => ({
        id: idFromUrl(entry.move.url),
        method: d.move_learn_method.name as Method,
        level: d.level_learned_at,
      })),
  ),
);

const methods = computed(() =>
  (Object.keys(METHODS) as Method[])
    .map(key => ({ key, label: METHODS[key], count: learned.value.filter(l => l.method === key).length }))
    .filter(option => option.count),
);

const method = ref<Method>('level-up');
watch(
  methods,
  available => {
    if (available.length && !available.some(option => option.key === method.value)) method.value = available[0].key;
  },
  { immediate: true },
);

const rows = computed(() => {
  if (!index.value) return [];
  const moves = index.value;
  return learned.value
    .filter(entry => entry.method === method.value && moves.has(entry.id))
    .map(entry => ({ move: moves.get(entry.id) as Move, level: entry.level }))
    .sort((a, b) => a.level - b.level || moveName(a.move).localeCompare(moveName(b.move)));
});
</script>

<style scoped>
.pokemon-moves {
  display: grid;
  gap: 1rem;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.methods {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  border: 0;
}

.method {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 2.4rem;
  padding: 0 0.9rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  cursor: pointer;
}

.method input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.method:has(input:checked) {
  border-color: var(--ink);
  background: var(--ink);
  color: var(--paper);
}

.method:has(input:focus-visible) {
  outline: 3px solid var(--focus);
  outline-offset: 2px;
}

.count {
  font-size: 0.8rem;
  opacity: 0.75;
}

.skeleton-table {
  display: grid;
  gap: 0.4rem;
}

.game,
.muted {
  color: var(--muted);
  font-size: 0.9rem;
}
</style>
