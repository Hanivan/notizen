<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import { config } from '$lib/config.js';
	import { m } from '$lib/paraglide/messages.js';
	import '../app.css';

	let { children } = $props();
</script>

<Navigation />

<main>
	{@render children()}
</main>

<!-- Footer -->
<footer class="bg-muted/30 border-t py-12">
	<div class="zen-container text-center">
		<div class="space-y-4">
			<p class="zen-text text-muted-foreground text-sm">
				{m.footer_text()}
			</p>
			<p class="text-muted-foreground text-xs">
				{config.business.copyright}
			</p>
		</div>
	</div>
</footer>
