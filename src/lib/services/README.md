# Service Layer Architecture

This directory contains all API services and business logic for the application.

## Structure

```
services/
├── api-client.ts      # Base API client with common fetch logic
├── blog.service.ts    # Blog-specific API service
├── types.ts           # Shared types for all services
├── index.ts           # Barrel file for clean imports
└── README.md          # This file
```

## Usage

### Importing Services

```typescript
// Import from barrel file for clean imports
import { blogService, apiClient } from '$lib/services';
import type { BlogPostFilters, ApiResponse } from '$lib/services';

// Or import specific services
import { blogService } from '$lib/services/blog.service';
```

### Blog Service

```typescript
// Get featured posts
const featuredPosts = await blogService.getFeaturedPosts(3);

// Get posts by category
const categoryPosts = await blogService.getPostsByCategory('web development', 10);

// Search posts
const searchResults = await blogService.searchPosts('svelte 5');

// Get single post
const post = await blogService.getPost('my-post-slug');
```

### Creating New Services

1. Create a new service file (e.g., `user.service.ts`)
2. Extend the `ApiClient` base class or use it directly
3. Export a singleton instance
4. Add to `index.ts` barrel file

```typescript
// user.service.ts
import { apiClient } from './api-client';

export class UserService {
	async getProfile() {
		return apiClient.get<UserProfile>('/api/user/profile');
	}
}

export const userService = new UserService();
```

## Benefits

- **Centralized API Logic**: All fetch calls in one place
- **Error Handling**: Consistent error handling across all API calls
- **Type Safety**: Full TypeScript support with proper types
- **Testability**: Easy to mock services for testing
- **Maintainability**: Easy to update API endpoints
- **Browser Safety**: Automatic browser environment checks

## Architecture Principles

1. **Services handle API calls** - Components shouldn't call fetch directly
2. **Utilities handle data transformation** - Keep services focused on API logic
3. **Components handle UI state** - Services return data, components manage state
4. **Singleton instances** - Each service has one instance for consistency

## Migration Notes

The old API functions have been moved from `utils/blog.ts` to the service layer:
- `loadBlogPost()` → `blogService.getPost()`
- `loadBlogPosts()` → `blogService.getPosts()`

Utility functions (formatters, helpers) remain in `utils/blog.ts`.
