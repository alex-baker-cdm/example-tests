// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
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
