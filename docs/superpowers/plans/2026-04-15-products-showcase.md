# Products Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal, elegant products showcase page displaying DummyJSON products in a Japanese minimalist grid layout with pagination.

**Architecture:** Client-side data fetching (matching blog pattern) - Products page fetches from DummyJSON API, manages state with Svelte 5 runes, renders ProductCard components in a responsive grid with pagination controls.

**Tech Stack:** Svelte 5 (Runes Mode), SvelteKit, TypeScript, TailwindCSS 4.2.2, DummyJSON API

---

## File Structure

```
src/routes/products/
├── +page.svelte              # Main products page (state, fetch, render)
└── types.ts                  # TypeScript types for Product API

src/lib/utils/
└── products.ts               # Product utilities (fetch, format)

src/lib/components/
├── ProductCard.svelte        # Reusable product card component
└── Navbar.svelte             # MODIFIED: Add "Products" link
```

**Units of Responsibility:**
- `types.ts` - Type definitions for DummyJSON API response
- `products.ts` - API fetching and data transformation utilities
- `ProductCard.svelte` - Single product display with hover effects
- `+page.svelte` - Page-level state, pagination, error handling
- `Navbar.svelte` - Navigation update to include Products link

---

## Task 1: Define TypeScript Types for Product API

**Files:**
- Create: `src/routes/products/types.ts`

- [ ] **Step 1: Create type definitions**

```typescript
// src/routes/products/types.ts

/**
 * Product data from DummyJSON API
 * Only essential fields for the showcase
 */
export interface Product {
	id: number;
	title: string;
	description: string;
	category: string;
	price: number;
	thumbnail: string;
}

/**
 * DummyJSON API response structure
 */
export interface ProductsResponse {
	products: Product[];
	total: number;
	skip: number;
	limit: number;
}

/**
 * Product card props
 */
export interface ProductCardProps {
	product: Product;
}
```

- [ ] **Step 2: Verify types compile**

Run: `pnpm check`
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/routes/products/types.ts
git commit -m "feat(products): define TypeScript types for Product API

- Add Product interface with essential fields
- Add ProductsResponse for API structure
- Add ProductCardProps for component props"
```

---

## Task 2: Create Product Utility Functions

**Files:**
- Create: `src/lib/utils/products.ts`

- [ ] **Step 1: Write utility functions**

```typescript
// src/lib/utils/products.ts

import type { Product, ProductsResponse } from '../../routes/products/types';

const DUMMYJSON_BASE_URL = 'https://dummyjson.com/products';
const PRODUCTS_PER_PAGE = 30;

/**
 * Fetch products from DummyJSON API with pagination
 * @param page - Page number (1-based)
 * @param limit - Number of products per page
 * @returns Promise with products response
 */
export async function fetchProducts(
	page: number = 1,
	limit: number = PRODUCTS_PER_PAGE
): Promise<ProductsResponse> {
	const skip = (page - 1) * limit;
	const select = 'id,title,description,category,price,thumbnail';

	const url = `${DUMMYJSON_BASE_URL}?limit=${limit}&skip=${skip}&select=${select}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch products: ${response.statusText}`);
	}

	const data: ProductsResponse = await response.json();
	return data;
}

/**
 * Format price with currency symbol
 * @param price - Product price
 * @returns Formatted price string
 */
export function formatPrice(price: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(price);
}

/**
 * Calculate total pages from product count
 * @param total - Total number of products
 * @param limit - Products per page
 * @returns Total pages
 */
export function getTotalPages(total: number, limit: number = PRODUCTS_PER_PAGE): number {
	return Math.ceil(total / limit);
}
```

- [ ] **Step 2: Verify utilities compile**

Run: `pnpm check`
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/utils/products.ts
git commit -m "feat(products): add product utility functions

- Add fetchProducts() with pagination support
- Add formatPrice() for currency formatting
- Add getTotalPages() for pagination calculation
- Use DummyJSON API with select parameter for essential fields"
```

---

## Task 3: Create ProductCard Component

**Files:**
- Create: `src/lib/components/ProductCard.svelte`

- [ ] **Step 1: Create ProductCard component**

```svelte
<!-- src/lib/components/ProductCard.svelte -->

<script lang="ts">
	import type { ProductCardProps } from '$routes/products/types';

	let { product }: ProductCardProps = $props();

	// Truncate title if too long
	const maxTitleLength = 50;
	const truncatedTitle =
		product.title.length > maxTitleLength
			? product.title.slice(0, maxTitleLength) + '...'
			: product.title;
</script>

<article class="card-japanese group">
	<a href="#" class="block" aria-label={`View ${product.title}`}>
		<!-- Thumbnail Image -->
		<div class="aspect-square overflow-hidden rounded-t-md bg-muted mb-4">
			<img
				src={product.thumbnail}
				alt={product.title}
				class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
				loading="lazy"
			/>
		</div>

		<!-- Category Badge -->
		<div class="mb-3">
			<span class="badge-accent text-xs">{product.category}</span>
		</div>

		<!-- Product Title -->
		<h3 class="text-lg font-semibold mb-2 leading-tight group-hover:text-primary transition-colors">
			{truncatedTitle}
		</h3>

		<!-- Price -->
		<div class="text-xl font-medium text-primary">
			{new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD'
			}).format(product.price)}
		</div>
	</a>
</article>
```

- [ ] **Step 2: Run svelte-autofixer to verify component**

Run: Check if svelte-autofixer is available in MCP tools, then use it to verify the component follows Svelte 5 best practices

Expected: No critical issues

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/ProductCard.svelte
git commit -m "feat(products): create ProductCard component

- Display product thumbnail, title, price, category
- Use card-japanese styling for consistency
- Add hover effects (scale, color change)
- Support long title truncation
- Lazy load images for performance"
```

---

## Task 4: Create Products Page with State Management

**Files:**
- Create: `src/routes/products/+page.svelte`

- [ ] **Step 1: Create products page structure**

```svelte
<!-- src/routes/products/+page.svelte -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import type { Product } from './types';
	import { fetchProducts, formatPrice, getTotalPages } from '$lib/utils/products';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	// State
	let products = $state<Product[]>([]);
	let loading = $state(true);
	let currentPage = $state(1);
	let totalPages = $state(1);
	let error = $state<string | null>(null);

	// Derived values
	let hasNextPage = $derived(currentPage < totalPages);
	let hasPrevPage = $derived(currentPage > 1);

	// Load products
	async function loadProducts(page: number) {
		loading = true;
		error = null;

		try {
			const data = await fetchProducts(page);
			products = data.products;
			totalPages = getTotalPages(data.total, data.limit);
			currentPage = page;

			// Update URL param
			if (browser) {
				const url = new URL(window.location.href);
				url.searchParams.set('page', page.toString());
				window.history.replaceState({}, '', url.toString());
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load products';
			console.error('Error loading products:', err);
		} finally {
			loading = false;
		}
	}

	// Handle page change from URL params on mount
	onMount(() => {
		const urlParams = new URLSearchParams($page.url.searchParams);
		const pageParam = urlParams.get('page');
		const initialPage = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;

		loadProducts(initialPage);
	});

	// Pagination handlers
	function goToNextPage() {
		if (hasNextPage) {
			loadProducts(currentPage + 1);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function goToPrevPage() {
		if (hasPrevPage) {
			loadProducts(currentPage - 1);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			loadProducts(page);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	// Retry handler
	function retry() {
		loadProducts(currentPage);
	}
</script>

<svelte:head>
	<title>Products - Notizen</title>
	<meta name="description" content="Browse our curated collection of products" />
</svelte:head>

<!-- Simple Hero Section -->
<section class="border-b border-border/40 bg-muted/20 py-16">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-4xl text-center">
			<h1 class="mb-6 text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
				Products
			</h1>
			<div class="divider-japanese max-w-xs mx-auto"></div>
		</div>
	</div>
</section>

<!-- Loading State -->
{#if loading && products.length === 0}
	<section class="py-32">
		<div class="container mx-auto px-4">
			<div class="flex flex-col items-center justify-center py-16">
				<div class="border-primary h-16 w-16 animate-spin rounded-full border-b-2"></div>
				<p class="mt-4 text-muted-foreground text-sm">Loading products...</p>
			</div>
		</div>
	</section>
{:else if error}
	<!-- Error State -->
	<section class="py-32">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-2xl py-16 text-center">
				<div class="w-20 h-20 rounded-full bg-destructive/10 mx-auto mb-6 flex items-center justify-center">
					<span class="text-4xl">⚠️</span>
				</div>
				<h1 class="mb-4 text-3xl font-semibold">Connection Error</h1>
				<p class="text-muted-foreground mb-8 text-lg leading-relaxed">
					{error}
				</p>
				<div class="flex justify-center gap-4">
					<button
						onclick={retry}
						class="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
					>
						Retry
					</button>
					<a
						href="/"
						class="inline-flex items-center justify-center px-8 py-3 font-medium rounded-lg border border-border hover:bg-accent transition-all duration-300"
					>
						Go Back
					</a>
				</div>
			</div>
		</div>
	</section>
{:else if products.length === 0}
	<!-- Empty State -->
	<section class="py-32">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-2xl py-16 text-center">
				<div class="w-20 h-20 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
					<span class="text-4xl">📦</span>
				</div>
				<h1 class="mb-4 text-3xl font-semibold">No Products Found</h1>
				<p class="text-muted-foreground mb-8 text-lg leading-relaxed">
					No products are available at the moment.
				</p>
			</div>
		</div>
	</section>
{:else}
	<!-- Products Grid -->
	<section class="py-16">
		<div class="container mx-auto px-4">
			<div class="grid-japanese max-w-7xl mx-auto">
				{#each products as product, index (product.id)}
					<ProductCard
						{product}
						in:fly={{ y: 30, opacity: 0, delay: index * 50, duration: 500, easing: quintOut }}
					/>
				{/each}
			</div>
		</div>
	</section>

	<!-- Pagination Controls -->
	{#if totalPages > 1}
		<section class="border-t border-border/40 py-12 bg-muted/20">
			<div class="container mx-auto px-4">
				<div class="flex items-center justify-center gap-2">
					<!-- Previous Button -->
					<button
						disabled={!hasPrevPage}
						class="px-4 py-2 font-medium rounded-lg border border-border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/50 hover:bg-accent"
						onclick={goToPrevPage}
					>
						◀ Previous
					</button>

					<!-- Page Numbers -->
					{#each Array(totalPages) as _, i}
						{@const pageNum = i + 1}
						<button
							class="px-4 py-2 font-medium rounded-lg border border-border transition-all duration-300 hover:border-primary/50 hover:bg-accent {currentPage === pageNum
								? 'bg-primary text-primary-foreground border-primary'
								: ''}"
							onclick={() => goToPage(pageNum)}
						>
							{pageNum}
						</button>
					{/each}

					<!-- Next Button -->
					<button
						disabled={!hasNextPage}
						class="px-4 py-2 font-medium rounded-lg border border-border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/50 hover:bg-accent"
						onclick={goToNextPage}
					>
						Next ▶
					</button>
				</div>
			</div>
		</section>
	{/if}
{/if}

<style>
	/* Smooth transitions */
	button,
	a {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
```

- [ ] **Step 2: Run svelte-autofixer to verify page component**

Expected: No critical issues, check for proper Svelte 5 runes usage

- [ ] **Step 3: Commit**

```bash
git add src/routes/products/+page.svelte
git commit -m "feat(products): create products page with pagination

- Implement client-side data fetching from DummyJSON
- Add state management with Svelte 5 runes
- Display products in grid-japanese layout
- Add pagination controls (7 pages, 30 items per page)
- Handle loading, error, and empty states
- Update URL params for page tracking
- Smooth animations and transitions"
```

---

## Task 5: Update Navbar with Products Link

**Files:**
- Modify: `src/lib/components/Navbar.svelte`

- [ ] **Step 1: Read current Navbar implementation**

Run: Read the file to understand current structure

- [ ] **Step 2: Add Products link to navigation**

Find the navigation links section (likely around the Blog link) and add:

```svelte
<!-- Add Products link in the navigation -->
<a
	href="/products"
	class="text-sm font-medium transition-colors hover:text-primary {$page.url.pathname ===
	'/products'
		? 'text-primary'
		: 'text-muted-foreground'}"
>
	Products
</a>
```

Position it logically (e.g., after Blog link, before other items)

- [ ] **Step 3: Verify navigation works**

Run: `pnpm dev`
Visit: http://localhost:5173
Click Products link
Expected: Navigates to /products page

- [ ] **Step 4: Run svelte-autofixer on Navbar**

Expected: No issues

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/Navbar.svelte
git commit -m "feat(products): add Products link to navigation

- Add Products link to main navigation
- Match existing navigation styling
- Add active state highlighting"
```

---

## Task 6: Update Phosphor Icons (Fix Deprecation Warnings)

**Files:**
- Modify: `src/routes/products/+page.svelte` (if needed)
- Check: All icon imports across the project

- [ ] **Step 1: Check for icon usage in products page**

Run: Search for any phosphor-svelte imports in the products page

If no icons are used, skip to commit. If icons are used:

- [ ] **Step 2: Update icon imports to use *Icon suffix**

Example change:
```typescript
// Before
import { MagnifyingGlass, Folder, Tag } from 'phosphor-svelte';

// After
import { MagnifyingGlassIcon, FolderIcon, TagIcon } from 'phosphor-svelte';
```

- [ ] **Step 3: Commit (if changes made)**

```bash
git add src/routes/products/+page.svelte
git commit -m "fix(products): update icon imports to use Icon suffix

- Use new phosphor-svelte icon naming convention
- Fix deprecation warnings"
```

---

## Task 7: Add Error Boundary for Products Page

**Files:**
- Modify: `src/routes/+error.svelte` (if needed)

- [ ] **Step 1: Check if error page handles products route**

Run: Read `src/routes/+error.svelte`

If the error page is generic and handles all routes, no changes needed.

- [ ] **Step 2: Test error handling**

Run: `pnpm dev`
Visit: http://localhost:5173/products
Temporarily break the API call (e.g., change URL)
Expected: Error boundary catches and displays error

- [ ] **Step 3: Commit (if changes made)**

```bash
git add src/routes/+error.svelte
git commit -m "feat(products): ensure error handling for products route"
```

---

## Task 8: Final Testing and Verification

**Files:**
- All created/modified files

- [ ] **Step 1: Run type checking**

Run: `pnpm check`
Expected: No TypeScript errors

- [ ] **Step 2: Run linter**

Run: `pnpm lint`
Expected: No ESLint errors

- [ ] **Step 3: Test products page functionality**

Run: `pnpm dev -- --open`

Test checklist:
- [ ] Products page loads at `/products`
- [ ] Products display in grid layout
- [ ] Product cards show: thumbnail, title, price, category
- [ ] Hover effects work on cards
- [ ] Pagination controls appear and work
- [ ] Next/Previous buttons work correctly
- [ ] Page numbers are clickable
- [ ] URL updates with page parameter
- [ ] Browser back/forward maintains page state
- [ ] Loading state displays on initial load
- [ ] Error state displays when API fails
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] Products link in Navbar works
- [ ] Active state highlights in navigation

- [ ] **Step 4: Test performance**

- [ ] Images load lazily (check network tab)
- [ ] Pagination is fast (smooth transitions)
- [ ] No console errors

- [ ] **Step 5: Test accessibility**

- [ ] Tab navigation works through products
- [ ] Focus visible on interactive elements
- [ ] Screen reader announces product info
- [ ] Alt text present on images

- [ ] **Step 6: Commit final changes**

```bash
git add .
git commit -m "feat(products): complete products showcase implementation

- All functionality working as designed
- Pagination, error handling, loading states complete
- Responsive design verified
- Accessibility tested
- Performance optimized with lazy loading"
```

---

## Task 9: Documentation and Cleanup

**Files:**
- Update: `README.md` or `CLAUDE.md` (if needed)

- [ ] **Step 1: Check if project documentation needs updating**

Run: Read `README.md` and `CLAUDE.md`

- [ ] **Step 2: Add products section to docs (if needed)**

Add a brief section about the products feature:
```markdown
## Products

The products showcase displays products from the DummyJSON API in a minimalist grid layout.

- Route: `/products`
- Features: Pagination, filtering, responsive design
- API: DummyJSON Products API
```

- [ ] **Step 3: Commit documentation**

```bash
git add README.md CLAUDE.md
git commit -m "docs: add products feature documentation"
```

---

## Task 10: Final Verification Handoff

**Files:**
- All files

- [ ] **Step 1: Run full test suite**

Run: `pnpm test` (if tests exist)
Expected: All tests pass

- [ ] **Step 2: Build production version**

Run: `pnpm build`
Expected: Build succeeds without errors

- [ ] **Step 3: Preview production build**

Run: `pnpm preview`
Visit: http://localhost:4173/products
Expected: Products page works in production mode

- [ ] **Step 4: Create final summary**

Verify all success criteria from design doc:
- ✅ Products page displays at `/products` route
- ✅ Shows products in clean grid layout with Japanese aesthetic
- ✅ Pagination works correctly (7 pages, 30 items per page)
- ✅ Product cards display: thumbnail, title, price, category
- ✅ Hover effects match blog card animations
- ✅ Loading states and error handling work properly
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Accessible keyboard navigation
- ✅ Performance optimized (lazy loading, minimal bundle)
- ✅ Consistent with existing codebase patterns

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat(products): complete implementation - ready for review

All tasks completed:
- Type definitions for Product API
- Utility functions for fetching and formatting
- ProductCard component with hover effects
- Products page with pagination and state management
- Navbar integration
- Error handling and loading states
- Responsive design and accessibility
- Performance optimization

Verified:
- Type checking passes
- Linting passes
- Production build succeeds
- All functionality tested
- Japanese aesthetic maintained"
```

---

## Implementation Notes

### Key Decisions

1. **Client-side fetching** - Matches blog pattern, simpler than SSR for showcase
2. **30 products per page** - Balances performance and user experience
3. **Essential fields only** - Reduces API payload, faster loading
4. **Grid layout** - Reuses existing `grid-japanese` utility
5. **Card styling** - Matches blog card aesthetic with `card-japanese`

### Future Enhancements (Out of Scope)

- Product detail pages (`/products/[id]`)
- Category filtering
- Search functionality
- Shopping cart
- Wishlist feature

### Dependencies

- No new dependencies required
- Uses existing: Svelte 5, SvelteKit, TailwindCSS
- External API: DummyJSON (free, no key required)

---

## Success Criteria

✅ All tasks completed with checkboxes checked
✅ Products page accessible at `/products`
✅ Pagination working across all 7 pages
✅ Product cards display correctly with all fields
✅ Hover effects and animations smooth
✅ Error handling graceful with retry option
✅ Responsive on all device sizes
✅ Accessible via keyboard and screen reader
✅ No console errors or warnings
✅ Production build succeeds
✅ Code follows project patterns (Japanese aesthetic, Svelte 5 runes)
