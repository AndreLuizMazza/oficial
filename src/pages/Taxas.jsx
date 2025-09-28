// src/pages/Taxas.jsx

import Footer from "@/components/Footer";
import { setPageSEO } from "@/lib/seo";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown, Calculator, Info, CreditCard,
  Landmark, Building2, Zap, ShieldCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { track } from "@/lib/analytics";
import BottomDockCTA from "@/components/BottomDockCTA";

// --- Dados de referência (integração principal em destaque, sem citar marca nos títulos) ---
const taxasPagamento = [
  { tipo: "Pix", valor: "R$0,99", icon: "💠", note: "por transação" },
  { tipo: "Boleto (Liquidado)", valor: "R$2,30", icon: "📄", note: "somente quando pago" },
];

// --- Cartões (apenas as bandeiras informadas) ---
const taxasCartoes = [
  { bandeira: "Master",           gatilho: "R$ 0,30", taxa: "3,59%" },
  { bandeira: "Visa",             gatilho: "R$ 0,30", taxa: "3,59%" },
  { bandeira: "Elo",              gatilho: "R$ 0,30", taxa: "4,59%" },
  { bandeira: "American Express", gatilho: "R$ 0,30", taxa: "4,09%" },
  { bandeira: "Hipercard",        gatilho: "R$ 0,30", taxa: "4,09%" },
];

// --- Alternativa: TecnoSpeed (boletos com bancos) ---
const tecnospeed = {
  custoRegistro: "R$0,45", // pago à Progem no registro (pode reduzir por volume)
  bancos: ["Banco do Brasil", "Sicredi", "Sicoob", "Bradesco", "BTG Pactual"],
  bullets: [
    "Somente boletos (emissão pelo Progem Gestão).",
    "Não integrado ao checkout online do Progem.",
    "Além do valor de registro, há a tarifa do seu banco.",
    "Créditos pré-pagos no Progem para registrar boletos.",
    "Velocidade de integração depende do banco/gerente.",
  ],
};

// --- FAQ ---
const faqs = [
  {
    q: "Posso usar o gateway do Progem e, ao mesmo tempo, emitir boletos pelo meu banco?",
    a: "Sim. Você pode manter as duas integrações ativas e alternar conforme a necessidade. No dia a dia, dá para definir preferências por canal (ex.: Pix/Cartão no gateway principal e boletos via banco) ou escolher caso a caso. A conciliação e os relatórios continuam centralizados no Progem."
  },
  {
    q: "O que é considerado um contrato ativo?",
    a: "Contratos com status 'ativo' dentro do período de faturamento. Cancelados, suspensos ou em implantação não entram na contagem."
  },
  {
    q: "Há cobrança para boletos emitidos, baixados ou cancelados?",
    a: "Não. Na integração principal, a taxa de boleto aplica-se apenas quando há liquidação (pagamento confirmado). Emissão, baixa manual ou cancelamento não geram tarifa."
  },
  {
    q: "O que significa 'gatilho' nos cartões?",
    a: "É um valor fixo por transação cobrado pelo adquirente/gateway, somado ao percentual da taxa da bandeira."
  },
  {
    q: "Ultrapassei minha faixa de contratos. O que acontece?",
    a: "Você pode migrar para a faixa seguinte (ex.: Pro → Enterprise) ou contratar um add-on conforme o volume. Nosso time orienta o melhor cenário."
  },
  {
    q: "Posso antecipar recebíveis de cartão?",
    a: "Sim. A antecipação é opcional e possui custo do adquirente. Se desejar, ajudamos a habilitar e simular."
  }
];

// --- Helpers de moeda/percentual ---
function parseMoneyBRL(str) {
  if (!str) return 0;
  return Number(String(str).replace(/[^\d,.-]/g, "").replace(".", "").replace(",", ".")) || 0;
}
function parsePercentBR(str) {
  if (!str) return 0;
  const n = Number(String(str).replace("%", "").replace(",", ".")) || 0;
  return n / 100;
}
function formatBRL(n) {
  if (n == null || Number.isNaN(n)) return "—";
  try {
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  } catch {
    return `R$ ${Number(n).toFixed(2)}`;
  }
}

// --- Accordion simples ---
function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="divide-y divide-[var(--c-border)] rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)]">
      {items.map((it, i) => {
        const expanded = open === i;
        return (
          <div key={i}>
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-left"
              onClick={() => setOpen(expanded ? null : i)}
              aria-expanded={expanded}
            >
              <span className="font-medium">{it.q}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
            {expanded && (
              <div className="px-4 pb-4 text-sm muted">
                {it.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// --- Variações responsivas para tabelas ---
function TabelaPagamentos() {
  return (
    <>
      {/* Mobile (cards) */}
      <div className="sm:hidden grid gap-3">
        {taxasPagamento.map((t, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center gap-3">
              <span aria-hidden className="text-lg">{t.icon}</span>
              <div className="min-w-0">
                <div className="font-semibold">{t.tipo}</div>
                <div className="text-sm">
                  <span className="font-medium">{t.valor}</span>{" "}
                  <span className="muted">{t.note}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ≥ sm (tabela) */}
      <div className="hidden sm:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Tabela de taxas para Pix e Boleto liquidado</caption>
            <thead className="bg-[var(--c-surface-2)]">
              <tr>
                <th scope="col" className="text-left px-4 py-3">Tipo</th>
                <th scope="col" className="text-left px-4 py-3">Valor</th>
              </tr>
            </thead>
            <tbody>
              {taxasPagamento.map((t, i) => (
                <tr key={i} className="border-t border-[var(--c-border)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span aria-hidden>{t.icon}</span>
                      {t.tipo}
                    </div>
                  </td>
                  <td className="px-4 py-3">{t.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function TabelaCartoes() {
  return (
    <>
      {/* Mobile (cards) */}
      <div className="sm:hidden grid gap-3">
        {taxasCartoes.map((c, i) => (
          <div key={i} className="card p-4">
            <div className="font-semibold">{c.bandeira}</div>
            <div className="mt-1 text-sm grid grid-cols-2 gap-2">
              <div>
                <div className="muted">Gatilho</div>
                <div className="font-medium">{c.gatilho}</div>
              </div>
              <div>
                <div className="muted">Taxa</div>
                <div className="font-medium">{c.taxa}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ≥ sm (tabela) */}
      <div className="hidden sm:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <caption className="sr-only">Tabela de gatilho e percentuais por bandeira</caption>
            <thead className="bg-[var(--c-surface-2)]">
              <tr>
                <th scope="col" className="text-left px-4 py-3">Bandeira</th>
                <th scope="col" className="text-left px-4 py-3">Gatilho</th>
                <th scope="col" className="text-left px-4 py-3">Taxa</th>
              </tr>
            </thead>
            <tbody>
              {taxasCartoes.map((c, i) => (
                <tr key={i} className="border-t border-[var(--c-border)]">
                  <td className="px-4 py-3">{c.bandeira}</td>
                  <td className="px-4 py-3">{c.gatilho}</td>
                  <td className="px-4 py-3">{c.taxa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function Taxas() {
  useEffect(() => {
    setPageSEO({
      title: "Progem • Taxas e formas de cobrança",
      description:
        "Transparência nas taxas com integração recomendada e opção de boletos via bancos. Simule custos e compare."
    });
  }, []);

  // --- Simulador (integração principal) ---
  const [valor, setValor] = useState(100);
  const [metodo, setMetodo] = useState("pix"); // pix | boleto | cartao
  const [flag, setFlag] = useState(taxasCartoes[0]?.bandeira || "Master");

  const flagObj = useMemo(
    () => taxasCartoes.find(f => f.bandeira === flag) || taxasCartoes[0],
    [flag]
  );

  const taxaAtual = useMemo(() => {
    const v = Number(valor) || 0;
    if (metodo === "pix") return 0.99;                         // Pix fixo (integração principal)
    if (metodo === "boleto") return 2.30;                      // Boleto liquidado (integração principal)
    // cartão → gatilho + (valor * %)
    const gat = parseMoneyBRL(flagObj?.gatilho);
    const pct = parsePercentBR(flagObj?.taxa);
    return gat + v * pct;
  }, [valor, metodo, flagObj]);

  const liquido = useMemo(() => {
    const v = Number(valor) || 0;
    return Math.max(0, v - (taxaAtual || 0));
  }, [valor, taxaAtual]);

  const aliquotaEfetiva = useMemo(() => {
    const v = Number(valor) || 0;
    if (!v) return 0;
    return (taxaAtual / v) * 100;
  }, [valor, taxaAtual]);

  // ---------- Analytics ----------
  const lastValueTracked = useRef(valor);
  const snapshot = () => ({
    value: Number(valor) || 0,
    method: metodo,
    flag,
    fee: Number(taxaAtual || 0),
    net: Number(liquido || 0),
    eff_rate: Number.isFinite(aliquotaEfetiva) ? Number(aliquotaEfetiva.toFixed(4)) : 0,
  });
  const fire = (event, extra = {}) => {
    try { track(event, { ...snapshot(), ...extra }); } catch {}
  };

  useEffect(() => {
    fire("fees_view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lastValueTracked.current === valor) return;
    const id = setTimeout(() => {
      lastValueTracked.current = valor;
      fire("fees_value_change");
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor]);

  // --------- UI ---------
  return (
    <div>
      <main className="mx-auto max-w-7xl px-4 py-12">
        {/* HERO / INTRO */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
            <ShieldCheck className="w-4 h-4 text-[color:var(--c-muted)]" />
            Integração recomendada
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mt-3">Taxas & Formas de Cobrança</h1>
          <p className="muted mt-2">
            Abaixo estão as modalidades e custos da integração principal. Se preferir usar seu próprio banco,
            há uma opção mais abaixo.
          </p>
          {/* ÚNICA menção discreta ao parceiro */}
          <p className="mt-2 text-[11px] muted">
            * Integração operada por parceiro homologado cel_cash.
          </p>

          {/* Resumo rápido (integração principal) */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {taxasPagamento.map((t, i) => (
              <div key={i} className="card p-4 flex items-center gap-3">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                  <span aria-hidden className="text-base">{t.icon}</span>
                </span>
                <div className="text-left">
                  <div className="font-semibold leading-tight">{t.tipo}</div>
                  <div className="text-sm">
                    <span className="font-medium">{t.valor}</span>{" "}
                    <span className="muted">{t.note}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="card p-4 flex items-center gap-3">
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                <CreditCard className="w-5 h-5 text-[color:var(--c-muted)]" />
              </span>
              <div className="text-left">
                <div className="font-semibold leading-tight">Cartões</div>
                <div className="text-sm">
                  <span className="font-medium">gatilho R$0,30</span>{" "}
                  <span className="muted">+ taxa (%) por bandeira</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Grelha principal: Tabelas + Simulador */}
        <div className="grid gap-10 lg:grid-cols-[1fr,420px]">
          {/* Coluna esquerda: tabelas (integração principal) */}
          <div className="grid gap-10 min-w-0">
            {/* Taxas de Pagamento */}
            <section aria-labelledby="tabela-pagamentos">
              <h2 id="tabela-pagamentos" className="text-xl font-semibold mb-4 text-center md:text-left">
                Taxas de Pagamento
              </h2>

              {/* Mobile cards + tabela ≥ sm */}
              <TabelaPagamentos />

              <p className="mt-3 text-xs text-center md:text-left muted">
                * Boleto só gera tarifa quando houver <strong>liquidação</strong> (pagamento confirmado).
              </p>
            </section>

            {/* Cartões */}
            <section aria-labelledby="tabela-cartoes">
              <h2 id="tabela-cartoes" className="text-xl font-semibold mb-4 text-center md:text-left">
                Cartões por Bandeira
              </h2>

              {/* Mobile cards + tabela ≥ sm */}
              <TabelaCartoes />

              <div className="mt-3 text-xs muted flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5" />
                <p>As taxas são definidas pelo adquirente/gateway e podem variar por campanha/volume.</p>
              </div>
            </section>

            {/* Opção discreta: emitir boletos pelo meu banco? (TecnoSpeed) */}
            <section aria-labelledby="banco-tecnospeed" className="mt-2">
              <details
                className="group rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)]"
                onToggle={(e)=> { if (e.target.open) try{ track("fees_tecnospeed_open"); } catch{} }}
              >
                <summary className="list-none cursor-pointer select-none p-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <h3 id="banco-tecnospeed" className="font-semibold">Posso emitir boletos pelo meu banco?</h3>
                    <p className="muted text-sm">Opção alternativa via integração de boletos com bancos tradicionais.</p>
                  </div>
                  <ChevronDown className="w-4 h-4 opacity-70 transition group-open:rotate-180" />
                </summary>

                <div className="px-4 pb-4">
                  <div className="grid gap-5 lg:grid-cols-2">
                    {/* Como funciona */}
                    <article className="card p-5">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[color:var(--c-muted)]" />
                        <h4 className="font-semibold">Como funciona</h4>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm">
                        {tecnospeed.bullets.map((t) => (
                          <li key={t} className="muted">• {t}</li>
                        ))}
                        <li className="muted">• Bancos: {tecnospeed.bancos.join(", ")}.</li>
                      </ul>
                      <div className="text-[11px] muted mt-3">parceria: TecnoSpeed</div>
                    </article>

                    {/* Custos */}
                    <article className="card p-5">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-[color:var(--c-muted)]" />
                        <h4 className="font-semibold">Custos & Operação</h4>
                      </div>
                      <div className="mt-3 text-sm">
                        <div className="rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)] p-3">
                          <p><strong>Custo Progem por registro:</strong> {tecnospeed.custoRegistro} (pode reduzir por volume)</p>
                          <p className="mt-1">+ <strong>Tarifa do banco</strong> (conforme convênio).</p>
                          <p className="mt-1">Emissão exige <strong>créditos pré-pagos</strong> no Progem.</p>
                        </div>
                        <div className="mt-3 flex items-start gap-2 text-xs muted">
                          <Info className="w-4 h-4 mt-0.5" />
                          <span>
                            A velocidade de integração depende do banco e do gerente responsável.
                          </span>
                        </div>
                      </div>
                    </article>
                  </div>

                  {/* Comparativo em 2 cartões curtos */}
                  <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    <article className="card p-5">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-[color:var(--c-muted)]" />
                        <h4 className="font-semibold">Quando preferimos a integração principal</h4>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm">
                        <li className="muted">• Pix, Boleto liquidado e Cartões no mesmo arranjo.</li>
                        <li className="muted">• Liquidação mais rápida e conciliação automática.</li>
                        <li className="muted">• API robusta; autonomia e integração em até <strong>48h úteis</strong>.</li>
                        <li className="muted">• Caixa integrado: entradas, taxas e repasses organizados.</li>
                      </ul>
                    </article>

                    <article className="card p-5">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-[color:var(--c-muted)]" />
                        <h4 className="font-semibold">Quando faz sentido usar seu banco</h4>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm">
                        <li className="muted">• Política interna exige <strong>convênio direto</strong> com o banco.</li>
                        <li className="muted">• Operação focada exclusivamente em <strong>boletos</strong>.</li>
                        <li className="muted">• Você já possui tarifas bancárias negociadas.</li>
                      </ul>
                    </article>
                  </div>

                  {/* CTAs */}
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link to="/demo" data-cta="demo" className="btn btn-primary btn-demo">
                      Escolher a melhor integração
                    </Link>
                    <Link to="/contato" className="btn btn-ghost">
                      Falar com um especialista
                    </Link>
                  </div>
                </div>
              </details>
            </section>
          </div>

          {/* Coluna direita: Simulador (integração principal) */}
          <aside aria-labelledby="simulador-taxas" className="lg:sticky lg:top-24 h-fit min-w-0">
            <div className="card p-5">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[color:var(--c-muted)]" />
                <h2 id="simulador-taxas" className="text-lg font-semibold">Simulador de custo</h2>
              </div>
              <p className="muted text-sm mt-1">
                Estime taxa e valor líquido por transação.
              </p>

              {/* Valor */}
              <div className="mt-4">
                <label htmlFor="valor" className="label">Valor da transação</label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm muted">R$</span>
                  <input
                    id="valor"
                    type="number"
                    min={0}
                    step="0.01"
                    inputMode="decimal"
                    value={valor}
                    onChange={(e)=> setValor(e.target.value)}
                    onBlur={()=> fire("fees_value_blur")}
                    className="input w-full max-w-[220px]"
                    aria-describedby="valor-ajuda"
                  />
                </div>
                <div id="valor-ajuda" className="text-xs muted mt-1">
                  Ex.: 89,90
                </div>
              </div>

              {/* Método */}
              <div className="mt-4">
                <span className="label">Método</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    { id: "pix", label: "Pix" },
                    { id: "boleto", label: "Boleto (Liquidado)" },
                    { id: "cartao", label: "Cartão" },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={()=>{
                        setMetodo(opt.id);
                        fire("fees_method_select", { method: opt.id });
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                        metodo === opt.id
                          ? "border-[var(--c-primary)] bg-[var(--c-surface-2)]"
                          : "border-[var(--c-border)] hover:bg-[var(--c-surface-2)]"
                      }`}
                      aria-pressed={metodo === opt.id}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bandeira (se cartao) */}
              {metodo === "cartao" && (
                <div className="mt-4 min-w-0">
                  <label htmlFor="bandeira" className="label">Bandeira</label>
                  <div className="mt-1">
                    <select
                      id="bandeira"
                      value={flag}
                      onChange={(e)=>{
                        setFlag(e.target.value);
                        fire("fees_flag_select", { flag: e.target.value });
                      }}
                      className="input w-full max-w-[300px]"
                      aria-describedby="ajuda-bandeira"
                    >
                      {taxasCartoes.map((c)=> (
                        <option key={c.bandeira} value={c.bandeira}>
                          {c.bandeira}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div id="ajuda-bandeira" className="text-xs muted mt-1">
                    Gatilho <strong>{flagObj?.gatilho}</strong> + taxa <strong>{flagObj?.taxa}</strong> sobre {formatBRL(Number(valor)||0)}.
                  </div>
                </div>
              )}

              {/* Resultado */}
              <div className="mt-5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-4">
                <div className="text-sm uppercase tracking-wide text-[color:var(--c-muted)]">Resultado</div>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="muted">Taxa estimada</div>
                    <div className="text-lg font-semibold">
                      {formatBRL(taxaAtual)}
                    </div>
                    {metodo === "cartao" && (
                      <div className="text-xs muted">
                        {flagObj?.gatilho} + {flagObj?.taxa} de {formatBRL(Number(valor)||0)}
                      </div>
                    )}
                    {metodo !== "cartao" && (
                      <div className="text-xs muted">
                        {metodo === "pix" ? "Pix fixo por transação (R$ 0,99)" : "Boleto pago (R$ 2,30 por liquidação)"}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="muted">Você recebe</div>
                    <div className="text-lg font-semibold">{formatBRL(liquido)}</div>
                    {Number(valor) > 0 && (
                      <div className="text-xs muted">Alíquota efetiva ≈ {aliquotaEfetiva.toFixed(2)}%</div>
                    )}
                  </div>
                </div>

                {/* CTAs do simulador */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <Link
                    to="/demo"
                    data-cta="demo"
                    className="btn btn-primary btn-demo w-full"
                    onClick={()=> fire("fees_cta_demo")}
                  >
                    Falar com um especialista
                  </Link>
                  <Link
                    to="/planos"
                    className="btn btn-ghost w-full"
                    onClick={()=> fire("fees_cta_planos")}
                  >
                    Ver Planos
                  </Link>
                </div>

                {/* Observações */}
                <div className="mt-3 text-[12px] muted leading-relaxed">
                  Valores indicativos. Antecipação de cartão (se habilitada) possui custo do adquirente.
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-3">Perguntas frequentes</h2>
          <Accordion items={faqs} />
        </section>

        {/* Observações gerais */}
        <section className="mt-8">
          <div className="rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] p-4">
            <div className="flex items-start gap-2 text-sm">
              <Info className="w-4 h-4 mt-0.5 text-[color:var(--c-muted)]" />
              <p className="muted">
                As condições podem variar por volume, risco e adquirente/banco. Em caso de campanha promocional,
                faixas e percentuais podem ser ajustados. Nosso time ajuda a definir o melhor arranjo.
              </p>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="mt-10">
          <div className="card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-sm uppercase tracking-wide text-[color:var(--c-muted)]">
                Precisa de ajuda?
              </div>
              <h3 className="text-2xl font-semibold mt-1">Vamos calcular o melhor cenário para sua operação</h3>
              <p className="muted">Simulamos custos por volume, bandeiras, bancos e meios de pagamento.</p>
            </div>
            <Link
              to="/demo"
              data-cta="demo"
              className="btn btn-primary btn-demo"
            >
              Falar com um especialista
            </Link>
          </div>
        </section>
      </main>

      {/* CTA fixo (mobile) */}
      <BottomDockCTA />
      <Footer />
    </div>
  );
}
