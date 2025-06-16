<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description: string;
		children?: Snippet;
	}

	let { title, description, children }: Props = $props();
</script>

<section class="zen-spacing bg-background">
	<div class="zen-container text-center">
		<h1 class="mb-8 text-4xl font-light md:text-5xl lg:text-6xl">{title}</h1>
		<p class="zen-text text-muted-foreground mx-auto mb-12 max-w-2xl">
			{description}
		</p>

		{#if children}
			{@render children()}
		{/if}
	</div>
</section>
