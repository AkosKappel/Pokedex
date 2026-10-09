<template>
  <HeaderPopover id="language-menu" ref="popover" :label="`Pokémon names: ${LANGUAGES[language].label}`">
    <template #button>
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" />
        <path
          d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        />
      </svg>
      <span class="code">{{ language === 'en' ? 'EN' : language.slice(0, 2).toUpperCase() }}</span>
    </template>
    <fieldset>
      <legend>Pokémon names and descriptions</legend>
      <label v-for="(info, code) in LANGUAGES" :key="code" class="option">
        <input type="radio" name="language" :value="code" :checked="code === language" @change="choose(code)" />
        <span :lang="code">{{ info.label }}</span>
      </label>
      <p class="hint">The rest of the site stays in English.</p>
    </fieldset>
  </HeaderPopover>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';
import HeaderPopover from './HeaderPopover.vue';
import { LANGUAGES, useLanguage, type Language } from '@/lib/language';

const { language, setLanguage } = useLanguage();
const popover = useTemplateRef('popover');

const choose = async (code: Language) => {
  await setLanguage(code);
  popover.value?.close();
};
</script>

<style scoped>
fieldset {
  display: grid;
  margin: 0;
  padding: 0.25rem;
  border: 0;
}

legend {
  padding: 0.4rem 0.5rem;
  color: var(--muted);
  font-size: 0.85rem;
}

.option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 2.5rem;
  padding: 0 0.6rem;
  border-radius: var(--radius-s);
  cursor: pointer;
}

.option:hover {
  background: var(--paper);
}

.option:has(input:checked) {
  font-weight: 600;
}

input {
  accent-color: var(--red);
}

.hint {
  padding: 0.4rem 0.5rem 0.2rem;
  color: var(--muted);
  font-size: 0.8rem;
}

.code {
  font-size: 0.8rem;
  font-weight: 600;
}
</style>
