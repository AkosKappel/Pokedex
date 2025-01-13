<template>
  <div class="content">
    <div class="cards">
      <div class="card-section">
        <div class="card-container">
          <PokemonCard v-if="pokemons.length > 0" :pokemon="pokemons[0]" />
        </div>
        <div class="info-section about">
          <h2>Welcome to PokéVue</h2>
          <p>
            Dive into the world of Pokémon with our modern, interactive Pokédex application. Experience seamless
            browsing through your favorite Pokémon, complete with detailed statistics, evolution chains, and move sets.
          </p>
          <p>Built with cutting-edge technologies to ensure a smooth, responsive experience:</p>
          <div class="tech-badges">
            <a href="https://v3.vuejs.org/" target="_blank" rel="noopener noreferrer" class="tech-badge">
              Vue 3 <img src="/vue.svg" alt="Vue logo" class="svg-logo" />
            </a>
            <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer" class="tech-badge">
              TypeScript <img src="/typescript.svg" alt="TypeScript logo" class="svg-logo" />
            </a>
            <a href="https://www.docker.com/" target="_blank" rel="noopener noreferrer" class="tech-badge">
              Docker <img src="/docker.svg" alt="Docker logo" class="svg-logo" />
            </a>
          </div>
          <p class="api-info">
            Powered by the comprehensive
            <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">
              PokéAPI <img src="/favicon.ico" alt="PokeAPI logo" class="svg-logo" />
            </a>
          </p>
        </div>
      </div>

      <div class="card-section reverse">
        <div class="card-container">
          <PokemonCard v-if="pokemons.length > 1" :pokemon="pokemons[1]" />
        </div>
        <div class="info-section features">
          <h2>Key Features</h2>
          <div class="feature-list">
            <div class="feature-item">
              <h3>Real-time Data</h3>
              <p>Access up-to-date information about every Pokémon species, ability, and move.</p>
            </div>
            <div class="feature-item">
              <h3>Advanced Search</h3>
              <p>Find Pokémon by type, region, or statistics with our powerful search functionality.</p>
            </div>
            <div class="feature-item">
              <h3>Responsive Design</h3>
              <p>Enjoy a seamless experience across all your devices, from desktop to mobile.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card-section">
        <div class="card-container">
          <PokemonCard v-if="pokemons.length > 2" :pokemon="pokemons[2]" />
        </div>
        <div class="info-section technical">
          <h2>Technical Excellence</h2>
          <div class="tech-details">
            <div class="tech-item">
              <h3>Cloud-Native Architecture</h3>
              <p>
                Deployed in a containerized environment using
                <a href="https://www.docker.com/" target="_blank" rel="noopener noreferrer">
                  Docker <img src="/docker.svg" alt="Docker logo" class="svg-logo" />
                </a>
                on Oracle Cloud Infrastructure for optimal performance and reliability.
              </p>
            </div>
            <div class="tech-item">
              <h3>Open Source</h3>
              <p>
                Explore our
                <a href="https://github.com/AkosKappel/Pokedex" target="_blank" rel="noopener noreferrer">
                  source code
                </a>
                and contribute to the project's development.
              </p>
            </div>
            <div class="tech-item">
              <h3>Modern Stack</h3>
              <p>
                Built with Vue 3's Composition API, TypeScript for type safety, and modern CSS features for a polished
                user interface.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PokemonCard from '@/components/PokemonCard.vue';
import { fetchRandomPokemons, type Pokemon } from '@/utils/helpers';

const pokemons = ref<Pokemon[]>([]);

onMounted(async () => {
  pokemons.value = await fetchRandomPokemons(3);
});
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 3rem auto;
  padding: 0 2rem;
  max-width: 1400px;
}

.cards {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 3rem;
}

.card-section {
  display: flex;
  align-items: center;
  gap: 3rem;
  padding: 3rem;
  border-radius: 1.5rem;
  background: linear-gradient(135deg, #5b7794, #2c3e50);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.card-section.reverse {
  flex-direction: row-reverse;
  background: linear-gradient(135deg, #2c3e50, #969ac7);
}

.card-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info-section {
  flex: 1.5;
  padding: 2rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.info-section h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.info-section h3 {
  font-size: 1.25rem;
  color: #34495e;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.info-section p {
  color: #486581;
  line-height: 1.7;
  margin-bottom: 1rem;
}

.tech-badges {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.tech-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #f8fafc;
  border-radius: 2rem;
  border: 1px solid #e2e8f0;
  color: #64748b;
  font-weight: 500;
  transition: all 0.2s ease;
}

.tech-badge:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
  text-decoration: none;
}

.feature-list,
.tech-details {
  display: grid;
  gap: 1.5rem;
}

.feature-item,
.tech-item {
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
}

.svg-logo {
  width: 1.25rem;
  height: 1.25rem;
  margin-left: 0.5rem;
  vertical-align: middle;
  transition: transform 0.2s ease;
}

a:hover .svg-logo {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .card-section,
  .card-section.reverse {
    flex-direction: column;
    padding: 2rem;
  }

  .info-section {
    padding: 1.5rem;
  }

  .tech-badges {
    flex-wrap: wrap;
  }
}
</style>
