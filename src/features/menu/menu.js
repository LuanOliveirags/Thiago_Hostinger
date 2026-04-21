// features/menu/menu.js — controle do menu desktop e mobile
import { SELECTORS, CLASSES } from '../../shared/constants.js';
import { query, addClass, removeClass } from '../../shared/dom.js';

export function initMenu() {
  initMenuMobile();
  initMenuDesktop();
}

function initMenuMobile() {
  const menuToggle = query(SELECTORS.menuToggle);
  const navMenu = query(SELECTORS.menuMobile);
  const menuOverlay = query(SELECTORS.menuOverlay);

  if (!menuToggle || !navMenu || !menuOverlay) {
    return;
  }

  const menuLinks = navMenu.querySelectorAll('.menu-items a');

  function openMenu() {
    addClass(navMenu, CLASSES.open);
    addClass(menuToggle, CLASSES.active);
    addClass(menuOverlay, CLASSES.active);
    document.body.style.overflow = 'hidden';
    if (menuLinks.length) {
      menuLinks[0].focus();
    }
    navMenu.style.animation = 'slideInMenu 0.35s cubic-bezier(0.4,0,0.2,1)';
  }

  function closeMenu() {
    navMenu.style.animation = 'slideOutMenu 0.25s cubic-bezier(0.4,0,0.2,1)';
    setTimeout(() => {
      removeClass(navMenu, CLASSES.open);
      removeClass(menuToggle, CLASSES.active);
      removeClass(menuOverlay, CLASSES.active);
      document.body.style.overflow = '';
      navMenu.style.animation = '';
    }, 220);
  }

  menuToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.contains(CLASSES.open);
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menuOverlay.addEventListener('click', closeMenu);

  menuLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (navMenu.classList.contains(CLASSES.open) && e.key === 'Escape') {
      closeMenu();
    }
  });

  navMenu.addEventListener('keydown', function (e) {
    if (!navMenu.classList.contains(CLASSES.open)) {
      return;
    }
    const focusable = Array.from(
      navMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

function initMenuDesktop() {
  const desktopMenu = query(SELECTORS.menuDesktop);
  if (!desktopMenu) {
    return;
  }

  const links = desktopMenu.querySelectorAll('a[href^="#"]');
  links.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const header = query(SELECTORS.header);
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.offsetTop - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  let lastScrollY = window.scrollY;
  let ticking = false;

  function onScrollMenuDesktop() {
    if (!desktopMenu) {
      return;
    }
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      desktopMenu.style.transform = 'translateY(-120%)';
      desktopMenu.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
    } else {
      desktopMenu.style.transform = 'translateY(0)';
      desktopMenu.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
    }
    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScrollMenuDesktop);
      ticking = true;
    }
  });
}
