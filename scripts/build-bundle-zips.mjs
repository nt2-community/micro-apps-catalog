import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync } from 'fflate';
import { sha384Integrity } from './lib/bundleIntegrity.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURES = join(ROOT, 'fixtures', 'bundles');
const OUT_DIR = join(ROOT, 'release-assets');

function sha384Base64(bytes) {
	return createHash('sha384').update(bytes).digest('base64');
}

function ensureDemoNotesManifest() {
	const bundleDir = join(FIXTURES, 'nt2-app-demo-notes');
	const htmlPath = join(bundleDir, 'index.html');
	const htmlBytes = readFileSync(htmlPath);
	const integrity = `sha384-${sha384Base64(htmlBytes)}`;
	const manifest = {
		id: 'nt2-app-demo-notes',
		version: '0.1.0',
		sdkVersion: '1.0.0',
		publisher: 'did:key:z6MkcommunityCatalogDemoPublisher00000000001',
		permissions: ['vault:status', 'items:list:note'],
		entry: {
			type: 'iframe',
			path: 'index.html',
			integrity
		},
		routes: [{ path: '/', label: 'Notes demo' }],
		minHostVersion: '0.0.1'
	};
	writeFileSync(join(bundleDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
}

function zipBundle(appId, version) {
	const bundleDir = join(FIXTURES, appId);
	const files = readdirSync(bundleDir).filter((f) => !f.startsWith('.'));
	/** @type {Record<string, Uint8Array>} */
	const zipInput = {};
	for (const name of files) {
		zipInput[name] = readFileSync(join(bundleDir, name));
	}
	const zipped = zipSync(zipInput);
	const outName = `${appId}-${version}.nt2app`;
	mkdirSync(OUT_DIR, { recursive: true });
	const outPath = join(OUT_DIR, outName);
	writeFileSync(outPath, zipped);
	const integrity = sha384Integrity(zipped);
	console.log(`${outName} → ${integrity}`);
	return { outPath, outName, integrity, bytes: zipped };
}

ensureDemoNotesManifest();
const hello = zipBundle('nt2-app-hello', '0.0.1');
const demo = zipBundle('nt2-app-demo-notes', '0.1.0');

writeFileSync(
	join(OUT_DIR, 'manifest.json'),
	`${JSON.stringify(
		{
			releaseTag: 'v0.1.1',
			assets: [
				{ file: hello.outName, bundleIntegrity: hello.integrity, appId: 'nt2-app-hello' },
				{ file: demo.outName, bundleIntegrity: demo.integrity, appId: 'nt2-app-demo-notes' }
			]
		},
		null,
		2
	)}\n`
);

console.log('Built release-assets/*.nt2app');
