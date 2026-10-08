import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
import boundaries from 'eslint-plugin-boundaries'
import effector from 'eslint-plugin-effector'
import { importX } from 'eslint-plugin-import-x'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const tsconfigPath = path.join(__dirname, 'tsconfig.json')

// effector.flatConfigs.recommended is an object in some versions and an array in others.
const effectorRecommended = Array.isArray(effector.flatConfigs.recommended)
  ? effector.flatConfigs.recommended
  : [effector.flatConfigs.recommended]

export default defineConfig([
  globalIgnores([
    '.next/**',
    'out/**',
    'dist/**',
    'coverage/**',
    'node_modules/**',
    'next-env.d.ts',
    '**/*.d.ts',
    'eslint.config.*',
  ]),
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
  },

  // Effector state manager rules. Delete this block if you don't use Effector.
  ...effectorRecommended.map((cfg) => ({
    ...cfg,
    files: ['src/**/*.{ts,tsx}'],
  })),

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      boundaries,
      'import-x': importX,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },

    settings: {
      // Absolute tsconfig path, so the `@/` alias resolves even when ESLint runs
      // from a monorepo root. eslint-plugin-boundaries reads 'import/resolver',
      // import-x reads its own key, so both are set.
      'import/resolver': {
        typescript: { alwaysTryTypes: true, project: [tsconfigPath] },
        node: true,
      },
      'import-x/resolver': {
        typescript: { alwaysTryTypes: true, project: [tsconfigPath] },
        node: true,
      },

      // Feature-Sliced Design layers, top to bottom.
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**' },
        { type: 'pages', pattern: 'src/pages/**' },
        { type: 'widgets', pattern: 'src/widgets/**' },
        { type: 'features', pattern: 'src/features/**' },
        { type: 'entities', pattern: 'src/entities/**' },
        { type: 'shared', pattern: 'src/shared/**' },
      ],
    },

    rules: {
      'react-hooks/set-state-in-effect': 'warn',

      // Unused code and import order
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import-x/no-unresolved': 'off',
      'import-x/no-internal-modules': 'off',

      // Slices are imported only through their public API (index.ts).
      // Assumes the `@/*` -> `src/*` path alias.
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              group: ['@/widgets/*/*', '@/widgets/*/*/**'],
              message: 'Import widgets through their public API: "@/widgets/<slice>" (index.ts).',
            },
            {
              group: ['@/features/*/*', '@/features/*/*/**'],
              message: 'Import features through their public API: "@/features/<slice>" (index.ts).',
            },
            {
              group: ['@/entities/*/*', '@/entities/*/*/**'],
              message: 'Import entities through their public API: "@/entities/<slice>" (index.ts).',
            },
          ],
        },
      ],

      // FSD layer graph: a layer may only import from layers below it.
      // Starts as 'warn' so you can adopt it on an existing codebase;
      // switch to 'error' once the warnings are gone.
      //
      // Same-layer imports are allowed because each layer is matched as one
      // element, so imports inside a slice count as same-layer too. Cross-slice
      // imports on one layer are therefore not checked here.
      'boundaries/element-types': [
        'warn',
        {
          default: 'disallow',
          rules: [
            { from: 'app', allow: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'] },
            { from: 'pages', allow: ['pages', 'widgets', 'features', 'entities', 'shared'] },
            { from: 'widgets', allow: ['widgets', 'features', 'entities', 'shared'] },
            // A common compromise is to let features import widgets, e.g. to open
            // a modal. It breaks the layer order; add 'widgets' here only on purpose.
            { from: 'features', allow: ['features', 'entities', 'shared'] },
            { from: 'entities', allow: ['entities', 'shared'] },
            { from: 'shared', allow: ['shared'] },
          ],
        },
      ],
    },
  },

  // Escape hatch: low-level API and utility code may need `any`.
  {
    files: ['src/shared/api/**/*.{ts,tsx}', 'src/shared/utils/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
    },
  },
  {
    files: ['**/*.config.*', '**/scripts/**'],
    rules: { 'no-restricted-imports': 'off' },
  },
])
