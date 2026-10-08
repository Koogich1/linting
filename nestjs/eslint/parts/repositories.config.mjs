import { namingConvention } from './base-naming.rules.mjs';

// Repository layer only.
// Most repository code is generated, and every model invents its own names
// (data, res, item, userData, tmp...). Here local variables get a fixed vocabulary.
//
// Open question: people want to name a variable after its table (`users`,
// `orders`). Fair, but then the rule has to know table names.
const ALLOWED_NAMES = 'row|rows|result|results|entity|entities|conditions|payload';

export const repositoriesConfig = {
	name: 'project/repositories',
	files: ['src/**/modules/*/*.repository.ts', 'src/**/infrastructure/*/*.repository.ts'],
	rules: {
		'@typescript-eslint/naming-convention': [
			'error',
			// Keep base naming for functions, classes and types; only variables change.
			...namingConvention.filter(entry => entry.selector !== 'variable'),
			{
				selector: 'variable',
				format: ['camelCase'],
				custom: { regex: `^(${ALLOWED_NAMES})$`, match: true },
			},
		],
	},
};
