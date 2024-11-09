import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/pokemons',
    name: 'pokemons',
    component: () => import('../views/PokemonsView.vue'),
  },
  {
    path: '/pokemon/:id',
    name: 'pokemon',
    component: () => import('../views/PokemonView.vue'),
  },
  {
    path: '/items',
    name: 'items',
    component: () => import('../views/ItemsView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
