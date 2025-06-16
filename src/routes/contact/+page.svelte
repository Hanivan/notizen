<script lang="ts">
	import EmptyState from '$lib/components/EmptyState.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import Section from '$lib/components/Section.svelte';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import SocialLinks from '$lib/components/SocialLinks.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { config } from '$lib/config.js';
	import { m } from '$lib/paraglide/messages.js';
	import type { Faqs } from '$lib/types/faqs';

	// Form state
	let formData = {
		name: '',
		email: '',
		subject: '',
		message: ''
	};

	let isSubmitting = false;

	async function handleSubmit() {
		isSubmitting = true;
		// Simulate form submission
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Reset form
		formData = {
			name: '',
			email: '',
			subject: '',
			message: ''
		};

		isSubmitting = false;
		alert('Message sent successfully!'); // In real app, use proper notification
	}

	// FAQ data
	const faqs: Faqs[] = [
		// {
		// 	question: m.faq_1_question(),
		// 	answer: m.faq_1_answer()
		// },
		// {
		// 	question: m.faq_2_question(),
		// 	answer: m.faq_2_answer()
		// },
		// {
		// 	question: m.faq_3_question(),
		// 	answer: m.faq_3_answer()
		// }
	];
</script>

<svelte:head>
	<title>{m.nav_contact()} - {config.personal.name}</title>
	<meta name="description" content={m.contact_hero_description()} />
</svelte:head>

<main class="min-h-screen">
	<!-- Hero Section -->
	<PageHero title={m.contact_hero_title()} description={m.contact_hero_description()} />

	<!-- Contact Form & Info -->
	<Section background="muted">
		<div class="grid gap-16 lg:grid-cols-2">
			<!-- Contact Form -->
			<Card class="zen-card">
				<CardHeader>
					<CardTitle class="text-2xl font-light">{m.contact_form_title()}</CardTitle>
				</CardHeader>
				<CardContent class="space-y-6">
					<form on:submit|preventDefault={handleSubmit} class="space-y-6">
						<div class="grid gap-4 sm:grid-cols-2">
							<div class="space-y-2">
								<Label for="name">{m.contact_form_name()}</Label>
								<Input id="name" bind:value={formData.name} required class="zen-input" />
							</div>
							<div class="space-y-2">
								<Label for="email">{m.contact_form_email()}</Label>
								<Input
									id="email"
									type="email"
									bind:value={formData.email}
									required
									class="zen-input"
								/>
							</div>
						</div>
						<div class="space-y-2">
							<Label for="subject">{m.contact_form_subject()}</Label>
							<Input id="subject" bind:value={formData.subject} required class="zen-input" />
						</div>
						<div class="space-y-2">
							<Label for="message">{m.contact_form_message()}</Label>
							<Textarea
								id="message"
								bind:value={formData.message}
								required
								rows={6}
								class="zen-input resize-none"
							/>
						</div>
						<Button type="submit" disabled={isSubmitting} class="zen-button w-full" size="lg">
							{isSubmitting ? m.contact_form_sending() : m.contact_form_send()}
						</Button>
					</form>
				</CardContent>
			</Card>

			<!-- Contact Information -->
			<div class="space-y-8">
				<Card class="zen-card">
					<CardHeader>
						<CardTitle class="text-xl font-light">{m.contact_info_title()}</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="space-y-2">
							<p class="text-sm font-medium">Email</p>
							<p class="zen-text text-muted-foreground">{config.personal.email}</p>
						</div>
						<Separator />
						<div class="space-y-2">
							<p class="text-sm font-medium">Location</p>
							<p class="zen-text text-muted-foreground">{config.personal.location}</p>
						</div>
						<Separator />
						<div class="space-y-2">
							<p class="text-sm font-medium">Timezone</p>
							<p class="zen-text text-muted-foreground">{config.business.timezone}</p>
						</div>
						<Separator />
						<div class="space-y-2">
							<p class="text-sm font-medium">Status</p>
							<Badge variant="secondary" class="bg-green-100 text-green-800">
								{config.business.availability ? m.contact_availability() : 'Currently Unavailable'}
							</Badge>
						</div>
					</CardContent>
				</Card>

				<!-- Social Links -->
				<Card class="zen-card">
					<CardHeader>
						<CardTitle class="text-xl font-light">{m.social_links_title()}</CardTitle>
					</CardHeader>
					<CardContent>
						<SocialLinks />
						{#if !config.social.github.isPublished && !config.social.linkedin.isPublished && !config.social.instagram.isPublished}
							<div class="text-center">
								<div class="space-y-3">
									<div class="text-3xl opacity-50">🔗</div>
									<p class="text-muted-foreground text-sm">Social links will be available soon!</p>
								</div>
							</div>
						{/if}
					</CardContent>
				</Card>
			</div>
		</div>
	</Section>

	<!-- FAQ Section -->
	{#if config.sections.faq}
		<Section>
			<SectionHeader title={m.faq_title()} />

			{#if faqs.length > 0}
				<div class="mx-auto max-w-3xl space-y-6">
					{#each faqs as faq}
						<Card class="zen-card">
							<CardHeader>
								<CardTitle class="text-lg font-medium">{faq.question}</CardTitle>
							</CardHeader>
							<CardContent>
								<p class="zen-text text-muted-foreground leading-relaxed">
									{faq.answer}
								</p>
							</CardContent>
						</Card>
					{/each}
				</div>
			{:else}
				<EmptyState
					icon="❓"
					title="FAQ Coming Soon"
					description="I'm preparing answers to commonly asked questions. Check back soon!"
				/>
			{/if}
		</Section>
	{/if}
</main>
