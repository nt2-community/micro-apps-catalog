<script lang="ts">
	import { base } from '$app/paths';
	import type { PageData } from './$types';
	import { uniqueCategories } from '$lib/catalog';

	const { data }: { data: PageData } = $props();

	let query = $state('');
	let category = $state<string | null>(null);

	const categories = $derived(uniqueCategories(data.entries));

	const filtered = $derived(
		data.entries.filter((entry) => {
			if (category && !(entry.categories ?? []).includes(category)) return false;
			if (!query.trim()) return true;
			const q = query.toLowerCase();
			const hay = [
				entry.name,
				entry.description,
				entry.id,
				...(entry.tags ?? []),
				...(entry.categories ?? [])
			]
				.join(' ')
				.toLowerCase();
			return hay.includes(q);
		})
	);

	const featured = $derived(
		data.meta.featuredAppIds
			.map((id) => data.entries.find((e) => e.id === id))
			.filter((e): e is NonNullable<typeof e> => Boolean(e))
	);
</script>

<svelte:head>
	<title>{data.meta.siteTitle}</title>
</svelte:head>

<section class="mb-8">
	<h1 class="text-3xl font-bold text-base-content">{data.meta.siteTitle}</h1>
	<p class="mt-2 max-w-2xl text-base-content/70">{data.meta.tagline}</p>
</section>

{#if featured.length > 0}
	<section class="mb-10">
		<h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-base-content/60">Featured</h2>
		<div class="grid gap-4 sm:grid-cols-2">
			{#each featured as entry (entry.id)}
				<a
					href="{base}/apps/{entry.id}"
					class="card border border-base-300 bg-base-100 shadow-sm transition hover:border-primary"
				>
					<div class="card-body">
						<div class="flex items-start justify-between gap-2">
							<h3 class="card-title text-lg">{entry.name}</h3>
							{#if entry.maturity}
								<span
									class="badge badge-sm {entry.maturity === 'graduated'
										? 'badge-primary'
										: 'badge-ghost'}">{entry.maturity}</span
								>
							{/if}
						</div>
						<p class="text-sm text-base-content/70">{entry.description}</p>
					</div>
				</a>
			{/each}
		</div>
	</section>
{/if}

<div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
	<label class="input input-bordered flex min-h-11 flex-1 items-center gap-2">
		<input
			type="search"
			class="grow"
			placeholder="Search apps…"
			bind:value={query}
			data-testid="catalog-search"
		/>
	</label>
</div>

{#if categories.length > 0}
	<div class="mb-6 flex flex-wrap gap-2">
		<button
			type="button"
			class="btn btn-sm {category === null ? 'btn-primary' : 'btn-ghost'}"
			onclick={() => {
				category = null;
			}}
		>
			All
		</button>
		{#each categories as cat (cat)}
			<button
				type="button"
				class="btn btn-sm {category === cat ? 'btn-primary' : 'btn-ghost'}"
				onclick={() => {
					category = cat;
				}}
			>
				{cat}
			</button>
		{/each}
	</div>
{/if}

<ul class="divide-y divide-base-300 rounded-box border border-base-300 bg-base-100">
	{#each filtered as entry (entry.id)}
		<li>
			<a
				href="{base}/apps/{entry.id}"
				class="flex flex-col gap-2 px-4 py-4 hover:bg-base-200 sm:flex-row sm:items-center sm:justify-between"
			>
				<div class="min-w-0">
					<p class="font-medium">{entry.name}</p>
					<p class="mt-1 text-sm text-base-content/70">{entry.description}</p>
					{#if entry.tags?.length}
						<p class="mt-2 text-xs text-base-content/50">{entry.tags.join(' · ')}</p>
					{/if}
				</div>
				<span class="badge badge-outline shrink-0">v{entry.latestVersion}</span>
			</a>
		</li>
	{:else}
		<li class="px-4 py-8 text-center text-base-content/60">No apps match your search.</li>
	{/each}
</ul>

<p class="mt-8 text-sm text-base-content/60">
	Machine-readable index:
	<a class="link" href="{base}/catalog.json"><code>catalog.json</code></a>
</p>
