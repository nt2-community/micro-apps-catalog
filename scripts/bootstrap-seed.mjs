import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	demoSigningPrivateKey,
	publicJwkFromPrivateKey,
	signCatalogEntry
} from './lib/catalogCrypto.mjs';

// Build .nt2app fixtures first
await import('./build-bundle-zips.mjs');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RELEASE_MANIFEST = JSON.parse(
	readFileSync(join(ROOT, 'release-assets', 'manifest.json'), 'utf8')
);

const REPO = 'nt2-community/micro-apps-catalog';
const RELEASE_TAG = RELEASE_MANIFEST.releaseTag;
const PUBLISHER_DID = 'did:key:z6MkcommunityCatalogDemoPublisher00000000001';

const privateKey = demoSigningPrivateKey();
const signPubJwk = publicJwkFromPrivateKey(privateKey);

/** @type {Record<string, { name: string; description: string; version: string; maturity: string; categories: string[]; tags: string[]; permissions: string[]; homepageUrl?: string; repositoryUrl?: string }>} */
const META = {
	'nt2-app-hello': {
		name: 'NT² Hello',
		description:
			'Official pilot micro-app — lists vault status and creates notes via the Vault SDK. Shipped with NT² for dev and staging.',
		version: '0.0.1',
		maturity: 'graduated',
		categories: ['productivity', 'official'],
		tags: ['pilot', 'notes', 'sdk'],
		permissions: ['vault:status', 'items:list:note', 'items:create:note'],
		homepageUrl: 'https://github.com/nt2-community/micro-apps-catalog',
		repositoryUrl: 'https://github.com/nt2-community/micro-apps-catalog'
	},
	'nt2-app-demo-notes': {
		name: 'Notes demo (incubating)',
		description:
			'Minimal incubating example — read-only note list. Demonstrates community catalog PR workflow.',
		version: '0.1.0',
		maturity: 'incubating',
		categories: ['productivity', 'demo'],
		tags: ['example', 'incubating'],
		permissions: ['vault:status', 'items:list:note'],
		repositoryUrl: 'https://github.com/nt2-community/micro-apps-catalog'
	}
};

for (const asset of RELEASE_MANIFEST.assets) {
	const meta = META[asset.appId];
	if (!meta) continue;
	const bundleUrl = `https://github.com/${REPO}/releases/download/${RELEASE_TAG}/${asset.file}`;
	const unsigned = {
		id: asset.appId,
		name: meta.name,
		description: meta.description,
		publisherKeyDid: PUBLISHER_DID,
		signPubJwk,
		catalogSignature: '',
		latestVersion: meta.version,
		permissions: meta.permissions,
		bundleIntegrity: asset.bundleIntegrity,
		bundleUrl,
		categories: meta.categories,
		tags: meta.tags,
		maturity: meta.maturity,
		minSdkVersion: '1.0.0',
		...(meta.homepageUrl ? { homepageUrl: meta.homepageUrl } : {}),
		...(meta.repositoryUrl ? { repositoryUrl: meta.repositoryUrl } : {})
	};
	unsigned.catalogSignature = signCatalogEntry(unsigned, privateKey);
	const outPath = join(ROOT, 'catalog', 'entries', `${asset.appId}.json`);
	writeFileSync(outPath, `${JSON.stringify(unsigned, null, 2)}\n`);
	console.log(`Wrote catalog/entries/${asset.appId}.json`);
}
