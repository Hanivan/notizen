<script lang="ts">
	import EmptyState from '$lib/components/EmptyState.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import Section from '$lib/components/Section.svelte';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';
	import { config } from '$lib/config.js';
	import { m } from '$lib/paraglide/messages.js';
	import type { Project } from '$lib/types/project';

	let selectedFilter = 'all';

	// Project data with categories
	const projects: Project[] = [
		// {
		// 	id: 1,
		// 	title: m.project_1_title(),
		// 	description: m.project_1_description(),
		// 	category: 'fullstack',
		// 	tech: ['SvelteKit', 'TypeScript', 'TailwindCSS', 'PostgreSQL'],
		// 	image: config.projectImages.webApp,
		// 	demo: '#',
		// 	github: '#',
		// 	featured: true
		// },
		// {
		// 	id: 2,
		// 	title: m.project_2_title(),
		// 	description: m.project_2_description(),
		// 	category: 'frontend',
		// 	tech: ['Vue.js', 'D3.js', 'Python', 'FastAPI'],
		// 	image: config.projectImages.dashboard,
		// 	demo: '#',
		// 	github: '#',
		// 	featured: true
		// },
		// {
		// 	id: 3,
		// 	title: m.project_3_title(),
		// 	description: m.project_3_description(),
		// 	category: 'mobile',
		// 	tech: ['React Native', 'Node.js', 'MongoDB', 'Express'],
		// 	image: config.projectImages.mobileApp,
		// 	demo: '#',
		// 	github: '#',
		// 	featured: true
		// },
		// // Additional projects...
		// {
		// 	id: 4,
		// 	title: m.project_4_title(),
		// 	description: m.project_4_description(),
		// 	category: 'fullstack',
		// 	tech: ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL'],
		// 	image: config.projectImages.ecommerce,
		// 	demo: '#',
		// 	github: '#',
		// 	featured: false
		// },
		// {
		// 	id: 5,
		// 	title: m.project_5_title(),
		// 	description: m.project_5_description(),
		// 	category: 'fullstack',
		// 	tech: ['React', 'Socket.io', 'Node.js', 'MongoDB'],
		// 	image: config.projectImages.taskManagement,
		// 	demo: '#',
		// 	github: '#',
		// 	featured: false
		// },
		// {
		// 	id: 6,
		// 	title: m.project_6_title(),
		// 	description: m.project_6_description(),
		// 	category: 'frontend',
		// 	tech: ['React', 'Chart.js', 'OpenWeather API'],
		// 	image: config.projectImages.weatherDashboard,
		// 	demo: '#',
		// 	github: '#',
		// 	featured: false
		// }
	];

	const filters = [
		{ key: 'all', label: m.projects_filter_all() },
		{ key: 'fullstack', label: m.projects_filter_fullstack() },
		{ key: 'frontend', label: m.projects_filter_frontend() },
		{ key: 'backend', label: m.projects_filter_backend() }
		// { key: 'mobile', label: m.projects_filter_mobile() },
		// { key: 'devops', label: m.projects_filter_devops() },
		// { key: 'ai', label: m.projects_filter_ai() }
	];

	$: filteredProjects =
		selectedFilter === 'all'
			? projects
			: projects.filter((project) => project.category === selectedFilter);

	$: featuredProjects = filteredProjects.filter((project) => project.featured);
	$: otherProjects = filteredProjects.filter((project) => !project.featured);
</script>

<svelte:head>
	<title>{m.projects_title()} - {config.personal.name}</title>
	<meta name="description" content={m.projects_description()} />
</svelte:head>

<main class="min-h-screen">
	<!-- Hero Section -->
	<PageHero title={m.projects_title()} description={m.projects_description()}>
		<!-- Filter Buttons -->
		<div class="mb-16 flex flex-wrap justify-center gap-3">
			{#each filters as filter}
				<Button
					variant={selectedFilter === filter.key ? 'default' : 'outline'}
					size="sm"
					class="zen-button"
					onclick={() => (selectedFilter = filter.key)}
				>
					{filter.label}
				</Button>
			{/each}
		</div>
	</PageHero>

	<!-- Projects Content or Empty State -->
	{#if projects.length > 0}
		<!-- Featured Projects -->
		{#if featuredProjects.length > 0}
			<Section background="muted">
				<SectionHeader title={m.projects_featured_title()} />

				<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{#each featuredProjects as project}
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
								<div class="flex gap-3">
									<Button size="sm" class="zen-button flex-1">{m.view_demo()}</Button>
									<Button variant="outline" size="sm" class="zen-button flex-1"
										>{m.view_github()}</Button
									>
								</div>
							</CardContent>
						</Card>
					{/each}
				</div>
			</Section>
		{/if}

		<!-- Other Projects -->
		{#if otherProjects.length > 0}
			<Section>
				<SectionHeader title={m.projects_other_title()} />

				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each otherProjects as project}
						<Card class="zen-card group overflow-hidden transition-all duration-300">
							<div class="relative overflow-hidden">
								<img
									src={project.image}
									alt={project.title}
									class="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
								/>
							</div>
							<CardHeader class="space-y-2">
								<CardTitle class="text-base font-medium">{project.title}</CardTitle>
								<CardDescription class="zen-text text-xs">
									{project.description}
								</CardDescription>
							</CardHeader>
							<CardContent class="space-y-3">
								<div class="flex flex-wrap gap-1">
									{#each project.tech.slice(0, 3) as tech}
										<Badge variant="outline" class="text-xs">{tech}</Badge>
									{/each}
									{#if project.tech.length > 3}
										<Badge variant="outline" class="text-xs">+{project.tech.length - 3}</Badge>
									{/if}
								</div>
								<div class="flex gap-2">
									<Button size="sm" variant="outline" class="zen-button flex-1 text-xs"
										>{m.view_demo()}</Button
									>
									<Button size="sm" variant="outline" class="zen-button flex-1 text-xs"
										>{m.view_github()}</Button
									>
								</div>
							</CardContent>
						</Card>
					{/each}
				</div>
			</Section>
		{/if}

		<!-- No Projects Found for Current Filter -->
		{#if filteredProjects.length === 0 && config.projects.showEmptyState}
			<Section background="muted">
				<EmptyState
					icon="🔍"
					title={m.no_projects_found_title()}
					description={m.no_projects_found_description()}
				>
					{#snippet actions()}
						<Button
							variant="outline"
							size="sm"
							class="zen-button"
							onclick={() => (selectedFilter = 'all')}
						>
							{m.show_all_projects()}
						</Button>
					{/snippet}
				</EmptyState>
			</Section>
		{/if}
	{:else if config.projects.showEmptyState}
		<!-- No Projects Available -->
		<Section background="muted">
			<EmptyState
				icon="🚧"
				title={m.projects_coming_soon_title()}
				description={m.projects_coming_soon_description()}
				maxWidth="lg"
			>
				{#snippet actions()}
					<Button href="/contact" size="lg" class="zen-button min-w-48">{m.get_in_touch()}</Button>
					<Button href="/" variant="outline" size="lg" class="zen-button min-w-48"
						>{m.back_to_home()}</Button
					>
				{/snippet}
			</EmptyState>
		</Section>
	{/if}
</main>
