<script lang="ts">
	import BlogPostCard from '$lib/components/BlogPostCard.svelte';
	import {
		filterPostsByCategory,
		filterPostsByTag,
		getFeaturedPosts,
		getUniqueCategories,
		getUniqueTags,
		loadBlogPosts,
		searchPosts,
		type BlogPostMeta
	} from '$lib/utils/blog';
	import { onMount } from 'svelte';
	import { MagnifyingGlass } from 'phosphor-svelte';

	// Svelte 5 state
	let posts = $state<BlogPostMeta[]>([]);
	let categories = $state<string[]>([]);
	let tags = $state<string[]>([]);
	let loading = $state(true);

	// Filters
	let selectedCategory = $state('all');
	let selectedTag = $state('');
	let searchQuery = $state('');

	// Derived values
	let featuredPosts = $derived(getFeaturedPosts(posts));
	let filteredPosts = $derived(applyFilters());
	let displayTags = $derived(tags.slice(0, 12));

	onMount(async () => {
		// Get URL parameters
		const urlParams = new URLSearchParams(window.location.search);
		const categoryParam = urlParams.get('category');
		const tagParam = urlParams.get('tag');
		const searchParam = urlParams.get('search');

		if (categoryParam) selectedCategory = categoryParam;
		if (tagParam) selectedTag = tagParam;
		if (searchParam) searchQuery = searchParam;

		await loadData();
	});

	async function loadData() {
		loading = true;
		try {
			posts = await loadBlogPosts();
			categories = getUniqueCategories(posts);
			tags = getUniqueTags(posts);
		} catch (error) {
			console.error('Error loading blog posts:', error);
		} finally {
			loading = false;
		}
	}

	function resetFilters() {
		selectedCategory = 'all';
		selectedTag = '';
		searchQuery = '';
	}

	// Apply filters using the blog utility functions
	function applyFilters() {
		let filtered = posts;

		if (selectedCategory !== 'all') {
			filtered = filterPostsByCategory(filtered, selectedCategory);
		}

		if (selectedTag) {
			filtered = filterPostsByTag(filtered, selectedTag);
		}

		if (searchQuery) {
			filtered = searchPosts(filtered, searchQuery);
		}

		return filtered;
	}
</script>

<svelte:head>
	<title>Blog - Notizen</title>
	<meta name="description" content="Thoughts, tutorials, and insights about development" />
</svelte:head>

<main class="min-h-screen">
	<!-- Hero Section -->
	<section class="border-border/40 bg-background/50 border-b py-16 sm:py-24">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-4xl text-center">
				<h1 class="mb-4 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">Blog</h1>
				<p class="text-muted-foreground mb-8 text-lg sm:text-xl">
					Thoughts, tutorials, and insights about development
				</p>

				<!-- Search Bar -->
				<div class="relative mx-auto max-w-2xl">
					<input
						type="search"
						placeholder="Search posts..."
						bind:value={searchQuery}
						class="w-full border-input bg-background px-5 py-4 pl-12 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
					/>
					<div class="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2 flex items-center justify-center">
						<MagnifyingGlass size={20} />
					</div>
				</div>

				<!-- Category Filters -->
				<div class="mt-8 flex flex-wrap justify-center gap-3">
					<button
						class="px-5 py-2 text-sm font-medium transition-colors {selectedCategory === 'all'
							? 'bg-primary text-primary-foreground'
							: 'bg-muted text-muted-foreground hover:bg-muted/80'}"
						onclick={() => (selectedCategory = 'all')}
					>
						All Posts
					</button>
					{#each categories as category}
						<button
							class="px-5 py-2 text-sm font-medium transition-colors {selectedCategory ===
							category.toLowerCase()
								? 'bg-primary text-primary-foreground'
								: 'bg-muted text-muted-foreground hover:bg-muted/80'}"
							onclick={() => (selectedCategory = category.toLowerCase())}
						>
							{category}
						</button>
					{/each}
				</div>

				<!-- Tag Filters -->
				{#if tags.length > 0}
					<div class="mt-6 flex flex-wrap justify-center gap-2">
						{#each displayTags as tag}
							<button
								class="px-3 py-1.5 text-xs font-medium transition-colors {selectedTag ===
								tag.toLowerCase()
									? 'bg-primary text-primary-foreground'
									: 'bg-muted text-muted-foreground hover:bg-muted/80'}"
								onclick={() =>
									(selectedTag = selectedTag === tag.toLowerCase() ? '' : tag.toLowerCase())}
							>
								{tag}
							</button>
						{/each}
					</div>
				{/if}

				<!-- Active Filters Display -->
				{#if selectedCategory !== 'all' || selectedTag || searchQuery}
					<div class="mt-8 flex flex-wrap items-center justify-center gap-3 border-t pt-6">
						<span class="text-muted-foreground text-xs font-medium uppercase tracking-wider">
							Active filters
						</span>
						{#if selectedCategory !== 'all'}
							<span class="bg-secondary text-secondary-foreground px-3 py-1 text-xs">
								Category: {selectedCategory}
							</span>
						{/if}
						{#if selectedTag}
							<span class="bg-secondary text-secondary-foreground px-3 py-1 text-xs">
								Tag: {selectedTag}
							</span>
						{/if}
						{#if searchQuery}
							<span class="bg-secondary text-secondary-foreground px-3 py-1 text-xs">
								Search: "{searchQuery}"
							</span>
						{/if}
						<button
							class="text-muted-foreground hover:text-foreground text-xs font-medium underline underline-offset-2 transition-colors"
							onclick={resetFilters}
						>
							Clear all
						</button>
					</div>
				{/if}
			</div>
		</div>
	</section>

	{#if loading}
		<!-- Loading State -->
		<section class="py-20">
			<div class="container mx-auto px-4">
				<div class="flex items-center justify-center py-16">
					<div class="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
				</div>
			</div>
		</section>
	{:else if filteredPosts.length === 0}
		<!-- Empty State -->
		<section class="bg-muted/50 py-16">
			<div class="container mx-auto px-4">
				<div class="mx-auto max-w-2xl py-16 text-center">
					<h1 class="mb-4 text-2xl font-semibold">No posts found</h1>
					<p class="text-muted-foreground mb-8 text-base">
						{#if posts.length === 0}
							No blog posts yet. Check back soon!
						{:else}
							No posts match your current filters. Try adjusting your search criteria.
						{/if}
					</p>
					{#if posts.length > 0}
						<button
							onclick={resetFilters}
							class="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 font-medium transition-colors"
						>
							Clear filters
						</button>
					{/if}
				</div>
			</div>
		</section>
	{:else}
		<!-- Featured Posts -->
		{#if featuredPosts.length > 0 && selectedCategory === 'all' && !selectedTag && !searchQuery}
			<section class="bg-muted/30 border-b py-12">
				<div class="container mx-auto px-4">
					<div class="mb-8">
						<h2 class="text-2xl font-semibold">Featured Posts</h2>
					</div>

					<div class="grid gap-6 md:grid-cols-2">
						{#each featuredPosts as post}
							<BlogPostCard {post} featured={true} />
						{/each}
					</div>
				</div>
			</section>
		{/if}

		<!-- All Posts -->
		<section class="py-12">
			<div class="container mx-auto px-4">
				<div class="mb-8">
					<h2 class="text-2xl font-semibold">
						{filteredPosts.length === posts.length ? 'All Posts' : `${filteredPosts.length} Posts Found`}
					</h2>
				</div>

				<div class="grid gap-6 md:grid-cols-2">
					{#each filteredPosts as post}
						<BlogPostCard {post} variant="default" />
					{/each}
				</div>
			</div>
		</section>
	{/if}
</main>
