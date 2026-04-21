// features/header/header.js — efeito de scroll no header

export function initHeader() {
  const header = document.querySelector('.header');
  if (!header) {
    return;
  }

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    header.style.boxShadow =
      scrolled <= 0 ? '0 2px 20px rgba(0, 0, 0, 0.3)' : '0 2px 30px rgba(0, 0, 0, 0.5)';

    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
      heroContent.style.opacity = String(1 - scrolled / 600);
    }
  });
}
