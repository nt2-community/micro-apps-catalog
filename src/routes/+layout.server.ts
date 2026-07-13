import type { CatalogEntry, CatalogMeta } from '$lib/catalog';
import catalog from '../../static/catalog.json';
import meta from '../../catalog/index.meta.json';

export const prerender = true;

export function load() {
	return {
		meta: meta as CatalogMeta,
		entries: catalog as CatalogEntry[]
	};
}
