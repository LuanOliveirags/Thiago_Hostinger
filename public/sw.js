// sw.js — Service Worker da PWA Thiago Bazillio
// Estratégia: cache-first para assets estáticos, network-first para HTML

const CACHE_NAME = 'tb-pwa-v1';

// Recursos pré-cacheados na instalação (shell do app)
const PRECACHE_URLS = ['/', '/index.html', '/css/main.css', '/img/logo.png', '/img/Perfil-1.jpeg'];

// ── Install: pré-cacheia o shell ────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: remove caches antigos ─────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch: estratégia por tipo de recurso ────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requisições de terceiros (GA4, Sentry, CDN)
  if (url.origin !== self.location.origin) {
    return;
  }

  // HTML → network-first (garante conteúdo atualizado, cai no cache offline)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html') || caches.match('/'))
    );
    return;
  }

  // Assets estáticos → cache-first (performance máxima)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request).then((response) => {
        // Não armazena respostas inválidas
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clona antes de consumir — a resposta só pode ser lida uma vez
        const toCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, toCache));

        return response;
      });
    })
  );
});
