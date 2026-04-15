<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { config } from '$lib/config';
	import ThemeToggle from './ThemeToggle.svelte';
	import { House, Newspaper, List } from 'phosphor-svelte';

	let scrolled = $state(false);

	// Track scroll for navbar background
	onMount(() => {
		// Only run on client-side to prevent hydration mismatch
		if (!browser) return;

		function handleScroll() {
			scrolled = window.scrollY > 20;
		}

		// Use setTimeout to prevent hydration mismatch
		setTimeout(() => {
			handleScroll();
		}, 0);

		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => window.removeEventListener('scroll', handleScroll);
	});

	let currentPath = $derived(page.url.pathname);
	let navItems = $derived(config.navigation.main);
</script>

<header
	class="navbar-fixed w-full transition-all duration-500 {scrolled
		? 'bg-background/95 backdrop-blur-md border-b border-border/40'
		: 'bg-transparent'}"
>
	<div class="container mx-auto px-4">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo/Brand -->
			<a
				href="/"
				class="flex items-center gap-2 text-xl font-semibold transition-colors hover:text-primary"
			>
				<span>{config.site.name}</span>
			</a>

			<!-- Desktop Navigation -->
			<nav class="hidden items-center gap-6 md:flex">
				{#each navItems as item (item.href)}
					<a
						href={item.href}
						class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors {currentPath === item.href
							? 'text-foreground'
							: ''}"
					>
						<div class="flex items-center gap-2">
							{#if item.href === '/'}
								<House size={18} />
							{:else}
								<Newspaper size={18} />
							{/if}
							<span>{item.label}</span>
						</div>
					</a>
				{/each}
			</nav>

			<!-- Right Side Actions -->
			<div class="flex items-center gap-4">
				<!-- Theme Toggle -->
				<ThemeToggle />

				<!-- Mobile Menu Button -->
				<button
					class="text-muted-foreground hover:text-foreground md:hidden"
					aria-label="Toggle menu"
				>
					<List size={24} />
				</button>
			</div>
		</div>
	</div>
</header>

<style>
	.navbar-fixed {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
	}
</style>
