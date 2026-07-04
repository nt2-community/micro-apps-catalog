import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMicroAppCatalogEntry } from './lib/catalogEntry.mjs';
import { demoSigningPrivateKey, publicJwkFromPrivateKey, signCatalogEntry } from './lib/catalogCrypto.mjs';

const entryPath = process.argv[2];
if (!entryPath) {
	console.error('Usage: node scripts/sign-entry.mjs catalog/entries/my-app.json');
	process.exit(1);
}

const privateKeyHex = process.env.CATALOG_SIGNING_SEED_HEX;
const privateKey = privateKeyHex
	? (await import('@noble/curves/ed25519.js')).ed25519.utils.randomPrivateKey(
			Uint8Array.from(Buffer.from(privateKeyHex, 'hex'))
		)
	: demoSigningPrivateKey();

const signPubJwk = publicJwkFromPrivateKey(privateKey);
const raw = JSON.parse(readFileSync(entryPath, 'utf8'));
raw.signPubJwk = signPubJwk;
raw.catalogSignature = '';
parseMicroAppCatalogEntry({ ...raw, catalogSignature: 'placeholder' });
raw.catalogSignature = signCatalogEntry(raw, privateKey);
writeFileSync(entryPath, `${JSON.stringify(raw, null, 2)}\n`);
console.log(`Signed ${entryPath} with publisher ${raw.publisherKeyDid}`);
