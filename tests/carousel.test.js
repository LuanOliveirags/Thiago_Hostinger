// tests/carousel.test.js — testes do carrossel de feedbacks
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { initCarouselFeedback } from '../src/features/feedbacks/carousel-feedback.js';

function buildCarouselDOM() {
  document.body.innerHTML = `
    <section id="feedbacks">
      <div class="container">
        <div id="feedbackOrbit">
          <button id="feedbackPrev" type="button">&larr;</button>
          <div id="feedbackDeck" aria-live="polite"></div>
          <button id="feedbackNext" type="button">&rarr;</button>
        </div>
        <div id="feedback-modal" style="display:none;">
          <span id="feedback-modal-close">&times;</span>
          <img id="feedback-modal-img" src="" alt="">
        </div>
      </div>
    </section>
  `;
}

// renderDeck() usa setTimeout(300ms) antes de inserir o card + setTimeout(50ms) para opacity.
// Avançamos 400ms por operação — suficiente para ambos os timeouts, sem atingir o setInterval(4000ms).
const RENDER_DELAY = 400;

describe('Carrossel de Feedbacks', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    buildCarouselDOM();
    initCarouselFeedback();
    vi.advanceTimersByTime(RENDER_DELAY);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renderiza o primeiro card de feedback ao inicializar', () => {
    const deck = document.getElementById('feedbackDeck');
    expect(deck.querySelector('.feedback-card')).not.toBeNull();
    expect(deck.querySelector('img')).not.toBeNull();
  });

  it('avança para o próximo feedback ao clicar em "próximo"', () => {
    const nextBtn = document.getElementById('feedbackNext');
    const deck = document.getElementById('feedbackDeck');

    const firstSrc = deck.querySelector('img')?.getAttribute('src');
    nextBtn.click();
    vi.advanceTimersByTime(RENDER_DELAY);

    const secondSrc = deck.querySelector('img')?.getAttribute('src');
    expect(secondSrc).not.toBe(firstSrc);
  });

  it('volta para o feedback anterior ao clicar em "anterior"', () => {
    const nextBtn = document.getElementById('feedbackNext');
    const prevBtn = document.getElementById('feedbackPrev');
    const deck = document.getElementById('feedbackDeck');

    const initialSrc = deck.querySelector('img')?.getAttribute('src');

    nextBtn.click();
    vi.advanceTimersByTime(RENDER_DELAY);
    prevBtn.click();
    vi.advanceTimersByTime(RENDER_DELAY);

    const finalSrc = deck.querySelector('img')?.getAttribute('src');
    expect(finalSrc).toBe(initialSrc);
  });

  it('cria os dots de progresso corretamente', () => {
    const dots = document.querySelectorAll('.feedback-progress-dot');
    expect(dots.length).toBe(14); // 14 feedbackPrints
  });
});
