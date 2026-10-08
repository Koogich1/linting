import { restrictedSyntax } from './base-restrictions.rules.mjs';

// Database schema files only (Drizzle `pgTable`).
// Every table gets createdAt and updatedAt. Models forget updatedAt constantly.
export const schemasConfig = {
	name: 'project/schemas',
	files: ['src/**/schemas/*.ts'],
	rules: {
		'no-restricted-syntax': [
			// Switch to 'warn' to roll this out on an existing schema gradually.
			'error',
			...restrictedSyntax,
			{
				selector:
					'CallExpression[callee.name="pgTable"][arguments.1.type="ObjectExpression"]:matches(:not(:has(Property[key.name="createdAt"])), :not(:has(Property[key.name="updatedAt"])))',
				message: 'Every pgTable needs `createdAt` and `updatedAt` columns.',
			},
		],
	},
};
