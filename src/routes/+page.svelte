<script lang="ts">
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Section from '$lib/components/Section.svelte';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';
	import {
		HoverCard,
		HoverCardContent,
		HoverCardTrigger
	} from '$lib/components/ui/hover-card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger
	} from '$lib/components/ui/tooltip/index.js';
	import { config } from '$lib/config.js';
	import { m } from '$lib/paraglide/messages.js';
	import type { Project } from '$lib/types/project';

	// Portfolio data
	const projects: Project[] = [
		// {
		// 	title: m.project_1_title(),
		// 	description: m.project_1_description(),
		// 	tech: ['SvelteKit', 'TypeScript', 'TailwindCSS'],
		// 	image: config.projectImages.webApp,
		// 	demo: '#',
		// 	github: '#'
		// },
		// {
		// 	title: m.project_2_title(),
		// 	description: m.project_2_description(),
		// 	tech: ['Vue.js', 'D3.js', 'Python'],
		// 	image: config.projectImages.dashboard,
		// 	demo: '#',
		// 	github: '#'
		// },
		// {
		// 	title: m.project_3_title(),
		// 	description: m.project_3_description(),
		// 	tech: ['React Native', 'Node.js', 'MongoDB'],
		// 	image: config.projectImages.mobileApp,
		// 	demo: '#',
		// 	github: '#'
		// }
	];

	// Skills data
	const skills = [
		{
			category: m.skills_frontend(),
			items: ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Svelte', 'CSS', 'TailwindCSS']
		},
		{
			category: m.skills_backend(),
			items: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker']
		},
		{
			category: m.skills_tools(),
			items: ['Git', 'VS Code', 'Figma', 'AWS', 'Vercel', 'Linux']
		}
	];
</script>

<svelte:head>
	<title>{config.personal.name} - {config.personal.title}</title>
	<meta name="description" content={m.hero_description()} />
</svelte:head>

<main class="min-h-screen">
	<TooltipProvider>
		<!-- Hero Section -->
		<Section>
			<div class="grid gap-16 lg:grid-cols-2 lg:items-center">
				<div class="space-y-8">
					<div class="space-y-4">
						<div class="flex items-center gap-3">
							<Avatar class="size-12">
								<AvatarImage src={config.personal.profileImage} alt={config.personal.name} />
								<AvatarFallback>{config.personal.initials}</AvatarFallback>
							</Avatar>
							<h1 class="text-2xl font-light">{config.personal.name}</h1>
						</div>
						<h2 class="text-4xl leading-tight font-light md:text-5xl lg:text-6xl">
							{m.hero_title()}
						</h2>
						<p class="zen-text text-muted-foreground text-lg leading-relaxed">
							{m.hero_description()}
						</p>
					</div>

					<div class="flex flex-wrap gap-3">
						<Button href="/projects" size="lg" class="zen-button">{m.cta_view_work()}</Button>
						<Button href="/contact" variant="outline" size="lg" class="zen-button"
							>{m.cta_lets_talk()}</Button
						>
					</div>

					<!-- Social Links -->
					<div class="flex flex-wrap gap-3">
						{#if config.social.github.isPublished}
							<Tooltip>
								<TooltipTrigger>
									<Button
										href={config.social.github.url}
										variant="outline"
										size="sm"
										class="zen-button"
										target="_blank"
										rel="noopener noreferrer"
									>
										{m.social_github()}
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>{m.view_github()}</p>
								</TooltipContent>
							</Tooltip>
						{/if}
						{#if config.social.linkedin.isPublished}
							<Tooltip>
								<TooltipTrigger>
									<Button
										href={config.social.linkedin.url}
										variant="outline"
										size="sm"
										class="zen-button"
										target="_blank"
										rel="noopener noreferrer"
									>
										{m.social_linkedin()}
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>{m.connect_linkedin()}</p>
								</TooltipContent>
							</Tooltip>
						{/if}
					</div>
				</div>
				<div class="relative">
					<div class="bg-muted/30 aspect-square overflow-hidden rounded-sm p-8">
						<img
							src={config.personal.workspaceImage}
							alt="Workspace"
							class="h-full w-full rounded-sm object-cover opacity-80"
						/>
					</div>
				</div>
			</div>
		</Section>

		<!-- Projects Section -->
		{#if config.sections.projects && config.projects.showFeaturedSection}
			<Section background="muted">
				<SectionHeader
					title={m.featured_projects_title()}
					description={m.featured_projects_description()}
				/>

				{#if projects.length > 0}
					<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{#each projects.slice(0, config.projects.maxFeaturedProjects) as project}
							<Card class="zen-card group overflow-hidden transition-all duration-500">
								<div class="relative overflow-hidden">
									<img
										src={project.image}
										alt={project.title}
										class="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-105"
									/>
									<div
										class="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/5"
									></div>
								</div>
								<CardHeader class="space-y-3">
									<CardTitle class="text-lg font-medium">{project.title}</CardTitle>
									<CardDescription class="zen-text text-sm">
										{project.description}
									</CardDescription>
								</CardHeader>
								<CardContent class="space-y-4">
									<div class="flex flex-wrap gap-2">
										{#each project.tech as tech}
											<Badge variant="secondary" class="text-xs font-normal">{tech}</Badge>
										{/each}
									</div>
									<Separator />
									<div class="flex gap-3">
										<Button size="sm" class="zen-button flex-1">{m.project_button_view()}</Button>
										<Button variant="outline" size="sm" class="zen-button flex-1"
											>{m.project_button_code()}</Button
										>
									</div>
								</CardContent>
							</Card>
						{/each}
					</div>
					<div class="mt-12 text-center">
						<Button href="/projects" variant="outline" size="lg" class="zen-button"
							>{m.projects_view_all()}</Button
						>
					</div>
				{:else if config.projects.showEmptyState}
					<EmptyState
						icon="🚧"
						title="Projects Coming Soon"
						description="I'm currently working on some exciting projects. Stay tuned!"
					/>
				{/if}
			</Section>
		{/if}

		<!-- Skills Section -->
		{#if config.sections.skills && skills.length > 0}
			<Section>
				<SectionHeader title={m.skills_title()} description={m.skills_description()} />

				<div class="grid gap-8 md:grid-cols-3">
					{#each skills as skillGroup}
						<Card class="zen-card">
							<CardHeader class="text-center">
								<CardTitle class="text-lg font-medium">{skillGroup.category}</CardTitle>
							</CardHeader>
							<CardContent>
								<div class="flex flex-wrap justify-center gap-2">
									{#each skillGroup.items as skill}
										<HoverCard>
											<HoverCardTrigger>
												<Badge
													variant="outline"
													class="hover:bg-primary/10 hover:text-primary hover:border-primary/20 cursor-pointer transition-colors"
												>
													{skill}
												</Badge>
											</HoverCardTrigger>
											<HoverCardContent class="w-auto">
												<p class="text-sm">{m.skill_experience({ skill })}</p>
											</HoverCardContent>
										</HoverCard>
									{/each}
								</div>
							</CardContent>
						</Card>
					{/each}
				</div>
			</Section>
		{:else if config.sections.skills && config.projects.showEmptyState}
			<Section>
				<EmptyState
					icon="🛠️"
					title="Skills Coming Soon"
					description="I'm currently updating my skills section. Check back soon!"
				/>
			</Section>
		{/if}

		<!-- Contact Section -->
		{#if config.sections.contact}
			<Section background="muted">
				<div class="text-center">
					<div class="mx-auto max-w-2xl space-y-8">
						<h2 class="text-3xl font-light">{m.contact_hero_title()}</h2>
						<p class="zen-text text-muted-foreground">
							{m.contact_hero_description()}
						</p>

						<Card class="zen-card mx-auto max-w-md">
							<CardContent class="space-y-6 pt-8">
								<div class="space-y-4">
									<div class="flex items-center justify-center gap-3">
										<span class="text-lg">📧</span>
										<span class="font-mono text-sm">{config.personal.email}</span>
									</div>
									<Separator />
									<div class="flex items-center justify-center gap-3">
										<span class="text-lg">📱</span>
										<span class="font-mono text-sm">{config.personal.phone}</span>
									</div>
								</div>
								<Separator />
								<div class="flex flex-col gap-3 sm:flex-row">
									<Button href="/contact" size="sm" class="zen-button flex-1"
										>{m.contact_button_message()}</Button
									>
									<Button href="/contact" variant="outline" size="sm" class="zen-button flex-1"
										>{m.contact_button_talk()}</Button
									>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</Section>
		{/if}
	</TooltipProvider>
</main>
