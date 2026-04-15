<script lang="ts">
	import BlogPostCard from '$lib/components/BlogPostCard.svelte';
	import {
		formatDate,
		generatePostEmoji,
		getRelatedPosts,
		loadBlogPost,
		loadBlogPosts,
		type BlogPost,
		type BlogPostMeta
	} from '$lib/utils/blog';
	import { onMount } from 'svelte';

	let post = $state<BlogPost | null>(null);
	let relatedPosts = $state<BlogPostMeta[]>([]);
	let loading = $state(true);
	let error = $state(false);
	let imageError = $state(false);
	let imageLoaded = $state(false);

	onMount(async () => {
		await loadData();
	});

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

	let shareButtonText = $state('Share post');
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
				shareButtonText = 'Link copied!';
			}

			// Reset button text after 2 seconds
			setTimeout(() => {
				shareButtonText = originalText;
				isSharing = false;
			}, 2000);
		} catch (err) {
			console.error('Share failed:', err);
			shareButtonText = 'Share failed';
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
			const button = event.target as HTMLButtonElement;
			if (!button.classList.contains('code-block-copy')) return;

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
		<title>{post.title} - Notizen</title>
		<meta name="description" content={post.description} />
		<meta name="keywords" content={post.tags.join(', ')} />
	{:else}
		<title>Blog - Notizen</title>
	{/if}
</svelte:head>

<main class="min-h-screen">
	{#if loading}
		<!-- Loading State -->
		<section class="py-24">
			<div class="container mx-auto px-4">
				<div class="flex items-center justify-center py-16">
					<div class="border-primary h-16 w-16 animate-spin rounded-full border-b-2"></div>
				</div>
			</div>
		</section>
	{:else if error || !post}
		<!-- Error State -->
		<section class="py-24">
			<div class="container mx-auto px-4">
				<div class="mx-auto max-w-3xl py-20 text-center">
					<div class="text-muted-foreground/30 mb-8 text-8xl">📄</div>
					<h1 class="mb-6 text-3xl font-semibold">Post not found</h1>
					<p class="text-muted-foreground mb-10 text-lg">
						The blog post you're looking for doesn't exist or has been removed.
					</p>
					<div class="flex justify-center gap-4">
						<a
							href="/blog"
							class="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 font-medium transition-colors"
						>
							Browse All Posts
						</a>
						<a
							href="/"
							class="border-border hover:border-primary/30 hover:bg-accent border px-8 py-4 font-medium transition-colors"
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
			<section class="border-border/40 bg-background/50 border-b py-16 sm:py-24">
				<div class="container mx-auto px-4">
					<div class="mx-auto max-w-4xl">
						<!-- Breadcrumb -->
						<nav class="text-muted-foreground mb-8 flex items-center gap-2 text-sm">
							<a href="/" class="hover:text-primary transition-colors">Home</a>
							<span class="opacity-40">/</span>
							<a href="/blog" class="hover:text-primary transition-colors">Blog</a>
							<span class="opacity-40">/</span>
							<span class="truncate">{safePost.title}</span>
						</nav>

						<!-- Category Badge -->
						<div class="mb-6">
							<span
								class="bg-muted text-muted-foreground border border-border/50 inline-block px-3 py-1.5 text-sm font-semibold uppercase"
							>
								{post.category}
							</span>
						</div>

						<!-- Post Title -->
						<h1 class="mb-6 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
							{post.title}
						</h1>

						<!-- Post Description -->
						<p class="text-muted-foreground mb-8 text-lg leading-relaxed sm:text-xl">
							{post.description}
						</p>

						<!-- Post Meta -->
						<div
							class="flex flex-col gap-4 border-t border-border/50 pt-6 sm:flex-row sm:items-center sm:justify-between"
						>
							<div class="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
								<span class="font-medium text-foreground">By {post.author}</span>
								<span>•</span>
								<time datetime={post.date} class="font-medium">{formatDate(post.date)}</time>
								<span>•</span>
								<span>{post.readingTime} min read</span>
							</div>

							<!-- Tags -->
							<div class="flex flex-wrap gap-2">
								{#each post.tags as tag}
									<a
										href="/blog?tag={encodeURIComponent(tag.toLowerCase())}"
										class="bg-muted text-muted-foreground border border-border/50 px-3 py-1.5 text-xs transition-colors hover:border-primary/50"
									>
										{tag}
									</a>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Featured Image or Emoji Fallback -->
			{#if showImage || !showImage}
				<div class="border-border border-b py-8">
					<div class="container mx-auto px-4">
						<div class="mx-auto max-w-5xl">
							<div class="overflow-hidden shadow-md">
								{#if showImage}
									<img
										src={post.image}
										alt={post.title}
										class="aspect-video w-full object-cover {imageLoaded
											? 'opacity-100'
											: 'opacity-0'} transition-opacity duration-500"
										onerror={handleImageError}
										onload={handleImageLoad}
									/>
									{#if !imageLoaded}
										<div class="aspect-video w-full animate-pulse bg-muted"></div>
									{/if}
								{:else}
									<!-- Emoji Fallback -->
									<div
										class="flex aspect-video w-full items-center justify-center bg-linear-to-br from-muted/40 to-muted"
									>
										<div class="text-center">
											<div class="mb-4 text-7xl sm:text-8xl">{postEmoji}</div>
											<div
												class="text-muted-foreground text-base font-semibold uppercase sm:text-lg"
											>
												{safePost.category}
											</div>
											<div class="text-muted-foreground/70 text-sm">{safePost.title}</div>
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Share Buttons -->
			<section class="border-border border-b py-8">
				<div class="container mx-auto px-4">
					<div class="mx-auto max-w-4xl">
						<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<span class="text-muted-foreground text-sm font-medium uppercase tracking-wider">
								Share this post
							</span>
							<div class="flex flex-wrap gap-3">
								<button
									onclick={sharePost}
									disabled={isSharing}
									class="border-border hover:border-primary/30 hover:bg-accent border px-6 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-70"
								>
									{shareButtonText}
								</button>
								<a
									href="/blog?category={encodeURIComponent(post.category.toLowerCase())}"
									class="border-border hover:border-primary/30 hover:bg-accent border px-6 py-3 text-sm font-medium transition-colors"
								>
									More in {post.category}
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Post Content -->
			<section class="py-16">
				<div class="container mx-auto px-4">
					<div class="mx-auto max-w-4xl">
						<div class="prose prose-sm mx-auto max-w-none sm:prose-base lg:prose-lg">
							{@html post.content}
						</div>
					</div>
				</div>
			</section>

			<!-- Post Footer -->
			<section class="border-border/40 bg-background/50 border-b py-16">
				<div class="container mx-auto px-4">
					<div class="mx-auto max-w-4xl">
						<!-- Author Bio -->
						<div class="border-border mb-12 border p-6 sm:p-8">
							<div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
								<div
									class="mx-auto flex h-16 w-16 shrink-0 items-center justify-center bg-linear-to-br from-primary/20 to-accent/20 sm:mx-0 sm:h-20 sm:w-20"
									style="border-radius: 50%;"
								>
									<span class="text-4xl">👨‍💻</span>
								</div>
								<div class="text-center sm:text-left">
									<h3 class="mb-3 text-xl font-semibold">{post.author}</h3>
									<p class="text-muted-foreground mb-6 text-base leading-relaxed">
										Developer and writer passionate about development and creating user-friendly
										applications.
									</p>
									<div class="flex flex-col gap-3 sm:flex-row">
										<a
											href="/"
											class="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 text-sm font-medium transition-colors"
										>
											Get in Touch
										</a>
										<a
											href="/blog"
											class="border-border hover:border-primary/30 hover:bg-accent border px-6 py-3 text-sm font-medium transition-colors"
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
								class="border-border hover:border-primary/30 hover:bg-accent border px-6 py-3 text-sm font-medium transition-colors"
							>
								← All Posts
							</a>
							<button
								onclick={sharePost}
								disabled={isSharing}
								class="border-border hover:border-primary/30 hover:bg-accent border px-6 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-70"
							>
								{shareButtonText}
							</button>
						</div>
					</div>
				</div>
			</section>
		</article>

		<!-- Related Posts -->
		{#if relatedPosts.length > 0}
			<section class="bg-muted/30 py-16">
				<div class="container mx-auto px-4">
					<div class="mx-auto max-w-5xl">
						<div class="mb-10">
							<h2 class="text-2xl font-semibold">Related Posts</h2>
						</div>

						<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{#each relatedPosts as relatedPost}
								<BlogPostCard post={relatedPost} variant="compact" />
							{/each}
						</div>
					</div>
				</div>
			</section>
		{/if}
	{/if}
</main>
