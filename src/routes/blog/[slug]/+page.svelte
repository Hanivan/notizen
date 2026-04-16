<script lang="ts">
	import { config } from '$lib/config';
	import {
		formatDate,
		generatePostEmoji,
		getRelatedPosts,
		loadBlogPost,
		loadBlogPosts,
		type BlogPost,
		type BlogPostMeta
	} from '$lib/utils/blog';
	import { ClockIcon, UserIcon, ArrowLeftIcon, ShareIcon, CalendarIcon } from 'phosphor-svelte';
	import { fade, fly, blur } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';

	let post = $state<BlogPost | null>(null);
	let relatedPosts = $state<BlogPostMeta[]>([]);
	let loading = $state(true);
	let error = $state(false);
	let imageError = $state(false);
	let imageLoaded = $state(false);

	// ✅ GOOD: Use top-level async instead of onMount
	async function loadData() {
		loading = true;
		error = false;

		try {
			const slug = getCurrentSlug();
			if (!slug) {
				error = true;
				return;
			}

			// Load the current post
			post = await loadBlogPost(slug);

			if (!post) {
				error = true;
				return;
			}

			// Load related posts using API filter for efficiency
			const relatedPostsData = await loadBlogPosts({
				category: post.category,
				limit: 4 // Get 4 to exclude current post and get 3 related
			});
			relatedPosts = relatedPostsData.filter((p) => p.slug !== post!.slug).slice(0, 3);
		} catch (err) {
			console.error('Error loading blog post:', err);
			error = true;
		} finally {
			loading = false;
		}
	}

	function getCurrentSlug(): string | null {
		// Get slug from URL path
		const pathParts = window.location.pathname.split('/');
		return pathParts[pathParts.length - 1] || null;
	}

	// Load data immediately
	loadData();

	let shareButtonText = $state('Share');
	let isSharing = $state(false);

	async function sharePost() {
		if (isSharing || !post) return;

		isSharing = true;
		const originalText = shareButtonText;

		try {
			// Try native Web Share API first
			if (navigator.share) {
				await navigator.share({
					title: post.title,
					text: post.description,
					url: window.location.href
				});
				shareButtonText = 'Shared!';
			} else {
				// Fallback: copy URL to clipboard
				await navigator.clipboard.writeText(window.location.href);
				shareButtonText = 'Copied!';
			}

			// Reset button text after 2 seconds
			setTimeout(() => {
				shareButtonText = originalText;
				isSharing = false;
			}, 2000);
		} catch (err) {
			console.error('Share failed:', err);
			shareButtonText = 'Failed';
			setTimeout(() => {
				shareButtonText = originalText;
				isSharing = false;
			}, 2000);
		}
	}

	function handleImageError() {
		imageError = true;
	}

	function handleImageLoad() {
		imageLoaded = true;
	}

	let showImage = $derived(post?.image && !imageError);
	let postEmoji = $derived(post ? generatePostEmoji(post) : '📝');
	let safePost = $derived(
		post ?? { title: '', description: '', category: '', tags: [], author: '', date: '' }
	);

	// Copy code functionality - use event delegation
	$effect(() => {
		function handleCodeCopy(event: MouseEvent) {
			const button = (event.target as HTMLElement).closest('.code-block-copy') as HTMLButtonElement;
			if (!button) return;

			const wrapper = button.closest('.code-block-wrapper');
			const code = wrapper?.querySelector('code');
			const text = code?.textContent;

			if (text) {
				navigator.clipboard.writeText(text).then(() => {
					const originalIcon = button.innerHTML;
					button.innerHTML = `
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<polyline points="20,6 9,17 4,12"></polyline>
						</svg>
					`;
					button.style.color = 'oklch(var(--color-primary))';

					setTimeout(() => {
						button.innerHTML = originalIcon;
						button.style.color = '';
					}, 2000);
				});
			}
		}

		document.addEventListener('click', handleCodeCopy);

		return () => {
			document.removeEventListener('click', handleCodeCopy);
		};
	});
</script>

<svelte:head>
	{#if post}
		<title>{post.title} - {config.site.name}</title>
		<meta name="description" content={post.description} />
		<meta name="keywords" content={post.tags.join(', ')} />
	{:else}
		<title>Blog - {config.site.name}</title>
	{/if}
</svelte:head>

<main class="min-h-screen">
	{#if loading}
		<!-- Loading State -->
		<section class="py-32">
			<div class="container mx-auto px-4">
				<div class="flex flex-col items-center justify-center py-16">
					<div class="border-primary h-16 w-16 animate-spin rounded-full border-b-2"></div>
					<p class="mt-4 text-muted-foreground text-sm">Loading article...</p>
				</div>
			</div>
		</section>
	{:else if error || !post}
		<!-- Error State -->
		<section class="py-32">
			<div class="container mx-auto px-4">
				<div class="mx-auto max-w-3xl py-20 text-center">
					<div class="text-muted-foreground/30 mb-8 text-8xl">📄</div>
					<h1 class="mb-6 text-4xl font-semibold">
						Post not found
					</h1>
					<p class="text-muted-foreground mb-10 text-lg leading-relaxed">
						The blog post you're looking for doesn't exist or has been removed.
					</p>
					<div class="flex justify-center gap-4">
						<a
							href="/blog"
							class="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 font-medium rounded-lg transition-all duration-300 shadow-md"
						>
							Browse All Posts
						</a>
						<a
							href="/"
							class="border-border hover:border-primary/30 hover:bg-accent border px-8 py-4 font-medium rounded-lg transition-all duration-300"
						>
							Home
						</a>
					</div>
				</div>
			</div>
		</section>
	{:else}
		<!-- Blog Post Content -->
		<article>
			<!-- Post Header -->
			<section class="relative overflow-hidden in:fade={{ duration: 600 }} border-b border-border/40 bg-background/50 py-20 sm:py-32">
				<div class="absolute inset-0 pattern-seigaiha opacity-20"></div>

				<div class="container mx-auto px-4 relative z-10">
					<div class="mx-auto max-w-4xl">
						<!-- Back button -->
						<a
							href="/blog"
							class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors group"
						>
							<ArrowLeftIcon size={18} class="group-hover:-translate-x-1 transition-transform" />
							<span>Back to articles</span>
						</a>

						<!-- Category Badge -->
						<div class="mb-6">
							<span class="badge-accent">
								{post.category}
							</span>
						</div>

						<!-- Post Title -->
						<h1 class="mb-6 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
							{post.title}
						</h1>

						<!-- Post Description -->
						<p class="text-muted-foreground mb-8 text-xl leading-relaxed">
							{post.description}
						</p>

						<!-- Decorative divider -->
						<div class="divider-japanese max-w-xs"></div>

						<!-- Post Meta -->
						<div class="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
							<div class="flex items-center gap-2">
								<UserIcon size={18} weight="thin" />
								<span class="font-medium text-foreground">{post.author}</span>
							</div>
							<div class="flex items-center gap-2">
								<CalendarIcon size={18} weight="thin" />
								<time datetime={post.date} class="font-medium">{formatDate(post.date)}</time>
							</div>
							<div class="flex items-center gap-2">
								<ClockIcon size={18} weight="thin" />
								<span class="font-medium">{post.readingTime} min read</span>
							</div>
						</div>

						<!-- Tags -->
						{#if post.tags && post.tags.length > 0}
							<div class="mt-8 flex flex-wrap gap-2">
								{#each post.tags as tag}
									<a
										href="/blog?tag={encodeURIComponent(tag.toLowerCase())}"
										class="px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:border-primary/50 hover:bg-accent transition-all"
									>
										#{tag}
									</a>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</section>

			<!-- Featured Image or Emoji Fallback -->
			{#if showImage || !showImage}
				<div class="border-b border-border/40 py-12 bg-muted/20">
					<div class="container mx-auto px-4">
						<div class="mx-auto max-w-5xl">
							<div class="overflow-hidden rounded-lg shadow-japanese-lg">
								{#if showImage}
									<img
										src={post.image}
										alt={post.title}
										class="aspect-video w-full object-cover {imageLoaded
											? 'opacity-100'
											: 'opacity-0'} transition-opacity duration-700"
										onerror={handleImageError}
										onload={handleImageLoad}
									/>
									{#if !imageLoaded}
										<div class="aspect-video w-full animate-pulse bg-muted"></div>
									{/if}
								{:else}
									<!-- Emoji Fallback with Japanese minimalism -->
									<div class="flex aspect-video w-full items-center justify-center bg-linear-to-br from-muted/40 to-muted">
										<div class="text-center">
											<div class="mb-4 text-8xl sm:text-9xl">{postEmoji}</div>
											<div class="text-muted-foreground text-base font-semibold uppercase tracking-wider sm:text-lg">
												{safePost.category}
											</div>
											<div class="text-muted-foreground/70 text-sm mt-2 max-w-md mx-auto">
												{safePost.title}
											</div>
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Share Bar -->
			<section class="border-b border-border/40 bg-muted/20 py-6">
				<div class="container mx-auto px-4">
					<div class="mx-auto max-w-4xl">
						<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<span class="text-muted-foreground text-sm font-medium uppercase tracking-wider">
								Share this article
							</span>
							<div class="flex flex-wrap gap-3">
								<button
									onclick={sharePost}
									disabled={isSharing}
									class="inline-flex items-center gap-2 border-border hover:border-primary/30 hover:bg-accent border px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70"
								>
									<ShareIcon size={18} weight="thin" />
									<span>{shareButtonText}</span>
								</button>
								<a
									href="/blog?category={encodeURIComponent(post.category.toLowerCase())}"
									class="inline-flex items-center gap-2 border-border hover:border-primary/30 hover:bg-accent border px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-300"
								>
									<span>More in {post.category}</span>
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Post Content -->
			<section class="py-16 sm:py-24">
				<div class="container mx-auto px-4">
					<div class="mx-auto max-w-4xl">
						<div class="prose prose-lg mx-auto max-w-none">
							{@html post.content}
						</div>
					</div>
				</div>
			</section>

			<!-- Post Footer -->
			<section class="border-b border-border/40 bg-background/50 py-16">
				<div class="container mx-auto px-4">
					<div class="mx-auto max-w-4xl">
						<!-- Author Bio Card -->
						<div class="card-japanese mb-12">
							<div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
								<div
									class="mx-auto flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-accent/20 sm:mx-0"
								>
									<span class="text-4xl">👨‍💻</span>
								</div>
								<div class="text-center sm:text-left flex-1">
									<h3 class="mb-3 text-2xl font-semibold">
										{post.author}
									</h3>
									<p class="text-muted-foreground mb-6 text-base leading-relaxed">
										Developer and writer passionate about development and creating user-friendly
										applications. Sharing thoughts, tutorials, and insights about technology.
									</p>
									<div class="flex flex-col gap-3 sm:flex-row">
										<a
											href={config.social.email.url}
											class="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 shadow-md inline-flex items-center justify-center"
										>
											Get in Touch
										</a>
										<a
											href="/blog"
											class="border-border hover:border-primary/30 hover:bg-accent border px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 inline-flex items-center justify-center"
										>
											More Posts
										</a>
									</div>
								</div>
							</div>
						</div>

						<!-- Navigation -->
						<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<a
								href="/blog"
								class="inline-flex items-center gap-2 border-border hover:border-primary/30 hover:bg-accent border px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 group"
							>
								<ArrowLeftIcon size={18} class="group-hover:-translate-x-1 transition-transform" />
								<span>All Articles</span>
							</a>
							<button
								onclick={sharePost}
								disabled={isSharing}
								class="inline-flex items-center gap-2 border-border hover:border-primary/30 hover:bg-accent border px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70"
							>
								<ShareIcon size={18} weight="thin" />
								<span>{shareButtonText}</span>
							</button>
						</div>
					</div>
				</div>
			</section>
		</article>

		<!-- Related Posts -->
		{#if relatedPosts.length > 0}
			<section class="bg-muted/20 py-20">
				<div class="container mx-auto px-4">
					<div class="mx-auto max-w-6xl">
						<!-- Section header -->
						<div class="mb-12">
							<div class="flex items-center gap-3 mb-2">
								<div class="w-8 h-0.5 bg-primary"></div>
								<span class="text-sm font-medium tracking-widest uppercase text-muted-foreground">Related</span>
							</div>
							<h2 class="text-3xl font-semibold">
								You might also like
							</h2>
						</div>

						<!-- Related posts grid -->
						<div class="grid-japanese">
							{#each relatedPosts as relatedPost, index (relatedPost.slug)}
									<article
								class="card-japanese"
								in:fly={{ y: 20, opacity: 0, delay: index * 100, duration: 500, easing: quintOut }}
							>
								<a href={`/blog/${relatedPost.slug}`} class="block group">
										<!-- Post meta -->
										<div class="flex items-center gap-4 text-sm text-muted-foreground mb-3">
											<span class="flex items-center gap-1">
												<CalendarIcon size={14} weight="thin" />
												<time datetime={relatedPost.date}>
													{new Date(relatedPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
												</time>
											</span>
											{#if relatedPost.category}
												<span class="badge-accent text-xs">{relatedPost.category}</span>
											{/if}
										</div>

										<!-- Post title -->
										<h3 class="text-xl font-semibold mb-3 group-hover:text-primary transition-colors leading-tight">
											{relatedPost.title}
										</h3>

										<!-- Post excerpt -->
										<p class="text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
											{relatedPost.description || relatedPost.excerpt}
										</p>

										<!-- Reading time -->
										{#if relatedPost.readingTime}
											<div class="flex items-center gap-2 text-xs text-muted-foreground">
												<ClockIcon size={14} weight="thin" />
												<span>{relatedPost.readingTime} min read</span>
											</div>
										{/if}
									</a>
								</article>
							{/each}
						</div>
					</div>
				</div>
			</section>
		{/if}
	{/if}
</main>

<style>
	/* Smooth transitions */
	a,
	button {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
