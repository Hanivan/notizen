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
				<p class="text-sm leading-relaxed text-muted-foreground">
					{config.site.tagline}
				</p>
				<!-- Decorative accent -->
				<div class="h-0.5 w-12 bg-primary"></div>
			</div>

			<!-- Navigation -->
			<div class="space-y-4">
				<h3 class="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
					Navigation
				</h3>
				<ul class="space-y-3">
					{#each config.navigation.main as item (item.href)}
						<li>
							<a
								href={item.href}
								class="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-primary"
							>
								<span class="transition-transform group-hover:translate-x-1">→</span>
								<span>{item.label}</span>
							</a>
						</li>
					{/each}
					{#if config.navigation.secondary && config.navigation.secondary.length > 0}
						{#each config.navigation.secondary as item (item.href)}
							<li>
								<a
									href={item.href}
									class="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-primary"
								>
									<span class="transition-transform group-hover:translate-x-1">→</span>
									<span>{item.label}</span>
								</a>
							</li>
						{/each}
					{/if}
				</ul>
			</div>

			<!-- Social Links -->
			<div class="space-y-4">
				<h3 class="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
					Connect
				</h3>
				<div class="flex gap-3">
					{#each Object.values(config.social) as social (social.url)}
						<a
							href={social.url}
							target="_blank"
							rel="noopener noreferrer"
							class="flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-all duration-300 hover:border-border/50 hover:bg-accent hover:text-primary"
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

			<!-- Other Projects -->
			<div class="space-y-4">
				<h3 class="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
					More Projects
				</h3>
				<ul class="space-y-3">
					{#each Object.values(config.otherProjects) as project (project.label)}
						<li>
							<a
								href={project.url}
								target="_blank"
								rel="noopener noreferrer"
								class="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-primary"
							>
								<span class="transition-transform group-hover:translate-x-1">→</span>
								<span>{project.label}</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="mt-16 border-t border-border/60 pt-8">
			<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
				<p class="text-sm text-muted-foreground">
					{config.business.copyright}
				</p>
				<!-- Decorative elements -->
				<div class="flex items-center gap-2">
					<div class="h-2 w-2 rounded-full bg-primary/60"></div>
					<div class="h-2 w-2 rounded-full bg-primary/40"></div>
					<div class="h-2 w-2 rounded-full bg-primary/20"></div>
				</div>
			</div>
		</div>
	</div>
</footer>
