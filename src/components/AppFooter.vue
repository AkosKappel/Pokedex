<template>
  <footer class="footer">
    <div class="inner">
      <div class="author">
        <p>
          Built by <a href="https://portfolio-taupe-eta-51.vercel.app/">Ákos Kappel</a>, {{ year }}.
          <a href="https://github.com/AkosKappel/Pokedex">Source code</a> on GitHub.
        </p>
        <ul class="links">
          <li><a href="https://github.com/AkosKappel">GitHub</a></li>
          <li><a href="https://www.linkedin.com/in/%C3%A1kos-kappel-b53344220/">LinkedIn</a></li>
          <li><a href="https://portfolio-taupe-eta-51.vercel.app/">Portfolio</a></li>
        </ul>
      </div>
      <p class="credits">
        Data and artwork from <a href="https://pokeapi.co/">PokéAPI</a>. Pokémon and Pokémon character names are
        trademarks of Nintendo, Game Freak and Creatures. This is a fan project, not affiliated with them.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<style scoped>
.footer {
  border-top: 1px solid var(--line);
  background: var(--panel);
  color: var(--muted);
  font-size: 0.9rem;
}

.inner {
  width: var(--page);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem 3rem;
  padding: 2rem 0;
}

a {
  color: var(--ink);
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
  margin: 0.6rem 0 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 720px) {
  .inner {
    grid-template-columns: 1fr;
  }
}
</style>
