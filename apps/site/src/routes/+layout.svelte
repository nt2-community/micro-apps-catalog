<script lang="ts">
	import { base } from '$app/paths';
	import ThemeToggle from '$lib/ThemeToggle.svelte';
	import type { LayoutData } from './$types';

	const { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();
</script>

<div class="navbar bg-base-100 shadow-sm">
	<div class="mx-auto flex w-full max-w-5xl items-center gap-4 px-4">
		<a href="{base}/" class="text-lg font-semibold text-primary">{data.meta.siteTitle}</a>
		<div class="flex-1"></div>
		<ThemeToggle />
		<a class="btn btn-ghost btn-sm" href="{base}/contribute">Contribute</a>
		<a class="btn btn-outline btn-sm" href={data.meta.vaultMarketingUrl} rel="noopener noreferrer"
			>Get Vault</a
		>
	</div>
</div>

<main class="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-5xl px-4 py-8">
	{@render children()}
</main>

<footer class="border-t border-base-300 bg-base-100 py-6 text-center text-sm text-base-content/60">
	<p>
		Open catalog for <a class="link" href={data.meta.vaultMarketingUrl}>NT² Vault</a> micro-apps ·
		{#if data.meta.communityDiscordUrl}
			<a class="link" href={data.meta.communityDiscordUrl} rel="noopener noreferrer">Discord</a>
			·
		{/if}
		<a class="link" href="https://github.com/nt2-community/micro-apps-catalog">Source on GitHub</a>
	</p>
</footer>
