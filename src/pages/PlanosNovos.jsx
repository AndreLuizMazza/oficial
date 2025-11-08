// src/pages/PlanosNovos.jsx
import { Link } from "react-router-dom";
import clsx from "clsx";
import CardMotion from "@/components/CardMotion";
import {
  CheckCircle2, XCircle, PlusCircle, ShieldCheck, Globe, Building2, Users,
  HardDrive, Cable, Workflow, Banknote, Receipt, Store, Smartphone, Globe2, Info
} from "lucide-react";
import { setPageSEO } from "@/lib/seo";
import { useEffect, useMemo, useState } from "react";

/* ==================== Helpers ==================== */
const DESCONTO_ANUAL = 0.15;

const fmtBRL = (n) =>
  typeof n === "number"
    ? n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : n;

const priceForPeriod = (mensal, periodo) =>
  periodo === "mensal" ? mensal : mensal * 12 * (1 - DESCONTO_ANUAL);

function StatusBadge({ type, children }) {
  const base = "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[12px] font-medium";
  const styles = {
    sim: "bg-emerald-100/70 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    adicional: "bg-sky-100/70 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300",
    nao: "bg-rose-100/70 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300",
    note: "bg-violet-100/70 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300",
  };
  const icons = {
    sim: <CheckCircle2 className="w-3.5 h-3.5" />,
    adicional: <PlusCircle className="w-3.5 h-3.5" />,
    nao: <XCircle className="w-3.5 h-3.5" />,
    note: <Info className="w-3.5 h-3.5" />,
  };
  return <span className={clsx(base, styles[type])}>{icons[type]} {children}</span>;
}

function FeatureRow({ icon: Icon, label, status }) {
  return (
    <li className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <span className="inline-flex w-6 h-6 items-center justify-center rounded-md border border-[var(--c-border)] bg-[var(--c-surface-2)]">
          <Icon className="w-3.5 h-3.5 text-[color:var(--c-muted)]" />
        </span>
        <span className="text-sm">{label}</span>
      </div>
      <StatusBadge type={status.type}>{status.text}</StatusBadge>
    </li>
  );
}

function TogglePeriodo({ periodo, setPeriodo }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl p-1 bg-[var(--c-surface)] border border-[var(--c-border)]">
      {["mensal","anual"].map(opt=>(
        <button
          key={opt}
          type="button"
          onClick={()=>setPeriodo(opt)}
          aria-pressed={periodo===opt}
          className={clsx(
            "px-3 py-1.5 text-sm rounded-md transition",
            periodo===opt ? "bg-[var(--c-primary)] text-[var(--c-primary-contrast)]" : "hover:bg-[var(--c-surface-2)]"
          )}
        >
          {opt==="mensal" ? "Mensal" : "Anual — 15% OFF"}
        </button>
      ))}
    </div>
  );
}

function PriceLadder({ title = "Tabela por faixas", rows = [], periodo = "mensal" }) {
  if (!rows?.length) return null;
  const suffix = periodo === "mensal" ? "/mês" : "/ano";
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-4 h-4 text-[color:var(--c-muted)]" />
        <span className="font-medium text-sm">{title}</span>
      </div>
      <div className="rounded-xl border border-[var(--c-border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--c-surface-2)]">
            <tr>
              <th className="text-left px-3 py-2">Contratos</th>
              <th className="text-right px-3 py-2">Mensalidade {suffix}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={i ? "border-t border-[var(--c-border)]" : ""}>
                <td className="px-3 py-2">{r.range}</td>
                <td className="px-3 py-2 text-right font-medium">
                  {fmtBRL(priceForPeriod(r.price, periodo))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {periodo === "anual" && (
        <p className="text-xs text-[color:var(--c-muted)] mt-2">
          Exibindo valores com 15% de desconto anual. Equivalência mensal = total/12.
        </p>
      )}
    </div>
  );
}

/* =========== Tabelas de faixas (coluna Mensalidade) =========== */
const PRO_TIERS = [
  { range: "0 – 500", price: 349 },
  { range: "501 – 1.000", price: 499 },
  { range: "1.001 – 2.000", price: 599 },
  { range: "2.001 – 3.000", price: 699 },
  { range: "3.001 – 4.000", price: 799 },
  { range: "4.001 – 5.000", price: 899 },
  { range: "5.001 – 6.000", price: 999 },
  { range: "6.001 – 7.000", price: 1_099 },
  { range: "7.001 – 8.000", price: 1_199 },
  { range: "8.001 – 9.000", price: 1_299 },
  { range: "9.001 – 10.000", price: 1_399 },
];

const ENT_TIERS = [
  { range: "0 – 500", price: 469 },
  { range: "501 – 1.000", price: 599 },
  { range: "1.001 – 2.000", price: 799 },
  { range: "2.001 – 3.000", price: 999 },
  { range: "3.001 – 4.000", price: 1_199 },
  { range: "4.001 – 5.000", price: 1_399 },
  { range: "5.001 – 6.000", price: 1_599 },
  { range: "6.001 – 7.000", price: 1_799 },
  { range: "7.001 – 8.000", price: 1_999 },
  { range: "8.001 – 9.000", price: 2_199 },
  { range: "9.001 – 10.000", price: 2_399 },
];

/* ==================== Planos ==================== */
const PLANS_RAW = [
  {
    id: "start",
    name: "Start",
    icon: ShieldCheck,
    armazenamento: "500 MB",
    precoBase: 249,
    extras: [
      { label: "WhatsApp ilimitado", value: "R$ 150/mês" },
    ],
    features: [
      { icon: Receipt, label: "Gestão de Óbitos", status: { type: "sim", text: "Sim" } },
      { icon: Workflow, label: "Ordem de Serviço", status: { type: "sim", text: "Sim" } },
      { icon: Banknote, label: "Gestão Financeira", status: { type: "sim", text: "Sim" } },
      { icon: Cable, label: "Integração Meios de Pagamento", status: { type: "sim", text: "Sim" } },
      { icon: Globe2, label: "Integração NaLapide", status: { type: "sim", text: "Sim" } },
      { icon: Store, label: "Gestão de Planos", status: { type: "nao", text: "Não" } },
      { icon: Smartphone, label: "APP Cobrador & Vendedor", status: { type: "nao", text: "Não" } },
      { icon: Users, label: "APP Associado", status: { type: "nao", text: "Não" } },
      { icon: Globe, label: "Site", status: { type: "nao", text: "Não" } },
      { icon: HardDrive, label: "Armazenamento", status: { type: "sim", text: "500 MB" } },
    ],
    ladder: null,
    baseContracts: 500, // para simular
    cta: { label: "Solicitar Demonstração", to: "/demo" },
  },
  {
    id: "pro",
    name: "Pro",
    icon: Globe,
    armazenamento: "500 MB",
    precoBase: 349,
    destaque: true,
    extras: [
      { label: "WhatsApp ilimitado", value: "R$ 150/mês" },
    ],
    features: [
      { icon: Receipt, label: "Gestão de Óbitos", status: { type: "nao", text: "Não" } },
      { icon: Workflow, label: "Ordem de Serviço", status: { type: "sim", text: "Sim" } },
      { icon: Banknote, label: "Gestão Financeira", status: { type: "sim", text: "Sim" } },
      { icon: Cable, label: "Integração Meios de Pagamento", status: { type: "sim", text: "Sim" } },
      { icon: Globe2, label: "Integração NaLapide", status: { type: "nao", text: "Não" } },
      { icon: Store, label: "Gestão de Planos", status: { type: "sim", text: "Sim" } },
      { icon: Smartphone, label: "APP Cobrador & Vendedor", status: { type: "sim", text: "Sim" } },
      { icon: Users, label: "APP Associado", status: { type: "nao", text: "Não" } },
      { icon: Globe, label: "Site", status: { type: "sim", text: "Sim" } },
      { icon: HardDrive, label: "Armazenamento", status: { type: "sim", text: "500 MB" } },
    ],
    ladder: PRO_TIERS,
    baseContracts: 750, // meio da 1ª faixa pós-500
    cta: { label: "Solicitar Demonstração", to: "/demo" },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Building2,
    armazenamento: "1 GB",
    precoBase: 469,
    extras: [
      { label: "WhatsApp ilimitado", value: "R$ 150/mês" },
    ],
    features: [
      { icon: Receipt, label: "Gestão de Óbitos", status: { type: "sim", text: "Sim" } },
      { icon: Workflow, label: "Ordem de Serviço", status: { type: "sim", text: "Sim" } },
      { icon: Banknote, label: "Gestão Financeira", status: { type: "sim", text: "Sim" } },
      { icon: Cable, label: "Integração Meios de Pagamento", status: { type: "sim", text: "Sim" } },
      { icon: Globe2, label: "Integração NaLapide", status: { type: "sim", text: "Sim" } },
      { icon: Store, label: "Gestão de Planos", status: { type: "sim", text: "Sim" } },
      { icon: Smartphone, label: "APP Cobrador & Vendedor", status: { type: "sim", text: "Sim" } },
      { icon: Users, label: "APP Associado", status: { type: "sim", text: "Sim" } },
      { icon: Globe, label: "Site", status: { type: "sim", text: "Sim" } },
      { icon: HardDrive, label: "Armazenamento", status: { type: "sim", text: "1 GB" } },
    ],
    ladder: ENT_TIERS,
    baseContracts: 1500, // meio de 1.001–2.000
    cta: { label: "Falar com Vendas", to: "/contato" },
  },
];

/* ==================== Página ==================== */
export default function PlanosNovos() {
  const [periodo, setPeriodo] = useState("mensal");

  useEffect(() => {
    setPageSEO({
      title: "Progem • Planos",
      description:
        "Compare Start, Pro e Enterprise — preços com alternância Mensal/Anual e link para simulação já na faixa correta.",
    });
  }, []);

  const plans = useMemo(() => PLANS_RAW, []);

  // Monta URL do simulador com a faixa “ideal” de cada plano
  const simUrl = (contracts) =>
    `/planos?contracts=${encodeURIComponent(contracts)}&periodo=${encodeURIComponent(periodo)}`;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Planos Progem <span className="text-[var(--c-primary)]">— precificação progressiva</span>
          </h1>
          <p className="muted mt-2 text-lg">
            Valores base conforme a coluna <strong>Mensalidade</strong> da planilha. Pro e Enterprise mantêm
            o valor até 500 contratos e, após isso, seguem <strong>faixas</strong>.
          </p>
        </div>
        <TogglePeriodo periodo={periodo} setPeriodo={setPeriodo} />
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => {
          const precoDisplay = priceForPeriod(p.precoBase, periodo);
          const suffix = periodo === "mensal" ? "/mês" : "/ano";
          return (
            <CardMotion
              key={p.id}
              className={clsx("card p-6 flex flex-col", p.destaque && "ring-2 ring-[var(--c-primary)]")}
            >
              {/* Cabeçalho */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                    <p.icon className="w-6 h-6 text-[color:var(--c-muted)]" />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold">{p.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <StatusBadge type="sim">{p.armazenamento}</StatusBadge>
                      <StatusBadge type="note">
                        {p.id === "start" ? "Preço fixo até 500" : "Mantém até 500 • depois faixas"}
                      </StatusBadge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm uppercase tracking-wide text-[color:var(--c-muted)]">a partir de</div>
                  <div className="text-2xl font-bold">{fmtBRL(precoDisplay)}</div>
                  <div className="text-xs muted">{suffix}</div>
                  {periodo === "anual" && (
                    <div className="text-[11px] text-[color:var(--c-muted)] mt-0.5">
                      equivale a {fmtBRL(p.precoBase)} / mês
                    </div>
                  )}
                </div>
              </div>

              {/* Recursos */}
              <div className="mt-5">
                <h4 className="font-medium mb-2">Recursos</h4>
                <ul className="divide-y divide-[var(--c-border)]">
                  {p.features.map((f, i) => (
                    <FeatureRow key={i} icon={f.icon} label={f.label} status={f.status} />
                  ))}
                </ul>
              </div>

              {/* Extras */}
              <div className="mt-5">
                <h4 className="font-medium mb-2">Extras e integrações</h4>
                <div className="grid gap-2">
                  {p.extras.map((e, i) => (
                    <div key={i}
                      className="rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)] px-3 py-2 text-sm flex items-center justify-between"
                    >
                      <span>{e.label}</span>
                      <span className="font-medium">{e.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabela de faixas */}
              {p.ladder && <PriceLadder rows={p.ladder} periodo={periodo} />}

              {/* CTAs */}
              <div className="mt-6 flex flex-wrap gap-2">
                <Link to={p.cta.to} className="btn btn-primary">{p.cta.label}</Link>
                <Link to={simUrl(p.baseContracts)} className="btn btn-ghost">
                  Ver cálculo completo
                </Link>
              </div>
            </CardMotion>
          );
        })}
      </section>

      <section className="mt-10 card p-5">
        <h4 className="font-semibold">Observações comerciais</h4>
        <ul className="list-disc ml-5 mt-2 text-sm space-y-1">
          <li>Exibição por <strong>Mensalidade</strong> (sem add-ons).</li>
          <li>Em <strong>anual</strong>, aplicamos 15% OFF e mostramos a equivalência mensal.</li>
          <li>Impostos e tarifas de meios de pagamento não estão incluídos.</li>
        </ul>
      </section>
    </main>
  );
}
