---
title: "Modern CSS Techniques You Should Know"
description: "Explore powerful CSS features and techniques that will take your styling to the next level."
date: "2025-04-01"
category: "CSS"
tags: ["css", "styling", "modern", "frontend"]
author: "Hanivan Rizky Sobari"
featured: false
image: ""
---

# Modern CSS Techniques

CSS has evolved significantly over the years. Here are some modern techniques you should be using.

## CSS Grid Layout

Grid is a powerful 2D layout system:

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
```

## CSS Custom Properties

Variables make your CSS more maintainable:

```css
:root {
  --primary-color: oklch(0.52 0.24 25);
  --spacing-unit: 1rem;
  --border-radius: 0.5rem;
}

.button {
  background: var(--primary-color);
  padding: var(--spacing-unit);
  border-radius: var(--border-radius);
}
```

## Container Queries

Style elements based on their container's size:

```css
@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

## CSS Cascade Layers

Control specificity and precedence:

```css
@layer reset, base, components;

@layer reset {
  * { margin: 0; padding: 0; }
}

@layer components {
  .button { /* styles */ }
}
```

## Modern Color Functions

Use OKLCH for better color control:

```css
.button {
  background-color: oklch(0.52 0.24 25);
  color: oklch(0.99 0.002 90);
}
```

## Conclusion

These modern CSS techniques will help you write more maintainable and powerful styles. Start incorporating them into your projects today!
