<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		background?: 'default' | 'muted';
		children: Snippet;
		class?: string;
	}

	let { background = 'default', children, class: className = '' }: Props = $props();

	const backgroundClasses = {
		default: 'bg-background',
		muted: 'bg-muted/30'
	};
</script>

<section class="zen-spacing {backgroundClasses[background]} {className}">
	<div class="zen-container">
		{@render children()}
	</div>
</section>
