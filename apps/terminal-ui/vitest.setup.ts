import '@testing-library/jest-dom/vitest';

// Mock ResizeObserver for flexlayout-react
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
