<template>
  <div class="not-found">
    <svg class="missingno" viewBox="0 0 6 14" aria-hidden="true">
      <rect
        v-for="(cell, index) in cells"
        :key="index"
        :x="cell.x"
        :y="cell.y"
        width="1"
        height="1"
        :fill="cell.fill"
      />
    </svg>
    <div>
      <h1>A wild 404 appeared</h1>
      <p class="lead">This page does not exist. The address may be mistyped, or the Pokémon number is out of range.</p>
      <div class="actions">
        <RouterLink :to="{ name: 'browse' }" class="button primary">Browse Pokémon</RouterLink>
        <RouterLink to="/" class="button">Go to the home page</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// A MissingNo.-style block of pixels: a fixed pattern so it looks the same on every visit.
const PATTERN = [
  '000000',
  '110000',
  '120000',
  '312000',
  '231000',
  '113200',
  '321100',
  '132310',
  '213121',
  '321312',
  '132231',
  '311123',
  '213312',
  '132121',
];
const FILLS = ['', 'var(--ink)', 'var(--muted)', 'var(--red)'];
const cells = PATTERN.flatMap((row, y) =>
  [...row].flatMap((value, x) => (value === '0' ? [] : [{ x, y, fill: FILLS[Number(value)] }])),
);
</script>

<style scoped>
.not-found {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 3rem;
  padding: 3rem 0;
}

.missingno {
  width: 6rem;
  shape-rendering: crispEdges;
}

.lead {
  margin: 1rem 0 1.5rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

@media (max-width: 600px) {
  .not-found {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .missingno {
    width: 4rem;
  }
}
</style>
