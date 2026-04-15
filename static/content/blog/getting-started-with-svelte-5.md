---
title: "Getting Started with Svelte 5 and Runes"
description: "A comprehensive guide to understanding and using Svelte 5's new runes system for reactive state management."
date: "2025-04-10"
category: "Svelte"
tags: ["svelte", "javascript", "frontend", "tutorial"]
author: "Your Name"
featured: true
image: ""
---

# Introduction to Svelte 5 Runes

Svelte 5 introduces a new way of handling reactivity called **runes**. Runes are reactive primitives that give you fine-grained control over your application's state.

## What are Runes?

Runes are compiler-generated functions that tell Svelte which values should be reactive. They're literally symbols (like `$state`, `$derived`, `$effect`) that signal reactivity to the compiler.

## Core Runes

### `$state`

The `$state` rune creates a reactive piece of state:

```svelte
<script>
  let count = $state(0);
  
  function increment() {
    count += 1;
  }
</script>

<button onclick={increment}>
  Count: {count}
</button>
```

### `$derived`

Create computed values with `$derived`:

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>

<p>Count: {count}, Doubled: {doubled}</p>
```

### `$effect`

Run side effects with `$effect`:

```svelte
<script>
  let count = $state(0);
  
  $effect(() => {
    console.log('Count changed:', count);
  });
</script>
```

## Why Runes?

Runes offer several advantages:

1. **Explicit reactivity** - You can see at a glance what's reactive
2. **Better TypeScript support** - Fully type-safe reactive patterns
3. **More flexible** - Use reactivity outside components
4. **Performance** - Fine-grained reactivity improves performance

## Conclusion

Svelte 5's runes provide a powerful and intuitive way to handle reactivity. Start using them in your projects today!
