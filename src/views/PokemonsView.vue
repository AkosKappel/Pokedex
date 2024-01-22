<template>
  <LoadingWidget v-if="!data" />
  <div v-else class="pokemon-container">
    <PokemonList :pokemons="data.results ?? []" />
    <SideNavigation
      :showLeft="currentPage > 1"
      :showRight="currentPage < totalPages"
      @left="currentPage--"
      @right="currentPage++"
    />
    <vue-awesome-paginate
      v-model="currentPage"
      :total-items="data.count"
      :items-per-page="PER_PAGE"
      :max-pages-shown="5"
      :hide-prev-next-when-ends="true"
      active-page-class="active-page"
    />
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, watch, onMounted } from 'vue';
import LoadingWidget from '@/components/LoadingWidget.vue';
import PokemonList from '@/components/PokemonList.vue';
import SideNavigation from '@/components/SideNavigation.vue';

const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon/';
const PER_PAGE = 20;

const currentPage = ref<number>(1);
const totalPages = ref<number>(15);
const data = ref<any>(null);

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const initialPage = parseInt(urlParams.get('page') || '1', 10);
  currentPage.value = initialPage;
  await fetchPage(initialPage);
});

watch(currentPage, (newPage, oldPage) => {
  if (newPage !== oldPage) {
    data.value = null; // reset data to show loading widget
    console.log('currentPage changed from', oldPage, 'to', newPage);
    fetchPage(newPage);
  }
});

const fetchPage = async (page: number, perPage: number = PER_PAGE) => {
  if (page < 1 || page > totalPages.value) {
    console.warn('Invalid page number:', page);
    return;
  }

  try {
    const response = await axios.get(`${POKEMON_API_URL}?offset=${(page - 1) * perPage}&limit=${perPage}`);
    console.log('fetched data', response.data);
    data.value = response.data;
    totalPages.value = Math.ceil(response.data.count / response.data.results.length);
    history.pushState(null, '', `?page=${page}`);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
</script>
