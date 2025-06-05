# UI Component Testing Guide

This directory contains comprehensive examples and guidelines for testing React UI components with a focus on user flows and best practices.

## Overview

The `SampleFlowComponent.test.tsx` file demonstrates a complete testing approach for a multi-step form component, showcasing various testing patterns and best practices that should be applied to all UI component tests.

## Testing Philosophy

### User-Centric Testing
- **Test behavior, not implementation**: Focus on what the user experiences rather than internal component details
- **Use semantic queries**: Prefer `getByRole`, `getByLabelText`, `getByText` over `getByTestId`
- **Test accessibility**: Ensure components work for all users, including those using assistive technologies

### Test Structure
All tests follow the **AAA Pattern**:
- **Arrange**: Set up the test environment and data
- **Act**: Perform the action being tested
- **Assert**: Verify the expected outcome

## Key Testing Patterns Demonstrated

### 1. Component Rendering and Initial State
```typescript
it('should render the component with initial state', () => {
  // Arrange & Act
  renderWithProviders(<SampleFlowComponent />);

  // Assert
  expect(screen.getByTestId('sample-flow-component')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /multi-step form flow/i })).toBeInTheDocument();
});
```

### 2. User Interactions
```typescript
it('should navigate through all steps in the happy path', async () => {
  renderWithProviders(<SampleFlowComponent />);
  
  // Fill out form
  await user.type(screen.getByLabelText(/name/i), 'John Doe');
  await user.type(screen.getByLabelText(/email/i), 'john@example.com');
  
  // Navigate
  await user.click(screen.getByRole('button', { name: /next/i }));
  
  // Verify state change
  expect(screen.getByTestId('sample-flow-component')).toBeInStep(2);
});
```

### 3. Async Operations and Loading States
```typescript
it('should show loading state during submission', async () => {
  // Setup
  renderWithProviders(<SampleFlowComponent />);
  await fillFormAndNavigateToReview();

  // Trigger async operation
  await user.click(screen.getByRole('button', { name: /submit/i }));

  // Verify loading state
  expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
  expect(screen.getByRole('status')).toHaveTextContent(/please wait/i);
});
```

### 4. Accessibility Testing
```typescript
it('should have proper accessibility attributes', () => {
  renderWithProviders(<SampleFlowComponent />);

  const progressBar = screen.getByRole('progressbar');
  expect(progressBar).toHaveAttribute('aria-valuenow', '1');
  expect(progressBar).toHaveAttribute('aria-valuemax', '4');
  
  const nameInput = screen.getByLabelText(/name/i);
  expect(nameInput).toHaveAttribute('aria-required', 'true');
});
```

## Testing Tools and Setup

### Required Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "@tanstack/react-query": "^4.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.4.3",
    "@testing-library/jest-dom": "^5.16.5",
    "@types/jest": "^27.5.2"
  }
}
```

### Test Environment Setup
```typescript
// Setup user event with realistic timing
user = userEvent.setup({ delay: null });

// Create test query client
const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
};

// Render with providers
const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};
```

### Jest Configuration
Create a `setupTests.ts` file in your src directory:

```typescript
// setupTests.ts
import '@testing-library/jest-dom';

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInStep(expectedStep: number): R;
    }
  }
}

// Add custom matcher
expect.extend({
  toBeInStep(received: HTMLElement, expectedStep: number) {
    const stepIndicator = received.querySelector('[data-testid="step-indicator"]');
    const pass = stepIndicator?.textContent === `Step ${expectedStep} of 4`;
    
    return {
      message: () => 
        pass 
          ? `Expected component not to be in step ${expectedStep}`
          : `Expected component to be in step ${expectedStep}, but was in ${stepIndicator?.textContent}`,
      pass,
    };
  },
});
```

## Mock Management

### External Dependencies
```typescript
// Mock API services
jest.mock('../services/api', () => ({
  fetchUserData: jest.fn(),
  submitForm: jest.fn(),
  validateInput: jest.fn(),
}));

// Mock custom hooks
jest.mock('../hooks/useAuth', () => ({
  useAuth: jest.fn(() => ({
    user: { id: '123', name: 'Test User' },
    isAuthenticated: true,
  })),
}));
```

### Mock Lifecycle
```typescript
beforeEach(() => {
  jest.clearAllMocks();
  // Reset global state if needed
});

afterEach(() => {
  jest.restoreAllMocks();
});
```

## Custom Matchers

Extend Jest with domain-specific assertions:

```typescript
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInStep(expectedStep: number): R;
    }
  }
}

expect.extend({
  toBeInStep(received: HTMLElement, expectedStep: number) {
    const stepIndicator = received.querySelector('[data-testid="step-indicator"]');
    const pass = stepIndicator?.textContent === `Step ${expectedStep} of 4`;
    
    return {
      message: () => 
        pass 
          ? `Expected component not to be in step ${expectedStep}`
          : `Expected component to be in step ${expectedStep}`,
      pass,
    };
  },
});
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test SampleFlowComponent.test.tsx

# Run tests in CI mode
CI=true npm test
```

## Debugging Tests

### Using Debug Utilities
```typescript
import { screen } from '@testing-library/react';

// Debug current DOM state
screen.debug();

// Debug specific element
screen.debug(screen.getByRole('button'));

// Log queries that were attempted
screen.logTestingPlaygroundURL();
```

### Common Debugging Commands
```typescript
// Find all elements by role
screen.getAllByRole('button').forEach(button => 
  console.log(button.textContent)
);

// Check what's currently rendered
console.log(container.innerHTML);

// Wait for element and debug
await waitFor(() => {
  screen.debug(screen.getByTestId('async-content'));
});
```

### Jest Debugging
```bash
# Run tests with Node debugger
node --inspect-brk node_modules/.bin/react-scripts test --runInBand --no-cache

# Run single test file in debug mode
npm test -- --testNamePattern="should render" --no-coverage --watchAll=false
```

## React Scripts Configuration

### Package.json Scripts
```json
{
  "scripts": {
    "test": "react-scripts test",
    "test:coverage": "react-scripts test --coverage --watchAll=false",
    "test:ci": "CI=true react-scripts test --coverage --watchAll=false"
  }
}
```

### Jest Configuration in package.json
```json
{
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.d.ts",
      "!src/index.tsx",
      "!src/reportWebVitals.ts"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## Common Pitfalls to Avoid

### ❌ Testing Implementation Details
```typescript
// Bad - testing internal state
expect(component.state.currentStep).toBe(2);

// Good - testing user-visible behavior
expect(screen.getByTestId('step-2')).toBeInTheDocument();
```

### ❌ Overly Complex Test Setup
```typescript
// Bad - complex setup that's hard to understand
const setupComplexScenario = () => {
  // 50 lines of setup code
};

// Good - simple, focused setup
const fillFormAndNavigateToReview = async () => {
  await user.type(screen.getByLabelText(/name/i), 'John Doe');
  await user.click(screen.getByRole('button', { name: /next/i }));
};
```

### ❌ Not Testing Error States
```typescript
// Bad - only testing happy path
it('should submit form successfully', async () => {
  // Only test success scenario
});

// Good - test both success and failure
it('should handle submission errors gracefully', async () => {
  // Mock API to return error
  // Test error handling
});
```

### ❌ Not Cleaning Up Mocks
```typescript
// Bad - mocks persist between tests
jest.mock('../api');

// Good - clean up mocks
beforeEach(() => {
  jest.clearAllMocks();
});
```

## Future Enhancements

Consider adding these patterns as your testing suite grows:

1. **Visual Regression Testing**: Use tools like Chromatic or Percy
2. **Performance Testing**: Monitor render times and re-render counts
3. **Cross-browser Testing**: Ensure compatibility across different browsers
4. **Mobile Testing**: Test responsive behavior and touch interactions
5. **Internationalization Testing**: Verify components work with different locales

## Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Accessibility Testing Guide](https://web.dev/accessibility-testing/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Scripts Testing](https://create-react-app.dev/docs/running-tests/)

---

This guide serves as a foundation for building robust, maintainable UI component tests using Jest and React Testing Library with react-scripts. Adapt these patterns to fit your specific application needs while maintaining the core principles of user-centric, accessible, and reliable testing.
