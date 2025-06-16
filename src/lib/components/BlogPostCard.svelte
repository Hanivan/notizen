<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import {
		formatDate,
		formatDateRelative,
		generatePostEmoji,
		isRecentPost,
		type BlogPostMeta
	} from '$lib/utils/blog.js';

	interface Props {
		post: BlogPostMeta;
		featured?: boolean;
		variant?: 'default' | 'compact';
		showRelativeDate?: boolean;
	}

	let { post, featured = false, variant = 'default', showRelativeDate = false }: Props = $props();

	let imageError = $state(false);
	let imageLoaded = $state(false);

	function handleImageError() {
		imageError = true;
	}

	function handleImageLoad() {
		imageLoaded = true;
	}

	let showImage = $derived(post.image && !imageError);
	let postEmoji = $derived(generatePostEmoji(post));
	let isRecent = $derived(isRecentPost(post.date));
	let displayDate = $derived(
		showRelativeDate ? formatDateRelative(post.date) : formatDate(post.date)
	);
</script>

<!-- Zen Minimalist Blog Card (GitHub-inspired) -->
<article class="group block h-full">
	<a
		href="/blog/{post.slug}"
		class="border-border/40 bg-card/50 hover:border-border hover:bg-card flex h-full flex-col gap-4 rounded-xl border p-4 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-black/5 {variant ===
		'compact'
			? ''
			: 'sm:flex-row'} {featured ? 'ring-primary/20 ring-1' : ''}"
	>
		<!-- Image Section -->
		<div
			class="relative {variant === 'compact'
				? 'aspect-video w-full'
				: 'h-32 w-full sm:h-24 sm:w-32'} flex-shrink-0 overflow-hidden rounded-lg"
		>
			{#if showImage}
				<img
					src={post.image}
					alt={post.title}
					class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 {imageLoaded
						? 'opacity-100'
						: 'opacity-0'}"
					onerror={handleImageError}
					onload={handleImageLoad}
				/>
				{#if !imageLoaded}
					<div class="bg-muted h-full w-full animate-pulse"></div>
				{/if}
			{:else}
				<!-- Zen Emoji Fallback -->
				<div
					class="from-muted/30 to-muted/60 flex h-full w-full items-center justify-center bg-gradient-to-br"
				>
					<div class="text-center">
						<div
							class="text-3xl opacity-70 transition-transform duration-300 group-hover:scale-110 sm:text-2xl"
						>
							{postEmoji}
						</div>
					</div>
				</div>
			{/if}

			<!-- Status Indicators -->
			{#if featured || isRecent}
				<div class="absolute top-2 left-2 flex gap-1">
					{#if featured}
						<div class="bg-primary/20 rounded-full px-2 py-0.5 backdrop-blur-sm">
							<span class="text-primary text-xs font-medium">{m.blog_featured()}</span>
						</div>
					{/if}
					{#if isRecent}
						<div class="rounded-full bg-green-500/20 px-2 py-0.5 backdrop-blur-sm">
							<span class="text-xs font-medium text-green-600 dark:text-green-400"
								>{m.blog_new()}</span
							>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Content Section -->
		<div class="flex min-w-0 flex-1 flex-col">
			<!-- Category and Reading Time -->
			<div class="mb-2 flex items-center justify-between">
				<span class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
					{post.category}
				</span>
				<span class="text-muted-foreground text-xs">{post.readingTime} {m.blog_min_read()}</span>
			</div>

			<!-- Title -->
			<h3
				class="text-foreground group-hover:text-primary mb-2 line-clamp-2 text-lg leading-tight font-semibold tracking-tight transition-colors duration-200 sm:text-base"
			>
				{post.title}
			</h3>

			<!-- Description -->
			<p
				class="text-muted-foreground mb-4 line-clamp-3 flex-1 text-sm leading-relaxed sm:line-clamp-2"
			>
				{post.excerpt}
			</p>

			<!-- Meta Information (Reorganized) -->
			<div class="border-border/20 space-y-3 border-t pt-3">
				<!-- Author and Date -->
				<div class="flex items-center justify-between">
					{#if post.author}
						<span class="text-foreground text-sm font-medium">{post.author}</span>
					{:else}
						<div></div>
					{/if}
					<time
						class="text-muted-foreground text-xs"
						title={formatDate(post.date)}
						datetime={post.date}
					>
						{displayDate}
					</time>
				</div>

				<!-- Tags Only -->
				{#if post.tags.length > 0}
					<div class="flex flex-wrap items-center gap-2">
						{#each post.tags.slice(0, variant === 'compact' ? 2 : 3) as tag}
							<span
								class="bg-muted/40 text-muted-foreground inline-flex items-center rounded px-2 py-0.5 text-xs"
							>
								{tag}
							</span>
						{/each}
						{#if post.tags.length > (variant === 'compact' ? 2 : 3)}
							<span
								class="bg-muted/40 text-muted-foreground inline-flex items-center rounded px-2 py-0.5 text-xs"
							>
								+{post.tags.length - (variant === 'compact' ? 2 : 3)}
							</span>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<!-- Subtle Read Indicator -->
		<div
			class="flex items-center opacity-0 transition-all duration-300 group-hover:opacity-100 {variant ===
			'compact'
				? 'justify-end pt-2'
				: 'sm:items-start sm:pt-4'}"
		>
			<svg
				class="text-muted-foreground h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</div>
	</a>
</article>
