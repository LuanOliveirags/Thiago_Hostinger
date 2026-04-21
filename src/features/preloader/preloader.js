// features/preloader/preloader.js — controle do preloader

export function initPreloader() {
  window.addEventListener('load', () => {
    const loader = document.getElementById('preloader');
    if (!loader) {
      return;
    }
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }, 1500);
  });
}
