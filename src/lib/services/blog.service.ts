/**
 * Blog service - handles all blog-related API calls
 */

import { browser } from '$app/environment';
import { apiClient } from './api-client';
import type { BlogPost, BlogPostMeta } from '$lib/utils/blog';
import type { BlogPostFilters, PaginationOptions } from './types';

/**
 * Blog API Service
 * Provides methods for fetching blog posts and related data
 */
export class BlogService {
	private readonly basePath = '/api/blog';

	/**
	 * Fetch a single blog post by slug
	 */
	async getPost(slug: string): Promise<BlogPost | null> {
		if (!browser) return null;

		const result = await apiClient.get<BlogPost>(`${this.basePath}/${slug}`);

		if (result.error) {
			console.error('Failed to load blog post:', result.error);
			return null;
		}

		return result.data;
	}

	/**
	 * Fetch multiple blog posts with optional filters
	 */
	async getPosts(filters?: BlogPostFilters & PaginationOptions): Promise<BlogPostMeta[]> {
		if (!browser) return [];

		try {
			const params = new URLSearchParams();

			if (filters?.category) params.append('category', filters.category);
			if (filters?.tag) params.append('tag', filters.tag);
			if (filters?.search) params.append('search', filters.search);
			if (filters?.featured) params.append('featured', 'true');
			if (filters?.limit) params.append('limit', filters.limit.toString());
			if (filters?.page) params.append('page', filters.page.toString());
			if (filters?.offset) params.append('offset', filters.offset.toString());

			const queryString = params.toString();
			const endpoint = queryString ? `${this.basePath}?${queryString}` : this.basePath;

			const result = await apiClient.get<BlogPostMeta[]>(endpoint);

			if (result.error) {
				console.error('Failed to load blog posts:', result.error);
				return [];
			}

			return result.data || [];
		} catch (error) {
			console.error('Error loading blog posts:', error);
			return [];
		}
	}

	/**
	 * Fetch featured posts
	 */
	async getFeaturedPosts(limit: number = 3): Promise<BlogPostMeta[]> {
		return this.getPosts({ featured: true, limit });
	}

	/**
	 * Fetch posts by category
	 */
	async getPostsByCategory(category: string, limit?: number): Promise<BlogPostMeta[]> {
		return this.getPosts({ category, limit });
	}

	/**
	 * Fetch posts by tag
	 */
	async getPostsByTag(tag: string, limit?: number): Promise<BlogPostMeta[]> {
		return this.getPosts({ tag, limit });
	}

	/**
	 * Search posts
	 */
	async searchPosts(query: string, limit?: number): Promise<BlogPostMeta[]> {
		return this.getPosts({ search: query, limit });
	}

	/**
	 * Fetch latest posts
	 */
	async getLatestPosts(limit: number = 6): Promise<BlogPostMeta[]> {
		return this.getPosts({ limit });
	}
}

// Singleton instance
export const blogService = new BlogService();
