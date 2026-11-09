<template>
  <article class="about">
    <header class="page-header">
      <h1>About this Pokédex</h1>
      <p class="lead">
        A fast, ad-free Pokédex for looking up any Pokémon by name or number. It is a portfolio project by Ákos Kappel,
        built with Vue.
      </p>
    </header>

    <section>
      <h2>What you can do</h2>
      <ul>
        <li>
          Search all {{ POKEDEX.length }} Pokémon by name or number, filter by type and region, and sort by number, name
          or base stats. Every search and filter lives in the address, so any view can be shared.
        </li>
        <li>
          See base stats, abilities, height and weight, the evolution chain, other forms and the moves each Pokémon
          learns. Switch to shiny artwork, play its cry and share the page.
        </li>
        <li>Check which attack types are strong or weak against each Pokémon.</li>
        <li>Meet a new Pokémon of the day on the home page.</li>
        <li>Compare up to three Pokémon side by side.</li>
        <li>Play “Who's that Pokémon?” and guess Pokémon from their silhouettes.</li>
        <li>Look up moves, abilities and items, and see which Pokémon learn or have them.</li>
        <li>
          Build a team of six and check its shared weaknesses and attack coverage. The team builder points out the gaps
          (types nobody hits hard, weaknesses nobody resists) and suggests Pokémon that fill them, by region if you
          like. Share the team as a link.
        </li>
        <li>
          Keep a list of favorites, sort and filter it, share it as a link, and export or import it as a file to move it
          to another browser.
        </li>
        <li>
          Show Pokémon, move, ability and item names in English, German, French, Spanish, Italian, Japanese, Korean,
          Simplified or Traditional Chinese. Search accepts names in the chosen language.
        </li>
        <li>Switch between light and dark mode.</li>
        <li>Install the app and use it offline: Pokémon you have opened stay available without a connection.</li>
        <li>
          Keyboard shortcuts: <kbd>Ctrl</kbd> <kbd>K</kbd> (<kbd>⌘</kbd> <kbd>K</kbd> on a Mac) opens quick find for
          pages, types, regions and Pokémon, <kbd>/</kbd> jumps to search, <kbd>←</kbd> and <kbd>→</kbd> step through
          the Pokédex.
        </li>
      </ul>
    </section>

    <section>
      <h2>Where the data comes from</h2>
      <p>
        Everything comes from <a href="https://pokeapi.co/">PokéAPI</a>, a free and open Pokémon database. The list of
        names, types and regions (and the lists of moves, abilities, items and translated names) ships with the app, so
        search and filters work instantly and offline. Details load from PokéAPI when you open a Pokémon and are kept in
        your browser for later visits.
      </p>
      <p>
        Favorites, your team, the theme, the language, your best quiz streak and the cached data stay in your browser.
        Nothing is sent anywhere, and there are no accounts, cookies or trackers.
      </p>
    </section>

    <section>
      <h2>How it is built</h2>
      <dl class="stack">
        <div>
          <dt>Vue {{ versions.vue }} and Vue Router {{ versions.router }}</dt>
          <dd>Composition API single-page app with lazy-loaded pages.</dd>
        </div>
        <div>
          <dt>TypeScript {{ versions.typescript }}</dt>
          <dd>Strict types for the PokéAPI responses the app uses.</dd>
        </div>
        <div>
          <dt>Vite {{ versions.vite }}</dt>
          <dd>Build tool, plus a service worker for offline use.</dd>
        </div>
        <div>
          <dt>Vitest and Playwright</dt>
          <dd>
            Unit tests for search, type matchups and evolutions; end-to-end and accessibility tests in the browser.
          </dd>
        </div>
        <div>
          <dt>GitHub Pages</dt>
          <dd>Every push to <code>main</code> is tested and deployed by GitHub Actions.</dd>
        </div>
      </dl>
      <p><a href="https://github.com/AkosKappel/Pokedex">Source code on GitHub</a></p>
    </section>

    <section>
      <h2>Changes</h2>
      <dl class="changes">
        <div>
          <dt>2026</dt>
          <dd>
            Rebuilt with Vite and a new design: search, filters, type matchups, evolutions, compare, dark mode and
            offline support. Then moves, abilities, items, a team builder that suggests Pokémon for its gaps, quick find
            and eight more languages.
          </dd>
        </div>
        <div>
          <dt>2024</dt>
          <dd>First version with Vue CLI: a paged list, detail pages and favorites.</dd>
        </div>
      </dl>
    </section>

    <section class="author">
      <h2>Author</h2>
      <p>
        Ákos Kappel, software developer.
        <a href="https://akoskappel.dev/">Portfolio</a>, <a href="https://github.com/AkosKappel">GitHub</a> and
        <a href="https://www.linkedin.com/in/%C3%A1kos-kappel-b53344220/">LinkedIn</a>.
      </p>
    </section>
  </article>
</template>

<script setup lang="ts">
import { POKEDEX } from '@/lib/pokedex';

const versions = __VERSIONS__;
</script>

<style scoped>
.about {
  display: grid;
  gap: 2.5rem;
  max-width: 48rem;
}

section {
  display: grid;
  gap: 0.75rem;
}

ul {
  display: grid;
  gap: 0.4rem;
  margin: 0;
  padding-left: 1.25rem;
}

kbd {
  padding: 0 0.35rem;
  border: 1px solid var(--line);
  border-bottom-width: 2px;
  border-radius: 4px;
  background: var(--panel);
  font-family: inherit;
  font-size: 0.9em;
}

dl {
  display: grid;
  gap: 0.9rem;
  margin: 0;
}

dt {
  font-weight: 600;
}

dd {
  margin: 0;
  color: var(--muted);
}

.changes div {
  display: grid;
  grid-template-columns: 4rem 1fr;
  gap: 1rem;
}
</style>
