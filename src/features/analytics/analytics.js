// features/analytics/analytics.js — rastreamento de eventos críticos via GA4
//
// Carrega o Google Analytics 4 dinamicamente quando VITE_GA_MEASUREMENT_ID está definido.
// Configure o Measurement ID em .env.production ou via secrets do GitHub Actions.

/**
 * Inicializa o GA4 e injeta o script dinamicamente.
 * Deve ser chamado antes de qualquer trackEvent.
 */
export function initAnalytics() {
  const measurementId = import.meta.env?.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: true });
}

/**
 * Envia um evento genérico para o GA4.
 * Seguro: retorna sem erro se o gtag não estiver disponível.
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window.gtag !== 'function') {
    return;
  }
  window.gtag('event', eventName, params);
}

/** Rastreia clique em botão CTA (Contratar agora) */
export function trackCTAClick(planName) {
  trackEvent('cta_click', { event_category: 'CTA', plan_name: planName });
}

/** Rastreia abertura do modal de imagem de resultado */
export function trackModalOpen(imageIndex) {
  trackEvent('modal_open', { event_category: 'Resultados', image_index: imageIndex + 1 });
}

/** Rastreia expansão de uma pergunta do FAQ */
export function trackFAQInteraction(questionText) {
  trackEvent('faq_expand', { event_category: 'FAQ', question: questionText });
}

/** Rastreia navegação no carrossel de feedbacks */
export function trackCarouselInteraction(direction) {
  trackEvent('carousel_navigate', { event_category: 'Feedbacks', direction });
}

/**
 * Monitora a profundidade de scroll e envia eventos para GA4
 * nos marcos de 25%, 50%, 75% e 90%.
 */
export function initScrollDepthTracking() {
  const thresholds = [25, 50, 75, 90];
  const reached = new Set();

  const handler = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) {
      return;
    }
    const pct = (window.scrollY / totalHeight) * 100;
    thresholds.forEach((t) => {
      if (!reached.has(t) && pct >= t) {
        reached.add(t);
        trackEvent('scroll_depth', { event_category: 'Engajamento', depth_pct: t });
      }
    });
  };

  window.addEventListener('scroll', handler, { passive: true });
}

/**
 * Adiciona rastreamento de clique nos botões CTA (.plan-button).
 * Extrai o nome do plano a partir do elemento pai .plan-card.
 */
export function initCTATracking() {
  document.querySelectorAll('.plan-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.plan-card');
      const planName = card?.querySelector('h3')?.textContent?.trim() ?? 'Desconhecido';
      trackCTAClick(planName);
    });
  });
}

/**
 * Rastreia visibilidade de seções-chave do funil de conversão.
 * Usa IntersectionObserver para disparar um evento quando cada seção
 * entra na viewport pela primeira vez (limiar 50%).
 *
 * Seções mapeadas (id → nome do funil):
 *   #para-quem-e  → Consciência
 *   #planos       → Consideração
 *   #resultados   → Prova social
 *   #feedbacks    → Prova social
 *   #faq          → Objeção
 */
export function initFunnelTracking() {
  const sections = [
    { id: 'para-quem-e', stage: 'consciencia' },
    { id: 'planos', stage: 'consideracao' },
    { id: 'resultados', stage: 'prova_social_resultados' },
    { id: 'feedbacks', stage: 'prova_social_feedbacks' },
    { id: 'faq', stage: 'objecao' },
  ];

  const seen = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !seen.has(entry.target.id)) {
          seen.add(entry.target.id);
          const section = sections.find((s) => s.id === entry.target.id);
          if (section) {
            trackEvent('funnel_section_view', {
              event_category: 'Funil',
              section_id: section.id,
              funnel_stage: section.stage,
            });
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (el) {
      observer.observe(el);
    }
  });
}

/**
 * Rastreia abandono da página antes de chegar na seção de planos.
 * Envia evento 'page_abandon_before_plans' quando o usuário sai
 * sem ter visualizado #planos.
 */
export function initAbandonTracking() {
  let plansSeen = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        plansSeen = true;
        observer.disconnect();
      }
    },
    { threshold: 0.3 }
  );

  const plansEl = document.getElementById('planos');
  if (plansEl) {
    observer.observe(plansEl);
  }

  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && !plansSeen) {
      trackEvent('page_abandon_before_plans', {
        event_category: 'Abandono',
        scroll_y: Math.round(window.scrollY),
      });
    }
  });
}
