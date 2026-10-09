import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import { findById, formatNumber } from '@/lib/pokedex';
import { loadMoves } from '@/lib/moves';
import { loadAbilities } from '@/lib/abilities';

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

const notFound = (to: RouteLocationNormalized) => ({
  name: 'not-found',
  params: { pathMatch: to.path.slice(1).split('/') },
  replace: true,
});

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
        if (!speciesOf(to)) return notFound(to);
      },
      meta: {
        title: route => `${speciesOf(route)?.name} ${formatNumber(Number(route.params.id))}`,
        description: route =>
          `${speciesOf(route)?.name}: stats, abilities, evolutions, weaknesses and artwork in the Pokédex.`,
      },
    },
    {
      path: '/moves',
      name: 'moves',
      component: () => import('@/views/MovesView.vue'),
      meta: {
        title: 'Moves',
        description: 'Every move Pokémon can learn, with type, category, power, accuracy and PP.',
      },
    },
    {
      path: '/moves/:id(\\d+)',
      name: 'move',
      component: () => import('@/views/MoveView.vue'),
      props: route => ({ id: Number(route.params.id) }),
      beforeEnter: async to => {
        const move = (await loadMoves()).find(m => m.id === Number(to.params.id));
        if (!move) return notFound(to);
        to.meta.title = move.name;
        to.meta.description = `${move.name}: ${move.description}`;
      },
    },
    {
      path: '/abilities',
      name: 'abilities',
      component: () => import('@/views/AbilitiesView.vue'),
      meta: { title: 'Abilities', description: 'Every Pokémon ability, what it does and which Pokémon have it.' },
    },
    {
      path: '/abilities/:id(\\d+)',
      name: 'ability',
      component: () => import('@/views/AbilityView.vue'),
      props: route => ({ id: Number(route.params.id) }),
      beforeEnter: async to => {
        const ability = (await loadAbilities()).find(a => a.id === Number(to.params.id));
        if (!ability) return notFound(to);
        to.meta.title = ability.name;
        to.meta.description = `${ability.name}: ${ability.description}`;
      },
    },
    {
      path: '/items',
      name: 'items',
      component: () => import('@/views/ItemsView.vue'),
      meta: { title: 'Items', description: 'Poké Balls, medicine, berries, held items and key items.' },
    },
    {
      path: '/team',
      name: 'team',
      component: () => import('@/views/TeamView.vue'),
      meta: {
        title: 'Team builder',
        description: 'Build a team of six Pokémon and check its shared weaknesses and attack coverage.',
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
      path: '/quiz',
      name: 'quiz',
      component: () => import('@/views/QuizView.vue'),
      meta: { title: "Who's that Pokémon?", description: 'Guess the Pokémon from its silhouette and build a streak.' },
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
    // Filter changes and dialogs (?item=) on the same page keep the scroll position.
    if (to.path === from.path && to.query.page === from.query.page) return false;
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
