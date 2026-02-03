// Carrossel simples para feedbacks
const feedbackImages = [
  'img/F_1.PNG', 'img/F_2.PNG', 'img/F_3.jpeg', 'img/F_4.PNG', 'img/F_5.PNG',
  'img/F_6.PNG', 'img/F_7.PNG', 'img/F_8.PNG', 'img/F_9.PNG', 'img/F_10.jpeg',
  'img/F_11.PNG', 'img/F_12.PNG', 'img/F_13.PNG', 'img/F_14.PNG'
];

function updateDots() {
  const dotsContainer = document.getElementById('carousel-feedback-dots');
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  feedbackImages.forEach((_, idx) => {
    const dot = document.createElement('span');
    if (idx === currentIndex) dot.classList.add('active');
    dot.addEventListener('click', () => {
      currentIndex = idx;
      showFeedback(currentIndex);
      updateDots();
      startAutoCarousel();
    });
    dotsContainer.appendChild(dot);
  });
}

let autoInterval = null;

let currentIndex = 0;

function showFeedback(index) {
  const img = document.getElementById('carousel-feedback-img');
  img.classList.remove('fade-in');
  img.classList.add('fade-out');
  setTimeout(() => {
    img.src = feedbackImages[index];
    img.alt = `Feedback real ${index + 1}`;
    img.classList.remove('fade-out');
    img.classList.add('fade-in');
    updateDots();
  }, 200);
}

function nextFeedback() {
  currentIndex = (currentIndex + 1) % feedbackImages.length;
  showFeedback(currentIndex);
}

function prevFeedback() {
  currentIndex = (currentIndex - 1 + feedbackImages.length) % feedbackImages.length;
  showFeedback(currentIndex);
}

function startAutoCarousel() {
  if (autoInterval) clearInterval(autoInterval);
  autoInterval = setInterval(nextFeedback, 3500); // Troca a cada 3,5s
}

document.addEventListener('DOMContentLoaded', function() {
  showFeedback(currentIndex);
  startAutoCarousel();

  // Swipe para mobile
  const imgContainer = document.getElementById('carousel-feedback-img-container');
  let startX = null;
  imgContainer.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
      startX = e.touches[0].clientX;
    }
  });
  imgContainer.addEventListener('touchend', function(e) {
    if (startX !== null && e.changedTouches.length === 1) {
      const endX = e.changedTouches[0].clientX;
      const deltaX = endX - startX;
      if (Math.abs(deltaX) > 40) {
        if (deltaX < 0) {
          nextFeedback();
        } else {
          prevFeedback();
        }
        startAutoCarousel();
      }
      startX = null;
    }
  });

  // Expansão da imagem em modal
  const feedbackImg = document.getElementById('carousel-feedback-img');
  const modal = document.getElementById('feedback-modal');
  const modalImg = document.getElementById('feedback-modal-img');
  const modalClose = document.getElementById('feedback-modal-close');

  feedbackImg.addEventListener('click', function() {
    modalImg.src = feedbackImages[currentIndex];
    modal.style.display = 'flex';
  });
  modalClose.addEventListener('click', function() {
    modal.style.display = 'none';
  });
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Swipe no modal expandido
  let modalStartX = null;
  modalImg.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
      modalStartX = e.touches[0].clientX;
    }
  });
  modalImg.addEventListener('touchend', function(e) {
    if (modalStartX !== null && e.changedTouches.length === 1) {
      const modalEndX = e.changedTouches[0].clientX;
      const modalDeltaX = modalEndX - modalStartX;
      if (Math.abs(modalDeltaX) > 40) {
        if (modalDeltaX < 0) {
          // Próxima imagem
          currentIndex = (currentIndex + 1) % feedbackImages.length;
        } else {
          // Imagem anterior
          currentIndex = (currentIndex - 1 + feedbackImages.length) % feedbackImages.length;
        }
        modalImg.src = feedbackImages[currentIndex];
      }
      modalStartX = null;
    }
  });

  // Modal para resultados incríveis
  const resultImgs = document.querySelectorAll('.result-img');
  const resultModal = document.getElementById('result-modal');
  const resultModalImg = document.getElementById('result-modal-img');
  const resultModalClose = document.getElementById('result-modal-close');
  let resultCurrentIndex = 0;
  const resultImagesArr = [
    'img/IMG_1.jpeg','img/IMG_2.jpeg','img/IMG_3.jpeg','img/IMG_4.jpeg','img/IMG_5.PNG',
    'img/IMG_6.jpeg','img/IMG_7.jpeg','img/IMG_8.jpeg','img/IMG_9.jpeg','img/IMG_10.jpeg',
    'img/IMG_11.jpeg','img/IMG_12.jpeg','img/IMG_13.jpeg','img/IMG_14.jpeg','img/IMG_15.jpeg'
  ];

  function showResultModalImg(idx) {
    resultModalImg.style.opacity = '0';
    setTimeout(() => {
      resultModalImg.src = resultImagesArr[idx];
      resultModalImg.style.transition = 'opacity 0.5s';
      resultModalImg.style.opacity = '1';
    }, 200);
  }
  resultImgs.forEach((img, idx) => {
    img.addEventListener('click', function() {
      resultCurrentIndex = idx;
      showResultModalImg(resultCurrentIndex);
      resultModal.style.display = 'flex';
    });
  });
  resultModalClose.addEventListener('click', function() {
    resultModal.style.display = 'none';
  });
  resultModal.addEventListener('click', function(e) {
    if (e.target === resultModal) {
      resultModal.style.display = 'none';
    }
  });

  // Swipe no modal dos resultados
  let resultModalStartX = null;
  resultModalImg.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
      resultModalStartX = e.touches[0].clientX;
    }
  });
  resultModalImg.addEventListener('touchend', function(e) {
    if (resultModalStartX !== null && e.changedTouches.length === 1) {
      const resultModalEndX = e.changedTouches[0].clientX;
      const resultModalDeltaX = resultModalEndX - resultModalStartX;
      if (Math.abs(resultModalDeltaX) > 40) {
        if (resultModalDeltaX < 0) {
          // Próxima imagem
          resultCurrentIndex = (resultCurrentIndex + 1) % resultImagesArr.length;
        } else {
          // Imagem anterior
          resultCurrentIndex = (resultCurrentIndex - 1 + resultImagesArr.length) % resultImagesArr.length;
        }
        showResultModalImg(resultCurrentIndex);
      }
      resultModalStartX = null;
    }
  });
});
