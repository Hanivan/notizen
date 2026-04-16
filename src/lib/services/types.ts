/**
 * Shared types for API services
 */

export interface ApiResponse<T> {
	data: T | null;
	error: string | null;
	status: number;
}

export interface ApiError {
	message: string;
	status?: number;
	code?: string;
}

export interface PaginationOptions {
	limit?: number;
	offset?: number;
	page?: number;
}

export interface BlogPostFilters {
	category?: string;
	tag?: string;
	search?: string;
	featured?: boolean;
}
