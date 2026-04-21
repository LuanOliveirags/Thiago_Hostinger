// tests/menu.test.js — testes do menu mobile
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { initMenu } from '../src/features/menu/menu.js';

function buildMenuDOM() {
  document.body.innerHTML = `
    <div class="header">
      <nav>
        <button id="menuToggle" aria-expanded="false">
          <span class="bar"></span>
        </button>
        <div id="navMenuMobile">
          <ul class="menu-items">
            <li><a href="#inicio">Início</a></li>
            <li><a href="#sobre">Sobre</a></li>
          </ul>
        </div>
        <div id="menuOverlay"></div>
        <div id="navMenuDesktop">
          <ul class="menu-items">
            <li><a href="#inicio">Início</a></li>
          </ul>
        </div>
      </nav>
    </div>
  `;
}

describe('Menu Mobile', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    buildMenuDOM();
    initMenu();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('abre o menu ao clicar no botão toggle', () => {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenuMobile');
    const overlay = document.getElementById('menuOverlay');

    toggle.click();

    expect(menu.classList.contains('open')).toBe(true);
    expect(overlay.classList.contains('active')).toBe(true);
    expect(toggle.classList.contains('active')).toBe(true);
  });

  it('fecha o menu ao clicar no overlay', () => {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenuMobile');
    const overlay = document.getElementById('menuOverlay');

    toggle.click(); // abre
    overlay.click(); // fecha (closeMenu tem setTimeout de 220ms)
    vi.runAllTimers();

    expect(menu.classList.contains('open')).toBe(false);
    expect(overlay.classList.contains('active')).toBe(false);
  });

  it('fecha o menu ao pressionar Escape', () => {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenuMobile');

    toggle.click(); // abre
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    vi.runAllTimers();

    expect(menu.classList.contains('open')).toBe(false);
  });
});
