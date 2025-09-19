// src/pages/Taxas.jsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { setPageSEO } from "@/lib/seo";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Calculator, Info, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { track } from "@/lib/analytics";

// --- Dados de referência ---
const taxasPagamento = [
  { tipo: "Pix", valor: "R$0,99", icon: "💠", note: "por transação" },
  { tipo: "Boleto (Liquidado)", valor: "R$2,30", icon: "📄", note: "somente quando pago" },
];

const taxasCartoes = [
  { bandeira: "Mastercard",        gatilho: "R$0,29", taxa: "3,59%" },
  { bandeira: "Visa",              gatilho: "R$0,29", taxa: "3,59%" },
  { bandeira: "Elo",               gatilho: "R$0,29", taxa: "4,09%" },
  { bandeira: "American Express",  gatilho: "R$0,29", taxa: "4,79%" },
  { bandeira: "Hipercard",         gatilho: "R$0,29", taxa: "3,79%" },
  { bandeira: "Discover",          gatilho: "R$0,29", taxa: "4,09%" },
  { bandeira: "Diners Club",       gatilho: "R$0,29", taxa: "4,09%" },
  { bandeira: "JCB",               gatilho: "R$0,29", taxa: "4,09%" },
  { bandeira: "EnRoute",           gatilho: "R$0,29", taxa: "4,09%" },
  { bandeira: "Aura",              gatilho: "R$0,29", taxa: "4,09%" },
];

const faqs = [
  {
    q: "O que é considerado um contrato ativo?",
    a: "Contratos com status 'ativo' dentro do período de faturamento. Cancelados, suspensos ou em implantação não entram na contagem."
  },
  {
    q: "Há cobrança para boletos emitidos, baixados ou cancelados?",
    a: "Não. A taxa de boleto aplica-se apenas quando há liquidação (pagamento confirmado). Emissão, baixa manual ou cancelamento não geram tarifa."
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

export default function Taxas() {
  useEffect(() => {
    setPageSEO({
      title: "Progem • Taxas e formas de cobrança",
      description:
        "Transparência nas taxas: Pix, boleto liquidado e cartões por bandeira. Entenda gatilhos, percentuais e perguntas frequentes."
    });
  }, []);

  // --- Simulador ---
  const [valor, setValor] = useState(100);
  const [metodo, setMetodo] = useState("pix"); // pix | boleto | cartao
  const [flag, setFlag] = useState(taxasCartoes[0]?.bandeira || "Mastercard");

  const flagObj = useMemo(
    () => taxasCartoes.find(f => f.bandeira === flag) || taxasCartoes[0],
    [flag]
  );

  const taxaAtual = useMemo(() => {
    const v = Number(valor) || 0;
    if (metodo === "pix") return 0.99;                         // ✅ SEMPRE R$ 0,99
    if (metodo === "boleto") return 2.30;                      // boleto liquidado fixo
    // cartão → gatilho + (valor * %)
    const gat = parseMoneyBRL(flagObj?.gatilho);               // ex.: "R$0,29" → 0.29
    const pct = parsePercentBR(flagObj?.taxa);                 // ex.: "3,59%" → 0.0359
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

  // ---------- Analytics do simulador ----------
  const lastValueTracked = useRef(valor);

  // snapshot comum para payload
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
    fire("fees_simulator_view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce para mudanças de valor
  useEffect(() => {
    if (lastValueTracked.current === valor) return;
    const id = setTimeout(() => {
      lastValueTracked.current = valor;
      fire("fees_simulator_value_change");
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor]);

  // --------- UI ---------
  return (
    <div>
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-12">
        {/* HERO / INTRO */}
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">Taxas & Formas de Cobrança</h1>
          <p className="muted mt-2">
            Transparência nas modalidades e nos custos por transação. Veja abaixo os valores e simule o seu cenário.
          </p>

        {/* Resumo rápido */}
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
                  <span className="font-medium">gatilho R$0,29</span>{" "}
                  <span className="muted">+ taxa (%) por bandeira</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Grelha principal: Tabelas + Simulador */}
        <div className="grid gap-10 lg:grid-cols-[1fr,420px]">
          {/* Coluna esquerda: tabelas */}
          <div className="grid gap-10 min-w-0">
            {/* Taxas de Pagamento */}
            <section aria-labelledby="tabela-pagamentos">
              <h2 id="tabela-pagamentos" className="text-xl font-semibold mb-4 text-center md:text-left">
                Taxas de Pagamento
              </h2>
              <div className="card overflow-hidden">
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
              <p className="mt-3 text-xs text-center md:text-left muted">
                * Boleto só gera tarifa quando houver <strong>liquidação</strong> (pagamento confirmado).
              </p>
            </section>

            {/* Taxas de Cartões */}
            <section aria-labelledby="tabela-cartoes">
              <h2 id="tabela-cartoes" className="text-xl font-semibold mb-4 text-center md:text-left">
                Taxas de Cartões por Bandeira
              </h2>
              <div className="card overflow-hidden">
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
              <div className="mt-3 text-xs muted flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5" />
                <p>As taxas são definidas pelo adquirente/gateway e podem variar por campanha/volume.</p>
              </div>
            </section>
          </div>

          {/* Coluna direita: Simulador */}
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
                    value={valor}
                    onChange={(e)=> setValor(e.target.value)}
                    onBlur={()=> fire("fees_simulator_value_blur")}
                    className="input w-40"
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
                        fire("fees_simulator_method_select", { method: opt.id });
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
                        fire("fees_simulator_flag_select", { flag: e.target.value });
                      }}
                      className="input w-full sm:w-64 md:w-72"
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
                    onClick={()=> fire("fees_simulator_cta_demo")}
                  >
                    Falar com um especialista
                  </Link>
                  <Link
                    to="/planos"
                    className="btn btn-ghost w-full"
                    onClick={()=> fire("fees_simulator_cta_planos")}
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
                As condições podem variar por volume, risco e adquirente. Em caso de campanha promocional,
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
              <p className="muted">Simulamos custos por volume, bandeira e meios de pagamento.</p>
            </div>
            <Link
              to="/demo"
              data-cta="demo"
              className="btn btn-primary btn-demo"
              onClick={()=> fire("fees_simulator_cta_final_demo")}
            >
              Falar com um especialista
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
