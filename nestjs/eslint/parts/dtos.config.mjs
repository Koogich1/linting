import { restrictedSyntax } from './base-restrictions.rules.mjs';

// DTO files only.
// The backend returns error codes; the text the user sees is the frontend's job.
// Models add English messages to validators by default, so this blocks it.
const VALIDATORS =
	'MinLength|MaxLength|IsString|IsOptional|IsEmail|IsNumber|ValidateNested|IsArray|IsBoolean|IsDate|IsUUID|Matches|Length|Min|Max';

export const dtosConfig = {
	name: 'project/dtos',
	files: ['src/**/dtos/*.ts', 'src/**/dto/*.ts'],
	rules: {
		'no-restricted-syntax': [
			'error',
			// Keep the project-wide bans; see base-restrictions.rules.mjs for why.
			...restrictedSyntax,
			{
				selector: `Decorator > CallExpression[callee.name=/^(${VALIDATORS})$/] Property[key.name="message"]`,
				message:
					'Do not set `message` in validation decorators: return a code and let the frontend own the text.',
			},
		],
	},
};
