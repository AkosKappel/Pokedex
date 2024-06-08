<template>
  <div>
    <LoadingWidget v-if="loading" />
    <div v-else>
      <PokemonDetails v-if="pokemon" :pokemon="pokemon" />
      <div v-else>
        <span class="not-found">
          Could not find pokemon with id<strong>{{ pokemonId }}</strong>
        </span>
      </div>
      <SideNavigation
        :showLeft="pokemonId > 1"
        @left="fetchPokemon(pokemonId - 1)"
        @right="fetchPokemon(pokemonId + 1)"
      />
      <div class="back-button" @click="router.back()"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingWidget from '@/components/LoadingWidget.vue';
import PokemonDetails from '@/components/PokemonDetails.vue';
import SideNavigation from '@/components/SideNavigation.vue';
import { fetchPokemonById } from '@/utils/helpers';

const route = useRoute();
const router = useRouter();
const pokemon = ref(null);
const loading = ref(true);
const pokemonId = computed(() => parseInt(route.params.id as string, 10));

onMounted(async () => await fetchPokemon(pokemonId.value));

const fetchPokemon = async (pokemonId: number) => {
  try {
    router.replace({ path: `/pokemon/${pokemonId}` }); // update URL with new pokemon id
    loading.value = true; // show loading widget
    pokemon.value = await fetchPokemonById(pokemonId);
  } catch (error) {
    console.error(error);
    pokemon.value = null;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.not-found {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.not-found strong {
  margin: 0 0.3rem;
}

.back-button {
  position: fixed;
  top: 40px;
  left: 20px;
  width: 40px;
  height: 40px;
  background-image: url('~@/assets/go-back.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  cursor: pointer;
  filter: invert(0.6);
}

.back-button:hover {
  filter: invert(0.4);
}
</style>
