<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { config } from '$lib/config.js';
	import { m } from '$lib/paraglide/messages.js';

	interface Props {
		variant?: 'default' | 'outline';
		size?: 'default' | 'sm' | 'lg';
		class?: string;
	}

	let { variant = 'outline', size = 'sm', class: className = '' }: Props = $props();

	// Build social links from config
	const socialLinks = [
		{
			name: m.social_github(),
			url: config.social.github.url,
			isPublished: config.social.github.isPublished
		},
		{
			name: m.social_linkedin(),
			url: config.social.linkedin.url,
			isPublished: config.social.linkedin.isPublished
		},
		{
			name: m.social_instagram(),
			url: config.social.instagram.url,
			isPublished: config.social.instagram.isPublished
		}
	].filter((link) => link.isPublished);
</script>

{#if socialLinks.length > 0}
	<div class="flex flex-wrap gap-3 {className}">
		{#each socialLinks as link}
			<Button
				href={link.url}
				{variant}
				{size}
				class="zen-button"
				target="_blank"
				rel="noopener noreferrer"
			>
				{link.name}
			</Button>
		{/each}
	</div>
{/if}
