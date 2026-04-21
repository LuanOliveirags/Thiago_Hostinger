// tests/modal.test.js — testes do modal de imagens dos resultados
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { initModalImage } from '../src/features/resultados/modal-image.js';

function buildModalDOM() {
  document.body.innerHTML = `
    <section id="resultados">
      <div class="portfolio-grid">
        <div class="portfolio-item">
          <img src="img/IMG_1.jpeg" alt="Transformação 1">
        </div>
        <div class="portfolio-item">
          <img src="img/IMG_2.jpeg" alt="Transformação 2">
        </div>
        <div class="portfolio-item">
          <img src="img/IMG_3.jpeg" alt="Transformação 3">
        </div>
      </div>
    </section>
    <div id="modal-imagem" style="display:none;">
      <span id="fechar-modal-imagem">&times;</span>
      <button id="seta-esquerda-modal">&#8592;</button>
      <img id="imagem-modal-grande" src="" alt="">
      <button id="seta-direita-modal">&#8594;</button>
    </div>
  `;
}

describe('Modal de Imagens', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    buildModalDOM();
    initModalImage();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('abre o modal ao clicar em uma imagem de resultado', () => {
    const firstItem = document.querySelector('.portfolio-item');
    const modal = document.getElementById('modal-imagem');

    firstItem.click();

    expect(modal.style.display).toBe('flex');
  });

  it('exibe a imagem correta no modal', () => {
    const secondItem = document.querySelectorAll('.portfolio-item')[1];
    const imgModal = document.getElementById('imagem-modal-grande');

    secondItem.click();

    expect(imgModal.alt).toBe('Transformação 2');
  });

  it('fecha o modal ao clicar no botão fechar', () => {
    const firstItem = document.querySelector('.portfolio-item');
    const fechar = document.getElementById('fechar-modal-imagem');
    const modal = document.getElementById('modal-imagem');

    firstItem.click();
    fechar.click();
    vi.runAllTimers();

    expect(modal.style.display).toBe('none');
  });

  it('navega para a próxima imagem ao clicar na seta direita', () => {
    const firstItem = document.querySelector('.portfolio-item');
    const setaDireita = document.getElementById('seta-direita-modal');
    const imgModal = document.getElementById('imagem-modal-grande');

    firstItem.click(); // abre com img 0
    setaDireita.click(); // avança para img 1

    expect(imgModal.alt).toBe('Transformação 2');
  });

  it('fecha o modal ao pressionar Escape', () => {
    const firstItem = document.querySelector('.portfolio-item');
    const modal = document.getElementById('modal-imagem');

    firstItem.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    vi.runAllTimers();

    expect(modal.style.display).toBe('none');
  });
});
