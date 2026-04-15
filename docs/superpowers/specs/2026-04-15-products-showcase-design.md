# Products Showcase Design Document

**Date:** 2026-04-15
**Status:** Approved
**Approach:** Client-Side Data Fetching

## Overview

A minimal, elegant products showcase page demonstrating frontend skills with Japanese minimalist aesthetics. The page displays products from the DummyJSON API in a clean grid layout with pagination, matching the existing blog implementation pattern.

**Goal:** Showcase/demo page with essential product information (title, price, category, thumbnail) in a visually stunning presentation.

---

## Architecture & Components

### File Structure
```
src/routes/products/
├── +page.svelte              # Main products page
└── +page.svelte (types)      # Product data types

src/lib/utils/
└── products.ts               # Product utility functions (fetch, pagination)

src/lib/components/
└── ProductCard.svelte        # Reusable product card component
```

### Component Architecture

**Products Page (`src/routes/products/+page.svelte`)**
- Manages product state using `$state`
- Handles pagination logic (current page, total pages)
- Fetches from DummyJSON API on mount and page changes
- Renders grid of ProductCard components
- Displays pagination controls
- Follows BaseLayout pattern (no header/footer repetition)

**ProductCard Component (`src/lib/components/ProductCard.svelte`)**
- Displays: thumbnail image, title, price, category badge
- Hover effects with Japanese aesthetic (border accent, subtle lift)
- Uses `card-japanese` styling class
- Future: Links to product detail page
- Responsive design

**Product Utilities (`src/lib/utils/products.ts`)**
- `fetchProducts(page, limit)` - Fetches products with pagination
- `formatPrice(price)` - Formats price with currency symbol
- `getCategoryColor(category)` - Returns color for category badges (future)
- Type definitions for Product API response

### Data Flow
```
User visits /products
    ↓
Products page loads
    ↓
fetchProducts(page=1, limit=30) → DummyJSON API
    ↓
Response: { products: [...], total: 194, skip: 0, limit: 30 }
    ↓
Update $state with products and pagination info
    ↓
Render grid of ProductCard components
    ↓
User clicks pagination → fetchProducts(page=2)
```

---

## Visual Design & Styling

### Page Layout

**Hero Section (Simple Header)**
- Clean "Products" heading (H1, Cormorant Garamond font)
- Subtle divider line with primary accent (`divider-japanese`)
- No subtitle, no search, no badges (minimal approach)
- Centered, generous whitespace

**Product Grid**
- Uses existing `grid-japanese` utility class
- Responsive breakpoints:
  - Mobile: 1 column
  - Tablet (640px+): 2 columns
  - Desktop (1024px+): 3 columns
- Gap: 1.5rem (mobile), 2rem (desktop)
- Each card uses `card-japanese` styling

### Product Card Design

**Card Structure:**
```
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │    [THUMBNAIL]       │  │ ← Aspect ratio container
│  └──────────────────────┘  │
│  🏷️ beauty                 │ ← Category badge
│  Essence Mascara           │ ← Title
│  Lash Princess             │
│  $9.99                     │ ← Price (prominent)
└────────────────────────────┘
```

**Styling (Japanese Minimalism):**
- Background: `oklch(var(--color-card))`
- Border: 1px solid `oklch(var(--color-border))`
- **Hover effect:**
  - Border color → primary (30% opacity)
  - Transform: translateY(-2px)
  - Left border accent: scaleY(0) → scaleY(1)
- Image: Object-fit cover, rounded corners
- Typography: Noto Sans JP
- Price: Slightly larger font size, primary color

**Category Badges:**
- Small, pill-shaped (`badge-accent` utility)
- Background: `oklch(var(--color-primary) / 0.1)`
- Text: `oklch(var(--color-primary))`
- Uppercase, 0.75rem font size

### Pagination Controls

**Bottom of page:**
```
      ◀ Previous  1  2  3  4  5  Next ▶
```

- Centered, minimal button design
- Active page: Primary color background
- Disabled state: Reduced opacity, no hover
- Simple, unobtrusive styling

---

## API Integration & Data Management

### DummyJSON API Configuration

**Base URL:** `https://dummyjson.com/products`

**Fetch Parameters:**
- `limit=30` - Products per page (matches blog implementation)
- `skip={offset}` - Calculated as `(page - 1) * limit`
- `select=id,title,description,category,price,thumbnail` - Only essential fields

**Example Requests:**
```typescript
// Page 1: skip=0
GET /products?limit=30&skip=0&select=id,title,description,category,price,thumbnail

// Page 2: skip=30
GET /products?limit=30&skip=30&select=id,title,description,category,price,thumbnail
```

### State Management (Svelte 5 Runes)

**Products Page State:**
```typescript
let products = $state<Product[]>([]);
let loading = $state(true);
let currentPage = $state(1);
let totalPages = $state(1);
let error = $state<string | null>(null);
```

**Derived Values:**
```typescript
let hasNextPage = $derived(currentPage < totalPages);
let hasPrevPage = $derived(currentPage > 1);
```

### Pagination Logic

**Calculations:**
- `totalPages = Math.ceil(total / limit)` = 7 pages (194 total ÷ 30 per page)
- `offset = (currentPage - 1) * limit`
- URL updates: `/products?page=2`

**User Flow:**
1. Initial load → page 1
2. Click "Next" → fetch page 2, update URL
3. Click page number → jump to page
4. Browser back/forward → maintains page state

### Error Handling

**Graceful Degradation:**
- Network error: Show error message with retry button
- Empty response: Show "No products found" state
- Loading timeout: 10 second limit with retry option
- Image load failures: Fallback placeholder

---

## Animations & Transitions

### Page Transitions

**Initial Page Load:**
- Products fade in sequentially (staggered animation)
- Each card delays by 50-100ms
- Transition: `fly={{ y: 30, opacity: 0, duration: 500, easing: quintOut }}`
- Matches blog implementation pattern

**Pagination Transitions:**
- Old cards fade out quickly (200ms)
- New cards fade in with staggered animation
- Smooth scroll to top of grid on page change

### Card Hover Effects

**Micro-interactions:**
```typescript
// On hover
- Border color: → primary (30% opacity)
- Transform: translateY(-2px)
- Left border accent: scaleY(0) → scaleY(1)
- Shadow: subtle lift
- Transition timing: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

### Loading States

**Initial Load:**
- Centered spinner (matching blog style)
- Text: "Loading products..."

**Pagination Load:**
- Small spinner at bottom of grid
- Existing cards remain visible
- No full-page overlay

---

## Error Handling & Edge Cases

### Error States

**Network Error:**
- Display: "⚠️ Connection Error - Unable to load products"
- Actions: "Retry" button, "Go Back" button
- Console logging for debugging

**Empty State:**
- Display: "📦 No Products Found"
- Message: "No products are available at the moment"

### Edge Cases

**Slow Network:**
- Loading timeout after 10 seconds
- Show "Taking longer than expected..." message
- Keep retry button available

**Image Load Failures:**
- Fallback placeholder if thumbnail fails
- Graceful degradation (show title/price without image)

**Invalid Page Numbers:**
- URL param validation
- If `page < 1` or `page > totalPages`, redirect to page 1
- Browser history handled correctly

**Browser Back/Forward:**
- Page state persists in URL
- Products reload on history navigation
- Scroll position restored (if possible)

---

## Accessibility

**Keyboard Navigation:**
- Tab through product cards
- Enter/Space to select (future: open detail view)
- Focus visible on all interactive elements

**Screen Readers:**
- Semantic HTML (`<article>`, `<nav>`, `<h1>`)
- ARIA labels for pagination controls
- Alt text for product images (using product title)

**Performance:**
- Lazy load images below the fold
- Minimal JavaScript bundle
- Image optimization via DummyJSON

---

## Implementation Notes

### Navbar Integration

Add "Products" link to `src/lib/components/Navbar.svelte`:
- Position: Between "Blog" and other navigation items
- Style: Consistent with existing nav links
- Active state: Highlight when on `/products` page

### URL Structure

- Products page: `/products`
- With pagination: `/products?page=2`
- Clean URLs, no hash routing

### Future Enhancements (Out of Scope)

- Product detail pages (`/products/[id]`)
- Category filtering
- Search functionality
- Shopping cart
- Wishlist feature
- Product comparison

---

## Success Criteria

✅ Products page displays at `/products` route
✅ Shows products in clean grid layout with Japanese aesthetic
✅ Pagination works correctly (7 pages, 30 items per page)
✅ Product cards display: thumbnail, title, price, category
✅ Hover effects match blog card animations
✅ Loading states and error handling work properly
✅ Responsive design (mobile, tablet, desktop)
✅ Accessible keyboard navigation
✅ Performance optimized (lazy loading, minimal bundle)
✅ Consistent with existing codebase patterns

---

## Technical Constraints

- **Framework:** Svelte 5 with Runes Mode
- **Styling:** TailwindCSS 4.2.2 with Japanese Minimalism theme
- **Data Source:** DummyJSON Products API
- **Pattern:** Client-side data fetching (matching blog implementation)
- **Animation:** Svelte built-in transitions (fade, fly, blur)
- **No external libraries** for state management or data fetching
