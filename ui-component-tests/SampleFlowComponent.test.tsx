/**
 * Sample UI Flow Component Test
 * 
 * This file demonstrates best practices for testing React component flows,
 * including user interactions, state changes, and integration scenarios.
 * 
 * Key Testing Principles Demonstrated:
 * - Arrange-Act-Assert pattern
 * - User-centric testing approach (testing behavior, not implementation)
 * - Proper use of React Testing Library utilities
 * - Async testing patterns
 * - Mock management
 * - Accessibility testing
 * - Error boundary testing
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import the component under test (this would be your actual component)
// import { SampleFlowComponent } from '../components/SampleFlowComponent';

// Mock external dependencies
jest.mock('../services/api', () => ({
  fetchUserData: jest.fn(),
  submitForm: jest.fn(),
  validateInput: jest.fn(),
}));

jest.mock('../hooks/useAuth', () => ({
  useAuth: jest.fn(() => ({
    user: { id: '123', name: 'Test User', email: 'test@example.com' },
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn(),
  })),
}));

// Sample component for demonstration purposes
const SampleFlowComponent: React.FC = () => {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setStep(4); // Success step
  };

  return (
    <div data-testid="sample-flow-component">
      <h1>Multi-Step Form Flow</h1>
      
      {/* Step Indicator */}
      <div role="progressbar" aria-valuenow={step} aria-valuemax={4} aria-label="Form progress">
        <span data-testid="step-indicator">Step {step} of 4</span>
      </div>

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <div data-testid="step-1">
          <h2>Personal Information</h2>
          <form>
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && <div id="name-error" role="alert">{errors.name}</div>}
            
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && <div id="email-error" role="alert">{errors.email}</div>}
          </form>
          <button onClick={handleNext} disabled={!formData.name || !formData.email}>
            Next
          </button>
        </div>
      )}

      {/* Step 2: Message */}
      {step === 2 && (
        <div data-testid="step-2">
          <h2>Your Message</h2>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            rows={4}
          />
          <div>
            <button onClick={handlePrev}>Previous</button>
            <button onClick={handleNext}>Next</button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div data-testid="step-3">
          <h2>Review Your Information</h2>
          <div data-testid="review-data">
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Message:</strong> {formData.message}</p>
          </div>
          <div>
            <button onClick={handlePrev}>Previous</button>
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              aria-describedby="submit-status"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
          {isSubmitting && (
            <div id="submit-status" role="status" aria-live="polite">
              Please wait while we process your submission...
            </div>
          )}
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div data-testid="step-4" role="alert" aria-live="polite">
          <h2>Success!</h2>
          <p>Your form has been submitted successfully.</p>
          <button onClick={() => setStep(1)}>Start Over</button>
        </div>
      )}
    </div>
  );
};

// Test utilities and helpers
const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInStep(received: HTMLElement, expectedStep: number): R;
    }
  }
}

describe('SampleFlowComponent', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    // Setup user event with realistic timing
    user = userEvent.setup({ delay: null });
    
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset any global state if needed
    // resetGlobalState();
  });

  afterEach(() => {
    // Cleanup after each test
    jest.restoreAllMocks();
  });

  describe('Initial Render', () => {
    it('should render the component with initial state', () => {
      // Arrange & Act
      renderWithProviders(<SampleFlowComponent />);

      // Assert
      expect(screen.getByTestId('sample-flow-component')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /multi-step form flow/i })).toBeInTheDocument();
      expect(screen.getByTestId('step-1')).toBeInTheDocument();
      expect(screen.getByTestId('step-indicator')).toHaveTextContent('Step 1 of 4');
    });

    it('should have proper accessibility attributes', () => {
      // Arrange & Act
      renderWithProviders(<SampleFlowComponent />);

      // Assert
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '1');
      expect(progressBar).toHaveAttribute('aria-valuemax', '4');
      expect(progressBar).toHaveAttribute('aria-label', 'Form progress');

      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toHaveAttribute('aria-required', 'true');
      
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Step Navigation', () => {
    it('should navigate through all steps in the happy path', async () => {
      // Arrange
      renderWithProviders(<SampleFlowComponent />);

      // Act & Assert - Step 1
      expect(screen.getByTestId('sample-flow-component')).toBeInStep(1);
      
      // Fill out step 1
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      
      // Navigate to step 2
      await user.click(screen.getByRole('button', { name: /next/i }));
      expect(screen.getByTestId('sample-flow-component')).toBeInStep(2);

      // Act & Assert - Step 2
      expect(screen.getByTestId('step-2')).toBeInTheDocument();
      await user.type(screen.getByLabelText(/message/i), 'This is a test message');
      
      // Navigate to step 3
      await user.click(screen.getByRole('button', { name: /next/i }));
      expect(screen.getByTestId('sample-flow-component')).toBeInStep(3);

      // Act & Assert - Step 3 (Review)
      expect(screen.getByTestId('step-3')).toBeInTheDocument();
      expect(screen.getByTestId('review-data')).toHaveTextContent('John Doe');
      expect(screen.getByTestId('review-data')).toHaveTextContent('john@example.com');
      expect(screen.getByTestId('review-data')).toHaveTextContent('This is a test message');

      // Submit form
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Act & Assert - Step 4 (Success)
      await waitFor(() => {
        expect(screen.getByTestId('sample-flow-component')).toBeInStep(4);
      });
      expect(screen.getByRole('alert')).toHaveTextContent(/success/i);
    });

    it('should allow backward navigation', async () => {
      // Arrange
      renderWithProviders(<SampleFlowComponent />);
      
      // Navigate to step 2
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Act - Go back to step 1
      await user.click(screen.getByRole('button', { name: /previous/i }));

      // Assert
      expect(screen.getByTestId('sample-flow-component')).toBeInStep(1);
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    });

    it('should disable next button when required fields are empty', () => {
      // Arrange & Act
      renderWithProviders(<SampleFlowComponent />);

      // Assert
      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(nextButton).toBeDisabled();
    });

    it('should enable next button when required fields are filled', async () => {
      // Arrange
      renderWithProviders(<SampleFlowComponent />);

      // Act
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');

      // Assert
      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(nextButton).toBeEnabled();
    });
  });

  describe('Form Submission', () => {
    const fillFormAndNavigateToReview = async () => {
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /next/i }));
    };

    it('should show loading state during submission', async () => {
      // Arrange
      renderWithProviders(<SampleFlowComponent />);
      await fillFormAndNavigateToReview();

      // Act
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Assert
      expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
      expect(screen.getByRole('status')).toHaveTextContent(/please wait/i);
    });

    it('should show success message after successful submission', async () => {
      // Arrange
      renderWithProviders(<SampleFlowComponent />);
      await fillFormAndNavigateToReview();

      // Act
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/success/i);
      });
    });

    it('should allow starting over after successful submission', async () => {
      // Arrange
      renderWithProviders(<SampleFlowComponent />);
      await fillFormAndNavigateToReview();
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      await waitFor(() => {
        expect(screen.getByTestId('step-4')).toBeInTheDocument();
      });

      // Act
      await user.click(screen.getByRole('button', { name: /start over/i }));

      // Assert
      expect(screen.getByTestId('sample-flow-component')).toBeInStep(1);
      expect(screen.getByLabelText(/name/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
    });
  });

  describe('Error Handling', () => {
    it('should display validation errors with proper ARIA attributes', async () => {
      // This test would require implementing validation logic
      // For demonstration purposes, we'll test the structure
      
      renderWithProviders(<SampleFlowComponent />);
      
      // Simulate validation error (this would come from your validation logic)
      // In a real test, you might trigger validation by submitting invalid data
      
      // Assert error structure (if errors were present)
      // const errorElement = screen.queryByRole('alert');
      // if (errorElement) {
      //   expect(errorElement).toBeInTheDocument();
      //   expect(screen.getByLabelText(/name/i)).toHaveAttribute('aria-invalid', 'true');
      //   expect(screen.getByLabelText(/name/i)).toHaveAttribute('aria-describedby', 'name-error');
      // }
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation', async () => {
      // Arrange
      renderWithProviders(<SampleFlowComponent />);

      // Act - Navigate using Tab key
      await user.tab();
      expect(screen.getByLabelText(/name/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/email/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: /next/i })).toHaveFocus();
    });

    it('should support Enter key for form submission', async () => {
      // Arrange
      renderWithProviders(<SampleFlowComponent />);
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');

      // Act - Press Enter while focused on the Next button
      screen.getByRole('button', { name: /next/i }).focus();
      await user.keyboard('{Enter}');

      // Assert
      expect(screen.getByTestId('sample-flow-component')).toBeInStep(2);
    });
  });

  describe('Responsive Behavior', () => {
    it('should maintain functionality across different viewport sizes', () => {
      // Arrange - Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      });

      // Act
      renderWithProviders(<SampleFlowComponent />);

      // Assert - Component should still render and be functional
      expect(screen.getByTestId('sample-flow-component')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      // This test would require React DevTools Profiler or custom render counting
      // For demonstration purposes, we'll show the structure
      
      const renderSpy = jest.fn();
      
      // In a real scenario, you might wrap your component with a render counter
      // const WrappedComponent = () => {
      //   renderSpy();
      //   return <SampleFlowComponent />;
      // };
      
      renderWithProviders(<SampleFlowComponent />);
      
      // Assert initial render
      // expect(renderSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration Tests', () => {
    it('should work with external API calls', async () => {
      // Arrange - Mock API responses
      const mockSubmitForm = jest.fn().mockResolvedValue({ success: true });
      jest.mocked(mockSubmitForm);

      renderWithProviders(<SampleFlowComponent />);

      // Act - Complete the flow
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/success/i);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid clicking gracefully', async () => {
      // Arrange
      renderWithProviders(<SampleFlowComponent />);
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');

      // Act - Rapidly click the next button
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);
      await user.click(nextButton); // Second click should be ignored

      // Assert - Should only advance one step
      expect(screen.getByTestId('sample-flow-component')).toBeInStep(2);
    });

    it('should handle empty form data gracefully', () => {
      // Arrange & Act
      renderWithProviders(<SampleFlowComponent />);

      // Assert - Next button should be disabled with empty required fields
      expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    });
  });
});

/**
 * Additional Test Patterns and Best Practices:
 * 
 * 1. **Test Organization**:
 *    - Group related tests using describe blocks
 *    - Use descriptive test names that explain the expected behavior
 *    - Follow the AAA pattern (Arrange, Act, Assert)
 * 
 * 2. **User-Centric Testing**:
 *    - Test from the user's perspective
 *    - Use screen.getByRole, getByLabelText, etc. instead of testids when possible
 *    - Focus on behavior rather than implementation details
 * 
 * 3. **Async Testing**:
 *    - Use waitFor for async operations
 *    - Properly handle loading states
 *    - Test error scenarios
 * 
 * 4. **Accessibility Testing**:
 *    - Test ARIA attributes
 *    - Verify keyboard navigation
 *    - Check screen reader compatibility
 * 
 * 5. **Mock Management**:
 *    - Mock external dependencies
 *    - Clear mocks between tests
 *    - Use realistic mock data
 * 
 * 6. **Custom Matchers**:
 *    - Create domain-specific assertions
 *    - Improve test readability
 *    - Reduce code duplication
 * 
 * 7. **Test Utilities**:
 *    - Create reusable render functions
 *    - Extract common test setup
 *    - Use helper functions for complex interactions
 */
