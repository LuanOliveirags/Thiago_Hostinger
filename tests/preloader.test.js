// tests/preloader.test.js — testes do preloader
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { initPreloader } from '../src/features/preloader/preloader.js';

function buildPreloaderDOM() {
  document.body.innerHTML = `
    <div id="preloader" style="opacity: 1; display: block;">
      <div class="preloader-title">Thiago Bazillio</div>
    </div>
  `;
}

describe('Preloader', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    buildPreloaderDOM();
    initPreloader();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('define opacity 0 após o load + 1500ms', () => {
    const loader = document.getElementById('preloader');

    window.dispatchEvent(new Event('load'));
    vi.advanceTimersByTime(1500);

    expect(loader.style.opacity).toBe('0');
  });

  it('oculta o preloader após fade-out completo (1500 + 500ms)', () => {
    const loader = document.getElementById('preloader');

    window.dispatchEvent(new Event('load'));
    vi.advanceTimersByTime(2000); // 1500 + 500

    expect(loader.style.display).toBe('none');
  });
});
