// src/components/AnimatedCounter.jsx
import React, { useEffect, useRef } from "react";

/**
 * AnimatedCounter
 * Contador numérico com animação e formatação local.
 *
 * Props:
 * - from:      número inicial (default: 0)
 * - to:        número final (obrigatório)
 * - duration:  duração em ms (default: 1200)
 * - decimals:  casas decimais (default: 0)
 * - prefix:    texto antes do número (default: "")
 * - suffix:    texto depois do número (default: "")
 * - locale:    locale do Intl.NumberFormat (default: "pt-BR")
 * - startOnVisible: inicia quando entrar na viewport (default: true)
 *
 * Uso:
 *   <AnimatedCounter to={5000} prefix="R$ " decimals={0} />
 */
export default function AnimatedCounter({
  from = 0,
  to = 100,
  duration = 1200,
  decimals = 0,
  prefix = "",
  suffix = "",
  locale = "pt-BR",
  startOnVisible = true,
}) {
  const nodeRef = useRef(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    // Acessibilidade: respeita prefers-reduced-motion
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    const renderValue = (val) => {
      node.textContent = `${prefix}${formatter.format(val)}${suffix}`;
    };

    // Render imediato para RM, duração 0 ou sem window
    if (prefersReduced || !duration || duration <= 0 || typeof window === "undefined") {
      renderValue(to);
      return;
    }

    let raf = null;
    let startTs = null;

    // easing suave
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (ts) => {
      if (startTs == null) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const eased = easeOutCubic(progress);
      const current = from + (to - from) * eased;
      renderValue(current);
      if (progress < 1) raf = requestAnimationFrame(animate);
    };

    let io;
    const start = () => {
      // evita re-disparo
      if (raf != null) return;
      raf = requestAnimationFrame(animate);
    };

    if (startOnVisible && typeof window !== "undefined" && "IntersectionObserver" in window) {
      io = new IntersectionObserver(([entry], obs) => {
        if (entry.isIntersecting) {
          start();
          obs.disconnect();
        }
      }, { threshold: 0.5 });
      io.observe(node);
    } else {
      start();
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (io) io.disconnect();
    };
  }, [from, to, duration, decimals, prefix, suffix, locale, startOnVisible]);

  return <span ref={nodeRef} />;
}
