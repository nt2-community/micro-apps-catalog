import { readFileSync } from 'node:fs';
import { verifyBundleIntegrity } from './lib/bundleIntegrity.mjs';
import { parseMicroAppCatalogEntry } from './lib/catalogEntry.mjs';
import { verifyCatalogSignature } from './lib/catalogCrypto.mjs';

const skipIntegrity =
	process.argv.includes('--skip-integrity') || process.env.CATALOG_SKIP_INTEGRITY === '1';

/**
 * @param {string} entryPath
 */
export async function verifyEntryFile(entryPath) {
	const raw = JSON.parse(readFileSync(entryPath, 'utf8'));
	const entry = parseMicroAppCatalogEntry(raw);
	if (!verifyCatalogSignature(entry)) {
		throw new Error(`${entryPath}: catalogSignature verification failed`);
	}
	if (!skipIntegrity) {
		await verifyBundleIntegrity(entry.bundleUrl, entry.bundleIntegrity);
	}
	return entry;
}
