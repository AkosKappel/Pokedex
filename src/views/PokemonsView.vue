<template>
  <LoadingWidget v-if="!data" />
  <div v-else>
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
      :items-per-page="POKEMONS_PER_PAGE"
      :max-pages-shown="3"
      :hide-prev-next-when-ends="true"
      active-page-class="active-page"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import LoadingWidget from '@/components/LoadingWidget.vue';
import PokemonList from '@/components/PokemonList.vue';
import SideNavigation from '@/components/SideNavigation.vue';
import { POKEMON_API_URL, POKEMONS_PER_PAGE } from '@/config/constants';
import { useFetch } from '@/utils/helpers';

const router = useRouter();
const currentPage = ref<number>(1);
const totalPages = ref<number>(10);
const data = ref<any>(null);

onMounted(async () => {
  const initialPage = parseInt((router.currentRoute.value.query.page as string) || '1', 10);
  currentPage.value = initialPage;
  await fetchPage(initialPage);

  // start watching for page changes after initial page is loaded
  watch(currentPage, (newPage, oldPage) => {
    if (newPage !== oldPage) {
      data.value = null; // reset data to show loading widget
      fetchPage(newPage);
    }
  });
});

const fetchPage = async (page: number, perPage: number = POKEMONS_PER_PAGE) => {
  if (page < 1 || page > totalPages.value) {
    console.warn('Invalid page number:', page);
    return;
  }

  try {
    const offset: number = (page - 1) * perPage;
    const url = `${POKEMON_API_URL}?offset=${offset}&limit=${perPage}`;

    const response = await useFetch(url);
    data.value = response;
    totalPages.value = Math.ceil(response.count / response.results.length);

    router.push({ query: { page } });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
</script>
