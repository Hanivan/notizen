import type { Twitter } from "svelte-meta-tags";

// Site configuration - centralized static data
export const config = {
	// Personal Information
	personal: {
		name: 'Hanivan Rizky Sobari',
		initials: 'HRS',
		title: 'Development Blog',
		email: 'hello@hanivan.my.id',
		location: 'Indonesia',
		bio: 'Full-stack developer sharing thoughts, tutorials, and insights about development, design, and technology.',
		profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop'
	},

	// Site Information
	site: {
		name: 'Notizen',
		url: 'https://hanivan.my.id',
		tagline: 'Thoughts, tutorials, and insights about development',
		description: 'Notizen - A development blog sharing thoughts, tutorials, and insights about software development, design patterns, and technology.',
		keywords: ['development', 'programming', 'web development', 'tutorials', 'blog', 'portfolio'],
		author: 'Hanivan Rizky Sobari',
		twitterHandle: '@hanivanrizky_'
	},

	// Navigation Configuration
	navigation: {
		main: [
			{ label: 'Home', href: '/' },
			{ label: 'Blog', href: '/blog' }
		],
		secondary: [
			{ label: 'About', href: '/about' },
			{ label: 'Contact', href: '/contact' }
		]
	},

	// Social Media Links
	social: {
		github: {
			url: 'https://github.com/Hanivan/',
			icon: 'GitHub',
			label: 'GitHub'
		},
		twitter: {
			url: 'https://twitter.com/hanivanrizky_',
			icon: 'X',
			label: 'X (Twitter)'
		},
		email: {
			url: 'mailto:hello@hanivan.my.id',
			icon: 'Envelope',
			label: 'Email'
		}
	},

	// SEO Configuration
	seo: {
		openGraph: {
			type: 'website' as const,
			locale: 'en',
			siteName: 'Notizen'
		},
		twitter: {
			cardType: 'summary_large_image' as Twitter['cardType']
		}
	},

	// Blog Configuration
	blog: {
		postsPerPage: 6,
		showRelatedPosts: true,
		maxRelatedPosts: 3,
		readingTime: {
			wordsPerMinute: 200
		}
	},

	// Business Information
	business: {
		copyright: `© ${new Date().getFullYear()} Notizen by Hanivan Rizky Sobari. All rights reserved.`,
		timezone: 'WIB (GMT+7)'
	}
};

export default config;
