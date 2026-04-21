// features/resultados/modal-image.js — modal de imagens dos resultados

import { trackModalOpen } from '../analytics/analytics.js';

export function initModalImage() {
  const modal = document.getElementById('modal-imagem');
  const imgModal = document.getElementById('imagem-modal-grande');
  const fechar = document.getElementById('fechar-modal-imagem');
  const setaEsquerda = document.getElementById('seta-esquerda-modal');
  const setaDireita = document.getElementById('seta-direita-modal');

  if (!modal || !imgModal || !fechar || !setaEsquerda || !setaDireita) {
    return;
  }

  const portfolioItems = Array.from(document.querySelectorAll('.portfolio-item'));
  const todasImagens = portfolioItems
    .map((item) => {
      const img = item.querySelector('img');
      return img ? { src: img.src, alt: img.alt } : null;
    })
    .filter(Boolean);

  let imagemAtual = 0;

  function mostrarImagemModal(idx) {
    if (idx < 0) {
      idx = todasImagens.length - 1;
    }
    if (idx >= todasImagens.length) {
      idx = 0;
    }
    imagemAtual = idx;
    imgModal.src = todasImagens[imagemAtual].src;
    imgModal.alt = todasImagens[imagemAtual].alt;
  }

  portfolioItems.forEach((item, idx) => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', function () {
      const img = this.querySelector('img');
      if (!img) {
        return;
      }
      imagemAtual = idx;
      mostrarImagemModal(imagemAtual);
      modal.style.display = 'flex';
      modal.style.opacity = '0';
      setTimeout(() => {
        modal.style.opacity = '1';
      }, 10);
      trackModalOpen(idx);
    });
  });

  function fecharModal() {
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = 'none';
      imgModal.src = '';
    }, 300);
  }

  fechar.addEventListener('click', fecharModal);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      fecharModal();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (modal.style.display === 'flex') {
      if (e.key === 'Escape') {
        fecharModal();
      } else if (e.key === 'ArrowLeft') {
        mostrarImagemModal(imagemAtual - 1);
      } else if (e.key === 'ArrowRight') {
        mostrarImagemModal(imagemAtual + 1);
      }
    }
  });

  setaEsquerda.addEventListener('click', function (e) {
    e.stopPropagation();
    mostrarImagemModal(imagemAtual - 1);
  });

  setaDireita.addEventListener('click', function (e) {
    e.stopPropagation();
    mostrarImagemModal(imagemAtual + 1);
  });

  let touchStartX = 0;
  let isSwiping = false;

  modal.addEventListener(
    'touchstart',
    function (e) {
      if (e.touches.length !== 1) {
        return;
      }
      touchStartX = e.touches[0].clientX;
      isSwiping = true;
    },
    { passive: true }
  );

  modal.addEventListener(
    'touchmove',
    function (e) {
      if (!isSwiping || e.touches.length !== 1) {
        return;
      }
      const deltaX = e.touches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 60) {
        mostrarImagemModal(deltaX > 0 ? imagemAtual - 1 : imagemAtual + 1);
        isSwiping = false;
      }
    },
    { passive: true }
  );

  modal.addEventListener('touchend', function () {
    isSwiping = false;
  });
}
