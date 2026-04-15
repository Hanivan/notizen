<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { ModeWatcher } from 'mode-watcher';
	import { MetaTags, JsonLd } from 'svelte-meta-tags';
	import { config } from '$lib/config';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { browser } from '$app/environment';

	interface Props {
		children: any;
	}

	let { children }: Props = $props();

	// Scroll to top after navigation (proper SvelteKit way)
	afterNavigate(() => {
		if (browser) {
			window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<MetaTags
		title={config.site.name}
		titleTemplate={`%s | ${config.site.name}`}
		description={config.site.description}
		canonical={config.site.url}
		openGraph={{
			...config.seo.openGraph,
			url: config.site.url,
			title: config.site.name,
			description: config.site.description
		}}
		twitter={{
			creator: config.site.twitterHandle,
			site: config.site.twitterHandle,
			cardType: config.seo.twitter.cardType,
			title: config.site.name,
			description: config.site.description
		}}
	/>
	<JsonLd
		schema={[
			{
				'@type': 'WebSite',
				url: config.site.url + '/',
				name: config.site.name,
				description: config.site.description,
				potentialAction: {
					'@type': 'SearchAction',
					target: {
						'@type': 'EntryPoint',
						urlTemplate: `${config.site.url}/search?q={search_term_string}`
					},
					'query-input': 'required name=search_term_string'
				}
			},
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{
						'@type': 'ListItem',
						position: 1,
						name: 'Home',
						item: config.site.url + '/'
					},
					{
						'@type': 'ListItem',
						position: 2,
						name: 'Blog',
						item: config.site.url + '/blog'
					}
				]
			}
		]}
	/>
</svelte:head>

<ModeWatcher />

<div class="min-h-screen flex flex-col">
	<!-- Navbar -->
	<Navbar />

	<!-- Main Content -->
	<main class="flex-1 main-content">
		{@render children()}
	</main>

	<!-- Footer -->
	<Footer />
</div>

<!-- Locale Links for SEO (hidden) -->
<div style="display: none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
