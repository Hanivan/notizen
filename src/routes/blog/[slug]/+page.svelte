<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import BlogPostCard from '$lib/components/BlogPostCard.svelte';
	import Section from '$lib/components/Section.svelte';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { config } from '$lib/config.js';
	import * as m from '$lib/paraglide/messages.js';
	import {
		formatDate,
		generatePostEmoji,
		getRelatedPosts,
		loadBlogPost,
		loadBlogPosts,
		type BlogPost,
		type BlogPostMeta
	} from '$lib/utils/blog.js';
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
			const slug = $page.params.slug;
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

			// Load all posts to find related ones
			const allPosts = await loadBlogPosts();
			relatedPosts = getRelatedPosts(allPosts, post, 3);
		} catch (err) {
			console.error('Error loading blog post:', err);
			error = true;
		} finally {
			loading = false;
		}
	}

	let shareButtonText = $state(m.blog_share_post());
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
				shareButtonText = m.blog_shared();
			} else {
				// Fallback: copy URL to clipboard
				await navigator.clipboard.writeText(window.location.href);
				shareButtonText = m.blog_link_copied();
			}

			// Reset button text after 2 seconds
			setTimeout(() => {
				shareButtonText = originalText;
				isSharing = false;
			}, 2000);
		} catch (err) {
			console.error('Share failed:', err);
			// Show error message or fallback to manual copy
			shareButtonText = m.blog_share_failed();
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

	// Watch for route changes
	$effect(() => {
		if ($page.params.slug) {
			loadData();
		}
	});

	let showImage = $derived(post?.image && !imageError);
	let postEmoji = $derived(post ? generatePostEmoji(post) : '📝');

	// Copy code functionality
	function copyCode(button: HTMLButtonElement) {
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
				button.style.color = 'hsl(var(--success))';

				setTimeout(() => {
					button.innerHTML = originalIcon;
					button.style.color = '';
				}, 2000);
			});
		}
	}

	// Make copyCode available globally for onclick handlers
	if (typeof window !== 'undefined') {
		(window as any).copyCode = copyCode;
	}
</script>

<svelte:head>
	{#if post}
		<title>{post.title} - {config.personal.name}</title>
		<meta name="description" content={post.description} />
		<meta name="keywords" content={post.tags.join(', ')} />

		<!-- Open Graph meta tags -->
		<meta property="og:title" content={post.title} />
		<meta property="og:description" content={post.description} />
		<meta property="og:type" content="article" />
		<meta property="og:url" content={$page.url.href} />
		{#if post.image}
			<meta property="og:image" content={post.image} />
		{/if}

		<!-- Twitter meta tags -->
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content={post.title} />
		<meta name="twitter:description" content={post.description} />
		{#if post.image}
			<meta name="twitter:image" content={post.image} />
		{/if}

		<!-- Article meta tags -->
		<meta property="article:author" content={post.author} />
		<meta property="article:published_time" content={post.date} />
		<meta property="article:section" content={post.category} />
		{#each post.tags as tag}
			<meta property="article:tag" content={tag} />
		{/each}
	{:else}
		<title>{m.blog_title()} - {config.personal.name}</title>
	{/if}
</svelte:head>

<main class="min-h-screen">
	{#if loading}
		<!-- Loading State -->
		<Section>
			<div class="flex items-center justify-center py-16">
				<div class="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
			</div>
		</Section>
	{:else if error || !post}
		<!-- Error State -->
		<Section>
			<div class="mx-auto max-w-2xl py-16 text-center">
				<div class="mb-6 text-6xl">📄</div>
				<h1 class="mb-4 text-2xl font-semibold">{m.blog_post_not_found()}</h1>
				<p class="text-muted-foreground mb-8">
					{m.blog_post_not_found_description()}
				</p>
				<div class="flex justify-center gap-4">
					<Button href="/blog" class="zen-button">{m.blog_browse_all()}</Button>
					<Button href="/" variant="outline" class="zen-button">{m.nav_home()}</Button>
				</div>
			</div>
		</Section>
	{:else}
		<!-- Blog Post Content -->
		<article>
			<!-- Post Header -->
			<Section>
				<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
					<!-- Breadcrumb -->
					<nav class="text-muted-foreground mb-6 text-xs sm:mb-8 sm:text-sm">
						<a href="/" class="hover:text-foreground transition-colors">{m.nav_home()}</a>
						<span class="mx-1 sm:mx-2">/</span>
						<a href="/blog" class="hover:text-foreground transition-colors">{m.blog_title()}</a>
						<span class="mx-1 sm:mx-2">/</span>
						<span class="truncate">{post.title}</span>
					</nav>

					<!-- Post Meta -->
					<div class="mb-6">
						<div
							class="text-muted-foreground mb-4 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
						>
							<span>{m.blog_by_author({ author: post.author })}</span>
							<span class="hidden sm:inline">•</span>
							<time datetime={post.date}>{formatDate(post.date)}</time>
							<span class="hidden sm:inline">•</span>
							<span>{post.readingTime} {m.blog_min_read()}</span>
						</div>

						<!-- Tags and Category -->
						<div class="mb-6 flex flex-wrap gap-1.5 sm:gap-2">
							<Badge variant="outline" class="text-xs sm:text-sm">{post.category}</Badge>
							{#each post.tags as tag}
								<Badge
									variant="secondary"
									class="hover:bg-accent cursor-pointer text-xs transition-colors sm:text-sm"
									onclick={() => goto(`/blog?tag=${encodeURIComponent(tag.toLowerCase())}`)}
								>
									{tag}
								</Badge>
							{/each}
						</div>
					</div>

					<!-- Post Title -->
					<h1
						class="mb-4 text-2xl leading-tight font-bold tracking-tight sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl"
					>
						{post.title}
					</h1>

					<!-- Post Description -->
					<p class="text-muted-foreground mb-6 text-base leading-relaxed sm:mb-8 sm:text-lg">
						{post.description}
					</p>

					<!-- Featured Image or Emoji Fallback -->
					<div class="mb-8 overflow-hidden rounded-lg sm:mb-12">
						{#if showImage}
							<img
								src={post.image}
								alt={post.title}
								class="aspect-video w-full object-cover {imageLoaded
									? 'opacity-100'
									: 'opacity-0'} transition-opacity duration-300"
								onerror={handleImageError}
								onload={handleImageLoad}
							/>
							{#if !imageLoaded}
								<div
									class="aspect-video w-full animate-pulse"
									style="background-color: oklch(var(--muted))"
								></div>
							{/if}
						{:else}
							<!-- Emoji Fallback for Featured Image -->
							<div
								class="flex aspect-video w-full items-center justify-center rounded-lg border"
								style="background: linear-gradient(to bottom right, oklch(var(--muted) / 0.3), oklch(var(--muted) / 0.6))"
							>
								<div class="text-center">
									<div class="mb-2 text-4xl sm:mb-4 sm:text-8xl">{postEmoji}</div>
									<div class="text-muted-foreground text-sm font-medium sm:text-lg">
										{post.category}
									</div>
									<div class="text-muted-foreground/70 text-xs sm:text-sm">{post.title}</div>
								</div>
							</div>
						{/if}
					</div>

					<!-- Share Buttons -->
					<div
						class="mb-8 flex flex-col gap-3 border-b pb-4 sm:mb-12 sm:flex-row sm:items-center sm:gap-4 sm:pb-6"
					>
						<span class="text-sm font-medium">{m.blog_share()}</span>
						<div class="flex flex-wrap gap-2">
							<Button
								variant="outline"
								size="sm"
								onclick={sharePost}
								disabled={isSharing}
								class="zen-button text-xs sm:text-sm {isSharing
									? 'cursor-not-allowed opacity-70'
									: ''}"
							>
								{shareButtonText}
							</Button>
							<Button
								variant="outline"
								size="sm"
								href="/blog?category={encodeURIComponent(post.category.toLowerCase())}"
								class="zen-button text-xs sm:text-sm"
							>
								{m.blog_more_in_category({ category: post.category })}
							</Button>
						</div>
					</div>
				</div>
			</Section>

			<!-- Post Content -->
			<Section background="muted">
				<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
					<div
						class="prose prose-sm prose-slate dark:prose-invert sm:prose-base lg:prose-lg mx-auto max-w-none"
					>
						{@html post.content}
					</div>
				</div>
			</Section>

			<!-- Post Footer -->
			<Section>
				<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
					<!-- Author Bio -->
					<div class="mb-8 rounded-lg border p-4 sm:mb-12 sm:p-6">
						<div class="flex flex-col gap-4 sm:flex-row sm:items-start">
							<div
								class="from-primary/20 to-accent/20 mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br sm:mx-0 sm:h-16 sm:w-16"
							>
								<span class="text-lg sm:text-2xl">👨‍💻</span>
							</div>
							<div class="text-center sm:text-left">
								<h3 class="mb-2 font-semibold">{post.author}</h3>
								<p class="text-muted-foreground mb-4 text-sm">
									{m.blog_author_bio()}
								</p>
								<div class="flex flex-col gap-2 sm:flex-row">
									<Button href="/contact" size="sm" class="zen-button text-xs sm:text-sm"
										>{m.blog_get_in_touch()}</Button
									>
									<Button
										href="/blog"
										variant="outline"
										size="sm"
										class="zen-button text-xs sm:text-sm"
									>
										{m.blog_more_posts()}
									</Button>
								</div>
							</div>
						</div>
					</div>

					<!-- Navigation -->
					<div
						class="mb-8 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-center sm:justify-between"
					>
						<Button href="/blog" variant="outline" class="zen-button text-xs sm:text-sm"
							>{m.blog_all_posts_link()}</Button
						>
						<Button
							onclick={sharePost}
							variant="outline"
							disabled={isSharing}
							class="zen-button text-xs sm:text-sm {isSharing
								? 'cursor-not-allowed opacity-70'
								: ''}"
						>
							{shareButtonText}
						</Button>
					</div>
				</div>
			</Section>
		</article>

		<!-- Related Posts -->
		{#if relatedPosts.length > 0}
			<Section background="muted">
				<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
					<SectionHeader title={m.blog_related_posts()} />

					<div class="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
						{#each relatedPosts as relatedPost}
							<BlogPostCard post={relatedPost} variant="compact" />
						{/each}
					</div>
				</div>
			</Section>
		{/if}
	{/if}
</main>
