/**
 * MicroAppCatalogEntry parse + bundleUrl allowlist (spec 126f).
 */

const MICRO_APP_ID_SLUG_REGEX = /^[a-z0-9-]+$/;
const MICRO_APP_ID_MAX_LENGTH = 64;
const SRI_SHA384_REGEX = /^sha384-[A-Za-z0-9+/=]+$/;
const GITHUB_RELEASE_DOWNLOAD_PATH = /^\/[^/]+\/[^/]+\/releases\/download\/[^/]+\/.+$/;

const KNOWN_PERMISSIONS = new Set([
	'vault:status',
	'feed:read',
	'feed:publish',
	'feed:manage',
	'contacts:read',
	'contacts:write'
]);

function isRecord(value) {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value) {
	return typeof value === 'string' && value.length > 0;
}

function isKeyDid(value) {
	const trimmed = value.trim();
	return trimmed.startsWith('did:key:') && trimmed.length >= 12 && trimmed.length <= 512;
}

function isJsonWebKey(value) {
	return isRecord(value) && isNonEmptyString(value.kty);
}

export function isAllowedCatalogBundleUrl(url) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		return false;
	}
	if (parsed.protocol !== 'https:') return false;
	if (parsed.username !== '' || parsed.password !== '') return false;
	if (parsed.port !== '' && parsed.port !== '443') return false;
	if (parsed.hostname === 'api.github.com') return false;
	if (parsed.hostname.endsWith('.githubusercontent.com')) {
		return (
			parsed.hostname === 'release-assets.githubusercontent.com' && parsed.pathname.length > 1
		);
	}
	if (parsed.hostname !== 'github.com') return false;
	return GITHUB_RELEASE_DOWNLOAD_PATH.test(parsed.pathname);
}

function parsePermission(raw) {
	if (!isNonEmptyString(raw)) {
		throw new Error('permissions: non-empty string required');
	}
	if (KNOWN_PERMISSIONS.has(raw)) {
		return raw;
	}
	for (const action of ['list', 'read', 'create', 'update']) {
		const prefix = `items:${action}:`;
		if (raw.startsWith(prefix)) {
			const category = raw.slice(prefix.length);
			if (category.length > 0 && !category.includes('*')) {
				return raw;
			}
		}
	}
	throw new Error(`permissions: unknown permission slug: ${raw}`);
}

export function parseMicroAppCatalogEntry(value) {
	if (!isRecord(value)) {
		throw new Error('catalogEntry: object required');
	}
	const id = value.id;
	if (!isNonEmptyString(id) || id.length > MICRO_APP_ID_MAX_LENGTH || !MICRO_APP_ID_SLUG_REGEX.test(id)) {
		throw new Error('id: [a-z0-9-]+ slug required');
	}
	if (!isNonEmptyString(value.name)) throw new Error('name: required');
	if (!isNonEmptyString(value.description)) throw new Error('description: required');
	if (!isKeyDid(String(value.publisherKeyDid))) throw new Error('publisherKeyDid: did:key required');
	if (!isJsonWebKey(value.signPubJwk)) throw new Error('signPubJwk: required');
	if (!isNonEmptyString(value.catalogSignature)) throw new Error('catalogSignature: required');
	if (!isNonEmptyString(value.latestVersion)) throw new Error('latestVersion: required');
	if (!Array.isArray(value.permissions) || value.permissions.length === 0) {
		throw new Error('permissions: non-empty array required');
	}
	const permissions = value.permissions.map(parsePermission);
	const bundleIntegrity = value.bundleIntegrity;
	if (!isNonEmptyString(bundleIntegrity) || !SRI_SHA384_REGEX.test(bundleIntegrity)) {
		throw new Error('bundleIntegrity: sha384-… required');
	}
	const bundleUrl = value.bundleUrl;
	if (!isNonEmptyString(bundleUrl) || !isAllowedCatalogBundleUrl(bundleUrl)) {
		throw new Error('bundleUrl: HTTPS GitHub Release URL required');
	}
	return {
		id,
		name: value.name,
		description: value.description,
		publisherKeyDid: String(value.publisherKeyDid).trim(),
		signPubJwk: value.signPubJwk,
		catalogSignature: value.catalogSignature,
		latestVersion: value.latestVersion,
		permissions,
		bundleIntegrity,
		bundleUrl,
		// presentation (optional — preserved for site)
		...(Array.isArray(value.categories) ? { categories: value.categories } : {}),
		...(Array.isArray(value.tags) ? { tags: value.tags } : {}),
		...(Array.isArray(value.screenshotUrls) ? { screenshotUrls: value.screenshotUrls } : {}),
		...(isNonEmptyString(value.homepageUrl) ? { homepageUrl: value.homepageUrl } : {}),
		...(isNonEmptyString(value.repositoryUrl) ? { repositoryUrl: value.repositoryUrl } : {}),
		...(isNonEmptyString(value.minSdkVersion) ? { minSdkVersion: value.minSdkVersion } : {}),
		...(value.maturity === 'incubating' || value.maturity === 'graduated'
			? { maturity: value.maturity }
			: {})
	};
}
