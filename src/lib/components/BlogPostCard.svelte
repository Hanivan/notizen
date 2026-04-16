<script lang="ts">
	import {
		formatDate,
		formatDateRelative,
		generatePostEmoji,
		isRecentPost,
		type BlogPostMeta
	} from '$lib/utils/blog';

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

<!-- Minimalist Blog Card with Clean Design -->
<article class="group block h-full">
	<a
		href="/blog/{post.slug}"
		class="flex h-full flex-col gap-4 border border-border bg-card p-4 transition-all duration-300 hover:border-primary/50 hover:bg-card/80 hover:shadow-lg {variant ===
		'compact'
			? ''
			: 'sm:flex-row'} {featured ? 'ring-1 ring-primary/30' : ''}"
	>
		<!-- Image Section -->
		<div
			class="relative {variant === 'compact'
				? 'aspect-video w-full'
				: 'h-36 w-full sm:h-32 sm:w-48'} shrink-0 overflow-hidden bg-muted"
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
					<div class="h-full w-full animate-pulse bg-muted"></div>
				{/if}
			{:else}
				<!-- Emoji Fallback -->
				<div
					class="flex h-full w-full items-center justify-center bg-linear-to-br from-muted/50 to-muted"
				>
					<div class="text-center">
						<div
							class="mb-2 text-5xl transition-transform duration-300 group-hover:scale-110 sm:text-6xl"
						>
							{postEmoji}
						</div>
						<div class="text-xs text-muted-foreground/60">{post.category}</div>
					</div>
				</div>
			{/if}

			<!-- Status Indicators -->
			{#if featured || isRecent}
				<div class="absolute top-2 left-2 flex gap-2">
					{#if featured}
						<div class="bg-primary/90 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
							Featured
						</div>
					{/if}
					{#if isRecent}
						<div
							class="bg-green-500/90 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm"
						>
							New
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Content Section -->
		<div class="flex min-w-0 flex-1 flex-col">
			<!-- Category and Reading Time -->
			<div class="mb-3 flex items-center justify-between text-xs">
				<span class="bg-muted px-2 py-1 font-semibold text-muted-foreground uppercase">
					{post.category}
				</span>
				<span class="text-muted-foreground">{post.readingTime} min read</span>
			</div>

			<!-- Title -->
			<h3
				class="mb-3 line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary"
			>
				{post.title}
			</h3>

			<!-- Description -->
			<p class="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
				{post.excerpt}
			</p>

			<!-- Meta Information -->
			<div class="space-y-3 border-t border-border/60 pt-3">
				<!-- Author and Date -->
				<div class="flex items-center justify-between text-sm">
					{#if post.author}
						<span class="font-medium">{post.author}</span>
					{:else}
						<div></div>
					{/if}
					<time class="text-xs text-muted-foreground" datetime={post.date} title={displayDate}>
						{displayDate}
					</time>
				</div>

				<!-- Tags -->
				{#if post.tags.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each post.tags.slice(0, variant === 'compact' ? 2 : 3) as tag (tag)}
							<span
								class="border border-border/50 bg-muted px-2 py-1 text-xs text-muted-foreground"
							>
								{tag}
							</span>
						{/each}
						{#if post.tags.length > (variant === 'compact' ? 2 : 3)}
							<span
								class="border border-border/50 bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
							>
								+{post.tags.length - (variant === 'compact' ? 2 : 3)}
							</span>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<!-- Read Indicator -->
		<div
			class="flex items-center justify-end opacity-0 transition-all duration-300 group-hover:opacity-100 {variant ===
			'compact'
				? 'pt-2'
				: 'sm:pt-4'}"
		>
			<svg
				class="text-primary transition-transform duration-300 group-hover:translate-x-1"
				width="20"
				height="20"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				stroke-width="2"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
			</svg>
		</div>
	</a>
</article>
