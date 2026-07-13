<script lang="ts">
	import { base } from '$app/paths';
	import type { PageData } from './$types';
	import { truncateKeyDid, vaultInstallUrl } from '$lib/catalog';

	const { data }: { data: PageData } = $props();

	const installHref = $derived(vaultInstallUrl(data.meta.vaultInstallBaseUrl, data.entry.id));
</script>

<svelte:head>
	<title>{data.entry.name} · {data.meta.siteTitle}</title>
</svelte:head>

<nav class="mb-4 text-sm">
	<a class="link link-hover" href="{base}/">← Catalog</a>
</nav>

<article class="card border border-base-300 bg-base-100 shadow-sm">
	<div class="card-body gap-4">
		<div class="flex flex-wrap items-start justify-between gap-3">
			<div>
				<h1 class="text-2xl font-bold">{data.entry.name}</h1>
				<p class="font-mono text-sm text-base-content/60">{data.entry.id}</p>
			</div>
			{#if data.entry.maturity}
				<span
					class="badge {data.entry.maturity === 'graduated' ? 'badge-primary' : 'badge-ghost'}"
					>{data.entry.maturity}</span
				>
			{/if}
		</div>

		<p class="text-base-content/80">{data.entry.description}</p>

		<dl class="grid gap-3 text-sm sm:grid-cols-2">
			<div>
				<dt class="text-base-content/60">Version</dt>
				<dd class="font-medium">{data.entry.latestVersion}</dd>
			</div>
			<div>
				<dt class="text-base-content/60">Publisher</dt>
				<dd class="font-mono text-xs">{truncateKeyDid(data.entry.publisherKeyDid)}</dd>
			</div>
		</dl>

		<div>
			<h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-base-content/60">
				Permissions
			</h2>
			<ul class="list-inside list-disc text-sm text-base-content/80">
				{#each data.entry.permissions as perm (perm)}
					<li><code>{perm}</code></li>
				{/each}
			</ul>
		</div>

		<div class="flex flex-wrap gap-2 pt-2">
			<a
				class="btn btn-primary min-h-11"
				href={installHref}
				data-testid="catalog-install-cta"
				rel="noopener noreferrer"
			>
				Install in Vault
			</a>
			{#if data.entry.homepageUrl}
				<a class="btn btn-outline btn-sm min-h-11" href={data.entry.homepageUrl} rel="noopener noreferrer"
					>Homepage</a
				>
			{/if}
			{#if data.entry.repositoryUrl}
				<a
					class="btn btn-outline btn-sm min-h-11"
					href={data.entry.repositoryUrl}
					rel="noopener noreferrer">Repository</a
				>
			{/if}
		</div>

		<p class="text-xs text-base-content/50">
			Install opens NT² Vault (requires micro-apps preview). Bundles are verified by your vault at
			install time. You can also sideload the <code>.nt2app</code> from the publisher release.
		</p>
	</div>
</article>
