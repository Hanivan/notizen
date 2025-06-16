import { differenceInDays, format, isValid, parseISO } from 'date-fns';
import matter from 'gray-matter';
import hljs from 'highlight.js';
import { marked } from 'marked';

export interface BlogPost {
	slug: string;
	title: string;
	description: string;
	date: string;
	category: string;
	tags: string[];
	author: string;
	featured: boolean;
	image: string;
	content: string;
	excerpt: string;
	readingTime: number;
}

export interface BlogPostMeta {
	slug: string;
	title: string;
	description: string;
	date: string;
	category: string;
	tags: string[];
	author: string;
	featured: boolean;
	image: string;
	excerpt: string;
	readingTime: number;
}

// Category to emoji mapping
export function getCategoryEmoji(category: string): string {
	const categoryEmojiMap: Record<string, string> = {
		'web development': '🌐',
		programming: '💻',
		accessibility: '♿',
		javascript: '🟨',
		typescript: '🔷',
		svelte: '🧡',
		react: '⚛️',
		vue: '💚',
		css: '🎨',
		html: '📄',
		'node.js': '🟢',
		backend: '⚙️',
		frontend: '🎭',
		fullstack: '🔗',
		design: '🎨',
		'ui/ux': '📱',
		tutorial: '📚',
		tips: '💡',
		tools: '🔧',
		productivity: '⚡',
		career: '🚀',
		learning: '🎓',
		opensource: '🔓',
		api: '🔌',
		database: '🗃️',
		security: '🔒',
		performance: '🏃‍♂️',
		testing: '🧪',
		deployment: '🚀',
		mobile: '📱',
		devops: '🔄',
		ai: '🤖',
		'machine learning': '🧠',
		'data science': '📊'
	};

	const normalizedCategory = category.toLowerCase();
	return categoryEmojiMap[normalizedCategory] || '📝';
}

// Generate fallback emoji based on title or content
export function generatePostEmoji(post: BlogPostMeta): string {
	// If category has an emoji, use it
	const categoryEmoji = getCategoryEmoji(post.category);
	if (categoryEmoji !== '📝') {
		return categoryEmoji;
	}

	// Generate based on title keywords
	const title = post.title.toLowerCase();
	const description = post.description.toLowerCase();
	const content = title + ' ' + description;

	if (content.includes('tutorial') || content.includes('guide') || content.includes('how to'))
		return '📚';
	if (content.includes('tip') || content.includes('trick')) return '💡';
	if (content.includes('best practice') || content.includes('pattern')) return '⭐';
	if (content.includes('performance') || content.includes('optimize')) return '🚀';
	if (content.includes('debug') || content.includes('fix') || content.includes('error'))
		return '🐛';
	if (content.includes('design') || content.includes('ui') || content.includes('ux')) return '🎨';
	if (content.includes('security') || content.includes('auth')) return '🔒';
	if (content.includes('api') || content.includes('backend')) return '🔌';
	if (content.includes('component') || content.includes('frontend')) return '🧩';
	if (content.includes('test') || content.includes('testing')) return '🧪';
	if (content.includes('review') || content.includes('comparison')) return '📊';
	if (content.includes('news') || content.includes('update')) return '📰';
	if (content.includes('tool') || content.includes('setup')) return '🔧';

	// Default fallback
	return '📝';
}

// Configure marked for better rendering
marked.setOptions({
	gfm: true,
	breaks: true
});

// Custom renderer for better HTML output
const renderer = new marked.Renderer();

// Customize heading rendering with anchor links
renderer.heading = function ({ text, depth }) {
	const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
	return `
		<h${depth} id="${escapedText}">
			<a href="#${escapedText}" class="anchor-link" aria-hidden="true">#</a>
			${text}
		</h${depth}>
	`;
};

// Customize code block rendering with syntax highlighting
renderer.code = function ({ text, lang }) {
	const validLanguage = lang || 'text';
	let highlightedCode = text;

	// Language alias mapping for better compatibility
	const languageMap: Record<string, string> = {
		js: 'javascript',
		ts: 'typescript',
		sh: 'bash',
		shell: 'bash',
		yml: 'yaml',
		dockerfile: 'dockerfile',
		md: 'markdown',
		py: 'python',
		rs: 'rust',
		rb: 'ruby',
		kt: 'kotlin',
		java: 'java',
		c: 'c',
		cpp: 'cpp',
		cs: 'csharp'
	};

	// Resolve language alias
	const resolvedLang = languageMap[lang?.toLowerCase() || ''] || lang;

	// Apply syntax highlighting if language is supported
	if (resolvedLang && hljs.getLanguage(resolvedLang)) {
		try {
			const result = hljs.highlight(text, { language: resolvedLang });
			highlightedCode = result.value;
		} catch (error) {
			console.warn(`Failed to highlight code for language: ${resolvedLang}`, error);
			highlightedCode = hljs.highlightAuto(text).value;
		}
	} else {
		// Try auto-detection if specific language not found
		try {
			highlightedCode = hljs.highlightAuto(text).value;
		} catch (error) {
			// Fallback to escaped plain text
			highlightedCode = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}
	}

	// Add copy button and language label
	return `
		<div class="code-block-wrapper">
			<div class="code-block-header">
				<span class="code-block-language">${validLanguage}</span>
				<button class="code-block-copy" onclick="copyCode(this)" title="Copy code">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
						<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
					</svg>
				</button>
			</div>
			<pre><code class="hljs language-${validLanguage}">${highlightedCode}</code></pre>
		</div>
	`;
};

marked.use({ renderer });

export async function parseMarkdown(markdown: string): Promise<{ content: string; data: any }> {
	const parsed = matter(markdown);
	const content = await marked(parsed.content);
	return { content, data: parsed.data };
}

export function calculateReadingTime(content: string): number {
	const wordsPerMinute = 200;
	const words = content.trim().split(/\s+/).length;
	return Math.ceil(words / wordsPerMinute);
}

export function createExcerpt(content: string, maxLength: number = 160): string {
	// Remove HTML tags and get plain text
	const plainText = content.replace(/<[^>]*>/g, '');

	if (plainText.length <= maxLength) {
		return plainText;
	}

	return plainText.substring(0, maxLength).trim() + '...';
}

// Enhanced date formatting with date-fns
export function formatDate(dateString: string): string {
	try {
		const date = parseISO(dateString);
		if (!isValid(date)) {
			console.warn(`Invalid date: ${dateString}`);
			return dateString;
		}
		return format(date, 'MMMM d, yyyy');
	} catch (error) {
		console.warn(`Error formatting date: ${dateString}`, error);
		return dateString;
	}
}

// Additional date utilities using date-fns
export function formatDateShort(dateString: string): string {
	try {
		const date = parseISO(dateString);
		if (!isValid(date)) return dateString;
		return format(date, 'MMM d, yyyy');
	} catch (error) {
		return dateString;
	}
}

export function formatDateRelative(dateString: string): string {
	try {
		const date = parseISO(dateString);
		if (!isValid(date)) return dateString;

		const now = new Date();
		const daysDiff = differenceInDays(now, date);

		if (daysDiff === 0) return 'Today';
		if (daysDiff === 1) return 'Yesterday';
		if (daysDiff < 7) return `${daysDiff} days ago`;
		if (daysDiff < 30) return `${Math.floor(daysDiff / 7)} weeks ago`;
		if (daysDiff < 365) return `${Math.floor(daysDiff / 30)} months ago`;

		return `${Math.floor(daysDiff / 365)} years ago`;
	} catch (error) {
		return dateString;
	}
}

export function isRecentPost(dateString: string, withinDays: number = 7): boolean {
	try {
		const date = parseISO(dateString);
		if (!isValid(date)) return false;

		const daysDiff = differenceInDays(new Date(), date);
		return daysDiff <= withinDays;
	} catch (error) {
		return false;
	}
}

export function sortPostsByDate(posts: BlogPostMeta[]): BlogPostMeta[] {
	return posts.sort((a, b) => {
		try {
			const dateA = parseISO(a.date);
			const dateB = parseISO(b.date);
			return dateB.getTime() - dateA.getTime();
		} catch (error) {
			// Fallback to string comparison if date parsing fails
			return b.date.localeCompare(a.date);
		}
	});
}

export function filterPostsByCategory(posts: BlogPostMeta[], category: string): BlogPostMeta[] {
	if (category === 'all') return posts;
	return posts.filter((post) => post.category.toLowerCase() === category.toLowerCase());
}

export function filterPostsByTag(posts: BlogPostMeta[], tag: string): BlogPostMeta[] {
	return posts.filter((post) =>
		post.tags.some((postTag) => postTag.toLowerCase() === tag.toLowerCase())
	);
}

export function searchPosts(posts: BlogPostMeta[], query: string): BlogPostMeta[] {
	const lowercaseQuery = query.toLowerCase();
	return posts.filter(
		(post) =>
			post.title.toLowerCase().includes(lowercaseQuery) ||
			post.description.toLowerCase().includes(lowercaseQuery) ||
			post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
			post.category.toLowerCase().includes(lowercaseQuery)
	);
}

export function getFeaturedPosts(posts: BlogPostMeta[]): BlogPostMeta[] {
	return posts.filter((post) => post.featured);
}

export function getUniqueCategories(posts: BlogPostMeta[]): string[] {
	const categories = posts.map((post) => post.category);
	return [...new Set(categories)].sort();
}

export function getUniqueTags(posts: BlogPostMeta[]): string[] {
	const tags = posts.flatMap((post) => post.tags);
	return [...new Set(tags)].sort();
}

export function getRelatedPosts(
	posts: BlogPostMeta[],
	currentPost: BlogPostMeta,
	limit: number = 3
): BlogPostMeta[] {
	const relatedPosts = posts
		.filter((post) => post.slug !== currentPost.slug)
		.map((post) => ({
			post,
			score: calculateRelatedScore(post, currentPost)
		}))
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map((item) => item.post);

	return relatedPosts;
}

function calculateRelatedScore(post: BlogPostMeta, currentPost: BlogPostMeta): number {
	let score = 0;

	// Same category gets high score
	if (post.category === currentPost.category) {
		score += 3;
	}

	// Shared tags get points
	const sharedTags = post.tags.filter((tag) => currentPost.tags.includes(tag));
	score += sharedTags.length * 2;

	// Same author gets a point
	if (post.author === currentPost.author) {
		score += 1;
	}

	return score;
}

// Client-side blog post loading functions
export async function loadBlogPost(slug: string): Promise<BlogPost | null> {
	try {
		const response = await fetch(`/api/blog/${slug}`);
		if (!response.ok) return null;
		return await response.json();
	} catch (error) {
		console.error('Error loading blog post:', error);
		return null;
	}
}

export async function loadBlogPosts(options?: {
	category?: string;
	tag?: string;
	search?: string;
	featured?: boolean;
	limit?: number;
}): Promise<BlogPostMeta[]> {
	try {
		const params = new URLSearchParams();
		if (options?.category) params.append('category', options.category);
		if (options?.tag) params.append('tag', options.tag);
		if (options?.search) params.append('search', options.search);
		if (options?.featured) params.append('featured', 'true');
		if (options?.limit) params.append('limit', options.limit.toString());

		const response = await fetch(`/api/blog?${params.toString()}`);
		if (!response.ok) return [];
		return await response.json();
	} catch (error) {
		console.error('Error loading blog posts:', error);
		return [];
	}
}
