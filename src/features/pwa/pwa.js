// features/pwa/pwa.js — registro do Service Worker

export function initPWA() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Silencia erros esperados em HTTP puro (dev sem HTTPS)
      // O SW só é ativado em HTTPS ou localhost
    });
  });
}
