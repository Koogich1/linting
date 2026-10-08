import { globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

import { createBaseConfig } from './eslint/parts/base.config.mjs';
import { dtosConfig } from './eslint/parts/dtos.config.mjs';
import { nestModulesConfig } from './eslint/parts/nest-modules.config.mjs';
import { repositoriesConfig } from './eslint/parts/repositories.config.mjs';
import { schemasConfig } from './eslint/parts/schemas.config.mjs';

// Entry point. Assembles the parts into one flat config.
// Order matters: later entries override earlier ones for the files they match.
export default tseslint.config(
	// Paths ESLint should never look at.
	globalIgnores(['node_modules/**', 'dist/**', 'coverage/**', '**/migrations/**', '*.js', '*.cjs']),

	// Rules for every .ts file.
	createBaseConfig(import.meta.dirname),

	// Layer-specific rules. Each one only applies to its own glob.
	schemasConfig,
	repositoriesConfig,
	dtosConfig,
	nestModulesConfig,

	// Must stay last: turns off every rule that would fight Prettier.
	eslintConfigPrettier
);
