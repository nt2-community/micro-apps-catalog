import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(ROOT, 'dist', 'catalog.json');
const destDir = join(ROOT, 'static');
mkdirSync(destDir, { recursive: true });
copyFileSync(src, join(destDir, 'catalog.json'));
console.log('Copied dist/catalog.json → static/catalog.json');
