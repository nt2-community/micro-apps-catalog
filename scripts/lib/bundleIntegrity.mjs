import { createHash } from 'node:crypto';

export function sha384Integrity(bytes) {
	const digest = createHash('sha384').update(bytes).digest('base64');
	return `sha384-${digest}`;
}

export async function fetchBundleBytes(url) {
	const response = await fetch(url, { redirect: 'follow', cache: 'no-store' });
	if (!response.ok) {
		throw new Error(`HTTP ${response.status} fetching ${url}`);
	}
	return new Uint8Array(await response.arrayBuffer());
}

export async function verifyBundleIntegrity(url, expectedIntegrity) {
	const bytes = await fetchBundleBytes(url);
	const actual = sha384Integrity(bytes);
	if (actual !== expectedIntegrity) {
		throw new Error(`bundleIntegrity mismatch for ${url}\n  expected: ${expectedIntegrity}\n  actual:   ${actual}`);
	}
	return bytes;
}
