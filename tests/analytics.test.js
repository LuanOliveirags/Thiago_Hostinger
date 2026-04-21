// tests/analytics.test.js — testes do módulo de analytics
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  trackEvent,
  trackCTAClick,
  trackModalOpen,
  trackFAQInteraction,
  trackCarouselInteraction,
  initScrollDepthTracking,
  initCTATracking,
  initFunnelTracking,
  initAbandonTracking,
} from '../src/features/analytics/analytics.js';

describe('Analytics — trackEvent', () => {
  afterEach(() => {
    delete window.gtag;
    vi.restoreAllMocks();
  });

  it('chama window.gtag com os parâmetros corretos', () => {
    window.gtag = vi.fn();
    trackEvent('test_event', { foo: 'bar' });
    expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', { foo: 'bar' });
  });

  it('não lança erro quando window.gtag não está disponível', () => {
    expect(() => trackEvent('test_event', { foo: 'bar' })).not.toThrow();
  });

  it('não chama gtag sem parâmetros extras quando omitidos', () => {
    window.gtag = vi.fn();
    trackEvent('simple_event');
    expect(window.gtag).toHaveBeenCalledWith('event', 'simple_event', {});
  });
});

describe('Analytics — helpers de evento', () => {
  beforeEach(() => {
    window.gtag = vi.fn();
  });

  afterEach(() => {
    delete window.gtag;
  });

  it('trackCTAClick envia evento cta_click com nome do plano', () => {
    trackCTAClick('Plano Gold');
    expect(window.gtag).toHaveBeenCalledWith('event', 'cta_click', {
      event_category: 'CTA',
      plan_name: 'Plano Gold',
    });
  });

  it('trackModalOpen envia evento modal_open com índice 1-based', () => {
    trackModalOpen(0);
    expect(window.gtag).toHaveBeenCalledWith('event', 'modal_open', {
      event_category: 'Resultados',
      image_index: 1,
    });
  });

  it('trackFAQInteraction envia evento faq_expand com texto da pergunta', () => {
    trackFAQInteraction('Pago todo mês?');
    expect(window.gtag).toHaveBeenCalledWith('event', 'faq_expand', {
      event_category: 'FAQ',
      question: 'Pago todo mês?',
    });
  });

  it('trackCarouselInteraction envia evento carousel_navigate com direção', () => {
    trackCarouselInteraction('next');
    expect(window.gtag).toHaveBeenCalledWith('event', 'carousel_navigate', {
      event_category: 'Feedbacks',
      direction: 'next',
    });
  });
});

describe('Analytics — initScrollDepthTracking', () => {
  beforeEach(() => {
    window.gtag = vi.fn();
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 5000,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    delete window.gtag;
    vi.restoreAllMocks();
  });

  it('dispara evento scroll_depth ao atingir 25% de scroll', () => {
    initScrollDepthTracking();
    Object.defineProperty(window, 'scrollY', { value: 1050, writable: true, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(window.gtag).toHaveBeenCalledWith(
      'event',
      'scroll_depth',
      expect.objectContaining({ depth_pct: 25 })
    );
  });

  it('não envia evento duplicado para o mesmo marco', () => {
    initScrollDepthTracking();
    Object.defineProperty(window, 'scrollY', { value: 1050, writable: true, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
    const calls = window.gtag.mock.calls.filter(
      (c) => c[1] === 'scroll_depth' && c[2].depth_pct === 25
    );
    expect(calls.length).toBe(1);
  });
});

describe('Analytics — initCTATracking', () => {
  beforeEach(() => {
    window.gtag = vi.fn();
    document.body.innerHTML = `
      <div class="plan-card">
        <h3>Plano Gold</h3>
        <a class="plan-button" href="#">Contratar agora</a>
      </div>
    `;
  });

  afterEach(() => {
    delete window.gtag;
  });

  it('rastreia clique no botão CTA com o nome do plano correto', () => {
    initCTATracking();
    document.querySelector('.plan-button').click();
    expect(window.gtag).toHaveBeenCalledWith('event', 'cta_click', {
      event_category: 'CTA',
      plan_name: 'Plano Gold',
    });
  });
});

describe('Analytics — initFunnelTracking', () => {
  beforeEach(() => {
    window.gtag = vi.fn();
    document.body.innerHTML = `
      <section id="para-quem-e"></section>
      <section id="planos"></section>
      <section id="resultados"></section>
    `;
  });

  afterEach(() => {
    delete window.gtag;
  });

  it('não lança erro quando as seções do funil existem', () => {
    expect(() => initFunnelTracking()).not.toThrow();
  });

  it('não lança erro quando seções do funil estão ausentes', () => {
    document.body.innerHTML = '';
    expect(() => initFunnelTracking()).not.toThrow();
  });
});

describe('Analytics — initAbandonTracking', () => {
  beforeEach(() => {
    window.gtag = vi.fn();
    document.body.innerHTML = `<section id="planos"></section>`;
  });

  afterEach(() => {
    delete window.gtag;
  });

  it('não lança erro ao inicializar', () => {
    expect(() => initAbandonTracking()).not.toThrow();
  });

  it('envia evento de abandono ao sair sem ver os planos', () => {
    initAbandonTracking();
    // Simula visibilityState = 'hidden' direto na propriedade do window
    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
      configurable: true,
    });
    window.dispatchEvent(new Event('visibilitychange'));
    expect(window.gtag).toHaveBeenCalledWith(
      'event',
      'page_abandon_before_plans',
      expect.objectContaining({ event_category: 'Abandono' })
    );
  });
});
