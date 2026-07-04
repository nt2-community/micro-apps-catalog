import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMicroAppCatalogEntry } from './lib/catalogEntry.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENTRIES_DIR = join(ROOT, 'catalog', 'entries');
const OUT_PATH = join(ROOT, 'dist', 'catalog.json');

function loadEntries() {
	const files = readdirSync(ENTRIES_DIR)
		.filter((name) => name.endsWith('.json'))
		.sort();
	const entries = [];
	for (const file of files) {
		const raw = JSON.parse(readFileSync(join(ENTRIES_DIR, file), 'utf8'));
		entries.push(raw);
	}
	entries.sort((a, b) => String(a.id).localeCompare(String(b.id)));
	return entries;
}

mkdirSync(join(ROOT, 'dist'), { recursive: true });
const entries = loadEntries();
for (const entry of entries) {
	parseMicroAppCatalogEntry(entry);
}
writeFileSync(OUT_PATH, `${JSON.stringify(entries, null, 2)}\n`, 'utf8');
console.log(`Wrote ${entries.length} entries → dist/catalog.json`);
