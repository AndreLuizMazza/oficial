// src/pages/PlanosNovos.jsx
import { Link } from "react-router-dom";
import clsx from "clsx";
import CardMotion from "@/components/CardMotion";
import {
  CheckCircle2, XCircle, PlusCircle, ShieldCheck, Globe, Building2, Users,
  HardDrive, Cable, Workflow, Banknote, Receipt, Store, Smartphone, Globe2, Info,
  Handshake, BadgeDollarSign, MessageCircle, Star, Award, Rocket, Clock
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
  const base = "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[12px] font-medium";
  const styles = {
    sim: "bg-emerald-100/70 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    adicional: "bg-sky-100/70 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300",
    nao: "bg-rose-100/70 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300",
    note: "bg-violet-100/70 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300",
    segment: "bg-[color:var(--c-surface-2)] border border-[var(--c-border)] text-[color:var(--c-text)]",
  };
  const icons = {
    sim: <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />,
    adicional: <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />,
    nao: <XCircle className="w-3.5 h-3.5" aria-hidden="true" />,
    note: <Info className="w-3.5 h-3.5" aria-hidden="true" />,
    segment: null,
  };
  return <span className={clsx(base, styles[type])}>{icons[type]} {children}</span>;
}

function FeatureRow({ icon: Icon, label, status }) {
  return (
    <li className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <span className="inline-flex w-6 h-6 items-center justify-center rounded-md border border-[var(--c-border)] bg-[var(--c-surface-2)]">
          <Icon className="w-3.5 h-3.5 text-[color:var(--c-muted)]" aria-hidden="true" />
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
      {["mensal","anual"].map(opt=>(
        <button
          key={opt}
          type="button"
          onClick={()=>setPeriodo(opt)}
          aria-pressed={periodo===opt}
          className={clsx(
            "px-3 py-1.5 text-sm rounded-xl transition focus:outline-none focus:ring-2 focus:ring-[var(--c-primary)]",
            periodo===opt
              ? "bg-[var(--c-primary)] text-[var(--c-primary-contrast)] shadow-sm"
              : "hover:bg-[var(--c-surface-2)] text-[color:var(--c-text)]"
          )}
        >
          {opt==="mensal" ? "Mensal" : "Anual — 15% OFF"}
        </button>
      ))}
    </div>
  );
}

/** Modal desktop: portal, scroll lock e animação */
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

  useEffect(() => {
    if (!open) return;
    const { style: htmlStyle } = document.documentElement;
    const prevOverflow = htmlStyle.overflow;
    htmlStyle.overflow = "hidden";
    return () => { htmlStyle.overflow = prevOverflow || ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    function onKey(e){ if (e.key === "Escape") onClose?.(); }
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
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
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
          <h3 id="modal-title" className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--c-border)] hover:bg-[var(--c-surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--c-primary)]"
          >
            <XCircle className="w-5 h-5" aria-hidden="true" />
            <VisuallyHidden>Fechar</VisuallyHidden>
          </button>
        </div>
        <div className="mt-3 text-sm text-[color:var(--c-text)]">{children}</div>
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

  useLayoutEffect(() => {
    if (!open || !anchorRect) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = Math.round(vw / 2);
    let top = anchorRect.bottom + 10;
    let place = "bottom";

    const raf = requestAnimationFrame(() => {
      const h = cardRef.current?.offsetHeight || 0;
      const desiredBottom = top + h + 16;
      if (desiredBottom > vh) {
        place = "top";
        top = Math.max(anchorRect.top - 10 - h, 16);
      }
      setPos({ top, left, place });
    });
    return () => cancelAnimationFrame(raf);
  }, [open, anchorRect]);

  useEffect(() => {
    if (!open) return;
    function onKey(e){ if (e.key === "Escape") onClose?.(); }
    function onClick(e){ if (!cardRef.current) return; if (!cardRef.current.contains(e.target)) onClose?.(); }
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose]);

  if (!mounted || !anchorRect) return null;

  const arrowClass = "h-3 w-3 rotate-45 border border-[var(--c-border)] bg-[var(--c-surface)]";
  const arrowStyle = pos.place === "bottom" ? { marginTop: "-0.375rem" } : { marginBottom: "-0.375rem" };

  return createPortal(
    <>
      <div className={clsx("fixed inset-0 z-[98] transition-opacity duration-150", show ? "bg-black/20 opacity-100" : "bg-black/20 opacity-0")} />
      <div className="fixed z-[99]" style={{ top: pos.top, left: pos.left, transform: "translateX(-50%)", width: "min(92vw, 560px)" }}>
        <div aria-hidden="true" className={clsx("mx-auto", arrowClass)} style={arrowStyle} />
        <div
          ref={cardRef}
          className={clsx(
            "rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] shadow-xl p-4",
            "transition-all duration-150 transform-gpu",
            show ? "opacity-100 translate-y-0"
                 : pos.place === "bottom" ? "opacity-0 -translate-y-1" : "opacity-0 translate-y-1"
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
    if (isTouchDevice()) {
      const rect = btnRef.current?.getBoundingClientRect();
      onMobile?.(rect || null);
    } else {
      onDesktop?.();
    }
  }

  return (
    <Tooltip label="Faixas progressivas após 500 contratos. Clique para ver a explicação." disableOnTouch>
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
    cnpj: "1 CNPJ",
    headline: "Operação funerária ágil e simples.",
    features: [
      { icon: Receipt,    label: "Gestão de Óbitos",              status: { type: "sim", text: "Sim" } },
      { icon: Workflow,   label: "Ordem de Serviço",              status: { type: "sim", text: "Sim" } },
      { icon: Banknote,   label: "Gestão Financeira",             status: { type: "sim", text: "Sim" } },
      { icon: Cable,      label: "Integração Meios de Pagamento", status: { type: "sim", text: "Sim" } },
      { icon: Globe2,     label: "Memorial Digital",              status: { type: "sim", text: "Sim" } }, // incluso
      { icon: Store,      label: "Gestão de Planos",              status: { type: "nao", text: "Não" } },
      { icon: Smartphone, label: "APP Cobrador & Vendedor",       status: { type: "nao", text: "Não" } },
      { icon: Users,      label: "APP Associado",                 status: { type: "nao", text: "Não" } },
      { icon: Globe,      label: "Site",                          status: { type: "nao", text: "Não" } },
      { icon: HardDrive,  label: "Armazenamento",                 status: { type: "sim", text: "500 MB" } },
    ],
    cta: { label: "Solicitar Demonstração", to: "/demo" },
    contractsHint: 500,
  },
  {
    id: "pro",
    name: "Pro",
    segment: "Gestão de Planos",
    icon: Globe,
    armazenamento: "500 MB",
    precoBase: 269,
    cnpj: "2 CNPJs",
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
      { icon: Globe,      label: "Site",                          status: { type: "adicional", text: "Add-on" } }, // add-on no PRO
      { icon: HardDrive,  label: "Armazenamento",                 status: { type: "sim", text: "500 MB" } },
    ],
    cta: { label: "Solicitar Demonstração", to: "/demo" },
    contractsHint: 750,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    segment: "Funerária + Gestão de Planos",
    icon: Building2,
    armazenamento: "1 GB",
    precoBase: 499,             // ajustado
    cnpj: "3 CNPJs",
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
      { icon: Users,      label: "APP Associado",                 status: { type: "adicional", text: "Add-on" } }, // add-on aqui
      { icon: Globe,      label: "Site",                          status: { type: "sim", text: "Sim" } },
      { icon: HardDrive,  label: "Armazenamento",                 status: { type: "sim", text: "1 GB" } },
    ],
    cta: { label: "Solicitar Demonstração", to: "/demo" },
    contractsHint: 1500,
  },
];

const INCLUDED_USERS = { start: 5, pro: 5, enterprise: 10 };
const EXTRA_USER_PRICE = 10;

/* ====== Blocos persuasivos ====== */
function Subnav() {
  const items = [
    { href: "#comparativo", label: "Comparativo" },
    { href: "#extras", label: "Extras" },
    { href: "#apis", label: "APIs" },
    { href: "#faq", label: "FAQ" },
  ];
  return (
    <nav aria-label="Atalhos" className="mt-2">
      <ul className="flex flex-wrap gap-2">
        {items.map((i)=>(
          <li key={i.href}>
            <a
              href={i.href}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] px-3 py-1.5 text-sm hover:bg-[var(--c-surface-2)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-primary)]" />
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ProofStrip() {
  const items = [
    { icon: Star, label: "Avaliação média alta", sub: "Clientes satisfeitos" },
    { icon: Award, label: "Processos padronizados", sub: "Boas práticas do setor" },
    { icon: Clock, label: "Go-live rápido", sub: "Implantação guiada" },
    { icon: Handshake, label: "Parcerias sólidas", sub: "Integrações confiáveis" },
  ];
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({icon:Icon,label,sub},i)=>(
        <div key={i} className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-3 flex items-center gap-3">
          <span className="inline-flex w-9 h-9 items-center justify-center rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)]">
            <Icon className="w-5 h-5 text-[color:var(--c-muted)]" aria-hidden="true"/>
          </span>
          <div className="leading-tight">
            <div className="text-sm font-medium">{label}</div>
            <div className="text-xs muted">{sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** CTA flutuante com deslocamento dinâmico pela altura visível do rodapé */
function StickyCTA() {
  const [show, setShow] = useState(false);
  const [bottom, setBottom] = useState(12);

  // Mostra o CTA após rolar a página
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Calcula o deslocamento exato conforme a parte do rodapé que entrou na viewport
  useEffect(() => {
    const footer =
      document.querySelector("#site-footer") ||
      document.querySelector("footer");

    if (!footer) return;

    const recalc = () => {
      const r = footer.getBoundingClientRect();
      // quanto o footer invade a viewport a partir da borda inferior
      const overlap = Math.max(0, window.innerHeight - Math.max(r.top, 0));
      // margem base (12px) + overlap (para “subir” o CTA) + 8px de respiro
      setBottom(12 + overlap + (overlap > 0 ? 8 : 0));
    };

    const ro = new ResizeObserver(recalc);
    ro.observe(footer);

    const io = new IntersectionObserver(() => recalc(), { threshold: [0, 0.01, 1] });
    io.observe(footer);

    window.addEventListener("scroll", recalc, { passive: true });
    window.addEventListener("resize", recalc);

    recalc();

    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", recalc);
      window.removeEventListener("resize", recalc);
    };
  }, []);

  return (
    <div
      className={clsx(
        "fixed left-1/2 z-40 transition-all select-none",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      )}
      style={{ bottom, transform: "translateX(-50%)" }}
      role="region"
      aria-label="Chamada para demonstração"
    >
      <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)]/95 backdrop-blur px-3 py-2 flex items-center gap-3 shadow-2xl max-w-[560px]">
        <Rocket className="w-4 h-4 text-[var(--c-primary)]" aria-hidden="true"/>
        <span className="text-sm">Pronto para ver na prática?</span>
        <Link to="/demo" className="btn btn-primary btn-sm">Falar com especialista</Link>
      </div>
    </div>
  );
}

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
    <main className="mx-auto max-w-7xl px-4 py-10 relative pb-24">
      <StickyCTA />

      {/* Cabeçalho */}
      <header className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-[-0.02em]">
              Planos Progem{" "}
              <span className="text-[var(--c-primary)]">— escolha conforme sua operação</span>
            </h1>
            <p className="muted mt-2 text-base md:text-lg">
              Transparentes por padrão: mostramos a <strong>mensalidade base</strong> (sem add-ons). Em{" "}
              <strong>Anual</strong> aplicamos <strong>15% OFF</strong> com equivalência mensal reduzida.
            </p>
            <Subnav />
          </div>
          <div className="flex items-center gap-3">
            <TogglePeriodo periodo={periodo} setPeriodo={setPeriodo} />
            <Tooltip
              label="Compare preços em Mensal ou Anual. No Anual há 15% de desconto e mostramos o valor equivalente mensal com desconto."
              disableOnTouch
            >
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)]">
                <Info className="w-4.5 h-4.5 text-[color:var(--c-muted)]" aria-hidden="true" />
                <VisuallyHidden>Ajuda</VisuallyHidden>
              </span>
            </Tooltip>
          </div>
        </div>

        <ProofStrip />
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
              tabIndex={0}
              aria-labelledby={`title-${p.id}`}
            >
              {/* Ribbon destaque */}
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

              {/* Cabeçalho do card */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] shadow-sm">
                    <p.icon className="w-6 h-6 text-[color:var(--c-muted)]" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 id={`title-${p.id}`} className="text-xl font-semibold">{p.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <StatusBadge type="segment">{p.segment}</StatusBadge>
                      <StatusBadge type="sim">{p.armazenamento}</StatusBadge>
                      {/* CNPJ badge com tooltip */}
                      <Tooltip label="Para mais CNPJs, sob negociação.">
                        <StatusBadge type="note">{p.cnpj}</StatusBadge>
                      </Tooltip>
                    </div>
                    {p.headline && (
                      <p className="mt-1 text-sm text-[color:var(--c-muted)]">{p.headline}</p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm uppercase tracking-wide text-[color:var(--c-muted)]">a partir de</div>
                  <div className="text-2xl font-bold">{fmtBRL(precoDisplay)}</div>
                  <div className="text-xs muted">{suffix}</div>
                  {periodo === "anual" && (
                    <div className="text-[11px] text-[color:var(--c-muted)] mt-0.5">
                      <div><span className="line-through opacity-70">{fmtBRL(anualSemDesconto)}</span> → <strong>{fmtBRL(anualComDesconto)}</strong> no ano</div>
                      <div>equivale a <strong>{fmtBRL(mensalEquivalenteNoAnual)}</strong> / mês</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notas de precificação */}
              <div className="mt-3 text-xs text-[color:var(--c-muted)]">
                {showStartNote && (
                  <span>
                    Preço <strong>fixo</strong> até <strong>500 registros</strong>.
                  </span>
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

              {/* Economia no anual */}
              {periodo === "anual" && (
                <div className="mt-3 rounded-md border border-[var(--c-border)] bg-gradient-to-br from-emerald-50 to-transparent dark:from-emerald-900/20 px-3 py-2 text-xs">
                  Você economiza <strong>{fmtBRL(economia)}</strong> por ano.
                </div>
              )}

              {/* Recursos */}
              <div className="mt-4">
                <h4 className="font-medium mb-2">Recursos</h4>
                <ul className="divide-y divide-[var(--c-border)]">
                  {p.features.map((f, i) => (
                    <FeatureRow key={i} icon={f.icon} label={f.label} status={f.status} />
                  ))}
                </ul>
              </div>

              {/* Nota para extras */}
              <div className="mt-4 text-xs text-[color:var(--c-muted)]">
                Extras e integrações são iguais para todos os planos.{" "}
                <a className="underline underline-offset-2 hover:opacity-90" href="#extras">
                  Ver opções
                </a>
              </div>

              {/* CTA */}
              <div className="mt-6">
                <Link
                  to={p.cta.to}
                  className={clsx("btn w-full transition", p.destaque ? "btn-primary" : "btn-ghost")}
                  aria-label={`${p.cta.label} — Plano ${p.name}`}
                >
                  {p.cta.label}
                </Link>
              </div>

              <p className="mt-3 text-[11px] text-[color:var(--c-muted)]">
                Precisa atender mais CNPJs? <strong>Sob negociação.</strong>
              </p>
            </CardMotion>
          );
        })}
      </section>

      {/* Selo/nota global CNPJs por plano */}
      <div className="mt-3">
        <div className="rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] px-4 py-3 text-xs text-[color:var(--c-muted)]">
          <strong>CNPJs atendidos por plano:</strong> Start <strong>(1)</strong> • Pro <strong>(2)</strong> • Enterprise <strong>(3)</strong>. Para mais CNPJs, <strong>sob negociação</strong>.
        </div>
      </div>

      {/* Extras & integrações — seção única */}
      <section id="extras" className="mt-10 card p-5">
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

      {/* APIs e integrações (card rápido) */}
      <section id="apis" className="mt-10">
        <div className="card p-5">
          <h4 className="font-semibold">APIs e integrações</h4>
          <p className="muted mt-1 text-sm">Automatize seus fluxos com a API do Progem e integrações.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="https://sandbox-api.progem.com.br/docs/index.html"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost text-sm inline-flex items-center gap-2"
            >
              <Cable className="w-4 h-4"/> Ver documentação
            </a>
            <Link to="/gestao-web" className="btn btn-ghost text-sm">Gestão Web</Link>
            <Link to="/demo" className="btn btn-primary btn-demo text-sm">Falar com especialista</Link>
          </div>
        </div>
      </section>

      {/* Comparativo operacional */}
      <section id="comparativo" className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Comparativo operacional</h2>
        <div className="overflow-x-auto border border-[var(--c-border)] rounded-xl">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-[var(--c-surface-2)]">
              <tr>
                <th className="text-left px-4 py-3">Item</th>
                <th className="text-left px-4 py-3">Start</th>
                <th className="text-left px-4 py-3">Pro</th>
                <th className="text-left px-4 py-3">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[var(--c-border)]">
                <td className="px-4 py-3 font-medium">Limite de contratos ativos</td>
                <td className="px-4 py-3">até 500</td>
                <td className="px-4 py-3">até 1.000</td>
                <td className="px-4 py-3">a partir de 1.001</td>
              </tr>
              <tr className="border-t border-[var(--c-border)]">
                <td className="px-4 py-3 font-medium">Usuários incluídos</td>
                <td className="px-4 py-3">{INCLUDED_USERS.start}</td>
                <td className="px-4 py-3">{INCLUDED_USERS.pro}</td>
                <td className="px-4 py-3">{INCLUDED_USERS.enterprise}</td>
              </tr>
              <tr className="border-t border-[var(--c-border)]">
                <td className="px-4 py-3 font-medium">CNPJs atendidos</td>
                <td className="px-4 py-3">1</td>
                <td className="px-4 py-3">2</td>
                <td className="px-4 py-3">3 <span className="muted">(para mais, sob negociação)</span></td>
              </tr>
              <tr className="border-t border-[var(--c-border)]">
                <td className="px-4 py-3 font-medium">SLA de suporte</td>
                <td className="px-4 py-3">Até 24h úteis</td>
                <td className="px-4 py-3">Até 8h úteis</td>
                <td className="px-4 py-3">Até 4h úteis (prioritário)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Observações comerciais */}
      <section className="mt-10">
        <div className="card p-5 space-y-6">
          <h4 className="font-semibold">Observações comerciais</h4>

          <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <BadgeDollarSign className="w-5 h-5 text-[color:var(--c-muted)]" />
              <span className="font-medium">Preço & período</span>
            </div>
            <dl className="grid sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-3">
                <dt className="muted">Período de pagamento</dt>
                <dd className="mt-1"><strong>Mensal</strong> ou <strong>Anual</strong> (15% OFF).</dd>
              </div>
              <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-3">
                <dt className="muted">Usuários incluídos</dt>
                <dd className="mt-1">Start/Pro: <strong>5</strong> • Enterprise: <strong>10</strong><br/>Usuário adicional: <strong>{fmtBRL(EXTRA_USER_PRICE)}/mês</strong>.</dd>
              </div>
              <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-3">
                <dt className="muted">Setup inicial</dt>
                <dd className="mt-1">
                  A partir de <strong>{fmtBRL(600)}</strong> — <em>pode variar</em> conforme integrações,
                  <em> número de usuários</em> e <em>escopo de migração de dados</em>.
                </dd>
              </div>
            </dl>
          </div>

          {/* Cobrança & conciliação */}
          <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="w-5 h-5 text-[color:var(--c-muted)]" />
              <span className="font-medium">Cobrança & conciliação</span>
            </div>

            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 text-[11px] rounded-md bg-emerald-100/60 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">Sem custo</span>
                  <span className="font-medium">Sem registro bancário / Baixa manual</span>
                </div>
                <p className="muted mt-1">
                  Gere cobranças <strong>sem registro bancário</strong> para <strong>recebimento manual</strong> sem custo.
                  A <strong>baixa manual</strong> de <strong>PIX</strong> ou <strong>boletos</strong> também não tem custo.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 text-[11px] rounded-md bg-amber-100/70 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">Tarifa do banco</span>
                  <span className="font-medium">Pagamento via banco</span>
                </div>
                <p className="muted mt-1">
                  Há custos apenas quando o cliente paga pelo banco (tarifas do meio de pagamento).
                  Consulte <Link to="/taxas" className="underline">Taxas &amp; Cobrança</Link>.
                </p>
              </div>
            </div>

            {/* Links úteis */}
            <div className="mt-3 text-xs text-[color:var(--c-muted)] flex flex-wrap items-center gap-2">
              <span className="font-medium mr-1">Links úteis:</span>
              <Link to="/taxas" className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 no-underline border border-[var(--c-border)] bg-[var(--c-surface-2)] hover:bg-[var(--c-surface)]">Taxas &amp; Cobrança</Link>
              <Link to="/migracao" className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 no-underline border border-[var(--c-border)] bg-[var(--c-surface-2)] hover:bg-[var(--c-surface)]">Migração de Dados</Link>
              <Link to="/app-associado" className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 no-underline border border-[var(--c-border)] bg-[var(--c-surface-2)] hover:bg-[var(--c-surface)]">App do Associado</Link>
              <Link to="/site-premium" className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 no-underline border border-[var(--c-border)] bg-[var(--c-surface-2)] hover:bg-[var(--c-surface)]">Site Premium</Link>
              <Link to="/gestao-web" className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 no-underline border border-[var(--c-border)] bg-[var(--c-surface-2)] hover:bg-[var(--c-surface)]">Gestão Web</Link>
              <Link
                to="/zap"
                className={clsx(
                  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 no-underline border",
                  "border-[var(--c-border)] bg-emerald-100/60 dark:bg-emerald-900/30",
                  "text-emerald-700 dark:text-emerald-300 hover:opacity-90"
                )}
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp ilimitado
              </Link>
            </div>

            <div className="mt-3">
              <Link to="/contato" className="btn btn-ghost btn-sm">Tirar dúvidas com o time</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ (compacto) */}
      <section id="faq" className="mt-12">
        <h2 className="text-2xl font-semibold mb-3">Perguntas frequentes</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              q: "Como vocês contam contratos ativos?",
              a: "Consideramos contratos com status 'ativo' no mês de faturamento. Cancelados/pausados não entram no cálculo."
            },
            {
              q: "O WhatsApp ilimitado tem alguma taxa por mensagem?",
              a: <>Não. É um add-on de custo fixo mensal (por faixa), via integração com plataforma parceira oficial.</>
            },
            {
              q: "Posso migrar meus dados atuais?",
              a: <>Sim. Ajudamos na importação de clientes, contratos, carnês/boletos e histórico básico.</>
            },
            { q: "Posso mudar de plano depois?", a: "Pode. O ajuste acompanha sua faixa de contratos ativos." },
            { q: "A baixa manual tem algum custo?", a: "Não. Só há cobrança quando o pagamento acontece pelo banco." },
            { q: "Quais são as taxas quando o cliente paga pelo banco?", a: <>As tarifas dependem do meio de pagamento. Consulte a página <Link to="/taxas" className="underline">Taxas &amp; Cobrança</Link>.</> },
            {
              q: "Posso contratar o Site Premium ou o App do Associado depois?",
              a: <>Sim. Você pode contratar qualquer um separadamente conforme necessidade.</>
            },
            {
              q: "Vocês oferecem API?",
              a: <>Sim. Disponibilizamos API para integrações (veja a <a href="https://sandbox-api.progem.com.br/docs/index.html" target="_blank" rel="noreferrer" className="underline">documentação da sandbox</a>).</>
            },
            { q: "Existe fidelidade?", a: "Trabalhamos com fidelidade de 1 ano." },
            { q: "Como funciona o suporte?", a: "SLA conforme plano: Start até 24h úteis, Pro até 8h úteis, Enterprise até 4h úteis." },
          ].map((item, i) => (
            <details key={i} className="card p-4">
              <summary className="cursor-pointer font-medium">{item.q}</summary>
              <p className="muted text-sm mt-2">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Modal (desktop) */}
      <Modal
        open={openModal}
        onClose={()=>setOpenModal(false)}
        title="Como funcionam as faixas acima de 500 contratos"
      >
        <p>
          A partir de <strong>501 contratos ativos</strong>, aplicamos uma tabela de faixas progressivas com
          valor adicional por bloco de contratos. Isso mantém o custo proporcional ao seu crescimento, sem
          surpresas. Para receber a tabela detalhada e uma simulação sob medida, solicite uma demonstração.
        </p>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button className="btn btn-ghost" onClick={()=>setOpenModal(false)}>Entendi</button>
          <Link to="/demo" className="btn btn-primary">Solicitar Demonstração</Link>
        </div>
      </Modal>

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
    </main>
  );
}
