import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import unicornPlugin from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';

import { baseImportRules } from './base-imports.rules.mjs';
import { baseNamingRules } from './base-naming.rules.mjs';
import { baseRestrictionRules } from './base-restrictions.rules.mjs';
import { baseStyleRules } from './base-style.rules.mjs';
import { baseTypeScriptRules } from './base-typescript.rules.mjs';

// Shared base for every TypeScript file in the project.
// Wires up the parser and plugins, then merges the small rule sets.
export const createBaseConfig = tsconfigRootDir => ({
	name: 'project/base',
	files: ['**/*.ts'],
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		parser: tseslint.parser,
		parserOptions: {
			// Finds the nearest tsconfig.json for each file. Needed only if you
			// add type-aware rules later; none of the rules below require it.
			projectService: true,
			tsconfigRootDir,
		},
	},
	plugins: {
		'@typescript-eslint': tseslint.plugin,
		import: importPlugin,
		unicorn: unicornPlugin,
		'@stylistic': stylistic,
	},
	settings: {
		'import/resolver': {
			node: { extensions: ['.ts', '.js'] },
		},
	},
	rules: {
		...baseStyleRules,
		...baseNamingRules,
		...baseImportRules,
		...baseTypeScriptRules,
		...baseRestrictionRules,
	},
});
