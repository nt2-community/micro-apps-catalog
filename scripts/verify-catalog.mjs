import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyEntryFile } from './verify-entry.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENTRIES_DIR = join(ROOT, 'catalog', 'entries');

const files = readdirSync(ENTRIES_DIR)
	.filter((name) => name.endsWith('.json'))
	.map((name) => join(ENTRIES_DIR, name))
	.sort();

if (files.length === 0) {
	console.error('No catalog entries found');
	process.exit(1);
}

for (const file of files) {
	await verifyEntryFile(file);
	console.log(`verified ${file}`);
}
