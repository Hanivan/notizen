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
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import type { RequestHandler } from './$types';

// Use consistent path resolution
function getBlogDir() {
	// if (dev) {
	return 'src/content/blog';
	// }
	// In production, content should be copied to the build directory
	// return join(process.cwd(), 'content/blog');
}

async function loadAllPosts(): Promise<BlogPostMeta[]> {
	try {
		const BLOG_DIR = getBlogDir();
		const files = await readdir(BLOG_DIR);
		const markdownFiles = files.filter((file) => file.endsWith('.md'));

		const posts = await Promise.all(
			markdownFiles.map(async (file) => {
				const filePath = join(BLOG_DIR, file);
				const content = await readFile(filePath, 'utf-8');
				const { content: htmlContent, data } = await parseMarkdown(content);

				const slug = file.replace('.md', '');
				const excerpt = createExcerpt(data.description || htmlContent);
				const readingTime = calculateReadingTime(content);

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
