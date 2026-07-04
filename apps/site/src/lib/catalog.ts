import '../app.css';

export interface CatalogMeta {
	siteTitle: string;
	tagline: string;
	defaultLocale: string;
	featuredAppIds: string[];
	vaultInstallBaseUrl: string;
	vaultMarketingUrl: string;
	communityHomeUrl?: string;
	communityDiscordUrl?: string;
}

export type Maturity = 'incubating' | 'graduated';

export interface CatalogEntry {
	id: string;
	name: string;
	description: string;
	publisherKeyDid: string;
	signPubJwk: JsonWebKey;
	catalogSignature: string;
	latestVersion: string;
	permissions: string[];
	bundleIntegrity: string;
	bundleUrl: string;
	categories?: string[];
	tags?: string[];
	screenshotUrls?: string[];
	homepageUrl?: string;
	repositoryUrl?: string;
	minSdkVersion?: string;
	maturity?: Maturity;
}

export function truncateKeyDid(keyDid: string): string {
	if (keyDid.length <= 20) return keyDid;
	return `${keyDid.slice(0, 12)}…${keyDid.slice(-6)}`;
}

export function vaultInstallUrl(baseUrl: string, appId: string): string {
	const url = new URL(baseUrl);
	url.searchParams.set('microAppInstall', appId);
	return url.toString();
}

export function uniqueCategories(entries: CatalogEntry[]): string[] {
	const set = new Set<string>();
	for (const entry of entries) {
		for (const cat of entry.categories ?? []) {
			set.add(cat);
		}
	}
	return [...set].sort();
}
