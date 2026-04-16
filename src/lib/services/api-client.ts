/**
 * Base API client for common fetch logic
 */

import type { ApiResponse } from './types';

export class ApiClient {
	private baseUrl: string;

	constructor(baseUrl: string = '') {
		this.baseUrl = baseUrl;
	}

	/**
	 * Generic GET request handler
	 */
	async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
		try {
			const url = `${this.baseUrl}${endpoint}`;
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					...options?.headers
				},
				...options
			});

			const data = await response.json();

			return {
				data: response.ok ? data : null,
				error: response.ok ? null : data.message || 'Request failed',
				status: response.status
			};
		} catch (error) {
			return {
				data: null,
				error: error instanceof Error ? error.message : 'Unknown error',
				status: 0
			};
		}
	}

	/**
	 * Generic POST request handler
	 */
	async post<T>(endpoint: string, body?: any, options?: RequestInit): Promise<ApiResponse<T>> {
		try {
			const url = `${this.baseUrl}${endpoint}`;
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...options?.headers
				},
				body: JSON.stringify(body),
				...options
			});

			const data = await response.json();

			return {
				data: response.ok ? data : null,
				error: response.ok ? null : data.message || 'Request failed',
				status: response.status
			};
		} catch (error) {
			return {
				data: null,
				error: error instanceof Error ? error.message : 'Unknown error',
				status: 0
			};
		}
	}
}

// Singleton instance
export const apiClient = new ApiClient();
