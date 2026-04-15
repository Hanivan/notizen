<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { config } from '$lib/config';
	import ThemeToggle from './ThemeToggle.svelte';
	import { HouseIcon, NewspaperIcon, ListIcon, XIcon } from 'phosphor-svelte';

	let scrolled = $state(false);
	let mobileMenuOpen = $state(false);

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

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
		// Prevent body scroll when menu is open
		if (typeof document !== 'undefined') {
			document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
		}
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
		if (typeof document !== 'undefined') {
			document.body.style.overflow = '';
		}
	}
</script>

<header
	class="navbar-fixed w-full transition-all duration-500 {scrolled
		? 'bg-background/95 backdrop-blur-md border-b border-border/40 shadow-sm'
		: 'bg-transparent border-b border-transparent'}"
>
	<div class="container mx-auto px-4">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo/Brand -->
			<a
				href="/"
				class="flex items-center gap-2 text-xl font-semibold transition-all duration-300 hover:text-primary group"
				style="font-family: 'Cormorant Garamond', serif;"
			>
				<span class="group-hover:tracking-wide transition-all duration-300">{config.site.name}</span>
			</a>

			<!-- Desktop Navigation -->
			<nav class="hidden items-center gap-8 md:flex">
				{#each navItems as item (item.href)}
					<a
						href={item.href}
						class="text-muted-foreground hover:text-foreground text-sm font-medium transition-all duration-300 relative py-2 {currentPath === item.href
							? 'text-foreground'
							: ''}"
					>
						<div class="flex items-center gap-2">
							{#if item.href === '/'}
								<HouseIcon size={16} weight={currentPath === item.href ? 'fill' : 'thin'} />
							{:else}
								<NewspaperIcon size={16} weight={currentPath === item.href ? 'fill' : 'thin'} />
							{/if}
							<span>{item.label}</span>
						</div>
						{#if currentPath === item.href}
							<span class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
						{/if}
					</a>
				{/each}
			</nav>

			<!-- Right Side Actions -->
			<div class="flex items-center gap-4">
				<!-- Theme Toggle -->
				<div class="hidden sm:block">
					<ThemeToggle />
				</div>

				<!-- Mobile Menu Button -->
				<button
					onclick={toggleMobileMenu}
					class="text-muted-foreground hover:text-foreground md:hidden transition-colors p-2 rounded-lg hover:bg-accent"
					aria-label="Toggle menu"
				>
					{#if mobileMenuOpen}
						<XIcon size={24} weight="thin" />
					{:else}
						<ListIcon size={24} weight="thin" />
					{/if}
				</button>
			</div>
		</div>

		<!-- Mobile Menu -->
		{#if mobileMenuOpen}
			<div class="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md">
				<nav class="py-4 space-y-1">
					{#each navItems as item (item.href)}
						<a
							href={item.href}
							onclick={closeMobileMenu}
							class="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg {currentPath === item.href
								? 'bg-primary/10 text-primary'
								: 'text-muted-foreground hover:bg-accent hover:text-foreground'}"
						>
							{#if item.href === '/'}
								<HouseIcon size={20} weight={currentPath === item.href ? 'fill' : 'thin'} />
							{:else}
								<NewspaperIcon size={20} weight={currentPath === item.href ? 'fill' : 'thin'} />
							{/if}
							<span>{item.label}</span>
						</a>
					{/each}
					<!-- Mobile Theme Toggle -->
					<div class="px-4 py-3 border-t border-border/40 mt-2">
						<div class="flex items-center justify-between">
							<span class="text-sm font-medium text-muted-foreground">Theme</span>
							<ThemeToggle />
						</div>
					</div>
				</nav>
			</div>
		{/if}
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
