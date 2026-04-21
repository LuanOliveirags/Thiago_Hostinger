// src/main.js — entrypoint único da aplicação
import { initSentry } from './features/monitoring/sentry.js';
import { initApp } from './app/init.js';

// Sentry deve ser inicializado antes de qualquer outro código
initSentry();

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
