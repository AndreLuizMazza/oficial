// src/pages/PlanosNovos.jsx
import { Link } from "react-router-dom";
import clsx from "clsx";
import CardMotion from "@/components/CardMotion";
import {
  CheckCircle2, XCircle, PlusCircle, ShieldCheck, Globe, Building2, Users,
  HardDrive, Cable, Workflow, Banknote, Receipt, Store, Smartphone, Globe2, Info
} from "lucide-react";
import { setPageSEO } from "@/lib/seo";
import { useEffect, useMemo, useState, useId, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

/* ==================== Helpers ==================== */
const DESCONTO_ANUAL = 0.15;

const isTouchDevice = () =>
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

const fmtBRL = (n) =>
  typeof n === "number"
    ? n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : n;

const priceForPeriod = (mensal, periodo) =>
  periodo === "mensal" ? mensal : mensal * 12 * (1 - DESCONTO_ANUAL);

const economiaAnual = (mensal) => mensal * 12 * DESCONTO_ANUAL;

/** A11y: conteúdo apenas para leitores de tela */
function VisuallyHidden({ as: Tag = "span", children }) {
  return <Tag className="sr-only">{children}</Tag>;
}

/** Tooltip acessível com animação (desativa em touch) */
function Tooltip({ label, children, disableOnTouch = true }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const tipId = useId();

  const isTouch = isTouchDevice();
  const tooltipEnabled = !(disableOnTouch && isTouch);

  useEffect(() => {
    if (!tooltipEnabled) return;
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(id);
    } else {
      setShow(false);
      const t = setTimeout(() => setMounted(false), 150);
      return () => clearTimeout(t);
    }
  }, [open, tooltipEnabled]);

  if (!tooltipEnabled) {
    // Em touch, apenas envolve o children sem tooltip.
    return <span className="inline-flex">{children}</span>;
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={open ? tipId : undefined}>{children}</span>
      {mounted && (
        <span
          id={tipId}
          role="tooltip"
          className={clsx(
            // IMPORTANTE: não interceptar cliques
            "pointer-events-none absolute z-40 -top-2 left-1/2 -translate-x-1/2 -translate-y-full w-72 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] p-3 text-xs shadow-xl",
            "transition duration-150 ease-out transform-gpu",
            show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}

function StatusBadge({ type, children }) {
  const base =
    "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[12px] font-medium";
  const styles = {
    sim: "bg-emerald-100/70 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    adicional:
      "bg-sky-100/70 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300",
    nao: "bg-rose-100/70 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300",
    note: "bg-violet-100/70 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300",
    segment:
      "bg-[color:var(--c-surface-2)] border border-[var(--c-border)] text-[color:var(--c-text)]",
  };
  const icons = {
    sim: <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />,
    adicional: <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />,
    nao: <XCircle className="w-3.5 h-3.5" aria-hidden="true" />,
    note: <Info className="w-3.5 h-3.5" aria-hidden="true" />,
    segment: null,
  };
  return (
    <span className={clsx(base, styles[type])}>
      {icons[type]} {children}
    </span>
  );
}

function FeatureRow({ icon: Icon, label, status }) {
  return (
    <li className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <span className="inline-flex w-6 h-6 items-center justify-center rounded-md border border-[var(--c-border)] bg-[var(--c-surface-2)]">
          <Icon
            className="w-3.5 h-3.5 text-[color:var(--c-muted)]"
            aria-hidden="true"
          />
        </span>
        <span className="text-sm">{label}</span>
      </div>
      <StatusBadge type={status.type}>{status.text}</StatusBadge>
    </li>
  );
}

function TogglePeriodo({ periodo, setPeriodo }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-2xl p-1 bg-[var(--c-surface)] border border-[var(--c-border)] shadow-sm">
      {["mensal", "anual"].map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => setPeriodo(opt)}
          aria-pressed={periodo === opt}
          className={clsx(
            "px-3 py-1.5 text-sm rounded-xl transition focus:outline-none focus:ring-2 focus:ring-[var(--c-primary)]",
            periodo === opt
              ? "bg-[var(--c-primary)] text-[var(--c-primary-contrast)] shadow-sm"
              : "hover:bg-[var(--c-surface-2)] text-[color:var(--c-text)]"
          )}
        >
          {opt === "mensal" ? "Mensal" : "Anual — 15% OFF"}
        </button>
      ))}
    </div>
  );
}

/** Modal desktop: portal, scroll lock e animação (fade + scale) */
function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null);
  const [mounted, setMounted] = useState(open);
  const [show, setShow] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(id);
    } else {
      setShow(false);
      const t = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Trava o scroll da página quando aberto
  useEffect(() => {
    if (!open) return;
    const { style: htmlStyle } = document.documentElement;
    const prevOverflow = htmlStyle.overflow;
    htmlStyle.overflow = "hidden";
    return () => {
      htmlStyle.overflow = prevOverflow || "";
    };
  }, [open]);

  // Foco inicial e ESC para fechar
  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={clsx(
        "fixed inset-0 z-[100] p-3 flex items-center justify-center",
        "overflow-y-auto overscroll-contain",
        "transition-opacity duration-200 ease-out",
        show ? "bg-black/40 opacity-100" : "bg-black/40 opacity-0"
      )}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={clsx(
          "w-full max-w-lg outline-none",
          "bg-[var(--c-surface)] border border-[var(--c-border)] shadow-2xl md:rounded-2xl",
          "p-5 md:p-6 max-h-[85dvh] overflow-y-auto",
          "transform-gpu transition duration-200 ease-out",
          show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-1"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 id="modal-title" className="text-lg font-semibold">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--c-border)] hover:bg-[var(--c-surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--c-primary)]"
          >
            <XCircle className="w-5 h-5" aria-hidden="true" />
            <VisuallyHidden>Fechar</VisuallyHidden>
          </button>
        </div>

        <div className="mt-3 text-sm text-[color:var(--c-text)]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

/** Popover mobile com animação + auto-flip */
function PopoverFaixas({ anchorRect, open, onClose, children }) {
  const cardRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, place: "bottom" });
  const [mounted, setMounted] = useState(open);
  const [show, setShow] = useState(open);

  // montagem/saída animada
  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(id);
    } else {
      setShow(false);
      const t = setTimeout(() => setMounted(false), 150);
      return () => clearTimeout(t);
    }
  }, [open]);

  // posicionamento
  useLayoutEffect(() => {
    if (!open || !anchorRect) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxW = Math.min(560, vw * 0.92);

    // posição inicial: abaixo e centralizado
    let left = Math.round(vw / 2);
    let top = anchorRect.bottom + 10;
    let place = "bottom";

    // após montar, mede o card e ajusta (flip se precisar)
    const raf = requestAnimationFrame(() => {
      const h = cardRef.current?.offsetHeight || 0;
      const desiredBottom = top + h + 16; // margem inferior
      if (desiredBottom > vh) {
        // abre acima
        place = "top";
        top = Math.max(anchorRect.top - 10 - h, 16);
      }
      setPos({ top, left, place });
    });
    return () => cancelAnimationFrame(raf);
  }, [open, anchorRect]);

  // ESC / clique fora
  useEffect(() => {
    if (!open) return;
    function onKey(e) { if (e.key === "Escape") onClose?.(); }
    function onClick(e) {
      if (!cardRef.current) return;
      if (!cardRef.current.contains(e.target)) onClose?.();
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose]);

  if (!mounted || !anchorRect) return null;

  const arrowClass =
    "h-3 w-3 rotate-45 border border-[var(--c-border)] bg-[var(--c-surface)]";
  const arrowStyle =
    pos.place === "bottom"
      ? { marginTop: "-0.375rem" }
      : { marginBottom: "-0.375rem" };

  return createPortal(
    <>
      <div className={clsx(
        "fixed inset-0 z-[98] transition-opacity duration-150",
        show ? "bg-black/20 opacity-100" : "bg-black/20 opacity-0"
      )} />
      <div
        className="fixed z-[99]"
        style={{
          top: pos.top,
          left: pos.left,
          transform: "translateX(-50%)",
          width: "min(92vw, 560px)",
        }}
      >
        {/* seta */}
        <div
          aria-hidden="true"
          className={clsx("mx-auto", arrowClass)}
          style={arrowStyle}
        />
        {/* card */}
        <div
          ref={cardRef}
          className={clsx(
            "rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] shadow-xl p-4",
            "transition-all duration-150 transform-gpu",
            show
              ? "opacity-100 translate-y-0"
              : pos.place === "bottom"
              ? "opacity-0 -translate-y-1"
              : "opacity-0 translate-y-1"
          )}
        >
          {children}
          <div className="mt-4 flex items-center justify-end">
            <button className="btn btn-ghost" onClick={onClose}>Fechar</button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

/** Link “Saiba mais” (popover no touch / modal no desktop) */
function SaibaMaisLink({ onDesktop, onMobile }) {
  const btnRef = useRef(null);

  function handleClick(e) {
    e.preventDefault();
    const isTouch = isTouchDevice();
    if (isTouch) {
      const rect = btnRef.current?.getBoundingClientRect();
      onMobile?.(rect || null);
    } else {
      onDesktop?.();
    }
  }

  return (
    <Tooltip
      label="Faixas progressivas após 500 contratos"
      disableOnTouch
    >
      <button
        ref={btnRef}
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1 underline underline-offset-2 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--c-primary)] rounded-sm"
      >
        <span>Saiba mais</span>
        <Info className="w-3.5 h-3.5" aria-hidden="true" />
        <VisuallyHidden>sobre faixas acima de 500 contratos</VisuallyHidden>
      </button>
    </Tooltip>
  );
}

/* ==================== Dados ==================== */
const EXTRAS_COMUNS = [
  { label: "WhatsApp ilimitado", value: "R$ 150/mês" },
];

const PLANS_RAW = [
  {
    id: "start",
    name: "Start",
    segment: "Funerárias",
    icon: ShieldCheck,
    armazenamento: "500 MB",
    precoBase: 249,
    headline: "Operação funerária ágil e simples.",
    features: [
      { icon: Receipt,    label: "Gestão de Óbitos",              status: { type: "sim", text: "Sim" } },
      { icon: Workflow,   label: "Ordem de Serviço",              status: { type: "sim", text: "Sim" } },
      { icon: Banknote,   label: "Gestão Financeira",             status: { type: "sim", text: "Sim" } },
      { icon: Cable,      label: "Integração Meios de Pagamento", status: { type: "sim", text: "Sim" } },
      { icon: Globe2,     label: "Memorial Digital",              status: { type: "sim", text: "Sim" } }, // incluso no Start
      { icon: Store,      label: "Gestão de Planos",              status: { type: "nao", text: "Não" } },
      { icon: Smartphone, label: "APP Cobrador & Vendedor",       status: { type: "nao", text: "Não" } },
      { icon: Users,      label: "APP Associado",                 status: { type: "nao", text: "Não" } },
      { icon: Globe,      label: "Site",                          status: { type: "nao", text: "Não" } },
      { icon: HardDrive,  label: "Armazenamento",                 status: { type: "sim", text: "500 MB" } },
    ],
    cta: { label: "Solicitar Demonstração", to: "/demo" },
  },
  {
    id: "pro",
    name: "Pro",
    segment: "Gestão de Planos",
    icon: Globe,
    armazenamento: "500 MB",
    precoBase: 269,
    headline: "Venda, recorrência e relacionamento em escala.",
    features: [
      { icon: Receipt,    label: "Gestão de Óbitos",              status: { type: "nao", text: "Não" } },
      { icon: Workflow,   label: "Ordem de Serviço",              status: { type: "sim", text: "Sim" } },
      { icon: Banknote,   label: "Gestão Financeira",             status: { type: "sim", text: "Sim" } },
      { icon: Cable,      label: "Integração Meios de Pagamento", status: { type: "sim", text: "Sim" } },
      { icon: Globe2,     label: "Memorial Digital",              status: { type: "nao", text: "Não" } },
      { icon: Store,      label: "Gestão de Planos",              status: { type: "sim", text: "Sim" } },
      { icon: Smartphone, label: "APP Cobrador & Vendedor",       status: { type: "sim", text: "Sim" } },
      { icon: Users,      label: "APP Associado",                 status: { type: "nao", text: "Não" } },
      { icon: Globe,      label: "Site",                          status: { type: "sim", text: "Sim" } },
      { icon: HardDrive,  label: "Armazenamento",                 status: { type: "sim", text: "500 MB" } },
    ],
    cta: { label: "Solicitar Demonstração", to: "/demo" },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    segment: "Funerária + Gestão de Planos",
    icon: Building2,
    armazenamento: "1 GB",
    precoBase: 469,
    destaque: true,
    headline: "Tudo em um: operação completa e escalável.",
    features: [
      { icon: Receipt,    label: "Gestão de Óbitos",              status: { type: "sim", text: "Sim" } },
      { icon: Workflow,   label: "Ordem de Serviço",              status: { type: "sim", text: "Sim" } },
      { icon: Banknote,   label: "Gestão Financeira",             status: { type: "sim", text: "Sim" } },
      { icon: Cable,      label: "Integração Meios de Pagamento", status: { type: "sim", text: "Sim" } },
      { icon: Globe2,     label: "Memorial Digital",              status: { type: "sim", text: "Sim" } },
      { icon: Store,      label: "Gestão de Planos",              status: { type: "sim", text: "Sim" } },
      { icon: Smartphone, label: "APP Cobrador & Vendedor",       status: { type: "sim", text: "Sim" } },
      { icon: Users,      label: "APP Associado",                 status: { type: "adicional", text: "Add-on" } }, // add-on com custo
      { icon: Globe,      label: "Site",                          status: { type: "sim", text: "Sim" } },
      { icon: HardDrive,  label: "Armazenamento",                 status: { type: "sim", text: "1 GB" } },
    ],
    cta: { label: "Solicitar Demonstração", to: "/demo" },
  },
];

/* ==================== Página ==================== */
export default function PlanosNovos() {
  const [periodo, setPeriodo] = useState("mensal");
  const [openModal, setOpenModal] = useState(false); // desktop
  const [popover, setPopover] = useState({ open: false, anchorRect: null }); // mobile

  useEffect(() => {
    setPageSEO({
      title: "Progem • Planos",
      description:
        "Escolha o plano ideal para sua operação: Start (Funerárias), Pro (Gestão de Planos) e Enterprise (Funerária + Planos).",
    });
  }, []);

  const plans = useMemo(() => PLANS_RAW, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 relative">
      {/* Cabeçalho */}
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-[-0.02em]">
            Planos Progem{" "}
            <span className="text-[var(--c-primary)]">
              — escolha conforme sua operação
            </span>
          </h1>
          <p className="muted mt-2 text-base md:text-lg">
            Transparentes por padrão: mostramos a{" "}
            <strong>mensalidade base</strong> (sem add-ons). Em{" "}
            <strong>Anual</strong> aplicamos <strong>15% OFF</strong> com
            equivalência mensal reduzida.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <TogglePeriodo periodo={periodo} setPeriodo={setPeriodo} />
          <Tooltip
            label="Compare preços em Mensal ou Anual. No Anual há 15% de desconto e mostramos o valor equivalente por mês já com desconto."
            disableOnTouch
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)]">
              <Info className="w-4.5 h-4.5 text-[color:var(--c-muted)]" aria-hidden="true" />
              <VisuallyHidden>Ajuda</VisuallyHidden>
            </span>
          </Tooltip>
        </div>
      </header>

      {/* Cards */}
      <section className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => {
          const precoDisplay = priceForPeriod(p.precoBase, periodo);
          const suffix = periodo === "mensal" ? "/mês" : "/ano";

          const anualSemDesconto = p.precoBase * 12;
          const anualComDesconto = p.precoBase * 12 * (1 - DESCONTO_ANUAL);
          const economia = anualSemDesconto - anualComDesconto;
          const mensalEquivalenteNoAnual = p.precoBase * (1 - DESCONTO_ANUAL);

          const showTierNoteProEnt = p.id === "pro" || p.id === "enterprise";
          const showStartNote = p.id === "start";

          return (
            <CardMotion
              key={p.id}
              className={clsx(
                "relative card p-6 flex flex-col overflow-hidden border border-[var(--c-border)]",
                "hover:shadow-xl transition-shadow",
                p.destaque && "ring-2 ring-[var(--c-primary)]"
              )}
            >
              {p.destaque && (
                <div className="pointer-events-none absolute -right-12 top-6 rotate-45 bg-[var(--c-primary)] text-[var(--c-primary-contrast)] text-xs font-semibold px-16 py-1 shadow-lg">
                  Mais vendido
                </div>
              )}
              {periodo === "anual" && (
                <div className="absolute left-0 top-0 rounded-br-xl bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  15% de economia
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] shadow-sm">
                    <p.icon className="w-6 h-6 text-[color:var(--c-muted)]" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold">{p.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <StatusBadge type="segment">{p.segment}</StatusBadge>
                      <StatusBadge type="sim">{p.armazenamento}</StatusBadge>
                    </div>
                    <p className="mt-1 text-sm text-[color:var(--c-muted)]">{p.headline}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm uppercase tracking-wide text-[color:var(--c-muted)]">a partir de</div>
                  <div className="text-2xl font-bold">{fmtBRL(precoDisplay)}</div>
                  <div className="text-xs muted">{suffix}</div>

                  {periodo === "anual" && (
                    <div className="mt-1 text-[11px] leading-4 text-[color:var(--c-muted)]">
                      <div>
                        <span className="line-through opacity-70">{fmtBRL(anualSemDesconto)}</span>{" "}
                        → <strong>{fmtBRL(anualComDesconto)}</strong> no ano
                      </div>
                      <div>
                        equivale a <strong>{fmtBRL(mensalEquivalenteNoAnual)}</strong> / mês
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notas de precificação */}
              <div className="mt-3 text-xs text-[color:var(--c-muted)]">
                {showStartNote && (
                  <span>Preço <strong>fixo</strong> até <strong>500 registros</strong>.</span>
                )}

                {showTierNoteProEnt && (
                  <span>
                    Mantém este valor <strong>até 500 contratos ativos</strong>.{" "}
                    <SaibaMaisLink
                      onDesktop={() => setOpenModal(true)}
                      onMobile={(rect) => setPopover({ open: true, anchorRect: rect })}
                    />
                  </span>
                )}
              </div>

              {periodo === "anual" && (
                <div className="mt-3 rounded-md border border-[var(--c-border)] bg-gradient-to-br from-emerald-50 to-transparent dark:from-emerald-900/20 px-3 py-2 text-xs">
                  Você economiza <strong>{fmtBRL(economia)}</strong> por ano.
                </div>
              )}

              <div className="mt-4">
                <h4 className="font-medium mb-2">Recursos</h4>
                <ul className="divide-y divide-[var(--c-border)]">
                  {p.features.map((f, i) => (
                    <FeatureRow key={i} icon={f.icon} label={f.label} status={f.status} />
                  ))}
                </ul>
              </div>

              <div className="mt-4 text-xs text-[color:var(--c-muted)]">
                Extras e integrações são iguais para todos os planos.{" "}
                <a className="underline underline-offset-2 hover:opacity-90" href="#extras">
                  Ver opções
                </a>
              </div>

              <div className="mt-6">
                <Link
                  to={p.cta.to}
                  className={clsx("btn w-full transition", p.destaque ? "btn-primary" : "btn-ghost")}
                >
                  {p.cta.label}
                </Link>
              </div>
            </CardMotion>
          );
        })}
      </section>

      {/* Extras */}
      <section id="extras" className="mt-10 card p-5 border border-[var(--c-border)]">
        <h4 className="font-semibold">Extras e integrações (para qualquer plano)</h4>
        <div className="grid gap-2 mt-2">
          {EXTRAS_COMUNS.map((e, i) => (
            <div
              key={i}
              className="rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)] px-3 py-2 text-sm flex items-center justify-between"
            >
              <span>{e.label}</span>
              <span className="font-medium">{e.value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[color:var(--c-muted)] mt-2">
          Contratados à parte e ativados sob demanda. O <strong>App do Associado</strong> está disponível como <strong>add-on no plano Enterprise</strong>.
        </p>
      </section>

      {/* Popover (mobile) */}
      <PopoverFaixas
        anchorRect={popover.anchorRect}
        open={popover.open}
        onClose={() => setPopover({ open: false, anchorRect: null })}
      >
        <h3 className="text-base font-semibold">Como funcionam as faixas acima de 500 contratos</h3>
        <p className="mt-2 text-sm">
          A partir de <strong>501 contratos ativos</strong>, aplicamos uma tabela de faixas progressivas
          com valor adicional por bloco de contratos. Isso mantém o custo proporcional ao seu crescimento,
          sem surpresas. Para receber a tabela detalhada e uma simulação sob medida, solicite uma demonstração.
        </p>
        <div className="mt-3 flex items-center justify-end gap-2">
          <Link to="/demo" className="btn btn-primary">Solicitar Demonstração</Link>
        </div>
      </PopoverFaixas>

      {/* Modal (desktop) */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Como funcionam as faixas acima de 500 contratos"
      >
        <p>
          A partir de <strong>501 contratos ativos</strong>, aplicamos uma tabela de faixas progressivas com
          valor adicional por bloco de contratos. Isso mantém o custo proporcional ao seu crescimento, sem
          surpresas. Para receber a tabela detalhada e uma simulação sob medida, solicite uma demonstração.
        </p>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button className="btn btn-ghost" onClick={() => setOpenModal(false)}>Entendi</button>
          <Link to="/demo" className="btn btn-primary">Solicitar Demonstração</Link>
        </div>
      </Modal>
    </main>
  );
}
