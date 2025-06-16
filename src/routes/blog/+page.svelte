<script lang="ts">
	import { page } from '$app/stores';
	import BlogPostCard from '$lib/components/BlogPostCard.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import Section from '$lib/components/Section.svelte';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { config } from '$lib/config.js';
	import * as m from '$lib/paraglide/messages.js';
	import {
		getFeaturedPosts,
		getUniqueCategories,
		getUniqueTags,
		loadBlogPosts,
		type BlogPostMeta
	} from '$lib/utils/blog.js';
	import { onMount } from 'svelte';

	// Svelte 5 state
	let posts = $state<BlogPostMeta[]>([]);
	let featuredPosts = $state<BlogPostMeta[]>([]);
	let filteredPosts = $state<BlogPostMeta[]>([]);
	let categories = $state<string[]>([]);
	let tags = $state<string[]>([]);
	let loading = $state(true);

	// Filters
	let selectedCategory = $state('all');
	let selectedTag = $state('');
	let searchQuery = $state('');

	onMount(async () => {
		// Get URL parameters
		const categoryParam = $page.url.searchParams.get('category');
		const tagParam = $page.url.searchParams.get('tag');
		const searchParam = $page.url.searchParams.get('search');

		if (categoryParam) selectedCategory = categoryParam;
		if (tagParam) selectedTag = tagParam;
		if (searchParam) searchQuery = searchParam;

		await loadData();
	});

	async function loadData() {
		loading = true;
		try {
			posts = await loadBlogPosts();
			featuredPosts = getFeaturedPosts(posts);
			categories = getUniqueCategories(posts);
			tags = getUniqueTags(posts);
			applyFilters();
		} catch (error) {
			console.error('Error loading blog posts:', error);
		} finally {
			loading = false;
		}
	}

	function applyFilters() {
		let filtered = posts;

		// Apply category filter
		if (selectedCategory !== 'all') {
			filtered = filtered.filter(
				(post) => post.category.toLowerCase() === selectedCategory.toLowerCase()
			);
		}

		// Apply tag filter
		if (selectedTag) {
			filtered = filtered.filter((post) =>
				post.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase())
			);
		}

		// Apply search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(post) =>
					post.title.toLowerCase().includes(query) ||
					post.description.toLowerCase().includes(query) ||
					post.tags.some((tag) => tag.toLowerCase().includes(query)) ||
					post.category.toLowerCase().includes(query)
			);
		}

		filteredPosts = filtered;
	}

	function resetFilters() {
		selectedCategory = 'all';
		selectedTag = '';
		searchQuery = '';
		applyFilters();
	}

	// Reactive effects for Svelte 5
	$effect(() => {
		applyFilters();
	});
</script>

<svelte:head>
	<title>{m.blog_title()} - {config.personal.name}</title>
	<meta name="description" content={m.blog_description()} />
	<meta name="keywords" content={m.blog_meta_keywords()} />
</svelte:head>

<main class="min-h-screen">
	<!-- Hero Section -->
	<PageHero title={m.blog_title()} description={m.blog_description()}>
		<!-- Search and Filters -->
		<div class="mx-auto max-w-4xl space-y-6">
			<!-- Search Bar -->
			<div class="relative">
				<Input
					type="search"
					placeholder={m.blog_search_placeholder()}
					bind:value={searchQuery}
					class="zen-input pl-10"
				/>
				<div class="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">🔍</div>
			</div>

			<!-- Category Filters -->
			<div class="flex flex-wrap justify-center gap-3">
				<Button
					variant={selectedCategory === 'all' ? 'default' : 'outline'}
					size="sm"
					class="zen-button"
					onclick={() => (selectedCategory = 'all')}
				>
					{m.blog_all_posts()}
				</Button>
				{#each categories as category}
					<Button
						variant={selectedCategory === category.toLowerCase() ? 'default' : 'outline'}
						size="sm"
						class="zen-button"
						onclick={() => (selectedCategory = category.toLowerCase())}
					>
						{category}
					</Button>
				{/each}
			</div>

			<!-- Tag Filters -->
			{#if tags.length > 0}
				<div class="flex flex-wrap justify-center gap-2">
					{#each tags.slice(0, 8) as tag}
						<Badge
							variant={selectedTag === tag.toLowerCase() ? 'default' : 'outline'}
							class="hover:bg-accent cursor-pointer transition-colors"
							onclick={() =>
								(selectedTag = selectedTag === tag.toLowerCase() ? '' : tag.toLowerCase())}
						>
							{tag}
						</Badge>
					{/each}
				</div>
			{/if}

			<!-- Active Filters Display -->
			{#if selectedCategory !== 'all' || selectedTag || searchQuery}
				<div class="flex flex-wrap items-center justify-center gap-2 text-sm">
					<span class="text-muted-foreground">{m.blog_active_filters()}</span>
					{#if selectedCategory !== 'all'}
						<Badge variant="secondary">{m.blog_filter_category()} {selectedCategory}</Badge>
					{/if}
					{#if selectedTag}
						<Badge variant="secondary">{m.blog_filter_tag()} {selectedTag}</Badge>
					{/if}
					{#if searchQuery}
						<Badge variant="secondary">{m.blog_filter_search()} "{searchQuery}"</Badge>
					{/if}
					<Button variant="ghost" size="sm" onclick={resetFilters}>{m.blog_clear_all()}</Button>
				</div>
			{/if}
		</div>
	</PageHero>

	{#if loading}
		<!-- Loading State -->
		<Section>
			<div class="flex items-center justify-center py-16">
				<div class="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
			</div>
		</Section>
	{:else if filteredPosts.length === 0}
		<!-- Empty State -->
		<Section background="muted">
			{#if posts.length === 0}
				<EmptyState
					icon="📝"
					title={m.blog_no_posts_title()}
					description={m.blog_no_posts_description()}
					maxWidth="lg"
				>
					{#snippet actions()}
						<Button href="/contact" size="lg" class="zen-button min-w-48"
							>{m.blog_get_in_touch()}</Button
						>
						<Button href="/" variant="outline" size="lg" class="zen-button min-w-48"
							>{m.nav_home()}</Button
						>
					{/snippet}
				</EmptyState>
			{:else}
				<EmptyState
					icon="🔍"
					title={m.blog_no_results_title()}
					description={m.blog_no_results_description()}
				>
					{#snippet actions()}
						<Button onclick={resetFilters} size="sm" class="zen-button"
							>{m.blog_clear_filters()}</Button
						>
					{/snippet}
				</EmptyState>
			{/if}
		</Section>
	{:else}
		<!-- Featured Posts -->
		{#if featuredPosts.length > 0 && selectedCategory === 'all' && !selectedTag && !searchQuery}
			<Section background="muted">
				<SectionHeader title={m.blog_featured_posts()} />

				<div class="grid gap-6 lg:grid-cols-2">
					{#each featuredPosts as post}
						<BlogPostCard {post} featured={true} />
					{/each}
				</div>
			</Section>
		{/if}

		<!-- All Posts -->
		<Section>
			<SectionHeader
				title={filteredPosts.length === posts.length
					? m.blog_all_posts()
					: m.blog_found_posts({ count: filteredPosts.length })}
			/>

			<div class="grid gap-6 lg:grid-cols-2">
				{#each filteredPosts as post}
					<BlogPostCard {post} variant="default" />
				{/each}
			</div>
		</Section>
	{/if}
</main>
