# layered-eslint-config

ESLint flat config split by responsibility and by layer, for NestJS + Drizzle backends and Next.js + Feature-Sliced Design frontends.

## Why

Models are fast and inconsistent. Every generated file names things differently and reaches for a different API, so reviewing a diff means learning someone's naming first and reading the logic second.

Review comments don't scale to that. Lint rules do, and their errors go straight back into the agent loop: after a few files, the generated code follows the convention on its own.

## Layout

```
nestjs/
  eslint.config.mjs                 assembles everything
  eslint/parts/
    base.config.mjs                 parser, plugins, merges the base rule sets
    base-style.rules.mjs            file naming (formatting is Prettier's job)
    base-imports.rules.mjs          import order and grouping
    base-naming.rules.mjs           case rules, minimum identifier length
    base-typescript.rules.mjs       no any, explicit types at module boundaries
    base-restrictions.rules.mjs     project-wide banned patterns
    schemas.config.mjs              only src/**/schemas/*.ts
    repositories.config.mjs         only *.repository.ts
    dtos.config.mjs                 only src/**/dto(s)/*.ts
    nest-modules.config.mjs         only *.module.ts
    nest-module-md-plugin.mjs       an 80-line local ESLint plugin
  src/                              demo code used by the tests

nextjs-fsd/
  eslint.config.mjs                 Next.js + FSD layer graph + public API imports
  src/                              demo FSD tree used by the tests

scripts/verify.mjs                  checks every rule fires where it should
```

## Two ideas

**Split by responsibility.** Eleven small files instead of one 400-line config. Each file starts with a comment saying what it controls. When a rule fires, you know which file to open. So does the model.

**Rules per layer.** A flat config block with a `files` glob applies only to that layer. The repository layer gets a naming vocabulary, DTOs get validator rules, schemas get timestamp checks, and nothing leaks into the rest of the project.

## Backend rules

| Layer        | Rule                                                                                            | Why                                                                |
| ------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Repositories | Local variables may only be `row, rows, result, results, entity, entities, conditions, payload` | Every model invents its own names: `data`, `res`, `item`, `tmp`    |
| DTOs         | No `message` in class-validator decorators                                                      | The backend returns codes, the frontend owns the text              |
| Everywhere   | No `value === true` inside `@Transform`                                                         | Query strings arrive as `"true"`, so this silently returns `false` |
| Everywhere   | No `db.query.<table>.findFirst/findMany`                                                        | Explicit `.select().from()` queries look the same in every file    |
| Everywhere   | No free text in `ConflictException`                                                             | Errors are codes, mapped to messages in one place                  |
| Schemas      | Every `pgTable` has `createdAt` and `updatedAt`                                                 | Models forget `updatedAt` constantly                               |
| Nest modules | `imports/providers/...` arrays with more than 3 items must be multiline                         | A one-line array of twelve providers makes the diff useless        |

Open question in the repository rule: people want to name a variable after its table (`users`, `orders`). Fair, but then the rule has to know table names.

## Frontend rules

- **FSD layer graph** via `eslint-plugin-boundaries`: `app → pages → widgets → features → entities → shared`, each layer imports only from layers below. Starts as `warn` for adoption on an existing codebase.
- **Public API only**: `@/features/auth` is fine, `@/features/auth/ui/LoginForm` is not.
- Unused imports, sorted imports, Effector rules (delete that block if you don't use Effector).

## Use it

**Backend.** Copy `nestjs/eslint.config.mjs` and `nestjs/eslint/` to your project root, then:

```bash
pnpm add -D eslint typescript typescript-eslint eslint-plugin-import eslint-plugin-unicorn @stylistic/eslint-plugin eslint-config-prettier prettier
```

Adjust the globs in the layer configs if your folders differ, and add `**/*.module.ts` to `.prettierignore` (see below why).

**Frontend.** Copy `nextjs-fsd/eslint.config.mjs`, then:

```bash
pnpm add -D eslint eslint-config-next eslint-config-prettier eslint-plugin-boundaries eslint-plugin-import-x eslint-import-resolver-typescript eslint-plugin-simple-import-sort eslint-plugin-unused-imports eslint-plugin-effector
```

Assumes the `@/*` → `src/*` path alias in `tsconfig.json`.

## Verify

```bash
pnpm install
pnpm test
```

Lints the demo code in `nestjs/src` and `nextjs-fsd/src`. Every bad example must trigger exactly its rule, every good example must be clean. CI runs the same on each push.

## Things that bit us

Worth reading even if you never use this config.

1. **ESLint replaces rule options between config blocks, it doesn't merge them.** A layer config that sets `no-restricted-syntax` drops every project-wide ban for those files. In the first version of this config, the `@Transform` ban never ran in DTOs, the one place `@Transform` is actually used. Fix: export the base lists and spread them into layer configs.
2. **AST selectors fail silently.** A selector that matches nothing raises no error, it just never fires. Two selectors in the first version, validator `message` and `db.query.*`, matched nothing for months. Fix: every rule here has a bad example that must trigger it.
3. **`eslint-config-prettier` turns off formatting rules, `@stylistic` included.** With Prettier last in the chain, quote and semicolon rules in ESLint do nothing.
4. **A custom layout rule can fight Prettier.** The `@Module()` plugin wants arrays of 4+ items on separate lines, Prettier collapses any array that fits in `printWidth`. They loop forever. Fix: `**/*.module.ts` goes into `.prettierignore`, so ESLint alone owns module files.
5. **A pre-commit config that nothing calls is not a gate.** A `lint-staged` config without a hook runner does nothing, and a hook that lives only in your home directory checks only your commits. Put the hook in the repo and run the same checks in CI.

## Wire it into commits and CI

```bash
pnpm add -D husky lint-staged
pnpm exec husky init
echo "pnpm exec lint-staged" > .husky/pre-commit
```

```json
{
	"lint-staged": {
		"src/**/*.{ts,tsx}": ["eslint --fix", "prettier --write"]
	}
}
```

`husky init` adds a `prepare` script, so the hook installs itself on `pnpm install` for everyone on the team. Then run `eslint .` in CI as well, so a missing local hook stops mattering.

## License

MIT
