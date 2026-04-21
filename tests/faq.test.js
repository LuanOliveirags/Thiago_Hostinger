// tests/faq.test.js — testes do accordion FAQ
import { describe, it, expect, beforeEach } from 'vitest';
import { initFaq } from '../src/features/faq/faq.js';

function buildFaqDOM() {
  document.body.innerHTML = `
    <div class="faq-card" data-faq>
      <div class="faq-question"><h3>Pago todo mês?</h3></div>
      <div class="faq-answer" style="display: none;"><p>Não.</p></div>
    </div>
    <div class="faq-card" data-faq>
      <div class="faq-question"><h3>Recebo o treino em quanto tempo?</h3></div>
      <div class="faq-answer" style="display: none;"><p>Em até 4 dias.</p></div>
    </div>
  `;
}

describe('FAQ Accordion', () => {
  beforeEach(() => {
    buildFaqDOM();
    initFaq();
  });

  it('abre a resposta ao clicar na pergunta', () => {
    const question = document.querySelector('.faq-question');
    const answer = document.querySelector('.faq-answer');

    question.click();

    expect(answer.style.display).toBe('block');
    expect(document.querySelector('.faq-card').classList.contains('active')).toBe(true);
  });

  it('fecha a resposta ao clicar novamente na mesma pergunta', () => {
    const question = document.querySelector('.faq-question');
    const answer = document.querySelector('.faq-answer');

    question.click(); // abre
    question.click(); // fecha

    expect(answer.style.display).toBe('none');
    expect(document.querySelector('.faq-card').classList.contains('active')).toBe(false);
  });

  it('fecha o card anterior ao abrir um novo', () => {
    const questions = document.querySelectorAll('.faq-question');
    const answers = document.querySelectorAll('.faq-answer');

    questions[0].click(); // abre primeiro
    questions[1].click(); // abre segundo, primeiro deve fechar

    expect(answers[0].style.display).toBe('none');
    expect(answers[1].style.display).toBe('block');
  });
});
