---
title: "Advanced TypeScript Utility Types"
description: "Master TypeScript's built-in utility types to write more robust and maintainable type-safe code."
date: "2025-04-12"
category: "TypeScript"
tags: ["typescript", "types", "utilities", "advanced"]
author: "Hanivan Rizky Sobari"
featured: true
image: ""
---

# Advanced TypeScript Utility Types

TypeScript's utility types provide powerful ways to transform and manipulate types. Understanding them will make your code more type-safe and maintainable.

## Built-in Utility Types

### Partial<T>

Makes all properties of T optional:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function updateUser(id: number, fields: Partial<User>) {
  // fields.id, fields.name, and fields.email are all optional
  return { id, ...fields };
}

updateUser(1, { name: 'John' }); // ✅ Valid
```

### Required<T>

Makes all properties of T required:

```typescript
interface Product {
  id: number;
  name?: string;
  price?: number;
}

const completeProduct: Required<Product> = {
  id: 1,
  name: 'Laptop',
  price: 999
};
```

### Readonly<T>

Makes all properties of T readonly:

```typescript
interface Config {
  apiUrl: string;
  timeout: number;
}

const config: Readonly<Config> = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

// config.apiUrl = 'new-url'; // ❌ Error: Cannot assign to 'apiUrl'
```

### Record<Keys, Type>

Constructs an object type with keys of type Keys and values of type Type:

```typescript
type PageInfo = Record<string, { title: string; url: string }>;

const pages: PageInfo = {
  home: { title: 'Home', url: '/' },
  about: { title: 'About', url: '/about' },
  contact: { title: 'Contact', url: '/contact' }
};
```

### Pick<T, Keys>

Creates a type by picking specific properties from T:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type UserPublic = Pick<User, 'id' | 'name' | 'email'>;

const publicUser: UserPublic = {
  id: 1,
  name: 'John',
  email: 'john@example.com'
};
```

### Omit<T, Keys>

Creates a type by omitting specific properties from T:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type UserSafe = Omit<User, 'password'>;

const safeUser: UserSafe = {
  id: 1,
  name: 'John',
  email: 'john@example.com'
};
```

## Advanced Patterns

### Conditional Types

Create types that depend on other types:

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type Response = NonNullable<string | null>; // string
```

### Template Literal Types

Create string types from patterns:

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`;

type ButtonEvents = EventName<'click' | 'hover'>; // 'onClick' | 'onHover'
```

### Mapped Types with Modifiers

Transform properties of an existing type:

```typescript
type ReadonlyOptional<T> = {
  readonly [P in keyof T]?: T[P];
};

interface Config {
  debug: boolean;
  logLevel: string;
}

const config: ReadonlyOptional<Config> = {
  debug: true
};
```

## Practical Examples

### API Response Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// List response
type UserListResponse = User[];

// Detail response
type UserDetailResponse = User;

// Create request
type UserCreateRequest = Omit<User, 'id'>;

// Update request
type UserUpdateRequest = Partial<UserCreateRequest>;
```

### Form State Types

```typescript
interface FormData {
  username: string;
  email: string;
  age: number;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

type FormState = {
  data: FormData;
  errors: FormErrors;
  touched: Partial<Record<keyof FormData, boolean>>;
};
```

## Conclusion

TypeScript's utility types are powerful tools for creating flexible, type-safe code. Master them to write more maintainable and robust applications!
