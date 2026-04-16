## Project Configuration

- **Language**: TypeScript
- **Package Manager**: pnpm
- **Add-ons**: prettier, eslint, vitest, tailwindcss, sveltekit-adapter, mdsvex, paraglide, mcp

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

---

# Notizen - Complete Package Guide

**Framework**: Svelte 5.55.2 with Runes Mode | **Package Manager**: pnpm | **Styling**: TailwindCSS 4.2.2

## 🚀 Quick Start Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm dev -- --open    # Start and open in browser

# Building
pnpm build            # Production build
pnpm preview          # Preview production build

# Code Quality
pnpm check            # Type checking with svelte-check
pnpm check:watch      # Type checking in watch mode
pnpm lint             # ESLint + Prettier check
pnpm format           # Format code with Prettier

# Testing
pnpm test             # Run all tests once
pnpm test:unit        # Run unit tests in watch mode
```

## 📦 Package Usage Guide

### **Svelte 5 with Runes Mode**

This project uses **Svelte 5 runes mode** globally (except node_modules).

```svelte
<script>
	// $state - Reactive state
	let count = $state(0);
	let user = $state({ name: 'John', age: 30 });

	// $derived - Computed values (use instead of $effect for calculations)
	let doubled = $derived(count * 2);
	let isAdult = $derived(user.age >= 18);

	// $props - Component props (replaces export let)
	interface Props {
		name: string;
		age?: number;
	}
	let { name, age = 18 }: Props = $props();

	// ✅ Use event handlers instead of $effect for simple operations
	function increment() {
		count++;
		console.log('Count:', count); // Direct logging, not $effect
	}
</script>

<button onclick={increment}>
	{name}: {count} × 2 = {doubled}
</button>
```

**⚠️ Important: Minimize `$effect` usage**

- Use `$derived` for computations
- Use event handlers for actions
- Use `runed` library utilities (sleep, tick, etc.) for common patterns
- Only use `$effect` for true reactive side effects (syncing with external systems)

### **bits-ui Component Library**

Headless, accessible component library with 40+ components.

```svelte
<script>
	import { Button, Dialog, DropdownMenu, Select, Tabs } from 'bits-ui';
</script>

<!-- Basic usage -->
<Button variant="default" class="w-full">Click me</Button>

<!-- Dialog with builder pattern -->
<Dialog.Root>
	<Dialog.Trigger asChild let:builder>
		<Button build={builder}>Open Dialog</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Title>Dialog Title</Dialog.Title>
		<Dialog.Description>Description here</Dialog.Description>
	</Dialog.Content>
</Dialog.Root>
```

**Available Components**: Navigation (Menu, NavigationMenu, Command, Combobox), Form (Button, Checkbox, Label, Switch, Slider, DatePicker), Layout (Dialog, AlertDialog, Collapsible, Separator, Tabs), Display (Avatar, Meter, Progress, AspectRatio, Popover), Data (Table, Pagination, ToggleGroup, Toolbar)

### **@inlang/paraglide-js (i18n)**

Type-safe internationalization with compile-time optimizations.

```svelte
<script>
	import { setLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';

	let currentLocale = $state('en');

	function changeLocale(locale: string) {
		setLocale(locale);
		currentLocale = locale;
	}
</script>

<select bind:value={currentLocale} onchange={changeLocale(currentLocale)}>
	<option value="en">English</option>
	<option value="id">Indonesian</option>
	<option value="jp">Japanese</option>
</select>

<h1>{m.hello_world({ name: 'Claude' })}</h1>
```

**Supported Locales**: en (base), id, jp

### **TailwindCSS v4**

Latest TailwindCSS with Vite plugin. Configure in CSS, no config file needed!

```css
/* src/routes/layout.css */
@import 'tailwindcss';
@plugin '@tailwindcss/forms';
@plugin '@tailwindcss/typography';

:root {
	--primary: oklch(0.52 0.24 25);
	--secondary: oklch(0.94 0.008 90);
}

@theme inline {
	--color-primary: var(--primary);
	--color-secondary: var(--secondary);
}
```

```svelte
<!-- Use colors directly -->
<div class="bg-primary text-primary-foreground">
	<button class="bg-secondary hover:bg-secondary/80">Click me</button>
</div>
```

### **mdsvex (Markdown)**

Write markdown in `.svx` or `.md` files with Svelte components.

```markdown
# Svelte 5 Guide

<script>
  let count = $state(0);
</script>

Current count: {count}

<button onclick={() => count++}>Increment</button>
```

### **@sveltejs/enhanced-img**

Enhanced image optimization.

```svelte
<script>
	import { enhance } from '@sveltejs/enhanced-img';
	import img from '$lib/assets/photo.jpg?enhanced';
</script>

<img src={img.src} width={img.width} height={img.height} alt="Optimized" />
<!-- or -->
<img use:enhance src="/photo.jpg" alt="Enhanced" />
```

### **phosphor-svelte (Icons)**

2,000+ icons with 6 weights.

**⚠️ IMPORTANT: Always use `*Icon` suffix for imports**

The old icon names (without `Icon` suffix) are deprecated. Always use the newer `*Icon` versions.

```svelte
<script>
	// ❌ BAD: Old imports (deprecated)
	import { House, User, Settings, MagnifyingGlass } from 'phosphor-svelte';

	// ✅ GOOD: New imports with Icon suffix
	import { HouseIcon, UserIcon, SettingsIcon, MagnifyingGlassIcon } from 'phosphor-svelte';
</script>

<HouseIcon size={32} weight="fill" />
<UserIcon size={24} weight="regular" />
<SettingsIcon size={20} weight="thin" />
```

**Why This Matters:**

- Old names trigger deprecation warnings
- New names are the future-proof standard
- Same API, just with `Icon` suffix

**Weights**: thin, light, regular, bold, fill, duotone

### **runed (Runes Utilities)**

**IMPORTANT: Use `runed` functions instead of `$effect` and `onMount` when possible!**

Utility functions for Svelte 5 runes that provide cleaner alternatives to common reactive patterns.

```svelte
<script>
	import { sleep, tick, untrack, mount } from 'runed';

	// ❌ BAD: Using $effect for simple logging
	$effect(() => {
		console.log('Count changed:', count);
	});

	// ✅ GOOD: Just log directly in event handlers
	function increment() {
		count++;
		console.log('Count changed:', count);
	}

	// ✅ Use sleep() instead of $effect for delays
	let loading = $state(false);

	async function fetchData() {
		loading = true;
		await sleep(1000); // Sleep 1 second
		loading = false;
	}

	// ✅ Use tick() for DOM updates
	let items = $state([]);

	async function addItems() {
		items = [1, 2, 3];
		await tick(); // Wait for DOM to update
		const element = document.querySelector('.item');
	}

	// ❌ BAD: Using onMount for initialization
	import { onMount } from 'svelte';

	onMount(() => {
		loadData();
	});

	// ✅ GOOD: Use top-level await or mount() from runed
	// For components that need initialization
</script>

**Available `runed` functions:** - `sleep(ms)` - Delay execution - `tick()` - Wait for DOM updates -
`untrack(fn)` - Run function without reactivity tracking - `mount(fn)` - Component lifecycle
management - `use*()` - Various utility hooks **When to use $effect (sparingly):** - Synchronizing
state with external systems (localStorage, URL params) - Side effects that MUST react to state
changes - Debugging/reactivity tracing **When NOT to use $effect:** - Simple logging (use event
handlers) - DOM manipulation after state changes (use `tick()`) - Data fetching on mount (use async
functions or `$state()` with promises) - Computations (use `$derived` instead)
```

### **svelte-meta-tags (SEO)**

Manage meta tags for SvelteKit apps.

```svelte
<script>
	import { MetaTags } from 'svelte-meta-tags';
</script>

<svelte:head>
	<MetaTags
		title="Blog Post"
		description="Post description"
		openGraph={{
			title: 'Blog Post',
			image: 'https://example.com/og-image.jpg'
		}}
	/>
</svelte:head>
```

### **Blog Packages**

```typescript
// gray-matter - Frontmatter parsing
import matter from 'gray-matter';
const { content, data } = matter(markdownFile);

// marked - Markdown to HTML
import { marked } from 'marked';
const html = await marked(content);

// highlight.js - Syntax highlighting
import hljs from 'highlight.js';
const highlighted = hljs.highlight(code, { language: 'js' });

// date-fns - Date utilities
import { format, differenceInDays } from 'date-fns';
const formatted = format(date, 'MMMM d, yyyy');
```

## 🧪 Testing

### **vitest + vitest-browser-svelte + playwright**

```typescript
// Unit tests (*.spec.ts)
import { describe, it, expect } from 'vitest';
import { add } from './math';

describe('Math utils', () => {
	it('should add numbers', () => {
		expect(add(2, 3)).toBe(5);
	});
});
```

```svelte
<!-- Component tests (*.svelte.spec.ts) -->
<script module>
  import { test, expect } from '@playwright/test';
</script>

<script>
  import Button from './Button.svelte';
</script>

<template>
  <div id="test-root">
    <Button>Click me</Button>
  </div>
</template>

<script>
  test('renders button', async ({ page }) => {
    await page.goto('/');
    const button = page.locator('button');
    await expect(button).toHaveText('Click me');
  });
</script>
```

## 🎨 Code Quality

### **Prettier** (`.prettierrc`)

- Tabs, single quotes, no trailing commas
- 100 char print width
- Svelte + TailwindCSS plugins

### **ESLint** (`eslint.config.js`)

- Flat config with Svelte rules
- Prettier integration (no conflicts)

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/      # Reusable components
│   │   ├── Navbar.svelte       # Main navigation
│   │   ├── Footer.svelte       # Site footer
│   │   ├── Header.svelte       # Page header (if needed)
│   │   └── ...                 # Other UI components
│   ├── utils/          # Utility functions
│   ├── assets/         # Static assets
│   ├── paraglide/      # Auto-generated i18n (DO NOT EDIT)
│   └── vitest-examples/# Test examples
├── routes/             # SvelteKit file-based routing
│   ├── +layout.svelte  # ⭐ ROOT LAYOUT (includes Navbar, Footer)
│   ├── +page.svelte    # Home page (only content, no layout)
│   ├── layout.css      # Global styles
│   ├── api/            # API routes
│   ├── blog/           # Blog routes (only content, no layout)
│   └── about/          # Other routes (only content, no layout)
├── app.html            # HTML template
├── app.d.ts            # Global TypeScript declarations
├── hooks.ts            # Client-side hooks
└── hooks.server.ts     # Server-side hooks

messages/               # i18n message files (en.json, id.json, jp.json)
project.inlang/         # Paraglide configuration
static/                 # Static files
└── content/blog/       # Blog markdown files
```

**⭐ Key: BaseLayout Pattern**

- `+layout.svelte` - Contains header, navbar, footer (applies to all pages)
- `+page.svelte` - Contains only page-specific content
- Individual routes - Only their content, layout is automatic

## 🎯 Best Practices

### **⚠️ CRITICAL RULES**

**1. Avoid Overusing `$effect`**

```svelte
<script>
	// ❌ BAD: Using $effect for simple operations
	$effect(() => {
		console.log('Count:', count);
	});

	// ✅ GOOD: Log in event handlers
	function increment() {
		count++;
		console.log('Count:', count);
	}

	// ❌ BAD: Using $effect for derived values
	$effect(() => {
		doubled = count * 2;
	});

	// ✅ GOOD: Use $derived for computations
	let doubled = $derived(count * 2);
</script>
```

**2. Avoid `onMount` for Data Fetching**

```svelte
<script>
	// ❌ BAD: Using onMount for initialization
	import { onMount } from 'svelte';

	onMount(async () => {
		const data = await fetchData();
		items = data;
	});

	// ✅ GOOD: Use top-level async or reactive promises
	async function load() {
		const data = await fetchData();
		items = data;
	}

	load(); // Call directly

	// ✅ GOOD: For reactive data loading
	let data = $state(null);
	let loading = $state(true);

	fetchData().then((result) => {
		data = result;
		loading = false;
	});
</script>
```

**3. Use `runed` Library Functions**

```svelte
<script>
	import { sleep, tick } from 'runed';

	// ✅ Use sleep() for delays
	async function withDelay() {
		loading = true;
		await sleep(500);
		loading = false;
	}

	// ✅ Use tick() for DOM updates
	async function updateAndScroll() {
		items.push(newItem);
		await tick(); // Wait for DOM update
		window.scrollTo(0, document.body.scrollHeight);
	}
</script>
```

**4. Always Use BaseLayout Pattern (DRY)**

```svelte
<!-- ❌ BAD: Repeating header/navbar/footer in every page -->
<!-- src/routes/about/+page.svelte -->
<div class="header">
	<nav>...</nav>
</div>
<main>
	<h1>About</h1>
	<p>About content...</p>
</main>
<footer>...</footer>

<!-- src/routes/contact/+page.svelte -->
<div class="header">
	<nav>...</nav>
	<!-- REPEATED -->
</div>
<main>
	<h1>Contact</h1>
	<p>Contact content...</p>
</main>
<footer>...</footer>
<!-- REPEATED -->
```

```svelte
<!-- ✅ GOOD: BaseLayout component with header/navbar/footer -->
<!-- src/routes/+layout.svelte (Root Layout) -->
<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { page } from '$app/stores';

  let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
  <header class="border-b">
    <Navbar />
  </header>

  <main class="flex-1">
    {@render children()}
  </main>

  <Footer />
</div>

<!-- ✅ Then each page only contains page-specific content -->
<!-- src/routes/about/+page.svelte -->
<script lang="ts">
  import { pageTitle } from '$lib/stores/meta';
</script>

<svelte:head>
  <title>About - Notizen</title>
</svelte:head>

<h1>About</h1>
<p>About content...</p>

<!-- src/routes/contact/+page.svelte -->
<svelte:head>
  <title>Contact - Notizen</title>
</svelte:head>

<h1>Contact</h1>
<p>Contact content...</p>
```

**BaseLayout Pattern Benefits:**

- ✅ **DRY** - Header/navbar/footer defined once
- ✅ **Consistent** - Same layout across all pages
- ✅ **Maintainable** - Update navbar/footer in one place
- ✅ **Clean** - Pages only contain their specific content
- ✅ **Flexible** - Can use slot props for page-specific customization

**5. Avoid `sed -i` Force Replace**

```bash
# ❌ BAD: Using sed -i for file edits (dangerous, error-prone)
sed -i 's/old/new/g' file.txt
sed -i '352,354d' file.txt
sed -i "s/class=\"mx-auto flex h-16/class=\"mx-auto flex h-16 bg-gradient/g" file.txt

# ✅ GOOD: Use Edit tool (safe, precise, handles edge cases)
Edit tool with:
- old_string: exact match
- new_string: replacement
- replace_all: for multiple occurrences
```

**Why Avoid `sed -i`:**

- ❌ **Fragile** - Breaks on special characters, quotes, tabs
- ❌ **Dangerous** - No verification, can corrupt files
- ❌ **Error-prone** - Fails silently on partial matches
- ❌ **Hard to debug** - Can't see what changed

**When to Use Edit Tool:**

```typescript
// ✅ Use Edit for all file modifications
Edit({
	file_path: '/path/to/file.svelte',
	old_string: 'exact string to replace',
	new_string: 'replacement string',
	replace_all: false // or true for multiple occurrences
});
```

**Only Use `sed` For:**

- ✅ Simple text operations in non-code files
- ✅ One-off commands that don't affect project files
- ✅ Operations where Edit tool isn't available
- ❌ Never for .svelte, .ts, .js, .json files

**6. Maximize Built-in Svelte Animation Modules**

Svelte 5 includes powerful built-in animation and transition modules. Use these instead of external animation libraries.

```svelte
<script>
  import { fade, blur, fly, slide, scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { tweened, spring } from 'svelte/motion';
  import { quintOut } from 'svelte/easing';

  // Animated value with spring physics
  let progress = $state(0);
  let tweenedProgress = $state(tweened(0, {
    duration: 300,
    easing: quintOut
  }));

  // Spring-animated value (smooth, physics-based)
  let position = $state(spring({ x: 0, y: 0 }, {
    stiffness: 0.1,
    damping: 0.2
  }));

  let visible = $state(false);
  let items = $state([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' }
  ]);
</script>

<!-- Built-in transitions -->
<button onclick={() => visible = !visible}>
  Toggle
</button>

{#if visible}
  <div transition:fade={{ duration: 300 }}>
    Fade in/out
  </div>

  <div transition:blur={{ amount: 10, duration: 300 }}>
    Blur in/out
  </div>

  <div transition:fly={{ y: 50, duration: 300, easing: quintOut }}>
    Fly from bottom
  </div>

  <div transition:slide={{ duration: 300 }}>
    Slide in
  </div>

  <div transition:scale={{ duration: 300, start: 0.5, easing: quintOut }}>
    Scale in
  </div>
{/if}

<!-- Animate reordered lists with flip -->
{#each items as item (item.id)}
  <div animate:flip={{ duration: 300 }}>
    {item.text}
  </div>
{/each}

<!-- Spring-animated progress bar -->
<progress value={$tweenedProgress} max="100" />

<!-- Smooth value interpolation -->
<script>
  async function updateProgress() {
    for (let i = 0; i <= 100; i++) {
      progress = i;
      tweenedProgress.set(i); // Smoothly interpolates
      await sleep(10);
    }
  }
</script>
```

**Built-in Animation Modules:**

- **`svelte/transition`** - Entrance/exit effects
  - `fade` - Opacity transition
  - `blur` - Blur + opacity transition
  - `fly` - Position + opacity transition
  - `slide` - Slide in from edge
  - `scale` - Scale + opacity transition
  - All support `duration`, `delay`, `easing` parameters

- **`svelte/animate`** - List reordering
  - `flip` - Animate elements to new positions in keyed each blocks
  - Perfect for sortable lists, drag-and-drop, reordering

- **`svelte/motion`** - Smooth value transitions
  - `tweened(value, options)` - Tween between values over time
  - `spring(value, options)` - Physics-based spring animations
  - Use with `$state` for reactive animated values

- **`svelte/easing`** - Easing functions
  - `linear`, `quad`, `cubic`, `quart`, `quint`, `sine`, `expo`, `circ`, `back`
  - Each has `In`, `Out`, `InOut` variants (e.g., `quintOut`)

**Why Use Built-in Modules:**

- ✅ **No extra dependencies** - Smaller bundle size
- ✅ **Svelte-optimized** - Designed for Svelte's reactivity
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Performant** - Efficient DOM manipulation
- ✅ **Flexible** - Combine with CSS transitions for custom effects

**When to Use External Libraries:**

- Complex 3D animations (three.js)
- SVG animations (gsap)
- Canvas/WebGL animations
- Specific animation formats (Lottie, Rive)

**Advanced Example: Combining Modules**

```svelte
<script>
	import { fly, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { spring } from 'svelte/motion';

	let cards = $state([
		{ id: 1, title: 'Card 1', color: 'red' },
		{ id: 2, title: 'Card 2', color: 'blue' },
		{ id: 3, title: 'Card 3', color: 'green' }
	]);

	let offset = $state(
		spring(
			{ x: 0, y: 0 },
			{
				stiffness: 0.15,
				damping: 0.1
			}
		)
	);

	function moveUp(index) {
		if (index > 0) {
			const temp = cards[index];
			cards[index] = cards[index - 1];
			cards[index - 1] = temp;
		}
	}
</script>

<div style="transform: translate({$offset.x}px, {$offset.y}px)">
	{#each cards as card (card.id)}
		<div
			class="card"
			animate:flip={{ duration: 400 }}
			transition:fly|scale={{ duration: 300 }}
			style="background: {card.color}"
			role="button"
			tabindex="0"
			onclick={() => moveUp(cards.indexOf(card))}
		>
			{card.title}
		</div>
	{/each}
</div>
```

**Advanced BaseLayout with Slots:**

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';

  interface Props {
    children: any;
    title?: string;
    description?: string;
  }

  let { children, title, description }: Props = $props();
</script>

<svelte:head>
  <title>{title || 'Notizen'}</title>
  {#if description}
    <meta name="description" content={description} />
  {/if}
</svelte:head>

<div class="min-h-screen flex flex-col">
  <header class="border-b">
    <Navbar />
  </header>

  <main class="flex-1">
    {@render children()}
  </main>

  <Footer />
</div>

<!-- Usage in pages -->
<!-- src/routes/about/+page.svelte -->
<script lang="ts">
  // Can pass title/description if needed
</script>

<h1>About</h1>
<p>About content...</p>
```

**7. Always Use `*Icon` Suffix for phosphor-svelte Imports**

The phosphor-svelte library has deprecated old icon names. Always use the new `*Icon` prefixed imports.

```typescript
// ❌ BAD: Old imports (deprecated)
import { House, Newspaper, List, X } from 'phosphor-svelte';

// ✅ GOOD: New imports with Icon suffix
import { HouseIcon, NewspaperIcon, ListIcon, XIcon } from 'phosphor-svelte';
```

**Why This Matters:**

- Old names trigger deprecation warnings
- New names are the future-proof standard
- Same API, just with `Icon` suffix
- Prevents breaking changes in future versions

**Complete Example:**

```svelte
<script lang="ts">
	import { HouseIcon, NewspaperIcon, ListIcon, XIcon, SunIcon, MoonIcon } from 'phosphor-svelte';
	import { setMode } from 'mode-watcher';
</script>

<!-- Usage is identical -->
<HouseIcon size={24} weight="thin" />
<NewspaperIcon size={20} weight="fill" />
<XIcon size={18} weight="regular" />

<!-- Theme toggle example -->
<button onclick={() => setMode('light')}>
	<SunIcon size={20} weight="fill" />
</button>
<button onclick={() => setMode('dark')}>
	<MoonIcon size={20} weight="fill" />
</button>
```

**Migration Guide:**

- `House` → `HouseIcon`
- `Newspaper` → `NewspaperIcon`
- `List` → `ListIcon`
- `X` → `XIcon`
- `Sun` → `SunIcon`
- `Moon` → `MoonIcon`
- `Monitor` → `MonitorIcon`
- `GithubLogo` → `GithubLogoIcon`
- `Envelope` → `EnvelopeIcon`
- `User` → `UserIcon`
- `Settings` → `SettingsIcon`
- `MagnifyingGlass` → `MagnifyingGlassIcon`

All icons follow the same pattern: `{IconName}Icon`

### **Component Structure**

```svelte
<script lang="ts">
	// 1. Imports (avoid importing onMount unless necessary)
	import { Button } from 'bits-ui';
	import { sleep, tick } from 'runed';

	// 2. Types/Interfaces
	interface Props {
		title: string;
		variant?: 'default' | 'primary';
	}

	// 3. Props
	let { title, variant = 'default' }: Props = $props();

	// 4. State
	let count = $state(0);
	let doubled = $derived(count * 2);

	// 5. Functions (avoid $effect for simple operations)
	function increment() {
		count++;
		// Direct logic, not $effect
	}
</script>

<div class="container">
	<h1>{title}</h1>
	<p>Count: {count}</p>
	<Button onclick={increment}>Increment</Button>
</div>
```

### **File Naming**

- Components: `PascalCase.svelte`
- Utilities: `camelCase.ts`
- Types: `types.ts`
- Tests: `*.spec.ts` or `*.test.ts`

### **Import Order**

```typescript
// 1. External dependencies
import { Button } from 'bits-ui';
import { format } from 'date-fns';

// 2. Internal dependencies
import { formatDate } from '$lib/utils/blog';
import { m } from '$lib/paraglide/messages.js';

// 3. Types
import type { BlogPost } from '$lib/types';
```

## 🎨 Color System (Japanese Minimalism)

**Light Mode:**

- Background: `oklch(0.97 0.005 90)` - Warm off-white
- Foreground: `oklch(0.18 0.01 90)` - Soft black
- Primary: `oklch(0.52 0.24 25)` - Rich vermilion red

**Dark Mode (`.dark` class):**

- Background: `oklch(0.12 0.008 90)` - Deep charcoal
- Foreground: `oklch(0.94 0.005 90)` - Off-white
- Primary: `oklch(0.62 0.22 25)` - Bright vermilion

## 🔧 Common Tasks

### **Add a New Route (With BaseLayout Pattern)**

1. **Create page component** - Only page-specific content

```svelte
<!-- src/routes/about/+page.svelte -->
<svelte:head>
	<title>About - Notizen</title>
</svelte:head>

<h1>About</h1>
<p>About content...</p>
```

2. **BaseLayout automatically includes** - Header, navbar, footer

- No need to repeat layout elements
- Pages are clean and focused on content

### **Add API Endpoint**

Create `src/routes/api/users/+server.ts`

### **Add a Component**

Create `src/lib/components/MyComponent.svelte`

### **Add Translation**

1. Add to `messages/en.json`
2. Add to `messages/id.json` and `messages/jp.json`
3. Use with `m.your_key`

### **Create Reusable Layout Components**

```svelte
<!-- src/lib/components/Navbar.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
</script>

<nav class="border-b">
	<a href="/">Home</a>
	<a href="/blog">Blog</a>
	<a href="/about">About</a>
</nav>

<!-- src/lib/components/Footer.svelte -->
<footer class="border-t py-8">
	<p>&copy; 2025 Notizen. All rights reserved.</p>
</footer>
```

## 📚 Key Resources

- [Svelte 5 Docs](https://svelte.dev/docs)
- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [bits-ui Components](https://www.bits-ui.com/)
- [TailwindCSS v4](https://tailwindcss.com/docs)
- [Paraglide i18n](https://inlang.com/docs/paraglide)
- [Vitest Testing](https://vitest.dev/)

## 🛠️ Tool Usage Best Practices

### **File Editing Rules**

**1. Always Use Edit Tool for Code Files**

```typescript
// ✅ GOOD: Use Edit tool for .svelte, .ts, .js, .json files
Edit({
  file_path: "/path/to/file.svelte",
  old_string: "exact match",
  new_string: "replacement"
})

// ❌ BAD: Never use sed -i for code files
sed -i 's/old/new/g' file.svelte  // DANGEROUS!
```

**2. When to Use Edit Tool**

- ✅ All source code files (.svelte, .ts, .js, .tsx, .jsx)
- ✅ Configuration files (.json, .yaml, .toml)
- ✅ Markdown files (.md, .svx)
- ✅ Any file where precision matters

**3. When Bash/sed is Acceptable**

- ✅ Simple operations in logs or temporary files
- ✅ File system operations (mkdir, cp, mv, rm)
- ✅ Package management (pnpm install, npm scripts)
- ✅ One-off commands that don't modify code

**4. Safe File Modification Workflow**

```bash
# ✅ SAFE: Read first, then Edit
1. Read tool - See current file content
2. Edit tool - Make precise changes
3. Verify with pnpm check

# ❌ UNSAFE: sed -i without verification
sed -i 's/foo/bar/g' file.svelte  # Can break files!
```

## ⚡ Performance Tips

1. **Minimize `$effect` usage** - Only use for true reactive side effects
   - ❌ Don't use for logging, simple state updates, or computations
   - ✅ Use event handlers, `$derived`, or `runed` functions instead

2. **Avoid `onMount` when possible** - Use top-level async or reactive patterns
   - ❌ Don't use for simple data fetching or initialization
   - ✅ Use async functions, promises, or `$state()` with async data

3. **Use `runed` library utilities** - More efficient than manual `$effect`
   - `sleep(ms)` - Better than setTimeout in effects
   - `tick()` - Better than $effect for DOM updates
   - `untrack()` - For non-reactive operations

4. **Use $derived for computed values** - Automatic memoization
5. **Lazy load components** - `{#await import()}` in Svelte
6. **Image optimization** - Use `@sveltejs/enhanced-img`
7. **Code splitting** - Dynamic imports for routes
8. **Minimize reactivity** - Use `$state.raw` for static data

9. **Avoid sed -i for file editing** - Use Edit tool instead
   - ❌ Don't use sed -i for code files (dangerous, error-prone)
   - ✅ Use Edit tool for all code modifications (safe, precise)

---

**Last Updated**: 2026-04-15
