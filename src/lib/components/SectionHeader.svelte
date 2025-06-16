<script lang="ts">
	interface Props {
		title: string;
		description?: string;
		centered?: boolean;
	}

	let { title, description, centered = true }: Props = $props();
</script>

<div class="mb-16 {centered ? 'text-center' : ''}">
	<h2 class="mb-4 text-3xl font-light">{title}</h2>
	{#if description}
		<p class="zen-text text-muted-foreground {centered ? 'mx-auto max-w-2xl' : ''}">
			{description}
		</p>
	{/if}
</div>
