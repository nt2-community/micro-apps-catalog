<script lang="ts">
	import { base } from '$app/paths';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Contribute · {data.meta.siteTitle}</title>
</svelte:head>

<nav class="mb-4 text-sm">
	{#if data.meta.communityHomeUrl}
		<a class="link link-hover" href={data.meta.communityHomeUrl} rel="noopener noreferrer"
			>NT² Community</a
		>
		<span class="text-base-content/40" aria-hidden="true"> / </span>
	{/if}
	<a class="link link-hover" href="{base}/">Catalog</a>
</nav>

<article
	class="max-w-none space-y-4 text-base-content [&_a]:link [&_code]:rounded [&_code]:bg-base-200 [&_code]:px-1 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6"
>
	<h1>Contribute a listing</h1>
	<p>
		The catalog is open source. Authors submit signed <code>catalog/entries/{'{appId}'}.json</code>
		files via pull request.
	</p>
	<ol>
		<li>Build and sign a <code>.nt2app</code> bundle per the NT² author guide.</li>
		<li>Publish it on a public GitHub Release.</li>
		<li>Fork <a href="https://github.com/nt2-community/micro-apps-catalog">micro-apps-catalog</a>.</li>
		<li>Add your signed catalog entry and open a PR.</li>
	</ol>
	<p>
		Full workflow:
		<a class="link" href="https://github.com/nt2-community/micro-apps-catalog/blob/main/CONTRIBUTING.md"
			>CONTRIBUTING.md</a
		>
	</p>
	{#if data.meta.communityDiscordUrl}
		<p>
			Questions? Join
			<a class="link" href={data.meta.communityDiscordUrl} rel="noopener noreferrer">NT² Community on Discord</a>.
		</p>
	{/if}
	<h2>Trust</h2>
	<p>
		This website is for discovery only. NT² Vault re-verifies signatures and shows a permission
		consent dialog before installing any bundle.
	</p>
</article>
