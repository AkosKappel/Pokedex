import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import { findById, formatNumber } from '@/lib/pokedex';

const SITE = 'Pokédex';
const DEFAULT_DESCRIPTION =
  'Browse all 1025 Pokémon: search by name or number, filter by type and region, and see stats, evolutions and type matchups.';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string | ((route: RouteLocationNormalized) => string);
    description?: string | ((route: RouteLocationNormalized) => string);
  }
}

const speciesOf = (route: RouteLocationNormalized) => findById(Number(route.params.id));

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      path: '/pokemon',
      name: 'browse',
      component: () => import('@/views/BrowseView.vue'),
      meta: { title: 'Browse Pokémon' },
    },
    {
      path: '/pokemon/:id(\\d+)',
      name: 'pokemon',
      component: () => import('@/views/PokemonView.vue'),
      props: route => ({ id: Number(route.params.id) }),
      beforeEnter: to => {
        if (!speciesOf(to)) {
          return { name: 'not-found', params: { pathMatch: to.path.slice(1).split('/') }, replace: true };
        }
      },
      meta: {
        title: route => `${speciesOf(route)?.name} ${formatNumber(Number(route.params.id))}`,
        description: route =>
          `${speciesOf(route)?.name}: stats, abilities, evolutions, weaknesses and artwork in the Pokédex.`,
      },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/FavoritesView.vue'),
      meta: { title: 'Favorites' },
    },
    {
      path: '/compare',
      name: 'compare',
      component: () => import('@/views/CompareView.vue'),
      meta: { title: 'Compare Pokémon', description: 'Compare the base stats and types of up to three Pokémon.' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { title: 'About', description: 'What this Pokédex is, how it is built and where its data comes from.' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Page not found' },
    },
  ],
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) return savedPosition;
    // Filter changes on the browse page keep the toolbar in view.
    if (to.name === 'browse' && from.name === 'browse' && to.query.page === from.query.page) return false;
    return { top: 0 };
  },
});

const resolve = (
  value: string | ((route: RouteLocationNormalized) => string) | undefined,
  route: RouteLocationNormalized,
) => (typeof value === 'function' ? value(route) : value);

router.afterEach(to => {
  const title = resolve(to.meta.title, to);
  document.title = title ? `${title} · ${SITE}` : `${SITE}: every Pokémon at a glance`;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', resolve(to.meta.description, to) ?? DEFAULT_DESCRIPTION);
});

export default router;
