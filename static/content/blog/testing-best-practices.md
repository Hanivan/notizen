---
title: "Testing Best Practices for Modern JavaScript"
description: "Learn essential testing strategies and best practices for writing maintainable, reliable tests for JavaScript applications."
date: "2025-04-14"
category: "Testing"
tags: ["testing", "javascript", "tdd", "best practices", "quality"]
author: "Hanivan Rizky Sobari"
featured: true
image: ""
---

# Testing Best Practices for Modern JavaScript

Writing tests is essential for maintaining code quality and preventing regressions. Let's explore the best practices for testing JavaScript applications.

## Testing Pyramid

Follow the testing pyramid for optimal test coverage:

```
        E2E Tests (few)
       /              \
    Integration Tests (some)
   /                      \
Unit Tests (many)
```

- **Unit Tests**: Test individual functions/components in isolation
- **Integration Tests**: Test how modules work together
- **E2E Tests**: Test the entire application flow

## Unit Testing Best Practices

### 1. Test Behavior, Not Implementation

```javascript
// ❌ BAD: Tests implementation details
test('filterUsers sets the filter state', () => {
  filterUsers('active');
  expect(component.state.filter).toBe('active');
});

// ✅ GOOD: Tests behavior
test('filterUsers only shows active users', () => {
  filterUsers('active');
  expect(screen.getAllByTestId('user-card')).toHaveLength(3);
});
```

### 2. Follow AAA Pattern (Arrange, Act, Assert)

```javascript
test('calculates total price with discount', () => {
  // Arrange
  const cart = new Cart();
  cart.addItem({ price: 100, quantity: 2 });

  // Act
  const total = cart.calculateTotal(10); // 10% discount

  // Assert
  expect(total).toBe(180); // (100 * 2) - 10%
});
```

### 3. Use Descriptive Test Names

```javascript
// ❌ BAD
test('test1', () => {});
test('works', () => {});

// ✅ GOOD
test('should return error when email is invalid', () => {});
test('should apply discount when order total exceeds $100', () => {});
```

### 4. Test Edge Cases

```javascript
describe('calculateDiscount', () => {
  test('should handle zero discount', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
  });

  test('should handle 100% discount', () => {
    expect(calculateDiscount(100, 100)).toBe(0);
  });

  test('should handle negative prices', () => {
    expect(calculateDiscount(-100, 10)).toBe(0);
  });

  test('should handle decimal values', () => {
    expect(calculateDiscount(99.99, 15.5)).toBeCloseTo(84.49);
  });
});
```

## Integration Testing

### Test Component Integration

```javascript
test('form submits with valid data', async () => {
  const mockSubmit = vi.fn();
  render(<LoginForm onSubmit={mockSubmit} />);

  await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
  await userEvent.type(screen.getByLabelText('Password'), 'password123');
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

  expect(mockSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123'
  });
});
```

### Test API Integration

```javascript
test('fetches user data from API', async () => {
  const mockUser = { id: 1, name: 'John' };
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockUser)
    })
  );

  const user = await fetchUser(1);

  expect(user).toEqual(mockUser);
  expect(fetch).toHaveBeenCalledWith('/api/users/1');
});
```

## Test-Driven Development (TDD)

Follow the Red-Green-Refactor cycle:

1. **Red**: Write a failing test
2. **Green**: Write the minimum code to make it pass
3. **Refactor**: Improve the code while keeping tests green

```javascript
// 1. RED - Write failing test
test('adds two numbers', () => {
  expect(add(2, 3)).toBe(5);
});

// 2. GREEN - Make it pass
function add(a, b) {
  return a + b;
}

// 3. REFACTOR - Improve if needed
const add = (a, b) => a + b;
```

## Mocking and Stubbing

### Mock External Dependencies

```javascript
import { vi } from 'vitest';

// Mock API calls
vi.mock('@/lib/api', () => ({
  fetchUsers: vi.fn(() => Promise.resolve(mockUsers))
}));

// Mock timers
vi.useFakeTimers();

test('shows timeout message after 5 seconds', () => {
  render(<LoadingComponent />);

  advanceTimersByTime(5000);

  expect(screen.getByText('Request timeout')).toBeInTheDocument();
});
```

## Continuous Integration

### Automated Testing in CI/CD

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
      - run: npm run test:e2e
      - uses: codecov/codecov-action@v3
```

## Best Practices Summary

1. **Write tests first** (TDD approach)
2. **Keep tests simple** and focused
3. **Test behavior**, not implementation
4. **Use descriptive names** for tests
5. **Cover edge cases** and error scenarios
6. **Mock external dependencies** appropriately
7. **Keep tests fast** - use unit tests for quick feedback
8. **Maintain test independence** - tests should not depend on each other
9. **Review and refactor tests** regularly
10. **Aim for high coverage**, but prioritize quality over quantity

## Conclusion

Good tests are a safety net that gives you confidence to refactor and add features. Follow these practices to build robust, maintainable test suites!
