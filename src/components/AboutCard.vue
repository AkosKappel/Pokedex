<template>
  <div class="card about">
    <h2>About this project</h2>
    <p>This is a small frontend application for the Pokémon games.</p>
    <p>
      The app was built with
      <a href="https://v3.vuejs.org/" target="_blank" rel="noopener noreferrer">
        Vue 3 <img src="/vue.svg" alt="Vue logo" class="svg-logo" />
      </a>
      and
      <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">
        TypeScript <img src="/typescript.svg" alt="TypeScript logo" class="svg-logo" />
      </a>
      while the data is fetched from the
      <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">
        PokéAPI <img src="/favicon.ico" alt="PokeAPI logo" class="svg-logo" />
      </a>
      interface.
    </p>
    <p>The functionality of the app is limited due to the available features of the free API that is being used.</p>
    <p>
      The application is running inside a
      <a href="https://www.docker.com/" target="_blank" rel="noopener noreferrer">
        Docker <img src="/docker.svg" alt="Docker logo" class="svg-logo" />
      </a>
      container which is self-hosted on a Free Tier
      <a href="https://www.oracle.com/cloud/free/" target="_blank" rel="noopener noreferrer"> Oracle Cloud </a>
      VM instance.
    </p>
    <p>
      Check out the source code on
      <a href="https://github.com/AkosKappel/Pokedex" target="_blank" rel="noopener noreferrer"> GitHub </a>
    </p>
  </div>
</template>

<style>
.svg-logo {
  width: 16px;
  height: 16px;
}
</style>
