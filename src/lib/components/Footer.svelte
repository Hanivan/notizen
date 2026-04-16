<script lang="ts">
	import { config } from '$lib/config';
	import { GithubLogoIcon, XLogoIcon, EnvelopeIcon, InstagramLogoIcon } from 'phosphor-svelte';
</script>

<footer class="border-t border-border/40 bg-muted/30">
	<div class="container mx-auto px-4 py-16">
		<div class="grid gap-12 md:grid-cols-4">
			<!-- Brand -->
			<div class="space-y-4">
				<h3 class="text-2xl font-semibold">
					{config.site.name}
				</h3>
				<p class="text-muted-foreground text-sm leading-relaxed">
					{config.site.tagline}
				</p>
				<!-- Decorative accent -->
				<div class="w-12 h-0.5 bg-primary"></div>
			</div>

			<!-- Navigation -->
			<div class="space-y-4">
				<h3 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
					Navigation
				</h3>
				<ul class="space-y-3">
					{#each config.navigation.main as item (item.href)}
						<li>
							<a
								href={item.href}
								class="text-muted-foreground hover:text-primary text-sm transition-all duration-300 inline-flex items-center gap-2 group"
							>
								<span class="group-hover:translate-x-1 transition-transform">→</span>
								<span>{item.label}</span>
							</a>
						</li>
					{/each}
					{#each config.navigation.secondary as item (item.href)}
						<li>
							<a
								href={item.href}
								class="text-muted-foreground hover:text-primary text-sm transition-all duration-300 inline-flex items-center gap-2 group"
							>
								<span class="group-hover:translate-x-1 transition-transform">→</span>
								<span>{item.label}</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Social Links -->
			<div class="space-y-4">
				<h3 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
					Connect
				</h3>
				<div class="flex gap-3">
					{#each Object.values(config.social) as social (social.url)}
						<a
							href={social.url}
							target="_blank"
							rel="noopener noreferrer"
							class="text-muted-foreground hover:text-primary hover:bg-accent w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 border border-transparent hover:border-border/50"
							aria-label={social.label}
						>
							{#if social.label === 'GitHub'}
								<GithubLogoIcon size={20} weight="thin" />
							{:else if social.label === 'X (Twitter)'}
								<XLogoIcon size={20} weight="thin" />
							{:else if social.label === 'Email'}
								<EnvelopeIcon size={20} weight="thin" />
							{:else if social.label === 'Instagram'}
								<InstagramLogoIcon size={20} weight="thin" />
							{/if}
						</a>
					{/each}
				</div>
			</div>

			<!-- Legal -->
			<div class="space-y-4">
				<h3 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
					Legal
				</h3>
				<ul class="space-y-3">
					<li>
						<a
							href="/privacy"
							class="text-muted-foreground hover:text-primary text-sm transition-all duration-300 inline-flex items-center gap-2 group"
						>
							<span class="group-hover:translate-x-1 transition-transform">→</span>
							<span>Privacy Policy</span>
						</a>
					</li>
					<li>
						<a
							href="/terms"
							class="text-muted-foreground hover:text-primary text-sm transition-all duration-300 inline-flex items-center gap-2 group"
						>
							<span class="group-hover:translate-x-1 transition-transform">→</span>
							<span>Terms of Service</span>
						</a>
					</li>
				</ul>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="mt-16 border-t border-border/60 pt-8">
			<div class="flex flex-col md:flex-row items-center justify-between gap-4">
				<p class="text-muted-foreground text-sm">
					{config.business.copyright}
				</p>
				<!-- Decorative elements -->
				<div class="flex items-center gap-2">
					<div class="w-2 h-2 rounded-full bg-primary/60"></div>
					<div class="w-2 h-2 rounded-full bg-primary/40"></div>
					<div class="w-2 h-2 rounded-full bg-primary/20"></div>
				</div>
			</div>
		</div>
	</div>
</footer>
