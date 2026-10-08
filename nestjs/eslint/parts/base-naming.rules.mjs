// Naming conventions and minimum identifier length.
// Exported as a list so layer configs can extend it instead of replacing it.
export const namingConvention = [
	{ selector: 'variable', format: ['camelCase'], leadingUnderscore: 'allow' },
	{ selector: 'variable', modifiers: ['const'], format: ['camelCase', 'UPPER_CASE'] },
	{ selector: 'function', format: ['camelCase'] },
	{ selector: ['class', 'interface', 'typeLike'], format: ['PascalCase'] },
	{ selector: 'enumMember', format: ['PascalCase'] },
];

export const baseNamingRules = {
	'id-length': [
		'error',
		{ min: 2, exceptions: ['i', 'j', 'id', 'db', 'qr', 'url', 'io'], properties: 'never' },
	],
	'@typescript-eslint/naming-convention': ['error', ...namingConvention],
};
