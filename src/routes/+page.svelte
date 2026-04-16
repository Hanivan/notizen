<script lang="ts">
	import { config } from '$lib/config';
	import { ArrowRightIcon, FileTextIcon, CalendarIcon, UserIcon } from 'phosphor-svelte';
	import { fade, fly } from 'svelte/transition';
	import { browser } from '$app/environment';
	import type { BlogPostMeta } from '$lib/utils/blog';
	import BlogCard from '$lib/components/BlogCard.svelte';
	import { blogService } from '$lib/services';

	// Tea ceremony easing - matches blog page for consistency
	// Custom easing function that starts slow and ends smoothly
	function teaCeremonyEasing(t: number): number {
		return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	}

	let featuredPosts = $state<BlogPostMeta[]>([]);
	let loading = $state(true);

	// ✅ Load featured posts using service layer
	async function loadFeaturedPosts() {
		if (!browser) return;

		try {
			featuredPosts = await blogService.getFeaturedPosts(3);
		} catch (error) {
			console.error('Failed to load featured posts:', error);
		} finally {
			loading = false;
		}
	}

	// Load immediately on component mount
	loadFeaturedPosts();
</script>

<svelte:head>
	<title>Home - {config.site.name}</title>
	<meta name="description" content={config.site.description} />
</svelte:head>

<!-- Hero Section -->
<section class="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
	<!-- Subtle background pattern -->
	<div class="pattern-seigaiha absolute inset-0 opacity-50"></div>

	<div class="relative z-10 container mx-auto px-4">
		<div class="mx-auto max-w-4xl text-center">
			<!-- Small badge - fade in -->
			<div
				class="badge-accent mb-8 inline-flex items-center gap-2"
				in:fade={{ duration: 350, delay: 0, easing: teaCeremonyEasing }}
			>
				<span>Portfolio & Blog</span>
			</div>

			<!-- Main heading - fade in -->
			<h1
				class="mb-6 text-5xl font-semibold tracking-tight md:text-7xl lg:text-8xl"
				in:fade={{ duration: 400, delay: 100, easing: teaCeremonyEasing }}
			>
				{config.personal.name}
			</h1>

			<!-- Subtitle - fade in -->
			<p
				class="mx-auto mb-4 max-w-2xl text-xl text-muted-foreground md:text-2xl"
				in:fade={{ duration: 400, delay: 200, easing: teaCeremonyEasing }}
			>
				{config.personal.title}
			</p>

			<!-- Decorative divider - fade in -->
			<div
				class="divider-japanese mx-auto max-w-xs"
				in:fade={{ duration: 350, delay: 300, easing: teaCeremonyEasing }}
			></div>

			<!-- Bio text - fade in -->
			<p
				class="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground"
				in:fade={{ duration: 400, delay: 350, easing: teaCeremonyEasing }}
			>
				{config.personal.bio}
			</p>

			<!-- CTA buttons - fly in with scale -->
			<div
				class="mt-12 flex flex-wrap items-center justify-center gap-4"
				in:fly={{ y: 10, duration: 400, delay: 400, easing: teaCeremonyEasing }}
			>
				<a
					href="/blog"
					class="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
				>
					<span>Read Blog</span>
					<ArrowRightIcon size={20} class="transition-transform group-hover:translate-x-1" />
				</a>
				<a
					href={config.social.github.url}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-medium transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent"
				>
					<span>GitHub</span>
				</a>
			</div>
		</div>
	</div>

	<!-- Scroll indicator - bounce animation -->
	<div
		class="absolute bottom-8 left-1/2 -translate-x-1/2"
		in:fade={{ duration: 600, delay: 600, easing: teaCeremonyEasing }}
	>
		<div class="scroll-indicator">
			<div class="flex h-10 w-6 items-start justify-center rounded-full border-2 border-border p-2">
				<div class="h-2 w-1 animate-bounce rounded-full bg-primary"></div>
			</div>
		</div>
	</div>
</section>

<!-- Featured Posts Section -->
<section class="bg-muted/30 py-24">
	<div class="container mx-auto px-4">
		<!-- Section header - fly in -->
		<div
			class="mx-auto mb-16 max-w-4xl"
			in:fly={{ y: 15, duration: 375, delay: 0, easing: teaCeremonyEasing }}
		>
			<div class="mb-4 flex items-center gap-3">
				<div class="h-0.5 w-8 bg-primary"></div>
				<span class="text-sm font-medium tracking-widest text-muted-foreground uppercase"
					>Featured</span
				>
			</div>
			<h2 class="text-4xl font-semibold md:text-5xl">Latest Writing</h2>
		</div>

		<!-- Posts grid -->
		{#if loading}
			<div class="grid-japanese mx-auto max-w-6xl">
				{#each Array(3) as _, index (index)}
					<div
						class="card-japanese"
						in:fly={{ y: 10, duration: 375, delay: 100 + index * 60, easing: teaCeremonyEasing }}
					>
						<div class="mb-4 h-48 animate-pulse rounded bg-muted/50"></div>
						<div class="mb-2 h-6 animate-pulse rounded bg-muted/50"></div>
						<div class="h-4 w-3/4 animate-pulse rounded bg-muted/50"></div>
					</div>
				{/each}
			</div>
		{:else if featuredPosts.length > 0}
			<div class="grid-japanese mx-auto max-w-6xl">
				{#each featuredPosts as post, index (post.slug)}
					<BlogCard {post} {index} delay={100} stagger={60} variant="default" />
				{/each}
			</div>
		{:else}
			<div
				class="py-12 text-center"
				in:fade={{ duration: 400, delay: 100, easing: teaCeremonyEasing }}
			>
				<p class="text-muted-foreground">No featured posts yet. Check back soon!</p>
			</div>
		{/if}

		<!-- View all link -->
		{#if featuredPosts.length > 0}
			<div
				class="mt-12 text-center"
				in:fly={{ y: 10, duration: 375, delay: 300, easing: teaCeremonyEasing }}
			>
				<a
					href="/blog"
					class="inline-flex items-center gap-2 text-sm font-medium text-primary transition-all hover:gap-3"
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
		<div class="mx-auto max-w-4xl">
			<div class="grid-japanese" style="grid-template-columns: 1fr;">
				<!-- About card - fly in -->
				<div
					class="card-japanese"
					in:fly={{ y: 15, duration: 375, delay: 0, easing: teaCeremonyEasing }}
				>
					<div class="mb-6 flex items-start gap-4">
						<div
							class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10"
						>
							<UserIcon size={24} class="text-primary" />
						</div>
						<div>
							<h3 class="mb-1 text-2xl font-semibold">About Me</h3>
							<p class="text-sm text-muted-foreground">{config.personal.location}</p>
						</div>
					</div>

					<p class="mb-6 leading-relaxed text-muted-foreground">
						Hi, I'm {config.personal.name}. {config.personal.intro}
					</p>

					<div class="flex flex-wrap gap-3">
						{#each Object.values(config.social) as social (social.label)}
							<a
								href={social.url}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent"
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
	/* Scroll indicator animation */
	.scroll-indicator {
		animation: fadeIn 1s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* Smooth scroll behavior */
	:root {
		scroll-behavior: smooth;
	}
</style>
