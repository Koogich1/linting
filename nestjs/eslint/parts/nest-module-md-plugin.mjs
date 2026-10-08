const NEST_MODULE_METADATA_KEYS = new Set(['imports', 'controllers', 'providers', 'exports']);

// Local ESLint plugin for NestJS modules.
// Reports one-line imports/controllers/providers/exports arrays inside @Module()
// once they have more than `maxInlineItems` elements.
// A local plugin is just an object with rules; no package needed.
export const nestModuleMdPlugin = {
	meta: { name: 'nest-module-metadata-multiline', version: '1.0.0' },
	rules: {
		'multiline-when-many': {
			meta: {
				type: 'layout',
				docs: {
					description:
						'Require multiline imports/controllers/providers/exports arrays in @Module() when they have many items.',
				},
				schema: [
					{
						type: 'object',
						properties: {
							maxInlineItems: {
								type: 'integer',
								minimum: 1,
								description: 'Maximum number of items allowed on a single line.',
							},
						},
						additionalProperties: false,
					},
				],
				messages: {
					needMultiline:
						'In @Module(), put "{{key}}" on multiple lines when it has more than {{max}} items.',
				},
			},
			defaultOptions: [{ maxInlineItems: 3 }],
			create(context) {
				const maxInline = context.options[0]?.maxInlineItems ?? 3;

				return {
					Property(node) {
						if (node.key.type !== 'Identifier' || !NEST_MODULE_METADATA_KEYS.has(node.key.name)) {
							return;
						}
						const obj = node.parent;
						if (!obj || obj.type !== 'ObjectExpression') {
							return;
						}
						const call = obj.parent;
						if (!call || call.type !== 'CallExpression') {
							return;
						}
						if (call.parent?.type !== 'Decorator') {
							return;
						}
						if (call.callee.type !== 'Identifier' || call.callee.name !== 'Module') {
							return;
						}
						if (node.value.type !== 'ArrayExpression') {
							return;
						}
						const arr = node.value;
						const totalCount = arr.elements.filter(el => el !== null).length;
						if (totalCount <= maxInline) {
							return;
						}
						if (arr.loc && arr.loc.start.line !== arr.loc.end.line) {
							return;
						}

						context.report({
							loc: arr.loc ?? node.loc,
							messageId: 'needMultiline',
							data: { key: node.key.name, max: String(maxInline) },
						});
					},
				};
			},
		},
	},
};
