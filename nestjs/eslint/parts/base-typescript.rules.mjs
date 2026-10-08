// TypeScript strictness: no any, explicit types at module boundaries,
// unused variables are errors unless prefixed with an underscore.
export const baseTypeScriptRules = {
	'no-unused-vars': 'off',
	'@typescript-eslint/no-unused-vars': [
		'error',
		{
			args: 'after-used',
			argsIgnorePattern: '^_',
			varsIgnorePattern: '^_',
			caughtErrors: 'all',
			caughtErrorsIgnorePattern: '^_',
			ignoreRestSiblings: true,
		},
	],
	'@typescript-eslint/no-explicit-any': 'error',
	'@typescript-eslint/no-empty-object-type': 'error',
	'@typescript-eslint/no-unsafe-function-type': 'error',
	'@typescript-eslint/no-wrapper-object-types': 'error',
	'@typescript-eslint/explicit-module-boundary-types': 'error',
	'@typescript-eslint/typedef': [
		'error',
		{ parameter: true, propertyDeclaration: true, memberVariableDeclaration: true },
	],
};
