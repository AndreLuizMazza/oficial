import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { setPageSEO } from "@/lib/seo"
import { BFF } from "@/lib/bff"
import clsx from "clsx"
import {
  Check, ShieldCheck, Globe, Handshake, Info, Cable, X, MessageCircle,
  LineChart, Building2  // ✅ novos ícones p/ prova social
} from "lucide-react"
import CardMotion from "@/components/CardMotion"
import { track } from "@/lib/analytics"

function formatBRL(n){
  if (n == null) return "Sob consulta"
  try { return Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }
  catch { return `R$ ${Number(n).toFixed(2)}` }
}

/** Tooltip simples */
function Tooltip({ id, content, children, side="top" }){
  const pos = side === "top"
    ? "bottom-full mb-2 left-1/2 -translate-x-1/2"
    : side === "bottom"
      ? "top-full mt-2 left-1/2 -translate-x-1/2"
      : side === "left"
        ? "right-full mr-2 top-1/2 -translate-y-1/2"
        : "left-full ml-2 top-1/2 -translate-y-1/2"
  return (
    <span className="relative inline-flex group focus-within:outline-none">
      {children}
      <span
        role="tooltip"
        id={id}
        className={clsx(
          "pointer-events-none absolute z-50 hidden group-hover:block group-focus-within:block",
          "rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] px-3 py-2 text-xs shadow-xl w-72",
          pos
        )}
      >
        {content}
      </span>
    </span>
  )
}

/** Faixas oficiais por nº de contratos ativos */
const TIERS = [
  { id: "start",       name: "Start",      min: 0,    max: 500,   price: 250, rangeLabel: "0 – 500 contratos" },
  { id: "pro",         name: "Pro",        min: 501,  max: 1000,  price: 350, rangeLabel: "501 – 1.000 contratos" },
  { id: "enterprise1", name: "Enterprise", min: 1001, max: 2000,  price: 500, rangeLabel: "1.001 – 2.000 contratos" },
  { id: "enterprise2", name: "Enterprise", min: 2001, max: 3000,  price: 700, rangeLabel: "2.001 – 3.000 contratos" },
]
function findTierByContracts(qtd){
  if (qtd == null || Number.isNaN(qtd)) return null
  const n = Math.max(0, Math.floor(qtd))
  const tier = TIERS.find(t => n >= t.min && n <= t.max)
  if (tier) return tier
  if (n > 3000) return { id:"enterprise+", name:"Enterprise", min:3001, max:Infinity, price:null, rangeLabel:"+3.000 contratos" }
  return null
}

/** Tabela Enterprise para o card */
const ENTERPRISE_BULLETS = [
  { range: "1.001 – 2.000 contratos", price: 500 },
  { range: "2.001 – 3.000 contratos", price: 700 },
  { range: "+3.000 contratos",        price: null },
]

const COMMON_FEATURES = [
  "Gestão de contratos e assinaturas",
  "Cobrança recorrente (boletos/carnês)",
  "Site institucional whitelabel",
  "App do Associado (iOS/Android)",
  "Apps do Vendedor e Cobrador (online/offline)",
  "Memorial Digital integrado",
  "Analytics & KPIs em tempo real",
  "APIs, webhooks e BFF",
]

const FALLBACK = [
  {
    id: "start",
    name: "Start",
    price_month: 250,
    cap: "até 500 contratos ativos",
    capNote: "Considera contratos com status 'ativo' no mês de faturamento.",
    icon: ShieldCheck,
  },
  {
    id: "pro",
    name: "Pro",
    price_month: 350,
    cap: "até 1.000 contratos ativos",
    capNote: "Ao ultrapassar 1.000, migre para Enterprise ou contrate add-on por faixa.",
    highlight: true,
    icon: Globe,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price_month: null,
    cap: "acima de 1.000 contratos",
    capNote: "Faixas progressivas 1.001–2.000 e 2.001–3.000. Acima de 3.000: sob consulta.",
    icon: Handshake,
  },
]

const ICONS = { start: ShieldCheck, pro: Globe, enterprise: Handshake }

/** CTA flutuante */
function FloatingCTA({ visible, onClose, period, contracts }){
  if (!visible) return null
  return (
    <div className="fixed right-4 bottom-4 z-50" aria-live="polite">
      <div className="rounded-2xl shadow-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-4 max-w-xs">
        <div className="flex items-start gap-3">
          <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
            <MessageCircle className="w-5 h-5 text-[color:var(--c-muted)]" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold leading-tight">Fale com vendas</div>
            <p className="text-sm muted mt-1">
              Tire dúvidas sobre limites de contratos, add-ons e migração.
            </p>
            <div className="mt-3">
              <a
                href="/contato"
                className="btn btn-primary btn-sm w-full"
                onClick={() => {
                  track("pricing_cta_click", {
                    origin: "floating_cta",
                    planId: "enterprise",
                    planName: "Enterprise",
                    period,
                    contracts,
                  })
                }}
              >
                Solicitar Demonstração
              </a>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm shrink-0"
            aria-label="Fechar"
            onClick={onClose}
          >
            <X className="w-4 h-4"/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Planos(){
  const [searchParams, setSearchParams] = useSearchParams()

  const [periodo, setPeriodo] = useState("mensal")
  const [plans, setPlans] = useState(FALLBACK)
  const [ctaOpen, setCtaOpen] = useState(false)
  const comparativoRef = useRef(null)

  // --- Slider dinâmico: mensal 0–3500 | anual 0–10000 ---
  const sliderMax = periodo === "mensal" ? 3500 : 10000
  const [contracts, setContracts] = useState(500)
  const selectedTier = useMemo(() => findTierByContracts(contracts), [contracts])
  const descontoAnual = 0.15

  // utils
  const clampContracts = (n) => Math.max(0, Math.min(sliderMax, Math.floor(Number(n) || 0)))
  const roundStep = (n, step = 50) => Math.round((Number(n)||0) / step) * step
  const setContractsSafe = (v, { emit=true } = {}) => {
    const newVal = clampContracts(v)
    setContracts(prev => {
      if (emit) {
        track("pricing_contracts_input", { value: newVal, period: periodo })
      }
      return newVal
    })
  }

  // 1) Ler query params na montagem
  useEffect(() => {
    const qContracts = searchParams.get("contracts")
    const qPeriodo = searchParams.get("periodo")
    if (qPeriodo === "mensal" || qPeriodo === "anual") setPeriodo(qPeriodo)
    setTimeout(() => {
      if (qContracts != null) setContractsSafe(qContracts, { emit:false })
    }, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 2) Sync URL (replace)
  useEffect(() => {
    const currContracts = Number(searchParams.get("contracts"))
    const currPeriodo = searchParams.get("periodo")
    const nextContracts = Math.max(0, Math.min(sliderMax, Math.floor(Number(contracts) || 0)))
    const nextPeriodo = periodo
    const changed = currContracts !== nextContracts || currPeriodo !== nextPeriodo
    if (changed) {
      const next = new URLSearchParams(searchParams)
      next.set("contracts", String(nextContracts))
      next.set("periodo", nextPeriodo)
      setSearchParams(next, { replace: true })
    }
  }, [contracts, periodo, sliderMax, searchParams, setSearchParams])

  // 2.1) Reclampar quando sliderMax muda
  useEffect(() => {
    setContractsSafe(contracts, { emit:false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderMax])

  // SEO
  useEffect(()=>{
    setPageSEO({
      title: "Progem • Planos",
      description: "Todos os planos incluem os mesmos recursos. O valor varia pelo número de contratos ativos."
    })
  },[])

  // Dados BFF
  useEffect(()=>{
    ;(async()=>{
      try{
        const apiPlans = await BFF.planos()
        if (Array.isArray(apiPlans) && apiPlans.length){
          const normalized = ["start","pro","enterprise"].map((key, idx) => {
            const p = apiPlans[idx] || {}
            const fallback = FALLBACK[idx]
            return {
              id: p.id?.toString() || fallback.id,
              name: fallback.name,
              price_month: key === "enterprise" ? null : Number(p.valor_unitario ?? fallback.price_month),
              cap: fallback.cap,
              capNote: fallback.capNote,
              highlight: Boolean(p.destaque ?? fallback.highlight),
              icon: ICONS[key],
            }
          })
          setPlans(normalized)
        }
      }catch(e){ console.warn("BFF.planos falhou, usando fallback", e) }
    })()
  },[])

  // CTA flutuante
  useEffect(()=>{
    const el = comparativoRef.current
    if (!el) return
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) setCtaOpen(true) }), { threshold: 0.2 })
    obs.observe(el)
    return ()=> obs.disconnect()
  },[])

  // Cards com preço por período
  const planosComPreco = useMemo(()=> plans.map(p=>{
    const mensal = p.price_month
    const anual = mensal != null ? mensal * 12 * (1 - descontoAnual) : null
    return { ...p, displayPrice: periodo === "mensal" ? mensal : anual, suffix: periodo === "mensal" ? "/mês" : "/ano", badge: p.highlight ? "Recomendado" : null }
  }),[plans, periodo])

  // Destaque pelo simulador
  const highlightedBySim = useMemo(()=>{
    if (!selectedTier) return null
    if (selectedTier.id === "start") return "start"
    if (selectedTier.id === "pro") return "pro"
    if (selectedTier.id.startsWith("enterprise")) return "enterprise"
    if (selectedTier.id === "enterprise+") return "enterprise"
    return null
  },[selectedTier])

  // Preço do simulador
  const simulatedPrice = useMemo(()=>{
    if (!selectedTier || selectedTier.price == null) return null
    const mensal = selectedTier.price
    return periodo === "mensal" ? mensal : mensal * 12 * (1 - descontoAnual)
  },[selectedTier, periodo])

  // ---- dataLayer events ----
  useEffect(() => { track("pricing_period_change", { period: periodo }) }, [periodo])

  const prevTierRef = useRef(selectedTier?.id)
  useEffect(() => {
    const prev = prevTierRef.current
    const next = selectedTier?.id
    if (next && prev !== next) {
      track("pricing_tier_change", {
        tierId: selectedTier.id,
        tierName: selectedTier.name,
        contracts,
        period: periodo,
      })
      prevTierRef.current = next
    }
  }, [selectedTier, contracts, periodo])

  const TogglePeriodo = () => (
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
          {opt === "mensal" ? "Mensal" : "Anual — 15% OFF"}
        </button>
      ))}
    </div>
  )

  const IconePlano = ({icon:Icon}) => (
    <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)]">
      <Icon className="w-6 h-6 text-[color:var(--c-muted)]"/>
    </span>
  )

  const PRESETS = [
    { n:500,  label:"500",   tip:"Start: até 500 contratos" },
    { n:1000, label:"1.000", tip:"Pro: até 1.000 contratos" },
    { n:2000, label:"2.000", tip:"Enterprise: 1.001–2.000" },
    { n:3000, label:"3.000", tip:"Enterprise: 2.001–3.000" },
    { n:3500, label:"+3.000", tip:"Enterprise: acima de 3.000 (sob consulta)" },
  ]
  const onPreset = (n, label) => {
    track("pricing_preset_click", { value: n, label, period: periodo })
    setContractsSafe(n)
  }

  const isSobConsulta = contracts > 3000
  const atMax = contracts >= sliderMax

  return (
    <div>
      <Header/>
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">Escolha o plano ideal</h1>
            <p className="muted mt-2 text-lg">
              Todos os planos incluem os mesmos recursos. O valor varia conforme o <strong>número de contratos ativos</strong>.
            </p>
          </div>
          <TogglePeriodo />
        </div>

        {/* ✅ PROVA SOCIAL */}
        <section aria-label="Prova social" className="mb-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card p-4 flex items-center gap-3">
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                <LineChart className="w-5 h-5 text-[color:var(--c-muted)]" />
              </span>
              <div>
                <div className="font-semibold leading-tight">R$ 5 mi+ processados/mês</div>
                <div className="muted text-[13px]">Volume transacionado em pagamentos recorrentes</div>
              </div>
            </div>
            <div className="card p-4 flex items-center gap-3">
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                <Building2 className="w-5 h-5 text-[color:var(--c-muted)]" />
              </span>
              <div>
                <div className="font-semibold leading-tight">Foco no setor funerário</div>
                <div className="muted text-[13px]">Operando desde 2019 para empresas do segmento</div>
              </div>
            </div>
            <div className="card p-4 flex items-center gap-3">
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                <ShieldCheck className="w-5 h-5 text-[color:var(--c-muted)]" />
              </span>
              <div>
                <div className="font-semibold leading-tight">SLA médio 99,9%</div>
                <div className="muted text-[13px]">Disponibilidade e atenção a operações críticas</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Simulador --- */}
        <section className="card p-4 md:p-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex-1">
              <label htmlFor="contracts-range" className="text-sm font-medium">
                Quantidade de contratos ativos
              </label>
              <input
                id="contracts-range"
                type="range"
                min={0}
                max={sliderMax}
                step={50}
                value={contracts}
                onChange={(e) => setContractsSafe(roundStep(e.target.value))}
                className="w-full mt-2"
                aria-valuemin={0}
                aria-valuemax={sliderMax}
                aria-valuenow={contracts}
              />
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={sliderMax}
                  step={50}
                  value={contracts}
                  onChange={(e) => setContractsSafe(e.target.value)}
                  onBlur={(e) => setContractsSafe(roundStep(e.target.value))}
                  className={clsx(
                    "w-36 px-3 py-2 rounded-lg border bg-[var(--c-surface)]",
                    atMax ? "border-[var(--c-border)] opacity-70 cursor-not-allowed" : "border-[var(--c-border)]"
                  )}
                  aria-label="Digite a quantidade de contratos"
                  disabled={atMax}
                  aria-disabled={atMax}
                  title={atMax ? "Você atingiu o máximo para este período" : undefined}
                />
                <span className="muted text-sm">contratos</span>
                {atMax && (
                  <span className="text-xs px-2 py-1 rounded-md border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                    Máximo para {periodo}: {sliderMax.toLocaleString("pt-BR")}
                  </span>
                )}
              </div>

              {/* atalhos/pílulas */}
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { n:500,  label:"500",   tip:"Start: até 500 contratos" },
                  { n:1000, label:"1.000", tip:"Pro: até 1.000 contratos" },
                  { n:2000, label:"2.000", tip:"Enterprise: 1.001–2.000" },
                  { n:3000, label:"3.000", tip:"Enterprise: 2.001–3.000" },
                  { n:3500, label:"+3.000", tip:"Enterprise: acima de 3.000 (sob consulta)" },
                ].filter(p => p.n <= sliderMax).map((p) => (
                  <Tooltip key={p.n} id={`preset-${p.n}`} content={p.tip}>
                    <button
                      type="button"
                      onClick={() => {
                        track("pricing_preset_click", { value: p.n, label: p.label, period: periodo })
                        setContractsSafe(p.n)
                      }}
                      className={clsx(
                        "px-3 py-1.5 rounded-lg border text-sm transition",
                        contracts === p.n
                          ? "border-[var(--c-primary)] bg-[var(--c-surface-2)]"
                          : "border-[var(--c-border)] hover:bg-[var(--c-surface-2)]"
                      )}
                      aria-pressed={contracts === p.n}
                      aria-label={`Definir ${p.label} contratos`}
                    >
                      {p.label}
                    </button>
                  </Tooltip>
                ))}
              </div>
            </div>

            <div className="relative rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-4 min-w-[280px]">
              {isSobConsulta && (
                <span className="absolute -top-3 right-3 px-2 py-0.5 text-xs rounded-md border border-[var(--c-border)] bg-[var(--c-surface)]">
                  Sob consulta
                </span>
              )}
              <div className="text-sm uppercase tracking-wide text-[color:var(--c-muted)]">Simulação</div>
              <div className="mt-1 font-semibold">
                {selectedTier?.name || "—"} <span className="muted">({selectedTier?.rangeLabel || "—"})</span>
              </div>
              <div className="mt-1 text-2xl font-bold">
                {formatBRL(simulatedPrice)}
                {simulatedPrice != null && (
                  <span className="text-sm font-medium muted"> {periodo === "mensal" ? "/mês" : "/ano"}</span>
                )}
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-[color:var(--c-muted)]">
            Os valores são estimativas com base na faixa de contratos ativos e no período selecionado.
            Impostos e tarifas de meios de pagamento não estão incluídos.
            Consulte também a página <a href="/taxas" className="underline">Taxas & Cobrança</a>.
          </p>
        </section>

        {/* --- Cards de planos --- */}
        <section className="grid gap-6 md:grid-cols-3">
          {planosComPreco.map(pl=>(
            <CardMotion
              key={pl.id}
              className={clsx(
                "card p-6 flex flex-col",
                (pl.highlight || (pl.id === highlightedBySim)) && "ring-2 ring-[var(--c-primary)]"
              )}
              tabIndex={0}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconePlano icon={pl.icon}/>
                  <div>
                    <h3 className="text-lg font-semibold">{pl.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="badge">
                        {pl.id === "start" ? "até 500" : pl.id === "pro" ? "até 1.000" : "acima de 1.000"} contratos
                      </span>
                      <Tooltip id={`tip-${pl.id}`} content={
                        pl.id === "enterprise"
                          ? "1.001–2.000: R$ 500/mês • 2.001–3.000: R$ 700/mês • +3.000: sob consulta"
                          : "Contagem considera contratos com status 'ativo' no mês de faturamento."
                      }>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-[var(--c-border)]"
                        >
                          <Info className="w-3.5 h-3.5 text-[color:var(--c-muted)]" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                {(pl.badge || pl.id === highlightedBySim) && <span className="badge">{pl.badge || "Recomendado"}</span>}
              </div>

              <div className="mt-4 text-3xl font-bold">
                {pl.id !== "enterprise" ? (
                  <>
                    {formatBRL(pl.displayPrice)} <span className="text-sm font-medium muted">{pl.suffix}</span>
                  </>
                ) : (
                  <div className="text-xl font-semibold">Tabelas por faixa</div>
                )}
              </div>

              {pl.id === "enterprise" && (
                <ul className="mt-2 space-y-1.5 text-sm">
                  {ENTERPRISE_BULLETS.map((b, i) => {
                    const base = b.price
                    const price = base == null ? null
                      : (periodo === "mensal" ? base : base * 12 * (1 - 0.15))
                    return (
                      <li
                        key={i}
                        className="flex items-center justify-between rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)] px-3 py-2"
                      >
                        <span className="muted">{b.range}</span>
                        <span className="font-medium">
                          {price != null ? `${formatBRL(price)}${periodo === "mensal" ? "/mês" : "/ano"}` : "Sob consulta"}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              )}

              <div className="mt-4 text-sm muted flex items-center gap-2">
                <Check className="w-4 h-4" /> Todos os recursos incluídos
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <a
                  href={pl.id === "enterprise" ? "/contato" : "/demo"}
                  className="btn btn-primary w-full text-center"
                  onClick={() => {
                    track("pricing_cta_click", {
                      origin: "plan_card",
                      planId: pl.id,
                      planName: pl.name,
                      period: periodo,
                      contracts,
                    })
                  }}
                >
                  {pl.id === "enterprise" ? "Falar com Vendas" : "Solicitar Demonstração"}
                </a>
              </div>
            </CardMotion>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-2">Todos os planos incluem</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {COMMON_FEATURES.map(f=>(
              <CardMotion key={f} className="card p-4 flex items-start gap-3" tabIndex={0}>
                <Check className="w-4 h-4 mt-1" /> <span className="text-sm">{f}</span>
              </CardMotion>
            ))}
          </div>

          {/* APIs e integrações */}
          <div className="card p-5 mt-6">
            <h4 className="font-semibold">APIs e integrações</h4>
            <p className="muted mt-1 text-sm">
              Conecte seu ERP, site ou CRM às APIs do Progem e à NaLápide.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="/developers"
                className="btn btn-ghost text-sm inline-flex items-center gap-2"
                onClick={() => {
                  track("pricing_cta_click", {
                    origin: "integrations_card",
                    planId: "integrations_docs",
                    planName: "APIs e Integrações — Docs",
                    period: periodo,
                    contracts,
                  })
                }}
              >
                <Cable className="w-4 h-4"/> Ver documentação
              </a>
              <a
                href="/demo"
                className="btn btn-primary text-sm"
                onClick={() => {
                  track("pricing_cta_click", {
                    origin: "integrations_card",
                    planId: "integrations_contact",
                    planName: "APIs e Integrações — Contato",
                    period: periodo,
                    contracts,
                  })
                }}
              >
                Falar com especialista
              </a>
            </div>
          </div>
        </section>

        <section className="mt-12" ref={comparativoRef}>
          <h2 className="text-2xl font-semibold mb-4">Comparativo operacional</h2>
          <div className="overflow-x-auto border border-[var(--c-border)] rounded-xl">
            <table className="min-w-[720px] w-full text-sm">
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
                  <td className="px-4 py-3 font-medium">SLA de suporte</td>
                  <td className="px-4 py-3">Até 24h úteis</td>
                  <td className="px-4 py-3">Até 8h úteis</td>
                  <td className="px-4 py-3">Até 4h úteis (prioritário)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <FloatingCTA
          visible={ctaOpen}
          onClose={()=>setCtaOpen(false)}
          period={periodo}
          contracts={contracts}
        />
      </main>
      <Footer/>
    </div>
  )
}
