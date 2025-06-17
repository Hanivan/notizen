import {
	calculateReadingTime,
	createExcerpt,
	filterPostsByCategory,
	filterPostsByTag,
	getFeaturedPosts,
	parseMarkdown,
	searchPosts,
	sortPostsByDate,
	type BlogPostMeta
} from '$lib/utils/blog';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Import all markdown files at build time
const allMarkdownFiles = import.meta.glob('/static/content/blog/*.md', {
	as: 'raw',
	eager: true
});

async function loadAllPosts(): Promise<BlogPostMeta[]> {
	try {
		const posts = await Promise.all(
			Object.entries(allMarkdownFiles).map(async ([path, content]) => {
				const { content: htmlContent, data } = await parseMarkdown(content as string);

				// Extract slug from file path
				const slug = path.split('/').pop()?.replace('.md', '') || '';
				const excerpt = createExcerpt(data.description || htmlContent);
				const readingTime = calculateReadingTime(content as string);

				return {
					slug,
					title: data.title,
					description: data.description,
					date: data.date,
					category: data.category,
					tags: data.tags || [],
					author: data.author,
					featured: data.featured || false,
					image: data.image,
					excerpt,
					readingTime
				} as BlogPostMeta;
			})
		);

		return sortPostsByDate(posts);
	} catch (error) {
		console.error('Error loading blog posts:', error);
		return [];
	}
}

export const GET: RequestHandler = async ({ url }) => {
	const posts = await loadAllPosts();

	// Parse query parameters
	const category = url.searchParams.get('category');
	const tag = url.searchParams.get('tag');
	const search = url.searchParams.get('search');
	const featured = url.searchParams.get('featured') === 'true';
	const limit = url.searchParams.get('limit');

	let filteredPosts = posts;

	// Apply filters
	if (category && category !== 'all') {
		filteredPosts = filterPostsByCategory(filteredPosts, category);
	}

	if (tag) {
		filteredPosts = filterPostsByTag(filteredPosts, tag);
	}

	if (search) {
		filteredPosts = searchPosts(filteredPosts, search);
	}

	if (featured) {
		filteredPosts = getFeaturedPosts(filteredPosts);
	}

	// Apply limit
	if (limit) {
		const limitNum = parseInt(limit, 10);
		if (!isNaN(limitNum) && limitNum > 0) {
			filteredPosts = filteredPosts.slice(0, limitNum);
		}
	}

	return json(filteredPosts);
};
