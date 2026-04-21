// features/header/header.js — efeito de scroll + scroll spy no menu desktop

export function initHeader() {
  initScrollEffect();
  initScrollSpy();
}

function initScrollEffect() {
  const header = document.querySelector('.header');
  if (!header) {
    return;
  }

  const THRESHOLD = 60;

  const update = () => {
    const scrolled = window.pageYOffset;

    if (scrolled > THRESHOLD) {
      header.style.background = 'rgba(5, 2, 8, 0.92)';
      header.style.backdropFilter = 'blur(12px)';
      header.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
      header.style.boxShadow = '0 2px 24px rgba(0,0,0,0.55)';
    } else {
      header.style.background = 'transparent';
      header.style.backdropFilter = 'none';
      header.style.borderBottom = 'none';
      header.style.boxShadow = 'none';
    }

    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
      heroContent.style.opacity = String(1 - scrolled / 600);
    }
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initScrollSpy() {
  const desktopMenu = document.getElementById('navMenuDesktop');
  if (!desktopMenu) {
    return;
  }

  const links = Array.from(desktopMenu.querySelectorAll('a[href^="#"]'));
  if (!links.length) {
    return;
  }

  const sectionIds = links.map((a) => a.getAttribute('href').slice(1));
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  if (!sections.length) {
    return;
  }

  const header = document.querySelector('.header');

  function getActiveIndex() {
    const headerH = header ? header.offsetHeight : 0;
    const offset = headerH + 16;
    // percorre de baixo para cima — o último que passou o threshold é o ativo
    for (let i = sections.length - 1; i >= 0; i--) {
      if (sections[i].getBoundingClientRect().top <= offset) {
        return i;
      }
    }
    return 0;
  }

  function setActive(index) {
    links.forEach((a, i) => {
      const isActive = i === index;
      a.classList.toggle('nav-active', isActive);
      if (isActive) {
        a.setAttribute('aria-current', 'page');
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setActive(getActiveIndex());
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  // força estado inicial após render
  requestAnimationFrame(() => setActive(getActiveIndex()));
}
