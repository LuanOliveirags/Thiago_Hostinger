// tests/setup.js — configurações globais para todos os testes
import { beforeAll, vi } from 'vitest';

beforeAll(() => {
  // Mock de window.matchMedia (não suportado no jsdom)
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
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

  // Mock de IntersectionObserver (não suportado no jsdom)
  global.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Mock de requestAnimationFrame
  global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
});
