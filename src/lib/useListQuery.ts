import { computed, watchEffect, type Ref } from 'vue';
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router';

/**
 * Filters and the page number of a list page live in the URL query, so every view can be shared
 * and the back button works. Empty values are dropped and any change goes back to page 1.
 */
export const useListQuery = (pageCount: Ref<number>) => {
  const route = useRoute();
  const router = useRouter();

  const param = (key: string) => {
    const value = route.query[key];
    return typeof value === 'string' ? value : '';
  };

  const requestedPage = computed(() => Math.max(1, Math.floor(Number(route.query.page)) || 1));
  const page = computed(() => Math.min(requestedPage.value, pageCount.value));

  // Out-of-range pages (an old link, or fewer results after a data update) show the last page.
  watchEffect(() => {
    if (route.query.page && String(page.value) !== route.query.page) {
      router.replace({ query: { ...route.query, page: page.value === 1 ? undefined : String(page.value) } });
    }
  });

  const update = (changes: LocationQueryRaw) => {
    const next: LocationQueryRaw = { ...route.query, ...changes, page: undefined };
    for (const key of Object.keys(next)) if (!next[key]) delete next[key];
    router.replace({ query: next });
  };

  return { param, page, update };
};
