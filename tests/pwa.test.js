// tests/pwa.test.js — testes do módulo de registro da PWA
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initPWA } from '../src/features/pwa/pwa.js';

describe('PWA', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('não lança erro quando serviceWorker não é suportado no browser', () => {
    const original = navigator.serviceWorker;
    Object.defineProperty(navigator, 'serviceWorker', {
      value: undefined,
      configurable: true,
    });

    expect(() => initPWA()).not.toThrow();

    Object.defineProperty(navigator, 'serviceWorker', {
      value: original,
      configurable: true,
    });
  });

  it('registra o service worker em /sw.js ao disparar o evento load', () => {
    const registerMock = vi.fn().mockResolvedValue({});
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { register: registerMock },
      configurable: true,
    });

    initPWA();
    window.dispatchEvent(new Event('load'));

    expect(registerMock).toHaveBeenCalledWith('/sw.js');
  });

  it('silencia erros de registro sem lançar exceção', () => {
    const registerMock = vi.fn().mockRejectedValue(new Error('HTTPS required'));
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { register: registerMock },
      configurable: true,
    });

    initPWA();
    expect(() => window.dispatchEvent(new Event('load'))).not.toThrow();
  });
});
