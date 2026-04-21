// tests/monitoring.test.js — testes do módulo de monitoramento Sentry
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initSentry } from '../src/features/monitoring/sentry.js';

describe('Monitoring — initSentry', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_SENTRY_DSN', '');
    vi.stubEnv('MODE', 'test');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('não lança erro quando DSN não está definido', () => {
    expect(() => initSentry()).not.toThrow();
  });

  it('não lança erro em ambiente de desenvolvimento (sem PROD=true)', () => {
    expect(() => initSentry()).not.toThrow();
  });

  it('retorna sem inicializar Sentry fora de produção', () => {
    // Em ambiente de teste, import.meta.env.PROD é false — initSentry retorna cedo
    // sem injetar nenhum script no DOM
    initSentry();
    const sentryScript = document.querySelector('script[src*="sentry"]');
    expect(sentryScript).toBeNull();
  });
});
