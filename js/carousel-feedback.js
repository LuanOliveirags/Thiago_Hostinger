const feedbackPrints = [
  'img/F_1.PNG', 'img/F_2.PNG', 'img/F_3.jpeg', 'img/F_4.PNG', 'img/F_5.PNG',
  'img/F_6.PNG', 'img/F_7.PNG', 'img/F_8.PNG', 'img/F_9.PNG', 'img/F_10.jpeg',
  'img/F_11.PNG', 'img/F_12.PNG', 'img/F_13.PNG', 'img/F_14.PNG'
];

document.addEventListener('DOMContentLoaded', initFeedbackGallery);

function initFeedbackGallery() {
  const deck = document.getElementById('feedbackDeck');
  const prevBtn = document.getElementById('feedbackPrev');
  const nextBtn = document.getElementById('feedbackNext');
  const modal = document.getElementById('feedback-modal');
  const modalImg = document.getElementById('feedback-modal-img');
  const modalClose = document.getElementById('feedback-modal-close');

  if (!deck || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  let autoSlide = null;
  let startPointerX = null;

  const total = feedbackPrints.length;

  const normalize = (index) => (index + total) % total;

  const createCardMarkup = (src, position, altText) => {
    const article = document.createElement('article');
    article.className = 'feedback-card';
    if (position === 0) article.classList.add('active');
    if (position === -1) article.classList.add('prev');
    if (position === 1) article.classList.add('next');
    article.innerHTML = `
      <div class="feedback-card__image">
        <img src="${src}" alt="${altText}" loading="lazy">
      </div>
    `;
    return article;
  };

  const renderDeck = () => {
    deck.innerHTML = '';
    const positions = total === 1 ? [0] : total === 2 ? [-1, 0] : [-1, 0, 1];
    positions.forEach((offset) => {
      const normalizedIndex = normalize(currentIndex + offset);
      const card = createCardMarkup(
        feedbackPrints[normalizedIndex],
        offset,
        `Print de feedback ${normalizedIndex + 1}`
      );
      deck.appendChild(card);
    });
  };

  const goToIndex = (index) => {
    currentIndex = normalize(index);
    renderDeck();
    restartAutoSlide();
  };

  const showPrev = () => goToIndex(currentIndex - 1);
  const showNext = () => goToIndex(currentIndex + 1);

  const restartAutoSlide = () => {
    if (autoSlide) clearInterval(autoSlide);
    autoSlide = setInterval(showNext, 5000);
  };

  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  deck.addEventListener('pointerdown', (event) => {
    startPointerX = event.clientX;
  });

  deck.addEventListener('pointerup', (event) => {
    if (startPointerX === null) return;
    const delta = event.clientX - startPointerX;
    if (Math.abs(delta) > 60) {
      delta < 0 ? showNext() : showPrev();
    }
    startPointerX = null;
  });

  deck.addEventListener('pointerleave', () => {
    startPointerX = null;
  });

  deck.addEventListener('click', (event) => {
    const img = event.target.closest('.feedback-card__image img');
    if (!img) return;
    openFeedbackModal(img.getAttribute('src'));
  });

  const openFeedbackModal = (src) => {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modal.style.display = 'flex';
    modal.style.opacity = '0';
    requestAnimationFrame(() => {
      modal.style.opacity = '1';
    });
  };

  const closeModal = () => {
    if (!modal) return;
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = 'none';
      if (modalImg) modalImg.src = '';
    }, 250);
  };

  if (modal && modalClose) {
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
      }
    });
  }

  renderDeck();
  restartAutoSlide();
}
