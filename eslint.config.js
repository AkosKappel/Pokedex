import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import { globalIgnores } from 'eslint/config';

export default defineConfigWithVueTs(
  globalIgnores(['dist', '.worktrees', 'lighthouse-report', 'test-results', 'playwright-report']),
  {
    languageOptions: { globals: globals.browser },
  },
  js.configs.recommended,
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  prettier,
);
