import { nextTick } from 'vue';
import type { Router } from 'vue-router';

/**
 * Wraps page changes in a view transition: the page cross-fades, and artwork with the same
 * `view-transition-name` (a card and the Pokémon page hero) moves into place. Skipped for the first
 * page, for query-only changes and when the user prefers reduced motion.
 */
export const installViewTransitions = (router: Router) => {
  let finish: (() => void) | undefined;
  const done = () => {
    finish?.();
    finish = undefined;
  };

  router.beforeResolve((to, from) => {
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!from.matched.length || to.path === from.path) return;
    // The old page is captured first; the navigation continues once the browser is ready for the new one.
    return new Promise<void>(resolve => {
      document.startViewTransition(
        () =>
          new Promise<void>(rendered => {
            finish = rendered;
            resolve();
          }),
      );
    });
  });

  router.afterEach(async () => {
    await nextTick();
    done();
  });
  router.onError(done);
};
