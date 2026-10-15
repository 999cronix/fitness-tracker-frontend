import { globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import pluginVitest from '@vitest/eslint-plugin'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

// Statt @vue/eslint-config-typescript nutzen wir typescript-eslint direkt.
// Grund: Das Wrapper-Paket zieht fast-glob und damit braces (Sicherheitsmeldung, noch kein Patch).
export default tseslint.config(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/essential'],
  ...tseslint.configs.recommended,

  {
    // In .vue-Dateien liest der Vue-Parser das Template, TypeScript-Code geht an den TS-Parser.
    // Der Vue-Parser muss hier wieder gesetzt werden, weil tseslint.configs.recommended den TS-Parser für alle Dateien setzt.
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tseslint.parser },
    },
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  skipFormatting,
)
