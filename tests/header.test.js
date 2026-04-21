// tests/header.test.js — testes do módulo de header
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initHeader } from '../src/features/header/header.js';

function buildDOM() {
  document.body.innerHTML = `
    <header class="header"></header>
    <div class="hero-content"></div>
  `;
}

describe('Header', () => {
  beforeEach(() => {
    buildDOM();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('aplica shadow leve quando não há scroll (pageYOffset = 0)', () => {
    initHeader();
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    const header = document.querySelector('.header');
    expect(header.style.boxShadow).toBe('none');
  });

  it('aplica shadow intenso ao rolar a página', () => {
    initHeader();
    Object.defineProperty(window, 'pageYOffset', {
      value: 200,
      writable: true,
      configurable: true,
    });
    window.dispatchEvent(new Event('scroll'));
    const header = document.querySelector('.header');
    expect(header.style.boxShadow).toBe('0 2px 24px rgba(0,0,0,0.55)');
  });

  it('aplica parallax ao hero-content durante scroll', () => {
    initHeader();
    Object.defineProperty(window, 'pageYOffset', {
      value: 100,
      writable: true,
      configurable: true,
    });
    window.dispatchEvent(new Event('scroll'));
    const heroContent = document.querySelector('.hero-content');
    expect(heroContent.style.transform).toBe('translateY(50px)');
  });

  it('não lança erro quando .header não existe no DOM', () => {
    document.body.innerHTML = '';
    expect(() => initHeader()).not.toThrow();
  });

  it('não lança erro quando .hero-content não existe no DOM', () => {
    document.body.innerHTML = '<header class="header"></header>';
    initHeader();
    Object.defineProperty(window, 'pageYOffset', {
      value: 50,
      writable: true,
      configurable: true,
    });
    expect(() => window.dispatchEvent(new Event('scroll'))).not.toThrow();
  });
});
