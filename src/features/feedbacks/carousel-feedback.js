// features/feedbacks/carousel-feedback.js — carrossel de feedbacks de alunas

import { trackCarouselInteraction } from '../analytics/analytics.js';

const feedbackPrints = [
  'img/F_1.PNG',
  'img/F_2.PNG',
  'img/F_3.jpeg',
  'img/F_4.PNG',
  'img/F_5.PNG',
  'img/F_6.PNG',
  'img/F_7.PNG',
  'img/F_8.PNG',
  'img/F_9.PNG',
  'img/F_10.jpeg',
  'img/F_11.PNG',
  'img/F_12.PNG',
  'img/F_13.PNG',
  'img/F_14.PNG',
];

export function initCarouselFeedback() {
  initFeedbackGallery();
}

function initFeedbackGallery() {
  const deck = document.getElementById('feedbackDeck');
  const prevBtn = document.getElementById('feedbackPrev');
  const nextBtn = document.getElementById('feedbackNext');
  const modal = document.getElementById('feedback-modal');
  const modalImg = document.getElementById('feedback-modal-img');
  const modalClose = document.getElementById('feedback-modal-close');

  if (!deck || !prevBtn || !nextBtn) {
    return;
  }

  const progressContainer = document.createElement('div');
  progressContainer.className = 'feedback-progress-container';
  progressContainer.innerHTML = `
    <div class="feedback-progress-bar">
      <div class="feedback-progress-fill" id="feedbackProgressFill"></div>
    </div>
    <div class="feedback-progress-dots" id="feedbackProgressDots"></div>
  `;
  document.querySelector('#feedbacks .container').appendChild(progressContainer);

  const progressFill = document.getElementById('feedbackProgressFill');
  const progressDots = document.getElementById('feedbackProgressDots');

  feedbackPrints.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'feedback-progress-dot';
    if (index === 0) {
      dot.classList.add('active');
    }
    dot.addEventListener('click', () => goToIndex(index));
    progressDots.appendChild(dot);
  });

  let currentIndex = 0;
  let autoSlide = null;
  const total = feedbackPrints.length;
  const normalize = (index) => (index + total) % total;

  const createCardMarkup = (src, altText) => {
    const article = document.createElement('article');
    article.className = 'feedback-card active';
    article.innerHTML = `
      <div class="feedback-card__image">
        <img src="${src}" alt="${altText}" loading="lazy">
      </div>
    `;
    return article;
  };

  const renderDeck = () => {
    deck.style.opacity = '0';
    setTimeout(() => {
      deck.innerHTML = '';
      const card = createCardMarkup(
        feedbackPrints[currentIndex],
        `Print de feedback ${currentIndex + 1}`
      );
      deck.appendChild(card);
      updateProgress();
      setTimeout(() => {
        deck.style.opacity = '1';
      }, 50);
    }, 300);
  };

  const updateProgress = () => {
    const percentage = ((currentIndex + 1) / total) * 100;
    if (progressFill) {
      progressFill.style.width = percentage + '%';
    }
    const dots = progressDots.querySelectorAll('.feedback-progress-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  };

  const goToIndex = (index) => {
    currentIndex = normalize(index);
    renderDeck();
    restartAutoSlide();
  };

  const showPrev = () => {
    trackCarouselInteraction('prev');
    goToIndex(currentIndex - 1);
  };
  const showNext = () => {
    trackCarouselInteraction('next');
    goToIndex(currentIndex + 1);
  };

  const restartAutoSlide = () => {
    if (autoSlide) {
      clearInterval(autoSlide);
    }
    autoSlide = setInterval(showNext, 4000);
  };

  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  deck.addEventListener('click', (event) => {
    const img = event.target.closest('.feedback-card__image img');
    if (!img) {
      return;
    }
    openFeedbackModal(img.getAttribute('src'));
  });

  const openFeedbackModal = (src) => {
    if (!modal || !modalImg) {
      return;
    }
    modalImg.src = src;
    modal.style.display = 'flex';
    modal.style.opacity = '0';
    requestAnimationFrame(() => {
      modal.style.opacity = '1';
    });
  };

  const closeModal = () => {
    if (!modal) {
      return;
    }
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = 'none';
      if (modalImg) {
        modalImg.src = '';
      }
    }, 250);
  };

  if (modal && modalClose) {
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
      }
    });
  }

  deck.style.transition = 'opacity 0.3s ease';
  renderDeck();
  restartAutoSlide();
}
