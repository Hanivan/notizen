<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';

	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, 'type'> &
			({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
	>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		...restProps
	}: Props = $props();
</script>

{#if type === 'file'}
	<input
		bind:this={ref}
		data-slot="input"
		class={cn(
			'zen-input border-border bg-background flex h-10 w-full min-w-0 rounded-sm border px-3 py-2 text-sm transition-colors',
			'placeholder:text-muted-foreground',
			'focus:border-primary focus:ring-primary/20 focus:ring-1 focus:outline-none',
			'disabled:cursor-not-allowed disabled:opacity-50',
			'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
			className
		)}
		type="file"
		bind:files
		bind:value
		{...restProps}
	/>
{:else}
	<input
		bind:this={ref}
		data-slot="input"
		class={cn(
			'zen-input border-border bg-background flex h-10 w-full min-w-0 rounded-sm border px-3 py-2 text-sm transition-colors',
			'placeholder:text-muted-foreground',
			'focus:border-primary focus:ring-primary/20 focus:ring-1 focus:outline-none',
			'disabled:cursor-not-allowed disabled:opacity-50',
			'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
			className
		)}
		{type}
		bind:value
		{...restProps}
	/>
{/if}
