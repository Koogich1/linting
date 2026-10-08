// Lints every example and checks that exactly the expected rules fire.
// Bad examples must trigger their rule; good examples must be clean.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ESLint } from 'eslint';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const cases = JSON.parse(
	await (await import('node:fs/promises')).readFile(path.join(root, 'scripts/cases.json'), 'utf8')
);

let failed = 0;
const engines = new Map();

for (const { dir, file, expect } of cases) {
	if (!engines.has(dir)) engines.set(dir, new ESLint({ cwd: path.join(root, dir) }));
	const [result] = await engines.get(dir).lintFiles([file]);
	const fired = [...new Set(result.messages.map(m => m.ruleId ?? 'PARSE_ERROR'))].sort();
	const wanted = [...expect].sort();
	const ok = JSON.stringify(fired) === JSON.stringify(wanted);
	if (!ok) failed++;
	console.log(`${ok ? 'PASS' : 'FAIL'}  ${dir}/${file}`);
	if (!ok) {
		console.log(`      expected: ${wanted.join(', ') || '(clean)'}`);
		console.log(`      got:      ${fired.join(', ') || '(clean)'}`);
		for (const m of result.messages) console.log(`        L${m.line} ${m.ruleId}: ${m.message}`);
	}
}

console.log(`\n${cases.length - failed}/${cases.length} passed`);
process.exit(failed ? 1 : 0);
