// Project-wide bans on specific patterns, written as AST selectors.
// Exported as a list: ESLint does not merge `no-restricted-syntax` between
// config blocks, it replaces it. A layer config that sets its own list must
// spread this one in, or every ban below silently stops working in that layer.
export const restrictedSyntax = [
	{
		selector:
			'CallExpression[callee.name="Transform"] > ArrowFunctionExpression:has(BinaryExpression[operator="==="][right.value=true])',
		message:
			'Do not cast to boolean inside @Transform by comparing with `true`: query strings arrive as "true"/"false" and this silently returns false.',
	},
	{
		// Drizzle relational API: db.query.<table>.findFirst / findMany
		selector:
			'MemberExpression[property.name=/^(findFirst|findMany)$/][object.object.property.name="query"]',
		message:
			'Use an explicit `.select().from()` query instead of `db.query.<table>.findFirst/findMany`.',
	},
	{
		// Extend the regex to cover other HTTP exceptions if you want the same policy there.
		selector: 'NewExpression[callee.name="ConflictException"][arguments.0.type="Literal"]',
		message:
			'Do not pass free text to ConflictException: throw an error code and map it to a message in one place.',
	},
];

export const baseRestrictionRules = {
	'no-restricted-syntax': ['error', ...restrictedSyntax],
};
