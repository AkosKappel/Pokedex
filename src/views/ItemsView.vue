<template>
  <div>
    <header class="page-header">
      <h1>Items</h1>
      <p class="lead">{{ results ? `${results.length} items` : 'Loading items…' }}</p>
    </header>

    <section class="filters" aria-label="Filters">
      <FilterSearch
        :model-value="query"
        label="Name"
        placeholder="Search items"
        @update:model-value="update({ q: $event })"
      />
      <fieldset class="pockets">
        <legend>Bag pocket</legend>
        <button type="button" class="pocket" :aria-pressed="!pocket" @click="update({ pocket: '' })">All</button>
        <button
          v-for="(label, value) in POCKETS"
          :key="value"
          type="button"
          class="pocket"
          :aria-pressed="pocket === value"
          @click="update({ pocket: value })"
        >
          {{ label }}
        </button>
      </fieldset>
    </section>

    <template v-if="results">
      <ul v-if="visible.length" class="items">
        <li v-for="item in visible" :key="item.id">
          <RouterLink :to="{ query: { ...route.query, item: item.slug } }" class="item">
            <ItemSprite :item="item" />
            <span class="label">
              <span class="name" :lang="lang">{{ itemName(item) }}</span>
              <span v-if="item.edition" class="edition">{{ item.edition }}</span>
            </span>
          </RouterLink>
        </li>
      </ul>
      <StatusMessage v-else title="No items match">Try another name or pocket.</StatusMessage>
      <PaginationNav :page="page" :total="totalPages" />
    </template>
    <div v-else class="skeleton-list items-skeleton" aria-busy="true">
      <SkeletonBlock v-for="n in 24" :key="n" height="3rem" radius="var(--radius-m)" />
    </div>

    <dialog ref="dialog" class="dialog" aria-labelledby="item-heading" @close="closeDialog" @click="onBackdropClick">
      <template v-if="selected">
        <div class="dialog-head">
          <ItemSprite :item="selected" :size="60" class="dialog-sprite" />
          <div>
            <h2 id="item-heading" :lang="lang">{{ itemName(selected) }}</h2>
            <p v-if="lang || selected.edition" class="english">
              {{ [lang && selected.name, selected.edition].filter(Boolean).join(', ') }}
            </p>
          </div>
          <form method="dialog">
            <button class="close" aria-label="Close">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
              </svg>
            </button>
          </form>
        </div>
        <p>{{ selected.description }}</p>
        <dl class="facts">
          <div>
            <dt>Pocket</dt>
            <dd>{{ POCKETS[selected.pocket] }}</dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{{ titleCase(selected.category) }}</dd>
          </div>
          <div v-if="selected.cost">
            <dt>Price</dt>
            <dd>₽{{ selected.cost.toLocaleString('en') }}</dd>
          </div>
        </dl>
      </template>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, shallowRef, useTemplateRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FilterSearch from '@/components/FilterSearch.vue';
import ItemSprite from '@/components/ItemSprite.vue';
import PaginationNav from '@/components/PaginationNav.vue';
import StatusMessage from '@/components/StatusMessage.vue';
import SkeletonBlock from '@/components/SkeletonBlock.vue';
import { filterItems, loadItems, POCKETS, type Item, type Pocket } from '@/lib/items';
import { pageCount, paginate } from '@/lib/pokedex';
import { titleCase } from '@/lib/format';
import { useLanguage } from '@/lib/language';
import { useListQuery } from '@/lib/useListQuery';

const PAGE_SIZE = 60;
const route = useRoute();
const router = useRouter();
const items = shallowRef<Item[]>();
onMounted(async () => (items.value = await loadItems()));

const { translations, itemName, lang } = useLanguage();
const totalPages = computed(() => pageCount(results.value?.length ?? 0, PAGE_SIZE));
const { param, page, update } = useListQuery(totalPages);

const query = computed(() => param('q'));
const pocket = computed(() => (param('pocket') in POCKETS ? (param('pocket') as Pocket) : undefined));

const results = computed(
  () =>
    items.value &&
    filterItems(items.value, { query: query.value, pocket: pocket.value, localNames: translations.value.items }),
);
const visible = computed(() => paginate(results.value ?? [], page.value, PAGE_SIZE));

// The open item lives in the URL (?item=potion), so it can be linked and closed with the back button.
const dialog = useTemplateRef('dialog');
const selected = computed(() => items.value?.find(item => item.slug === param('item')));

watch(selected, async item => {
  await nextTick();
  if (item && !dialog.value?.open) dialog.value?.showModal();
  if (!item && dialog.value?.open) dialog.value.close();
});

const closeDialog = () => {
  if (route.query.item) router.replace({ query: { ...route.query, item: undefined } });
};

// A click on the dialog element itself (not its content) is a click on the backdrop.
const onBackdropClick = (event: MouseEvent) => {
  if (event.target === dialog.value) dialog.value?.close();
};
</script>

<style scoped>
.skeleton-list {
  display: grid;
  gap: 0.5rem;
}

.abilities-skeleton {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
}

.items-skeleton {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));
}

.filters {
  display: grid;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  background: var(--panel);
}

.pockets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  border: 0;
}

legend {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.pocket {
  min-height: 2.25rem;
  padding: 0 0.85rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--panel);
  cursor: pointer;
}

.pocket:hover {
  border-color: var(--muted);
}

.pocket[aria-pressed='true'] {
  border-color: var(--ink);
  background: var(--ink);
  color: var(--paper);
}

.items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  height: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  background: var(--panel);
  text-decoration: none;
}

.item:hover {
  border-color: var(--muted);
}

.label {
  display: grid;
}

.name {
  font-weight: 500;
}

.edition {
  color: var(--muted);
  font-size: 0.8rem;
}

.dialog {
  width: min(100% - 2rem, 30rem);
  padding: 1.5rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-l);
  background: var(--panel);
  color: var(--ink);
}

.dialog::backdrop {
  background: rgb(10 15 20 / 0.55);
}

.dialog[open] {
  display: grid;
  gap: 1rem;
}

.dialog-head {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
}

.dialog-sprite {
  padding: 0.25rem;
  border-radius: var(--radius-m);
  background: var(--paper);
}

.english {
  color: var(--muted);
}

.close {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--panel);
  cursor: pointer;
}

.facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  gap: 0.75rem;
  margin: 0;
}

.facts dt {
  color: var(--muted);
  font-size: 0.85rem;
}

.facts dd {
  margin: 0;
  font-weight: 500;
}
</style>
