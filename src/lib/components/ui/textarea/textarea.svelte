<script lang="ts">
	import { cn, type WithElementRef, type WithoutChildren } from '$lib/utils.js';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...restProps
	}: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> = $props();
</script>

<textarea
	bind:this={ref}
	data-slot="textarea"
	class={cn(
		'zen-input border-border bg-background flex min-h-20 w-full rounded-sm border px-3 py-2 text-sm transition-colors',
		'placeholder:text-muted-foreground',
		'focus:border-primary focus:ring-primary/20 focus:ring-1 focus:outline-none',
		'disabled:cursor-not-allowed disabled:opacity-50',
		'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
		className
	)}
	bind:value
	{...restProps}
></textarea>
