---
title: "TypeScript Best Practices for Modern Development"
description: "Essential TypeScript patterns and practices that will make your code more maintainable, type-safe, and robust."
date: "2024-01-10"
category: "Programming"
tags: ["TypeScript", "Best Practices", "Development"]
author: "Hanivan Rizky S"
featured: false
image: "/images/blog/typescript-hero.jpg"
---

# TypeScript Best Practices for Modern Development

TypeScript has revolutionized JavaScript development by adding static type checking and modern language features. Here are the essential practices I've learned from years of TypeScript development.

## 1. Use Strict Type Checking

Enable strict mode in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

## 2. Prefer Type Assertions Over Any

Instead of using `any`, use proper type assertions:

```typescript
// ❌ Avoid
const user = data as any;

// ✅ Better
interface User {
  id: string;
  name: string;
  email: string;
}

const user = data as User;

// ✅ Even better with type guards
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as User).id === 'string' &&
    typeof (obj as User).name === 'string' &&
    typeof (obj as User).email === 'string'
  );
}

if (isUser(data)) {
  // data is now typed as User
  console.log(data.name);
}
```

## 3. Use Utility Types Effectively

TypeScript provides powerful utility types:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Pick specific properties
type PublicUser = Pick<User, 'id' | 'name' | 'email'>;

// Omit sensitive data
type SafeUser = Omit<User, 'password'>;

// Make properties optional
type UserUpdate = Partial<Pick<User, 'name' | 'email'>>;

// Make properties required
type RequiredUser = Required<User>;
```

## 4. Generic Constraints for Better APIs

Use generic constraints to create flexible yet type-safe APIs:

```typescript
// Generic constraint
interface Identifiable {
  id: string;
}

function updateEntity<T extends Identifiable>(
  entity: T,
  updates: Partial<Omit<T, 'id'>>
): T {
  return { ...entity, ...updates };
}

// Usage
const user = { id: '1', name: 'John', email: 'john@example.com' };
const updatedUser = updateEntity(user, { name: 'Jane' });
```

## 5. Discriminated Unions for Type Safety

Use discriminated unions for handling different states:

```typescript
type LoadingState = {
  status: 'loading';
};

type SuccessState = {
  status: 'success';
  data: User[];
};

type ErrorState = {
  status: 'error';
  error: string;
};

type ApiState = LoadingState | SuccessState | ErrorState;

function handleApiState(state: ApiState) {
  switch (state.status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return `Loaded ${state.data.length} users`;
    case 'error':
      return `Error: ${state.error}`;
    default:
      // TypeScript ensures all cases are handled
      const _exhaustive: never = state;
      return _exhaustive;
  }
}
```

## 6. Advanced Type Patterns

### Conditional Types

```typescript
type ApiResponse<T> = T extends string
  ? { message: T }
  : T extends number
  ? { count: T }
  : { data: T };

type StringResponse = ApiResponse<string>; // { message: string }
type NumberResponse = ApiResponse<number>; // { count: number }
type UserResponse = ApiResponse<User>; // { data: User }
```

### Mapped Types

```typescript
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type UserWithOptionalEmail = Optional<User, 'email'>;
// Same as: { id: string; name: string; password: string; createdAt: Date; email?: string }
```

## 7. Type-Safe Environment Variables

```typescript
// env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      JWT_SECRET: string;
      PORT?: string;
    }
  }
}

export {};

// config.ts
const config = {
  database: {
    url: process.env.DATABASE_URL, // TypeScript knows this exists
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
  },
  server: {
    port: Number(process.env.PORT) || 3000,
  },
} as const;
```

## 8. Error Handling with Result Types

```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: string): Promise<Result<User, string>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return { success: false, error: 'User not found' };
    }
    const user = await response.json();
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

// Usage
const result = await fetchUser('123');
if (result.success) {
  console.log(result.data.name); // TypeScript knows data exists
} else {
  console.error(result.error); // TypeScript knows error exists
}
```

## 9. Builder Pattern with TypeScript

```typescript
class QueryBuilder<T> {
  private conditions: string[] = [];
  private selectFields: string[] = ['*'];
  private limitCount?: number;

  select<K extends keyof T>(fields: K[]): QueryBuilder<Pick<T, K>> {
    this.selectFields = fields as string[];
    return this as any;
  }

  where(condition: string): QueryBuilder<T> {
    this.conditions.push(condition);
    return this;
  }

  limit(count: number): QueryBuilder<T> {
    this.limitCount = count;
    return this;
  }

  build(): string {
    let query = `SELECT ${this.selectFields.join(', ')} FROM table`;
    
    if (this.conditions.length > 0) {
      query += ` WHERE ${this.conditions.join(' AND ')}`;
    }
    
    if (this.limitCount) {
      query += ` LIMIT ${this.limitCount}`;
    }
    
    return query;
  }
}

// Usage
const query = new QueryBuilder<User>()
  .select(['name', 'email'])
  .where('active = true')
  .limit(10)
  .build();
```

## 10. Testing with TypeScript

```typescript
// Use branded types for testing
type UserId = string & { readonly brand: unique symbol };
type Email = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function createEmail(email: string): Email {
  if (!email.includes('@')) {
    throw new Error('Invalid email');
  }
  return email as Email;
}

// Mock types for testing
type MockedFunction<T extends (...args: any[]) => any> = jest.MockedFunction<T>;

interface UserService {
  findById(id: UserId): Promise<User | null>;
  create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User>;
}

const mockUserService: jest.Mocked<UserService> = {
  findById: jest.fn(),
  create: jest.fn(),
};
```

## Conclusion

These TypeScript patterns have helped me write more maintainable and robust applications. The key is to leverage TypeScript's type system to catch errors at compile time and provide better developer experience.

Remember: TypeScript is about gradual adoption. Start with basic typing and gradually introduce more advanced patterns as your team becomes comfortable with the language.

The investment in proper TypeScript usage pays dividends in reduced bugs, better refactoring capabilities, and improved team productivity.

---

*What TypeScript patterns have you found most valuable? Share your experiences in the comments below!* 