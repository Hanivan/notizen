import { calculateReadingTime, createExcerpt, parseMarkdown, type BlogPost } from '$lib/utils/blog';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Import all markdown files at build time
const allMarkdownFiles = import.meta.glob('/static/content/blog/*.md', {
	as: 'raw',
	eager: true
});

export const GET: RequestHandler = async ({ params }) => {
	const { slug } = params;

	if (!slug) {
		throw error(400, 'Slug is required');
	}

	try {
		// Find the matching file by slug
		const filePath = `/static/content/blog/${slug}.md`;
		const content = allMarkdownFiles[filePath];

		if (!content) {
			throw error(404, `Blog post '${slug}' not found`);
		}

		const { content: htmlContent, data } = await parseMarkdown(content);

		const excerpt = createExcerpt(data.description || htmlContent);
		const readingTime = calculateReadingTime(content);

		const post: BlogPost = {
			slug,
			title: data.title,
			description: data.description,
			date: data.date,
			category: data.category,
			tags: data.tags || [],
			author: data.author,
			featured: data.featured || false,
			image: data.image,
			content: htmlContent,
			excerpt,
			readingTime
		};

		return json(post);
	} catch (err) {
		console.error(`Error loading blog post ${slug}:`, err);
		// If it's already a SvelteKit error, re-throw it
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		// Otherwise, throw a 404
		throw error(404, `Blog post '${slug}' not found`);
	}
};
