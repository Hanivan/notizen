import { dev } from '$app/environment';
import { calculateReadingTime, createExcerpt, parseMarkdown, type BlogPost } from '$lib/utils/blog';
import { error, json } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import { join } from 'path';
import type { RequestHandler } from './$types';

// Configurable blog directory based on environment
const BLOG_DIR = dev ? 'src/content/blog' : join(process.cwd(), 'content/blog');

export const GET: RequestHandler = async ({ params }) => {
	const { slug } = params;

	if (!slug) {
		throw error(400, 'Slug is required');
	}

	try {
		const filePath = join(BLOG_DIR, `${slug}.md`);
		const content = await readFile(filePath, 'utf-8');
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
		throw error(404, `Blog post '${slug}' not found`);
	}
};
