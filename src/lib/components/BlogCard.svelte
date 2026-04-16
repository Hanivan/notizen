<script lang="ts">
	import { FolderIcon } from 'phosphor-svelte';
	import type { BlogPostMeta } from '$lib/utils/blog';
	import { fly } from 'svelte/transition';

	interface Props {
		post: BlogPostMeta;
		index?: number;
		delay?: number;
		stagger?: number;
		variant?: 'default' | 'featured';
	}

	let {
		post,
		index = 0,
		delay = 100,
		stagger = 60,
		variant = 'default'
	}: Props = $props();

	// Tea ceremony easing
	function teaCeremonyEasing(t: number): number {
		return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	}

	let animationDelay = $derived(delay + (index * stagger));
	let titleSize = $derived(variant === 'featured' ? 'text-2xl' : 'text-xl');
</script>

<article
	class="card-japanese group"
	in:fly={{ y: 10, duration: 375, delay: animationDelay, easing: teaCeremonyEasing }}
>
	<a href={`/blog/${post.slug}`} class="block">
		<!-- Post meta -->
		<div class="flex items-center gap-4 text-sm text-muted-foreground mb-3">
			<span class="flex items-center gap-1">
				<FolderIcon size={14} />
				{post.category || 'General'}
			</span>
			<span>•</span>
			<time datetime={post.date}>
				{new Date(post.date).toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
					year: 'numeric'
				})}
			</time>
		</div>

		<!-- Post title -->
		<h3 class="blog-card-title {titleSize} font-semibold mb-3 group-hover:text-primary transition-colors leading-tight">
			{post.title}
		</h3>

		<!-- Post excerpt -->
		<p class="text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
			{post.description || post.excerpt}
		</p>

		<!-- Tags -->
		{#if post.tags && post.tags.length > 0}
			<div class="flex flex-wrap gap-2 mb-4">
				{#each post.tags.slice(0, 3) as tag (tag)}
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

<style>
	.blog-card-title {
		font-family: 'Cormorant Garamond', serif;
	}
</style>
