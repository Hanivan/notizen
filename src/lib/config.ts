// Site configuration - centralized static data
export const config = {
	// Personal Information
	personal: {
		name: 'Notizen',
		initials: 'Nt',
		title: 'Silent Developer',
		email: 'hanivan20@gmail.com',
		phone: '+62 xxxxxxxxxxxxx',
		location: 'Kota Bogor, Indonesia',
		profileImage:
			'https://media.licdn.com/dms/image/v2/C4E03AQF3fGyXkimF4w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1600743396267?e=1755734400&v=beta&t=uMMSu3e62vogKWnLGTZFcm7WzkvPalbMdT479FCKP-4',
		workspaceImage:
			'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=500&fit=crop'
	},

	// Social Media Links with publish control
	social: {
		github: {
			url: 'https://github.com/Hanivan/',
			isPublished: true
		},
		linkedin: {
			url: 'https://www.linkedin.com/in/hanivanrizky/',
			isPublished: true
		},
		instagram: {
			url: 'https://instagram.com/hanivanrizky/',
			isPublished: true
		},
		twitter: {
			url: 'https://twitter.com/hanivanrizky_',
			isPublished: false
		}
	},

	// Skills & Technologies with publish control
	skills: {
		frontend: {
			items: ['SvelteKit', 'React', 'Next.js', 'TailwindCSS'],
			isPublished: true
		},
		backend: {
			items: [
				'Node.js/TypeScript',
				'Python',
				'Go',
				'PHP',
				'MySQL',
				'MongoDB',
				'PostgreSQL',
				'NestJS',
				'Laravel',
				'Express',
				'FastAPI'
			],
			isPublished: true
		},
		tools: {
			items: ['Git', 'Figma', 'Linux', 'Docker', 'Kubernetes', 'CI/CD', 'Ansible'],
			isPublished: true
		},
		cybersecurity: {
			items: ['Network Security', 'Web Application Security'],
			isPublished: true
		}
	},

	// Featured Projects Configuration
	projects: {
		showFeaturedSection: true,
		showAllProjectsSection: true,
		maxFeaturedProjects: 3,
		showEmptyState: true
	},

	// Section Visibility Controls
	sections: {
		hero: true,
		philosophy: true,
		about: true,
		projects: true,
		skills: true,
		contact: true,
		faq: true
	},

	// Project Images (using Unsplash for demo)
	projectImages: {
		webApp: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop',
		dashboard: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
		mobileApp: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop',
		ecommerce: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
		taskManagement:
			'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop',
		weatherDashboard:
			'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=250&fit=crop'
	},

	// Business Information
	business: {
		availability: true,
		copyright: `© ${new Date().getFullYear()} Notizen. All rights reserved.`,
		timezone: 'WIB (GMT+7)'
	}
};

export default config;
