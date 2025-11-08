// src/pages/PlanosNovos.jsx
import { Link } from "react-router-dom";
import clsx from "clsx";
import CardMotion from "@/components/CardMotion";
import {
  CheckCircle2, XCircle, PlusCircle, ShieldCheck, Globe, Building2, Users,
  HardDrive, Cable, Workflow, Banknote, Receipt, Store, Smartphone, Globe2, Info
} from "lucide-react";
import { setPageSEO } from "@/lib/seo";
import { useEffect, useMemo, useState, useId } from "react";

/* ==================== Helpers ==================== */
const DESCONTO_ANUAL = 0.15;

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

/** Tooltip acessível (mouse e teclado) */
function Tooltip({ label, children }) {
  const [open, setOpen] = useState(false);
  const tipId = useId();

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={()=>setOpen(true)}
      onMouseLeave={()=>setOpen(false)}
      onFocus={()=>setOpen(true)}
      onBlur={()=>setOpen(false)}
    >
      <span aria-describedby={open ? tipId : undefined}>
        {children}
      </span>
      {open && (
        <span
          id={tipId}
          role="tooltip"
          className="absolute z-40 -top-2 left-1/2 -translate-x-1/2 -translate-y-full w-72 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] p-3 text-xs shadow-xl"
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

/** Modal simples (sem libs) */
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <button aria-label="Fechar" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full md:max-w-lg md:rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] shadow-2xl p-5 md:p-6">
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
    </div>
  );
}

/* ==================== Dados ==================== */
const EXTRAS_COMUNS = [
  { label: "WhatsApp ilimitado", value: "R$ 150/mês" },
  // adicione aqui outros add-ons globais quando necessário
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
      { icon: Globe2,     label: "Integração NaLapide",           status: { type: "nao", text: "Não" } },
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
    headline: "Venda, recorrência e relacionamento em escala.",
    features: [
      { icon: Receipt,    label: "Gestão de Óbitos",              status: { type: "nao", text: "Não" } },
      { icon: Workflow,   label: "Ordem de Serviço",              status: { type: "sim", text: "Sim" } },
      { icon: Banknote,   label: "Gestão Financeira",             status: { type: "sim", text: "Sim" } },
      { icon: Cable,      label: "Integração Meios de Pagamento", status: { type: "sim", text: "Sim" } },
      { icon: Globe2,     label: "Integração NaLapide",           status: { type: "nao", text: "Não" } },
      { icon: Store,      label: "Gestão de Planos",              status: { type: "sim", text: "Sim" } },
      { icon: Smartphone, label: "APP Cobrador & Vendedor",       status: { type: "sim", text: "Sim" } },
      { icon: Users,      label: "APP Associado",                 status: { type: "nao", text: "Não" } },
      { icon: Globe,      label: "Site",                          status: { type: "sim", text: "Sim" } },
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
    precoBase: 469,
    destaque: true, // ✅ “mais escolhido"
    headline: "Tudo em um: operação completa e escalável.",
    features: [
      { icon: Receipt,    label: "Gestão de Óbitos",              status: { type: "sim", text: "Sim" } },
      { icon: Workflow,   label: "Ordem de Serviço",              status: { type: "sim", text: "Sim" } },
      { icon: Banknote,   label: "Gestão Financeira",             status: { type: "sim", text: "Sim" } },
      { icon: Cable,      label: "Integração Meios de Pagamento", status: { type: "sim", text: "Sim" } },
      { icon: Globe2,     label: "Integração NaLapide",           status: { type: "sim", text: "Sim" } },
      { icon: Store,      label: "Gestão de Planos",              status: { type: "sim", text: "Sim" } },
      { icon: Smartphone, label: "APP Cobrador & Vendedor",       status: { type: "sim", text: "Sim" } },
      { icon: Users,      label: "APP Associado",                 status: { type: "sim", text: "Sim" } },
      { icon: Globe,      label: "Site",                          status: { type: "sim", text: "Sim" } },
      { icon: HardDrive,  label: "Armazenamento",                 status: { type: "sim", text: "1 GB" } },
    ],
    cta: { label: "Solicitar Demonstração", to: "/demo" },
    contractsHint: 1500,
  },
];

/* ==================== Página ==================== */
export default function PlanosNovos() {
  const [periodo, setPeriodo] = useState("mensal");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setPageSEO({
      title: "Progem • Planos",
      description:
        "Escolha o plano ideal para sua operação: Start (Funerárias), Pro (Gestão de Planos) e Enterprise (Funerária + Planos). Pro e Enterprise mantêm preço até 500 contratos; acima, faixas progressivas.",
    });
  }, []);

  const plans = useMemo(() => PLANS_RAW, []);

  return (
    <main
      className="
        mx-auto max-w-7xl px-4 py-10
        relative
        before:absolute before:inset-x-0 before:-z-10 before:top-0
        before:h-[220px]
        before:bg-[radial-gradient(1200px_220px_at_50%_-40px,rgba(91,61,248,0.12),transparent)]
        dark:before:bg-[radial-gradient(1200px_220px_at_50%_-40px,rgba(91,61,248,0.18),transparent)]
      "
    >
      {/* Cabeçalho */}
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-[-0.02em]">
            Planos Progem <span className="text-[var(--c-primary)]">— escolha conforme sua operação</span>
          </h1>
          <p className="muted mt-2 text-base md:text-lg">
            Transparentes por padrão: mostramos a <strong>mensalidade base</strong> (sem add-ons). Em{" "}
            <strong>Anual</strong> aplicamos <strong>15% OFF</strong> com equivalência mensal reduzida.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <TogglePeriodo periodo={periodo} setPeriodo={setPeriodo} />
          <Tooltip label="Compare preços em Mensal ou Anual. No Anual há 15% de desconto e mostramos o valor equivalente por mês já com desconto.">
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
          const showTierNoteProEnt = p.id === "pro" || p.id === "enterprise";
          const showStartNote = p.id === "start";

          // Valores para evidenciar ECONOMIA no anual
          const anualSemDesconto = p.precoBase * 12;
          const anualComDesconto = p.precoBase * 12 * (1 - DESCONTO_ANUAL);
          const economia = anualSemDesconto - anualComDesconto;
          const mensalEquivalenteNoAnual = p.precoBase * (1 - DESCONTO_ANUAL);

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
              {/* Ribbons */}
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
                    </div>
                    {p.headline && (
                      <p className="mt-1 text-sm text-[color:var(--c-muted)]">{p.headline}</p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm uppercase tracking-wide text-[color:var(--c-muted)]">a partir de</div>

                  {/* Preço principal */}
                  <div className="text-2xl font-bold">{fmtBRL(precoDisplay)}</div>
                  <div className="text-xs muted">{suffix}</div>

                  {/* Linhas de reforço da economia no anual */}
                  {periodo === "anual" && (
                    <div className="mt-1 text-[11px] leading-4 text-[color:var(--c-muted)]">
                      <div>
                        <span className="line-through opacity-70">{fmtBRL(anualSemDesconto)}</span>{" "}
                        <span className="mx-1">→</span>
                        <strong>{fmtBRL(anualComDesconto)}</strong> no ano
                      </div>
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
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 underline underline-offset-2 hover:opacity-90"
                      onClick={()=>setOpenModal(true)}
                    >
                      Saiba mais <Info className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </span>
                )}
              </div>

              {/* Economia no anual: bloco destacado */}
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

              {/* Nota única para extras */}
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
                  className={clsx(
                    "btn w-full transition",
                    p.destaque ? "btn-primary" : "btn-ghost"
                  )}
                  aria-label={`${p.cta.label} — Plano ${p.name}`}
                >
                  {p.cta.label}
                </Link>
              </div>
            </CardMotion>
          );
        })}
      </section>

      {/* Extras & integrações — seção única */}
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
          Contratados à parte e ativados sob demanda.
        </p>
      </section>

      {/* Observações comerciais */}
      <section className="mt-6 card p-5 border border-[var(--c-border)]">
        <h4 className="font-semibold">Observações comerciais</h4>
        <ul className="list-disc ml-5 mt-2 text-sm space-y-1">
          <li>Valores exibem <strong>mensalidade base</strong> (sem add-ons).</li>
          <li>
            Planos <strong>Pro</strong> e <strong>Enterprise</strong> mantêm o valor até <strong>500 contratos ativos</strong>; acima disso, a precificação segue faixas progressivas.
          </li>
          <li>No plano <strong>Start</strong>, o preço é fixo até <strong>500 registros</strong>.</li>
          <li>Em <strong>Anual</strong>, aplicamos <strong>15% OFF</strong>, destacando economia total e equivalência mensal com desconto.</li>
          <li>Impostos e tarifas de meios de pagamento não estão incluídos.</li>
        </ul>
      </section>

      {/* Modal de faixas */}
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
    </main>
  );
}
