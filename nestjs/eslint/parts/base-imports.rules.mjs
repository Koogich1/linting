// Import order and grouping.
// One predictable order means import blocks never show up as noise in diffs.
export const baseImportRules = {
	'import/order': [
		'error',
		{
			groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
			'newlines-between': 'always',
			alphabetize: { order: 'asc', caseInsensitive: true },
		},
	],
	'import/newline-after-import': ['error', { count: 1 }],
	'import/no-absolute-path': 'error',
	// TypeScript already reports unresolved imports.
	'import/no-unresolved': 'off',
};
