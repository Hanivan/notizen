---
title: "Getting Started with SvelteKit: A Developer's Journey"
description: "Learn the fundamentals of SvelteKit and how to build modern web applications with this powerful framework."
date: "2024-01-15"
category: "Web Development"
tags: ["SvelteKit", "JavaScript", "Frontend"]
author: "Hanivan Rizky S"
featured: true
image: "/images/blog/sveltekit-hero.jpg"
---

# Getting Started with SvelteKit: A Developer's Journey

SvelteKit is a powerful framework that brings the simplicity of Svelte to full-stack web development. In this post, we'll explore why SvelteKit has become my go-to choice for modern web applications.

## Why Choose SvelteKit?

SvelteKit offers several compelling advantages:

- **Performance**: No virtual DOM overhead
- **Developer Experience**: Excellent tooling and hot reloading
- **Full-Stack**: Built-in SSR, API routes, and deployment adapters
- **Minimal Bundle Size**: Svelte compiles to vanilla JavaScript

## Creating Your First SvelteKit Project

Let's start with the basics. Here's how to create a new SvelteKit project:

```bash
# Create a new SvelteKit project
npm create svelte@latest my-app
cd my-app
npm install
npm run dev
```

## Building a Simple Component

Here's a basic Svelte component that demonstrates reactivity:

```svelte
<script>
  let count = 0;
  let name = 'world';

  function increment() {
    count += 1;
  }

  // Reactive statement
  $: doubled = count * 2;
</script>

<main>
  <h1>Hello {name}!</h1>
  <p>Count: {count}</p>
  <p>Doubled: {doubled}</p>
  
  <button on:click={increment}>
    Increment
  </button>
</main>

<style>
  main {
    padding: 1rem;
    text-align: center;
  }
  
  button {
    background: #ff3e00;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
  }
</style>
```

## TypeScript Support

SvelteKit has excellent TypeScript support out of the box:

```typescript
// src/app.d.ts
declare global {
  namespace App {
    interface Locals {
      user?: {
        id: string;
        name: string;
      };
    }
    
    interface PageData {
      user?: App.Locals['user'];
    }
  }
}

export {};
```

## API Routes

Creating API endpoints is straightforward:

```javascript
// src/routes/api/posts/+page.server.js
import { json } from '@sveltejs/kit';

export async function GET() {
  const posts = await fetchPosts();
  
  return json({
    posts,
    total: posts.length
  });
}

export async function POST({ request }) {
  const data = await request.json();
  const newPost = await createPost(data);
  
  return json(newPost, { status: 201 });
}
```

## Load Functions

SvelteKit's load functions enable efficient data fetching:

```javascript
// src/routes/blog/+page.server.js
export async function load({ fetch, url }) {
  const page = Number(url.searchParams.get('page')) || 1;
  const limit = 10;
  
  const response = await fetch(`/api/posts?page=${page}&limit=${limit}`);
  const { posts, total } = await response.json();
  
  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      hasMore: page * limit < total
    }
  };
}
```

## Styling with Modern CSS

SvelteKit works great with modern CSS features:

```css
/* Component styles with CSS custom properties */
.card {
  background: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  padding: 1.5rem;
  
  /* Modern CSS features */
  container-type: inline-size;
  
  @container (min-width: 400px) {
    padding: 2rem;
  }
}

.dark {
  --background: 222.2 84% 4.9%;
  --border: 217.2 32.6% 17.5%;
}
```

## Deployment

Deploying SvelteKit is simple with various adapters:

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';

export default {
  kit: {
    adapter: adapter({
      runtime: 'nodejs18.x'
    })
  }
};
```

## Conclusion

SvelteKit combines the best of modern web development practices with an exceptional developer experience. Its approach to reactivity, built-in optimizations, and full-stack capabilities make it an excellent choice for projects of any size.

The framework continues to evolve rapidly, with active community support and regular updates. Whether you're building a simple blog or a complex web application, SvelteKit provides the tools and flexibility you need.

Happy coding! 🚀 