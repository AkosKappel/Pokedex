<template>
  <div class="pokemon-details">
    <div class="header">
      <div class="name">
        <h2>{{ pokemon.name }}</h2>
        <div class="types">
          <span v-for="pokemonType in pokemon.types" :key="pokemonType.type.name" :class="pokemonType.type.name">
            {{ pokemonType.type.name }}
          </span>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="image-container">
        <img :src="pokemon.image" :alt="pokemon.name" :title="pokemon.name" @error="onImageError" />
        <div class="sprites">
          <div v-for="(sprite, key) in pokemon.sprites" :key="key">
            <img
              v-if="sprite && typeof sprite === 'string'"
              :src="sprite"
              :alt="`${key} ${pokemon.name}`"
              :title="`${key} ${pokemon.name}`"
              @error="removeSprite"
            />
          </div>
        </div>
      </div>
      <div class="details">
        <div v-if="pokemon.id" class="detail">
          <span class="label">ID:</span>
          <span class="value">#{{ pokemon.id.toString().padStart(3, '0') }}</span>
        </div>
        <div v-if="pokemon.weight" class="detail">
          <span class="label">Weight:</span>
          <span class="value">{{ pokemon.weight }}</span>
        </div>
        <div v-if="pokemon.height" class="detail">
          <span class="label">Height:</span>
          <span class="value">{{ pokemon.height }}</span>
        </div>
        <div v-if="pokemon.base_experience" class="detail">
          <span class="label">Base experience:</span>
          <span class="value">{{ pokemon.base_experience }}</span>
        </div>
        <div v-for="pokemonStat in pokemon.stats" :key="pokemonStat.stat.name" class="detail">
          <span class="label">{{ pokemonStat.stat.name.replace('-', ' ') }}:</span>
          <span class="value">{{ pokemonStat.base_stat }}</span>
        </div>
        <div class="detail">
          <span class="label">Abilities:</span>
          <span class="value">
            <span v-for="(pokemonAbility, index) in pokemon.abilities" :key="pokemonAbility.ability.name">
              {{ pokemonAbility.ability.name + (index < pokemon.abilities.length - 1 ? ', ' : '') }}
            </span>
          </span>
        </div>
        <div class="detail">
          <span class="label">Number of moves:</span>
          <span class="value">{{ pokemon.moves.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface Pokemon {
  id: number;
  name: string;
  weight: number;
  height: number;
  base_experience: number;
  moves: any[];
  stats: any[];
  types: any[];
  abilities: any[];
  sprites: any;
  image: string; // not part of the API response
  forms: any[];
  game_indices: any[];
  held_items: any[];
  is_default: boolean;
  location_area_encounters: string;
  order: number;
  past_abilities: any[];
  past_types: any[];
  species: any;
}

const props = defineProps({
  pokemon: {
    type: Object,
    required: true,
  },
});
const pokemon = props.pokemon as Pokemon;

const onImageError = (event: any) => {
  event.target.src = require('@/assets/pokeball.png');
};

const removeSprite = (event: any) => {
  event.target.parentNode.remove();
};
</script>

<style scoped>
.pokemon-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.header button {
  margin: 0 10px;
  padding: 10px;
  border: 1px solid #000;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
}

.header .name {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 20px;
}

.header .name h2 {
  margin: 0.3em 0;
  text-transform: capitalize;
}

.header .name span {
  font-size: 0.8em;
  font-weight: 300;
  color: #111;
  background-color: #eee;
  padding: 5px 10px;
  border-radius: 12px;
  border: 1px solid #000;
  text-transform: capitalize;
}

.header .types {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.types {
  .normal {
    background-color: #a8a878;
  }

  .fighting {
    background-color: #c03028;
  }

  .flying {
    background-color: #a890f0;
  }

  .poison {
    background-color: #a040a0;
  }

  .ground {
    background-color: #e0c068;
  }

  .rock {
    background-color: #b8a038;
  }

  .bug {
    background-color: #a8b820;
  }

  .ghost {
    background-color: #705898;
  }

  .steel {
    background-color: #b8b8d0;
  }

  .fire {
    background-color: #f08030;
  }

  .water {
    background-color: #6890f0;
  }

  .grass {
    background-color: #78c850;
  }

  .electric {
    background-color: #f8d030;
  }

  .psychic {
    background-color: #f85888;
  }

  .ice {
    background-color: #98d8d8;
  }

  .dragon {
    background-color: #7038f8;
  }

  .dark {
    background-color: #705848;
  }

  .fairy {
    background-color: #ee99ac;
  }

  .unknown {
    background-color: #68a090;
  }

  .shadow {
    background-color: #705898;
  }
}

.content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  gap: 60px;
}

.image-container img {
  max-width: 360px;
  max-height: 360px;
}

.sprites {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.sprites div img {
  max-width: 100px;
  max-height: 100px;
}

.details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
  min-width: 260px;
  margin-bottom: 20px;
}

.detail {
  margin-right: 20px;
}

.label {
  font-weight: bold;
  margin-right: 5px;
  text-transform: capitalize;
}

.value {
  font-weight: normal;
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
    gap: 20px;
  }

  .image-container {
    margin-right: 0;
    margin-bottom: 20px;
  }
}
</style>
