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
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.4.3",
    "@testing-library/jest-dom": "^5.16.5",
    "vitest": "^0.34.0",
    "@tanstack/react-query": "^4.0.0"
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

## Mock Management

### External Dependencies
```typescript
// Mock API services
vi.mock('../services/api', () => ({
  fetchUserData: vi.fn(),
  submitForm: vi.fn(),
  validateInput: vi.fn(),
}));

// Mock custom hooks
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: '123', name: 'Test User' },
    isAuthenticated: true,
  })),
}));
```

### Mock Lifecycle
```typescript
beforeEach(() => {
  vi.clearAllMocks();
  // Reset global state if needed
});

afterEach(() => {
  vi.restoreAllMocks();
});
```

## Custom Matchers

Extend Jest/Vitest with domain-specific assertions:

```typescript
expect.extend({
  toBeInStep(received: HTMLElement, expectedStep: number) {
    const stepIndicator = within(received).getByTestId('step-indicator');
    const pass = stepIndicator.textContent === `Step ${expectedStep} of 4`;
    
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

## Test Categories

### 1. Initial Render Tests
- Component mounts without errors
- Initial state is correct
- Required elements are present
- Accessibility attributes are set

### 2. User Interaction Tests
- Form inputs work correctly
- Button clicks trigger expected behavior
- Navigation between steps functions
- Keyboard navigation is supported

### 3. State Management Tests
- State updates correctly
- Form data persists across steps
- Validation states are handled
- Error states are managed

### 4. Async Operation Tests
- Loading states are shown
- Success states are handled
- Error scenarios are covered
- API calls are made correctly

### 5. Edge Case Tests
- Empty form handling
- Rapid user interactions
- Network failures
- Invalid data scenarios

### 6. Integration Tests
- Component works with providers
- External API integration
- Route navigation (if applicable)
- Global state management

## Best Practices Checklist

### ✅ Test Structure
- [ ] Tests are organized in logical describe blocks
- [ ] Test names clearly describe expected behavior
- [ ] AAA pattern is followed consistently
- [ ] Setup and teardown are handled properly

### ✅ User Experience
- [ ] Tests focus on user behavior
- [ ] Accessibility is tested
- [ ] Keyboard navigation is verified
- [ ] Screen reader compatibility is checked

### ✅ Reliability
- [ ] Tests are deterministic
- [ ] Async operations are properly awaited
- [ ] Mocks are realistic and consistent
- [ ] Edge cases are covered

### ✅ Maintainability
- [ ] Tests are readable and well-documented
- [ ] Common patterns are extracted to utilities
- [ ] Custom matchers improve clarity
- [ ] Test data is realistic but minimal

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
- [Vitest Documentation](https://vitest.dev/)

---

This guide serves as a foundation for building robust, maintainable UI component tests. Adapt these patterns to fit your specific application needs while maintaining the core principles of user-centric, accessible, and reliable testing.
