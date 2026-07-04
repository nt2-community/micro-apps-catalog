<script lang="ts">
	import { base } from '$app/paths';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Contribute · {data.meta.siteTitle}</title>
</svelte:head>

<nav class="mb-4 text-sm">
	<a class="link link-hover" href="{base}/">← Catalog</a>
</nav>

<article class="prose max-w-none">
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
	<h2>Trust</h2>
	<p>
		This website is for discovery only. NT² Vault re-verifies signatures and shows a permission
		consent dialog before installing any bundle.
	</p>
</article>
