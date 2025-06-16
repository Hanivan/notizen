<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		icon: string;
		title: string;
		description: string;
		actions?: Snippet;
		maxWidth?: 'sm' | 'md' | 'lg';
	}

	let { icon, title, description, actions, maxWidth = 'md' }: Props = $props();

	const maxWidthClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg'
	};
</script>

<div class="text-center">
	<div class="mx-auto space-y-6 {maxWidthClasses[maxWidth]}">
		<div class="text-6xl opacity-50">{icon}</div>
		<div class="space-y-4">
			<h2 class="text-muted-foreground text-2xl font-light">{title}</h2>
			<p class="zen-text text-muted-foreground">
				{description}
			</p>
		</div>

		{#if actions}
			<div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
				{@render actions()}
			</div>
		{/if}
	</div>
</div>
