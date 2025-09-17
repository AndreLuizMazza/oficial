# Rastreamento — Página de Planos (Pricing)

## Eventos implementados

### Mudança de período (mensal/anual)
```js
dataLayer.push({
  event: "pricing_period_change",
  period: "mensal" | "anual",
});
