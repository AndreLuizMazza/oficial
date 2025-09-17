// src/lib/analytics.js
/**
 * Envia evento para o dataLayer (Google Tag Manager)
 * @param {string} event - Nome do evento
 * @param {object} payload - Dados adicionais
 */
export function track(event, payload = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}
