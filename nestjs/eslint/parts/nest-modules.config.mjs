import { nestModuleMdPlugin } from './nest-module-md-plugin.mjs';

// NestJS module files only.
// Long one-line arrays in @Module() turn every diff into one changed line.
//
// Conflicts with Prettier: Prettier collapses any array that fits in printWidth
// back onto one line, and has no option to stop it. Add `**/*.module.ts` to
// .prettierignore so ESLint alone owns the format of module files.
export const nestModulesConfig = {
	name: 'project/nest-module-metadata-arrays',
	files: ['**/*.module.ts'],
	plugins: {
		'nest-module-md': nestModuleMdPlugin,
	},
	rules: {
		'nest-module-md/multiline-when-many': ['error', { maxInlineItems: 3 }],
	},
};
