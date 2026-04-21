// features/faq/faq.js — accordion de perguntas frequentes

import { trackFAQInteraction } from '../analytics/analytics.js';

export function initFaq() {
  const faqCards = document.querySelectorAll('[data-faq]');

  faqCards.forEach((card) => {
    const question = card.querySelector('.faq-question');
    const answer = card.querySelector('.faq-answer');
    if (!question || !answer) {
      return;
    }

    question.addEventListener('click', () => {
      const isActive = card.classList.contains('active');

      faqCards.forEach((otherCard) => {
        if (otherCard !== card) {
          otherCard.classList.remove('active');
          const otherAnswer = otherCard.querySelector('.faq-answer');
          if (otherAnswer) {
            otherAnswer.style.display = 'none';
          }
        }
      });

      if (isActive) {
        card.classList.remove('active');
        answer.style.display = 'none';
      } else {
        card.classList.add('active');
        answer.style.display = 'block';
        const questionText = question.querySelector('h3')?.textContent?.trim() ?? '';
        trackFAQInteraction(questionText);
      }
    });
  });
}
