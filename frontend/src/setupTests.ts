// @testing-library/jest-dom の拡張アサーションを有効化
import '@testing-library/jest-dom';

// Mock for window.matchMedia used in use-mobile hook
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
