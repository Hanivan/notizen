<script lang="ts">
	import { config } from '$lib/config';
	import { ArrowRightIcon, FileTextIcon, CalendarIcon, UserIcon } from 'phosphor-svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { BlogPostMeta } from '$lib/utils/blog';

	let featuredPosts = $state<BlogPostMeta[]>([]);
	let loading = $state(true);

	// Load featured posts on mount
	onMount(async () => {
		if (browser) {
			try {
				const response = await fetch('/api/blog?featured=true&limit=3');
				if (response.ok) {
					const data = await response.json();
					featuredPosts = data || [];
				}
			} catch (error) {
				console.error('Failed to load featured posts:', error);
			} finally {
				loading = false;
			}
		}
	});
</script>

<svelte:head>
	<title>{config.site.name} - {config.personal.title}</title>
	<meta name="description" content={config.site.description} />
</svelte:head>

<!-- Hero Section -->
<section class="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
	<!-- Subtle background pattern -->
	<div class="absolute inset-0 pattern-seigaiha opacity-50"></div>

	<div class="container mx-auto px-4 relative z-10">
		<div class="max-w-4xl mx-auto text-center">
			<!-- Small badge -->
			<div class="inline-flex items-center gap-2 mb-8 badge-accent">
				<span>Portfolio & Blog</span>
			</div>

			<!-- Main heading with Japanese minimalism -->
			<h1 class="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-6">
				{config.personal.name}
			</h1>

			<!-- Subtitle with refined typography -->
			<p class="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
				{config.personal.title}
			</p>

			<!-- Decorative divider -->
			<div class="divider-japanese max-w-xs mx-auto"></div>

			<!-- Bio text -->
			<p class="text-lg text-muted-foreground mt-8 max-w-2xl mx-auto leading-relaxed">
				{config.personal.bio}
			</p>

			<!-- CTA buttons -->
			<div class="flex flex-wrap items-center justify-center gap-4 mt-12">
				<a
					href="/blog"
					class="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all duration-300"
				>
					<span>Read Blog</span>
					<ArrowRightIcon size={20} class="group-hover:translate-x-1 transition-transform" />
				</a>
				<a
					href={config.social.github.url}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-all duration-300"
				>
					<span>GitHub</span>
				</a>
			</div>
		</div>
	</div>

	<!-- Scroll indicator -->
	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
		<div class="w-6 h-10 border-2 border-border rounded-full flex items-start justify-center p-2">
			<div class="w-1 h-2 bg-primary rounded-full"></div>
		</div>
	</div>
</section>

<!-- Featured Posts Section -->
<section class="py-24 bg-muted/30">
	<div class="container mx-auto px-4">
		<!-- Section header -->
		<div class="max-w-4xl mx-auto mb-16">
			<div class="flex items-center gap-3 mb-4">
				<div class="w-8 h-0.5 bg-primary"></div>
				<span class="text-sm font-medium tracking-widest uppercase text-muted-foreground">Featured</span>
			</div>
			<h2 class="text-4xl md:text-5xl font-semibold">
				Latest Writing
			</h2>
		</div>

		<!-- Posts grid -->
		{#if loading}
			<div class="grid-japanese max-w-6xl mx-auto">
				{#each Array(3) as _}
					<div class="card-japanese">
						<div class="h-48 bg-muted/50 rounded mb-4 animate-pulse"></div>
						<div class="h-6 bg-muted/50 rounded mb-2 animate-pulse"></div>
						<div class="h-4 bg-muted/50 rounded w-3/4 animate-pulse"></div>
					</div>
				{/each}
			</div>
		{:else if featuredPosts.length > 0}
			<div class="grid-japanese max-w-6xl mx-auto">
				{#each featuredPosts as post}
					<article class="card-japanese group">
						<a href={`/blog/${post.slug}`} class="block">
							<!-- Post meta -->
							<div class="flex items-center gap-4 text-sm text-muted-foreground mb-3">
								<span class="flex items-center gap-1">
									<CalendarIcon size={14} />
									<time datetime={post.date}>
										{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
									</time>
								</span>
								{#if post.category}
									<span class="badge-accent text-xs">{post.category}</span>
								{/if}
							</div>

							<!-- Post title -->
							<h3 class="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
								{post.title}
							</h3>

							<!-- Post excerpt -->
							<p class="text-muted-foreground line-clamp-2 mb-4">
								{post.description || post.excerpt}
							</p>

							<!-- Read more link -->
							<div class="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
								<span>Read more</span>
								<ArrowRightIcon size={16} class="group-hover:translate-x-1 transition-transform" />
							</div>
						</a>
					</article>
				{/each}
			</div>
		{:else}
			<div class="text-center py-12">
				<p class="text-muted-foreground">No featured posts yet. Check back soon!</p>
			</div>
		{/if}

		<!-- View all link -->
		{#if featuredPosts.length > 0}
			<div class="text-center mt-12">
				<a
					href="/blog"
					class="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
				>
					<span>View all posts</span>
					<ArrowRightIcon size={18} />
				</a>
			</div>
		{/if}
	</div>
</section>

<!-- About Section -->
<section class="py-24">
	<div class="container mx-auto px-4">
		<div class="max-w-4xl mx-auto">
			<div class="grid-japanese" style="grid-template-columns: 1fr;">
				<!-- About card -->
				<div class="card-japanese">
					<div class="flex items-start gap-4 mb-6">
						<div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
							<UserIcon size={24} class="text-primary" />
						</div>
						<div>
							<h3 class="text-2xl font-semibold mb-1">
								About Me
							</h3>
							<p class="text-sm text-muted-foreground">{config.personal.location}</p>
						</div>
					</div>

					<p class="text-muted-foreground leading-relaxed mb-6">
						Hi, I'm {config.personal.name}. I'm a developer passionate about building elegant solutions
						to complex problems. This blog is where I share my thoughts, tutorials, and insights about
						software development, design patterns, and technology.
					</p>

					<div class="flex flex-wrap gap-3">
						{#each Object.values(config.social) as social}
							<a
								href={social.url}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-accent hover:border-primary/30 transition-all"
							>
								<span>{social.label}</span>
							</a>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	/* Custom animations */
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	section {
		animation: fadeInUp 0.6s ease-out;
	}

	/* Smooth scroll behavior */
	:root {
		scroll-behavior: smooth;
	}
</style>
