<script lang="ts">
	import { config } from '$lib/config';
	import { GithubLogo, XLogo, Envelope } from 'phosphor-svelte';
</script>

<footer class="border-border/40 border-t bg-muted/50">
	<div class="container mx-auto px-4 py-12">
		<div class="grid gap-8 md:grid-cols-4">
			<!-- Brand -->
			<div class="space-y-4">
				<h3 class="text-lg font-semibold">{config.site.name}</h3>
				<p class="text-muted-foreground text-sm">
					{config.site.tagline}
				</p>
			</div>

			<!-- Navigation -->
			<div class="space-y-4">
				<h3 class="text-sm font-semibold uppercase tracking-wider">Navigation</h3>
				<ul class="space-y-2">
					{#each config.navigation.main as item}
						<li>
							<a
								href={item.href}
								class="text-muted-foreground hover:text-foreground text-sm transition-colors"
							>
								{item.label}
							</a>
						</li>
					{/each}
					{#each config.navigation.secondary as item}
						<li>
							<a
								href={item.href}
								class="text-muted-foreground hover:text-foreground text-sm transition-colors"
							>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Social Links -->
			<div class="space-y-4">
				<h3 class="text-sm font-semibold uppercase tracking-wider">Connect</h3>
				<div class="flex gap-4">
					{#each Object.values(config.social) as social}
						<a
							href={social.url}
							target="_blank"
							rel="noopener noreferrer"
							class="text-muted-foreground hover:text-foreground transition-colors"
							aria-label={social.label}
						>
							{#if social.label === 'GitHub'}
								<GithubLogo size={24} />
							{:else if social.label === 'X'}
								<XLogo size={24} />
							{:else if social.label === 'Email'}
								<Envelope size={24} />
							{/if}
						</a>
					{/each}
				</div>
			</div>

			<!-- Copyright -->
			<div class="space-y-4">
				<h3 class="text-sm font-semibold uppercase tracking-wider">Legal</h3>
				<ul class="space-y-2">
					<li>
						<a
							href="/privacy"
							class="text-muted-foreground hover:text-foreground text-sm transition-colors"
						>
							Privacy Policy
						</a>
					</li>
					<li>
						<a
							href="/terms"
							class="text-muted-foreground hover:text-foreground text-sm transition-colors"
						>
							Terms of Service
						</a>
					</li>
				</ul>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="mt-12 border-t border-border pt-8 text-center">
			<p class="text-muted-foreground text-sm">
				{config.business.copyright}
			</p>
		</div>
	</div>
</footer>
