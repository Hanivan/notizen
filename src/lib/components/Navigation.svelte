<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { config } from '$lib/config.js';
	import { m } from '$lib/paraglide/messages.js';
	import { setLocale } from '$lib/paraglide/runtime';
	import { Menu, X } from 'lucide-svelte';

	let mobileMenuOpen = false;

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<nav class="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
	<div class="zen-container flex h-16 items-center justify-between px-4 md:px-0">
		<!-- Logo -->
		<a href="/" class="text-xl font-light tracking-wide"> {config.personal.initials} </a>

		<!-- Desktop Navigation -->
		<div class="hidden items-center gap-8 md:flex">
			<a href="/" class="zen-text hover:text-primary font-medium transition-colors">
				{m.nav_home()}
			</a>
			<a href="/projects" class="zen-text hover:text-primary font-medium transition-colors">
				{m.nav_projects()}
			</a>
			<a href="/blog" class="zen-text hover:text-primary font-medium transition-colors">
				{m.nav_blog()}
			</a>
			<a href="/contact" class="zen-text hover:text-primary font-medium transition-colors">
				{m.nav_contact()}
			</a>
		</div>

		<!-- Language Switcher & Mobile Menu Button -->
		<div class="flex items-center gap-2">
			<!-- Language Switcher -->
			<div class="hidden gap-1 sm:flex">
				<Button size="sm" variant="ghost" onclick={() => setLocale('en')} class="text-xs">EN</Button
				>
				<Button size="sm" variant="ghost" onclick={() => setLocale('jp')} class="text-xs">JP</Button
				>
				<Button size="sm" variant="ghost" onclick={() => setLocale('id')} class="text-xs">ID</Button
				>
			</div>

			<!-- Mobile Menu Button -->
			<Button
				variant="ghost"
				size="sm"
				class="md:hidden"
				onclick={toggleMobileMenu}
				aria-label="Toggle menu"
			>
				{#if mobileMenuOpen}
					<X class="h-5 w-5" />
				{:else}
					<Menu class="h-5 w-5" />
				{/if}
			</Button>
		</div>
	</div>

	<!-- Mobile Navigation -->
	{#if mobileMenuOpen}
		<div class="bg-background border-t md:hidden">
			<div class="zen-container px-6 py-4 md:px-8">
				<div class="flex flex-col space-y-4">
					<a
						href="/"
						class="zen-text hover:text-primary font-medium transition-colors"
						onclick={toggleMobileMenu}
					>
						{m.nav_home()}
					</a>
					<a
						href="/projects"
						class="zen-text hover:text-primary font-medium transition-colors"
						onclick={toggleMobileMenu}
					>
						{m.nav_projects()}
					</a>
					<a
						href="/blog"
						class="zen-text hover:text-primary font-medium transition-colors"
						onclick={toggleMobileMenu}
					>
						{m.nav_blog()}
					</a>
					<a
						href="/contact"
						class="zen-text hover:text-primary font-medium transition-colors"
						onclick={toggleMobileMenu}
					>
						{m.nav_contact()}
					</a>

					<!-- Mobile Language Switcher -->
					<div class="flex gap-2 border-t pt-2">
						<Button size="sm" variant="outline" onclick={() => setLocale('en')} class="text-xs"
							>EN</Button
						>
						<Button size="sm" variant="outline" onclick={() => setLocale('jp')} class="text-xs"
							>JP</Button
						>
						<Button size="sm" variant="outline" onclick={() => setLocale('id')} class="text-xs"
							>ID</Button
						>
					</div>
				</div>
			</div>
		</div>
	{/if}
</nav>
