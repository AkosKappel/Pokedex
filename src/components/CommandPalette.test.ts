import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import CommandPalette from './CommandPalette.vue';

const routes = {
  home: '/',
  browse: '/pokemon',
  pokemon: '/pokemon/:id',
  moves: '/moves',
  abilities: '/abilities',
  items: '/items',
  team: '/team',
  favorites: '/favorites',
  compare: '/compare',
  quiz: '/quiz',
  about: '/about',
};
const router = createRouter({
  history: createMemoryHistory(),
  routes: Object.entries(routes).map(([name, path]) => ({ name, path, component: { template: '<div />' } })),
});

// jsdom has no modal dialogs and no scrolling.
beforeAll(() => {
  Element.prototype.scrollIntoView = () => {};
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
  };
});

let wrapper: VueWrapper;
afterEach(() => wrapper.unmount());

const setup = async () => {
  await router.push('/');
  wrapper = mount(CommandPalette, { global: { plugins: [router] }, attachTo: document.body });
  return wrapper;
};

const selectedLabel = () => wrapper.find('[aria-selected="true"] .label').text();

describe('CommandPalette', () => {
  it('opens with Ctrl+K and Cmd+K and closes on a second press', async () => {
    await setup();
    const dialog = wrapper.find('dialog').element;
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    expect(dialog.open).toBe(true);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'K', metaKey: true }));
    expect(dialog.open).toBe(false);
  });

  it('moves the selection with the arrow keys, wrapping around, and opens it with Enter', async () => {
    await setup();
    await wrapper.find('button').trigger('click');
    const input = wrapper.find('input');
    await input.setValue('pikachu');
    expect(selectedLabel()).toBe('Pikachu');
    expect(input.attributes('aria-activedescendant')).toBe('palette-pokemon-25');

    await input.trigger('keydown', { key: 'ArrowDown' });
    expect(selectedLabel()).toBe('Search Pokémon for “pikachu”');
    await input.trigger('keydown', { key: 'ArrowDown' });
    expect(selectedLabel()).toBe('Pikachu');
    await input.trigger('keydown', { key: 'ArrowUp' });
    expect(selectedLabel()).toBe('Search Pokémon for “pikachu”');
    await input.trigger('keydown', { key: 'ArrowDown' });

    await input.trigger('keydown', { key: 'Enter' });
    await new Promise(resolve => setTimeout(resolve));
    expect(router.currentRoute.value.fullPath).toBe('/pokemon/25');
    expect(wrapper.find('dialog').element.open).toBe(false);
  });
});
