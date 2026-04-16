<script lang="ts">
	import { config } from '$lib/config';
	import {
		filterPostsByCategory,
		filterPostsByTag,
		getFeaturedPosts,
		getUniqueCategories,
		getUniqueTags,
		searchPosts,
		type BlogPostMeta
	} from '$lib/utils/blog';
	import { MagnifyingGlassIcon, TagIcon, FolderIcon, XIcon } from 'phosphor-svelte';
	import { fade, fly } from 'svelte/transition';
	import BlogCard from '$lib/components/BlogCard.svelte';
	import { blogService } from '$lib/services';

	// Tea ceremony easing - starts slow, deliberate motion, smooth finish
	// Custom cubic bezier implementation for smooth, intentional animations
	function teaCeremonyEasing(t: number): number {
		// Simplified smooth easing that starts slow and ends smoothly
		// This creates a natural, flowing motion like tea being poured
		return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	}

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

	// ✅ Load blog posts using service layer
	async function loadData() {
		loading = true;
		try {
			// Get URL parameters
			const urlParams = new URLSearchParams(window.location.search);
			const categoryParam = urlParams.get('category');
			const tagParam = urlParams.get('tag');
			const searchParam = urlParams.get('search');

			if (categoryParam) selectedCategory = categoryParam;
			if (tagParam) selectedTag = tagParam;
			if (searchParam) searchQuery = searchParam;

			posts = await blogService.getPosts();
			categories = getUniqueCategories(posts);
			tags = getUniqueTags(posts);
		} catch (error) {
			console.error('Error loading blog posts:', error);
		} finally {
			loading = false;
		}
	}

	// Load data immediately
	loadData();

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
	<title>Blog - {config.site.name}</title>
	<meta name="description" content={config.site.tagline} />
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden border-b border-border/40 bg-background/50 py-20 sm:py-32">
	<div class="pattern-seigaiha absolute inset-0 opacity-30"></div>

	<div class="relative z-10 container mx-auto px-4">
		<div class="mx-auto max-w-4xl text-center">
			<!-- Badge -->
			<div
				class="badge-accent mb-6 inline-flex items-center gap-2"
				in:fade={{ duration: 350, delay: 0, easing: teaCeremonyEasing }}
			>
				<span>Blog</span>
			</div>

			<!-- Main heading -->
			<h1
				class="mb-6 text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl"
				in:fade={{ duration: 400, delay: 100, easing: teaCeremonyEasing }}
			>
				Writing
			</h1>

			<!-- Subtitle -->
			<p
				class="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-muted-foreground"
				in:fade={{ duration: 400, delay: 200, easing: teaCeremonyEasing }}
			>
				{config.site.tagline}
			</p>

			<!-- Decorative divider -->
			<div
				class="divider-japanese mx-auto mb-12 max-w-xs"
				in:fade={{ duration: 350, delay: 300, easing: teaCeremonyEasing }}
			></div>

			<!-- Search Bar - Japanese minimalism style -->
			<div
				class="relative mx-auto max-w-2xl"
				in:fly={{ y: 10, duration: 400, delay: 350, easing: teaCeremonyEasing }}
			>
				<input
					type="search"
					placeholder="Search articles..."
					bind:value={searchQuery}
					class="w-full rounded-lg border-input bg-background px-6 py-4 pl-14 text-base transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
				/>
				<div
					class="absolute top-1/2 left-5 flex -translate-y-1/2 items-center justify-center text-muted-foreground"
				>
					<MagnifyingGlassIcon size={22} weight="thin" />
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Filters Section -->
{#if !loading && (categories.length > 0 || tags.length > 0)}
	<section class="border-b border-border/40 bg-muted/20 py-8">
		<div class="container mx-auto px-4">
			<!-- Category Filters -->
			{#if categories.length > 0}
				<div class="mb-6">
					<div
						class="mb-3 flex items-center gap-2"
						in:fly={{ y: 12, duration: 350, delay: 0, easing: teaCeremonyEasing }}
					>
						<FolderIcon size={16} class="text-primary" />
						<span class="text-xs font-medium tracking-wider text-muted-foreground uppercase"
							>Categories</span
						>
					</div>
					<div class="flex flex-wrap gap-2">
						{#each [{ label: 'All', value: 'all' }, ...categories.map( (c) => ({ label: c, value: c.toLowerCase() }) )] as filter, index (filter.value)}
							<button
								class="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 {selectedCategory ===
								filter.value
									? 'bg-primary text-primary-foreground shadow-md'
									: 'border border-border bg-background hover:border-primary/50 hover:bg-accent'}"
								onclick={() => (selectedCategory = filter.value)}
								in:fly={{ y: 10, duration: 350, delay: 75 + index * 50, easing: teaCeremonyEasing }}
							>
								{filter.label}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Tag Filters -->
			{#if tags.length > 0}
				<div>
					<div
						class="mb-3 flex items-center gap-2"
						in:fly={{ y: 12, duration: 350, delay: 150, easing: teaCeremonyEasing }}
					>
						<TagIcon size={16} class="text-primary" />
						<span class="text-xs font-medium tracking-wider text-muted-foreground uppercase"
							>Tags</span
						>
					</div>
					<div class="flex flex-wrap gap-2">
						{#each displayTags as tag, index (tag)}
							<button
								class="rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-300 {selectedTag ===
								tag.toLowerCase()
									? 'bg-primary text-primary-foreground shadow-md'
									: 'border border-border bg-background hover:border-primary/50 hover:bg-accent'}"
								onclick={() =>
									(selectedTag = selectedTag === tag.toLowerCase() ? '' : tag.toLowerCase())}
								in:fly={{
									y: 10,
									duration: 350,
									delay: 225 + index * 40,
									easing: teaCeremonyEasing
								}}
							>
								{tag}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Active Filters Display -->
			{#if selectedCategory !== 'all' || selectedTag || searchQuery}
				<div class="mt-8 flex flex-wrap items-center gap-3 border-t border-border/60 pt-6">
					<span class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
						Active filters
					</span>
					{#if selectedCategory !== 'all'}
						<span
							class="flex items-center gap-2 rounded-md bg-secondary px-3 py-1 text-xs text-secondary-foreground"
						>
							<FolderIcon size={12} />
							{selectedCategory}
						</span>
					{/if}
					{#if selectedTag}
						<span
							class="flex items-center gap-2 rounded-md bg-secondary px-3 py-1 text-xs text-secondary-foreground"
						>
							<TagIcon size={12} />
							{selectedTag}
						</span>
					{/if}
					{#if searchQuery}
						<span
							class="flex items-center gap-2 rounded-md bg-secondary px-3 py-1 text-xs text-secondary-foreground"
						>
							<MagnifyingGlassIcon size={12} />
							"{searchQuery}"
						</span>
					{/if}
					<button
						class="flex items-center gap-1 text-xs font-medium text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
						onclick={resetFilters}
					>
						<XIcon size={12} />
						Clear all
					</button>
				</div>
			{/if}
		</div>
	</section>
{/if}

<!-- Content Section -->
{#if loading}
	<!-- Loading State -->
	<section class="py-32">
		<div class="container mx-auto px-4">
			<div class="flex flex-col items-center justify-center py-16">
				<div class="h-16 w-16 animate-spin rounded-full border-b-2 border-primary"></div>
				<p class="mt-4 text-sm text-muted-foreground">Loading articles...</p>
			</div>
		</div>
	</section>
{:else if filteredPosts.length === 0}
	<!-- Empty State -->
	<section class="py-32">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-2xl py-16 text-center">
				<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
					<MagnifyingGlassIcon size={40} class="text-muted-foreground" />
				</div>
				<h1 class="mb-4 text-3xl font-semibold">No posts found</h1>
				<p class="mb-8 text-lg leading-relaxed text-muted-foreground">
					{#if posts.length === 0}
						No blog posts yet. Check back soon!
					{:else}
						No posts match your current filters. Try adjusting your search criteria.
					{/if}
				</p>
				{#if posts.length > 0}
					<button
						onclick={resetFilters}
						class="rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground shadow-md transition-all duration-300 hover:bg-primary/90 hover:shadow-lg"
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
		<section class="border-b border-border/40 bg-muted/20 py-16">
			<div class="container mx-auto px-4">
				<div class="mb-10" in:fly={{ y: 15, duration: 375, delay: 0, easing: teaCeremonyEasing }}>
					<div class="mb-2 flex items-center gap-3">
						<div class="h-0.5 w-8 bg-primary"></div>
						<span class="text-sm font-medium tracking-widest text-muted-foreground uppercase"
							>Featured</span
						>
					</div>
					<h2 class="text-3xl font-semibold">Editor's Picks</h2>
				</div>

				<div class="grid-japanese mx-auto max-w-7xl">
					{#each featuredPosts as post, index (post.slug)}
						<BlogCard {post} {index} delay={100} stagger={60} variant="featured" />
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<!-- All Posts -->
	<section class="py-16">
		<div class="container mx-auto px-4">
			<div class="mb-10" in:fly={{ y: 15, duration: 375, delay: 0, easing: teaCeremonyEasing }}>
				<div class="flex items-center justify-between">
					<div>
						<div class="mb-2 flex items-center gap-3">
							<div class="h-0.5 w-8 bg-primary"></div>
							<span class="text-sm font-medium tracking-widest text-muted-foreground uppercase"
								>Archive</span
							>
						</div>
						<h2 class="text-3xl font-semibold">
							{filteredPosts.length === posts.length
								? 'All Articles'
								: `${filteredPosts.length} Found`}
						</h2>
					</div>
				</div>
			</div>

			<div class="grid-japanese mx-auto max-w-7xl">
				{#each filteredPosts as post, index (post.slug)}
					<BlogCard {post} {index} delay={80} stagger={50} variant="default" />
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	/* Smooth transitions */
	button,
	input {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Focus styles */
	input:focus {
		outline: none;
	}

	/* Custom scrollbar for filters */
	@media (min-width: 1024px) {
		section {
			position: relative;
		}
	}

	/* Mobile-specific animation adjustments */
	@media (max-width: 640px) {
		/* Reduce fly distance on mobile for subtler motion */
		:global(.card-japanese) {
			animation: mobileFadeIn 0.4s ease-out;
		}
	}

	@keyframes mobileFadeIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
