// features/monitoring/sentry.js — monitoramento de erros em produção

/**
 * Inicializa o Sentry apenas em produção quando VITE_SENTRY_DSN está definido.
 * Usa dynamic import para não quebrar o carregamento quando Sentry não estiver disponível.
 */
export function initSentry() {
  const dsn =
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.VITE_SENTRY_DSN
      : undefined;
  const isProd =
    typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.PROD : false;

  if (!isProd || !dsn) {
    return;
  }

  import('@sentry/browser')
    .then((Sentry) => {
      Sentry.init({
        dsn,
        environment: 'production',
        release:
          (typeof import.meta !== 'undefined' && import.meta.env
            ? import.meta.env.VITE_APP_VERSION
            : undefined) || '1.0.0',
        tracesSampleRate: 0.1,
        integrations: [Sentry.browserTracingIntegration()],
        beforeSend(event) {
          const frames = event.exception?.values?.[0]?.stacktrace?.frames ?? [];
          if (frames.some((f) => f.filename?.includes('extension://'))) {
            return null;
          }
          return event;
        },
      });
    })
    .catch(() => {});
}
