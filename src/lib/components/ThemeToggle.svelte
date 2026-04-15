<script lang="ts">
	import { SunIcon, MoonIcon, MonitorIcon } from 'phosphor-svelte';
	import { setMode, resetMode } from 'mode-watcher';
	import { DropdownMenu } from 'bits-ui';
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="group relative inline-flex h-10 w-10 select-none items-center justify-center rounded-lg border border-border/50 text-foreground transition-all duration-300 hover:border-primary/50 hover:bg-accent hover:shadow-sm"
		aria-label="Toggle theme"
	>
		<!-- Vermilion accent glow on hover -->
		<div class="absolute inset-0 rounded-lg bg-primary/0 opacity-0 transition-all duration-300 group-hover:bg-primary/5 group-hover:opacity-100"></div>

		<!-- Sun icon (visible in dark mode) -->
		<SunIcon
			class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all duration-500 dark:scale-0 dark:-rotate-90"
			weight="fill"
		/>

		<!-- Moon icon (visible in light mode) -->
		<MoonIcon
			class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all duration-500 dark:scale-100 dark:rotate-0"
			weight="fill"
		/>

		<!-- Subtle indicator dot -->
		<div class="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-primary/60 opacity-60"></div>

		<span class="sr-only">Toggle theme</span>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content
		align="end"
		class="min-w-[180px] z-1001 mt-4.5"
	>
		<!-- Light mode option -->
		<DropdownMenu.Item
			onclick={() => setMode('light')}
			class="group relative flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 hover:bg-accent rounded-md"
		>
			<!-- Icon container with subtle accent -->
			<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
				<SunIcon weight="fill" class="text-primary h-4 w-4" />
			</div>
			<div class="flex-1">
				<span class="font-medium">Light</span>
				<p class="text-muted-foreground text-xs mt-0.5">Clean and bright</p>
			</div>
			<!-- Active indicator -->
			<div class="h-2 w-2 rounded-full bg-primary/0 group-hover:bg-primary/40 transition-colors"></div>
		</DropdownMenu.Item>

		<!-- Dark mode option -->
		<DropdownMenu.Item
			onclick={() => setMode('dark')}
			class="group relative flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 hover:bg-accent rounded-md"
		>
			<!-- Icon container with subtle accent -->
			<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
				<MoonIcon weight="fill" class="text-primary h-4 w-4" />
			</div>
			<div class="flex-1">
				<span class="font-medium">Dark</span>
				<p class="text-muted-foreground text-xs mt-0.5">Easy on the eyes</p>
			</div>
			<!-- Active indicator -->
			<div class="h-2 w-2 rounded-full bg-primary/0 group-hover:bg-primary/40 transition-colors"></div>
		</DropdownMenu.Item>

		<!-- System mode option -->
		<DropdownMenu.Item
			onclick={() => resetMode()}
			class="group relative flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 hover:bg-accent rounded-md"
		>
			<!-- Icon container with subtle accent -->
			<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
				<MonitorIcon weight="fill" class="text-primary h-4 w-4" />
			</div>
			<div class="flex-1">
				<span class="font-medium">System</span>
				<p class="text-muted-foreground text-xs mt-0.5">Follow your device</p>
			</div>
			<!-- Active indicator -->
			<div class="h-2 w-2 rounded-full bg-primary/0 group-hover:bg-primary/40 transition-colors"></div>
		</DropdownMenu.Item>

		<!-- Decorative divider -->
		<div class="mx-3 my-1 h-px bg-border/60"></div>

		<!-- Footer note -->
		<div
			class="px-3 py-2 text-center"
			in:fade={{ duration: 300, easing: quintOut }}
		>
			<p class="text-muted-foreground text-xs">
				Theme preference saved
			</p>
		</div>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<style>
	/* Custom dropdown styling for Japanese minimalism */
	:global([data-state='open']) > div {
		animation: fadeInUp 0.2s ease-out;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(-4px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	/* Smooth hover transitions */
	:global([role='menuitem']) {
		position: relative;
		overflow: hidden;
	}

	:global([role='menuitem'])::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 2px;
		height: 100%;
		background: oklch(var(--color-primary));
		transform: scaleY(0);
		transition: transform 0.2s ease;
	}

	:global([role='menuitem']:hover)::before {
		transform: scaleY(1);
	}

	/* Focus styles */
	:global([role='menuitem']:focus-visible) {
		outline: 2px solid oklch(var(--color-primary) / 0.5);
		outline-offset: 2px;
	}
</style>
