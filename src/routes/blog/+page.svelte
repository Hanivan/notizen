<script lang="ts">
	import { config } from '$lib/config';
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
	import { MagnifyingGlass, Tag, Folder, X } from 'phosphor-svelte';

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

	// ✅ GOOD: Use top-level async instead of onMount
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

			posts = await loadBlogPosts();
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
	<div class="absolute inset-0 pattern-seigaiha opacity-30"></div>

	<div class="container mx-auto px-4 relative z-10">
		<div class="mx-auto max-w-4xl text-center">
			<!-- Badge -->
			<div class="inline-flex items-center gap-2 mb-6 badge-accent">
				<span>Blog</span>
			</div>

			<!-- Main heading -->
			<h1 class="mb-6 text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl" style="font-family: 'Cormorant Garamond', serif;">
				Writing
			</h1>

			<!-- Subtitle -->
			<p class="text-muted-foreground mb-12 text-xl leading-relaxed max-w-2xl mx-auto">
				{config.site.tagline}
			</p>

			<!-- Decorative divider -->
			<div class="divider-japanese max-w-xs mx-auto mb-12"></div>

			<!-- Search Bar - Japanese minimalism style -->
			<div class="relative mx-auto max-w-2xl">
				<input
					type="search"
					placeholder="Search articles..."
					bind:value={searchQuery}
					class="w-full border-input bg-background px-6 py-4 pl-14 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
				/>
				<div class="text-muted-foreground absolute top-1/2 left-5 -translate-y-1/2 flex items-center justify-center">
					<MagnifyingGlass size={22} weight="thin" />
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
					<div class="flex items-center gap-2 mb-3">
						<Folder size={16} class="text-primary" />
						<span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">Categories</span>
					</div>
					<div class="flex flex-wrap gap-2">
						<button
							class="px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg {selectedCategory === 'all'
								? 'bg-primary text-primary-foreground shadow-md'
								: 'bg-background border border-border hover:border-primary/50 hover:bg-accent'}"
							onclick={() => (selectedCategory = 'all')}
						>
							All
						</button>
						{#each categories as category}
							<button
								class="px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg {selectedCategory ===
								category.toLowerCase()
									? 'bg-primary text-primary-foreground shadow-md'
									: 'bg-background border border-border hover:border-primary/50 hover:bg-accent'}"
								onclick={() => (selectedCategory = category.toLowerCase())}
							>
								{category}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Tag Filters -->
			{#if tags.length > 0}
				<div>
					<div class="flex items-center gap-2 mb-3">
						<Tag size={16} class="text-primary" />
						<span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">Tags</span>
					</div>
					<div class="flex flex-wrap gap-2">
						{#each displayTags as tag}
							<button
								class="px-3 py-1.5 text-xs font-medium transition-all duration-300 rounded-md {selectedTag ===
								tag.toLowerCase()
									? 'bg-primary text-primary-foreground shadow-md'
									: 'bg-background border border-border hover:border-primary/50 hover:bg-accent'}"
								onclick={() =>
									(selectedTag = selectedTag === tag.toLowerCase() ? '' : tag.toLowerCase())}
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
					<span class="text-muted-foreground text-xs font-medium uppercase tracking-wider">
						Active filters
					</span>
					{#if selectedCategory !== 'all'}
						<span class="bg-secondary text-secondary-foreground px-3 py-1 text-xs rounded-md flex items-center gap-2">
							<Folder size={12} />
							{selectedCategory}
						</span>
					{/if}
					{#if selectedTag}
						<span class="bg-secondary text-secondary-foreground px-3 py-1 text-xs rounded-md flex items-center gap-2">
							<Tag size={12} />
							{selectedTag}
						</span>
					{/if}
					{#if searchQuery}
						<span class="bg-secondary text-secondary-foreground px-3 py-1 text-xs rounded-md flex items-center gap-2">
							<MagnifyingGlass size={12} />
							"{searchQuery}"
						</span>
					{/if}
					<button
						class="text-muted-foreground hover:text-foreground text-xs font-medium underline underline-offset-2 transition-colors flex items-center gap-1"
						onclick={resetFilters}
					>
						<X size={12} />
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
				<div class="border-primary h-16 w-16 animate-spin rounded-full border-b-2"></div>
				<p class="mt-4 text-muted-foreground text-sm">Loading articles...</p>
			</div>
		</div>
	</section>
{:else if filteredPosts.length === 0}
	<!-- Empty State -->
	<section class="py-32">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-2xl py-16 text-center">
				<div class="w-20 h-20 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
					<MagnifyingGlass size={40} class="text-muted-foreground" />
				</div>
				<h1 class="mb-4 text-3xl font-semibold" style="font-family: 'Cormorant Garamond', serif;">
					No posts found
				</h1>
				<p class="text-muted-foreground mb-8 text-lg leading-relaxed">
					{#if posts.length === 0}
						No blog posts yet. Check back soon!
					{:else}
						No posts match your current filters. Try adjusting your search criteria.
					{/if}
				</p>
				{#if posts.length > 0}
					<button
						onclick={resetFilters}
						class="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
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
				<div class="mb-10">
					<div class="flex items-center gap-3 mb-2">
						<div class="w-8 h-0.5 bg-primary"></div>
						<span class="text-sm font-medium tracking-widest uppercase text-muted-foreground">Featured</span>
					</div>
					<h2 class="text-3xl font-semibold" style="font-family: 'Cormorant Garamond', serif;">
						Editor's Picks
					</h2>
				</div>

				<div class="grid-japanese max-w-7xl mx-auto">
					{#each featuredPosts as post}
						<article class="card-japanese">
							<a href={`/blog/${post.slug}`} class="block group">
								<!-- Post meta -->
								<div class="flex items-center gap-4 text-sm text-muted-foreground mb-3">
									<span class="flex items-center gap-1">
										<Folder size={14} />
										{post.category || 'General'}
									</span>
									<span>•</span>
									<time datetime={post.date}>
										{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
									</time>
								</div>

								<!-- Post title -->
								<h3 class="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors leading-tight" style="font-family: 'Cormorant Garamond', serif;">
									{post.title}
								</h3>

								<!-- Post excerpt -->
								<p class="text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
									{post.description || post.excerpt}
								</p>

								<!-- Reading time -->
								{#if post.readingTime}
									<div class="flex items-center gap-2 text-xs text-muted-foreground">
										<span>{post.readingTime} min read</span>
									</div>
								{/if}
							</a>
						</article>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<!-- All Posts -->
	<section class="py-16">
		<div class="container mx-auto px-4">
			<div class="mb-10">
				<div class="flex items-center justify-between">
					<div>
						<div class="flex items-center gap-3 mb-2">
							<div class="w-8 h-0.5 bg-primary"></div>
							<span class="text-sm font-medium tracking-widest uppercase text-muted-foreground">Archive</span>
						</div>
						<h2 class="text-3xl font-semibold" style="font-family: 'Cormorant Garamond', serif;">
							{filteredPosts.length === posts.length ? 'All Articles' : `${filteredPosts.length} Found`}
						</h2>
					</div>
				</div>
			</div>

			<div class="grid-japanese max-w-7xl mx-auto">
				{#each filteredPosts as post}
					<article class="card-japanese">
						<a href={`/blog/${post.slug}`} class="block group">
							<!-- Post meta -->
							<div class="flex items-center gap-4 text-sm text-muted-foreground mb-3">
								<span class="flex items-center gap-1">
									<Folder size={14} />
									{post.category || 'General'}
								</span>
								<span>•</span>
								<time datetime={post.date}>
									{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
								</time>
							</div>

							<!-- Post title -->
							<h3 class="text-xl font-semibold mb-3 group-hover:text-primary transition-colors leading-tight" style="font-family: 'Cormorant Garamond', serif;">
								{post.title}
							</h3>

							<!-- Post excerpt -->
							<p class="text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
								{post.description || post.excerpt}
							</p>

							<!-- Tags -->
							{#if post.tags && post.tags.length > 0}
								<div class="flex flex-wrap gap-2 mb-4">
									{#each post.tags.slice(0, 3) as tag}
										<span class="badge-accent text-xs">{tag}</span>
									{/each}
								</div>
							{/if}

							<!-- Reading time -->
							{#if post.readingTime}
								<div class="flex items-center gap-2 text-xs text-muted-foreground">
									<span>{post.readingTime} min read</span>
								</div>
							{/if}
						</a>
					</article>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	/* Smooth transitions */
	button,
	input,
	a {
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
</style>
