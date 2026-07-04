import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { CatalogEntry } from '$lib/catalog';
import catalog from '../../../../static/catalog.json';

export const prerender = true;

export const load: PageServerLoad = async ({ params, parent }) => {
	const { meta, entries } = await parent();
	const entry = entries.find((e) => e.id === params.id);
	if (!entry) {
		error(404, 'App not found');
	}
	return { meta, entry };
};

export function entries() {
	return (catalog as CatalogEntry[]).map((entry) => ({ id: entry.id }));
}
