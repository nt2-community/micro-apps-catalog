/**
 * Catalog canonical JSON + Ed25519 verify (subset of NT² vault-sdk-protocol / microAppSignature).
 * @see https://github.com/nt2/nt2 — pkgs/vault-sdk-protocol, apps/web microAppSignature.ts
 */
import { ed25519 } from '@noble/curves/ed25519.js';
import { sha256 } from '@noble/hashes/sha2.js';

function isRecord(value) {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function sortKeysRecursive(value) {
	if (Array.isArray(value)) {
		return value.map(sortKeysRecursive);
	}
	if (isRecord(value)) {
		const keys = Object.keys(value).sort();
		const out = {};
		for (const key of keys) {
			out[key] = sortKeysRecursive(value[key]);
		}
		return out;
	}
	return value;
}

export function canonicalJsonBytes(value) {
	return new TextEncoder().encode(JSON.stringify(sortKeysRecursive(value)));
}

/** Catalog entry bytes for signature verify — all fields except `catalogSignature`. */
export function canonicalCatalogEntryBytes(entry) {
	const { catalogSignature: _sig, ...unsigned } = entry;
	return canonicalJsonBytes(unsigned);
}

export function verifyPublisherKeyDid(publisherKeyDid) {
	return (
		typeof publisherKeyDid === 'string' &&
		publisherKeyDid.startsWith('did:key:') &&
		publisherKeyDid.length > 'did:key:'.length
	);
}

function base64ToBytes(b64) {
	const normalized = b64.replace(/-/g, '+').replace(/_/g, '/');
	const padLen = (4 - (normalized.length % 4)) % 4;
	const padded = normalized + '='.repeat(padLen);
	const binary = atob(padded);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}

function ed25519PublicKeyFromJwk(jwk) {
	if (jwk.kty !== 'OKP' || jwk.crv !== 'Ed25519' || typeof jwk.x !== 'string') {
		return null;
	}
	try {
		return base64ToBytes(jwk.x);
	} catch {
		return null;
	}
}

export function verifyCatalogSignature(entry) {
	if (!verifyPublisherKeyDid(entry.publisherKeyDid)) {
		return false;
	}
	const pubKeyBytes = ed25519PublicKeyFromJwk(entry.signPubJwk);
	if (!pubKeyBytes) {
		return false;
	}
	let signature;
	try {
		signature = base64ToBytes(entry.catalogSignature);
	} catch {
		return false;
	}
	const payloadBytes = canonicalCatalogEntryBytes(entry);
	try {
		return ed25519.verify(signature, payloadBytes, pubKeyBytes);
	} catch {
		return false;
	}
}

export function signCatalogEntry(entry, privateKey) {
	const payloadBytes = canonicalCatalogEntryBytes(entry);
	const signatureBytes = ed25519.sign(payloadBytes, privateKey);
	let binary = '';
	for (const byte of signatureBytes) {
		binary += String.fromCharCode(byte);
	}
	return btoa(binary);
}

export function demoSigningPrivateKey() {
	/** Deterministic demo key — replace with author Vault Key DID for real listings. */
	const seed = new TextEncoder().encode('nt2-community-catalog-demo-signing-v1');
	return ed25519.utils.randomPrivateKey(sha256(seed));
}

export function publicJwkFromPrivateKey(privateKey) {
	const publicKey = ed25519.getPublicKey(privateKey);
	let binary = '';
	for (const byte of publicKey) {
		binary += String.fromCharCode(byte);
	}
	const x = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
	return { kty: 'OKP', crv: 'Ed25519', x };
}
