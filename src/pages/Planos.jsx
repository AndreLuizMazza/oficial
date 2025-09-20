// src/pages/Planos.jsx
import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import Footer from "@/components/Footer"
import { createPortal } from "react-dom"
import { setPageSEO } from "@/lib/seo"
import { BFF } from "@/lib/bff"
import clsx from "clsx"

import {
  Check, ShieldCheck, Globe, Handshake, Info, Cable, X,
  LineChart, Building2, Link2 as LinkIcon, MessageCircle, Users
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

/** Faixas por nº de contratos ativos */
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

// Política de usuários
const INCLUDED_USERS = { start: 5, pro: 5, enterprise: 10 }
const EXTRA_USER_PRICE = 10 // R$/mês por usuário adicional
const usersIncludedFor = (planId) =>
  planId === "start" ? INCLUDED_USERS.start
  : planId === "pro" ? INCLUDED_USERS.pro
  : INCLUDED_USERS.enterprise

// Features (termo padronizado: Site Premium)
const COMMON_FEATURES = [
  "Gestão de contratos e assinaturas",
  "Cobrança recorrente (boletos/carnês)",
  "Site Premium institucional",
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

const WHATSAPP_MENSAL = 150 // custo fixo/mês (mensagens ilimitadas)
const SITE_APP_MENSAL_STARTPRO = 199 // Site Premium + App do Associado (Start/Pro). Enterprise = sob consulta.

/** Marcas do slider */
function TierMarks({ max=3500 }){
  const marks = [
    { v: 500,  label: "500" },
    { v: 1000, label: "1.000" },
    { v: 2000, label: "2.000" },
    { v: 3000, label: "3.000" },
  ].filter(m => m.v <= max)

  return (
    <div className="mt-1 relative h-5">
      <div className="absolute inset-x-0 top-2 h-0.5 bg-[var(--c-border)] rounded" />
      {marks.map(m => (
        <div
          key={m.v}
          className="absolute top-0 -translate-x-1/2"
          style={{ left: `${(m.v/max)*100}%` }}
        >
          <div className="w-px h-2.5 bg-[var(--c-border)] mx-auto" />
          <div className="text-[10px] text-[color:var(--c-muted)] mt-0.5">{m.label}</div>
        </div>
      ))}
    </div>
  )
}

function FloatingCTA({ visible, onClose, period, contracts }) {
  if (!visible) return null

  const content = (
    <div
      className="hidden md:block fixed right-4 z-[90] pointer-events-none"
      style={{ bottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}
      aria-live="polite"
      role="dialog"
      aria-label="Fale com vendas"
    >
      <div className="pointer-events-auto rounded-2xl shadow-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-4 max-w-xs">
        <div className="flex items-start gap-3">
          <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
            <MessageCircle className="w-5 h-5 text-[color:var(--c-muted)]" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold leading-tight">Fale com vendas</div>
            <p className="text-sm muted mt-1">
              Tire dúvidas sobre limites de contratos, usuários e migração.
            </p>
            <div className="mt-3">
              <Link
                to="/demo"
                data-cta="demo"
                className="btn btn-primary btn-demo btn-sm w-full"
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
              </Link>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm shrink-0"
            aria-label="Fechar"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  // Renderiza fora da árvore com transform (corrige “grudar” no rodapé e clipping)
  return createPortal(content, document.body)
}


export default function Planos(){
  const [searchParams, setSearchParams] = useSearchParams()

  const [periodo, setPeriodo] = useState("mensal")
  const [plans, setPlans] = useState(FALLBACK)
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [ctaOpen, setCtaOpen] = useState(false)
  const comparativoRef = useRef(null)

  // Slider fixo 0–3500
  const sliderMax = 3500
  const [contracts, setContracts] = useState(500)
  const selectedTier = useMemo(() => findTierByContracts(contracts), [contracts])
  const descontoAnual = 0.15

  // Add-ons
  const [whatsappAddon, setWhatsappAddon] = useState(false)
  const [siteAppAddon, setSiteAppAddon] = useState(false)

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

  // 1) Ler query params
  useEffect(() => {
    const qContracts = searchParams.get("contracts")
    const qPeriodo = searchParams.get("periodo")
    const qWhats = searchParams.get("whatsapp")
    const qSiteApp = searchParams.get("siteapp")
    if (qPeriodo === "mensal" || qPeriodo === "anual") setPeriodo(qPeriodo)
    if (qWhats === "1" || qWhats === "true") setWhatsappAddon(true)
    if (qSiteApp === "1" || qSiteApp === "true") setSiteAppAddon(true)
    setTimeout(() => {
      if (qContracts != null) setContractsSafe(qContracts, { emit:false })
    }, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 2) Sync URL
  useEffect(() => {
    const currContracts = Number(searchParams.get("contracts"))
    const currPeriodo = searchParams.get("periodo")
    const currWhats = searchParams.get("whatsapp")
    const currSiteApp = searchParams.get("siteapp")
    const nextContracts = Math.max(0, Math.min(sliderMax, Math.floor(Number(contracts) || 0)))
    const nextPeriodo = periodo
    const nextWhats = whatsappAddon ? "1" : "0"
    const nextSiteApp = siteAppAddon ? "1" : "0"
    const changed =
      currContracts !== nextContracts ||
      currPeriodo !== nextPeriodo ||
      currWhats !== nextWhats ||
      currSiteApp !== nextSiteApp
    if (changed) {
      const next = new URLSearchParams(searchParams)
      next.set("contracts", String(nextContracts))
      next.set("periodo", nextPeriodo)
      next.set("whatsapp", nextWhats)
      next.set("siteapp", nextSiteApp)
      setSearchParams(next, { replace: true })
    }
  }, [contracts, periodo, sliderMax, whatsappAddon, siteAppAddon, searchParams, setSearchParams])

  // Reclampar na montagem
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
      }catch(e){
        console.warn("BFF.planos falhou, usando fallback", e)
      }finally{
        setLoadingPlans(false)
      }
    })()
  },[])

// CTA flutuante quando chega no comparativo
useEffect(() => {
  const el = comparativoRef.current;
  if (!el) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setCtaOpen(true);
      });
    },
    { threshold: 0.2 }
  );

  obs.observe(el);
  return () => obs.disconnect();
}, []);


  // Cards com preço por período
  const planosComPreco = useMemo(()=> plans.map(p=>{
    const mensal = p.price_month
    const anual = mensal != null ? mensal * 12 * (1 - descontoAnual) : null
    return {
      ...p,
      displayPrice: periodo === "mensal" ? mensal : anual,
      suffix: periodo === "mensal" ? "/mês" : "/ano",
      badge: p.highlight ? "Recomendado" : null,
      mensal
    }
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

  // Preço base simulado
  const simulatedPrice = useMemo(()=>{
    if (!selectedTier || selectedTier.price == null) return null
    const mensal = selectedTier.price
    return periodo === "mensal" ? mensal : mensal * 12 * (1 - descontoAnual)
  },[selectedTier, periodo])

  // WhatsApp
  const whatsappPrice = useMemo(() => {
    if (!whatsappAddon) return 0
    const mensal = WHATSAPP_MENSAL
    return periodo === "mensal" ? mensal : mensal * 12 * (1 - descontoAnual)
  }, [whatsappAddon, periodo])

  // Site + App do Associado
  const siteAppPrice = useMemo(() => {
    if (!siteAppAddon) return 0
    if (!selectedTier) return 0
    const isEnterprise = selectedTier.id.startsWith("enterprise")
    if (isEnterprise) return null // sob consulta
    const mensal = SITE_APP_MENSAL_STARTPRO
    return periodo === "mensal" ? mensal : mensal * 12 * (1 - descontoAnual)
  }, [siteAppAddon, selectedTier, periodo])

  // Total simulado
  const simulatedTotal = useMemo(() => {
    if (simulatedPrice == null) return null
    if (siteAppAddon && siteAppPrice == null) return null // enterprise com add-on => sob consulta
    return simulatedPrice + (whatsappPrice || 0) + (siteAppPrice || 0)
  }, [simulatedPrice, whatsappPrice, siteAppPrice, siteAppAddon])

  // Economia anual
  const mensalBase = selectedTier?.price ?? null
  const mensalAddon = (whatsappAddon ? WHATSAPP_MENSAL : 0) + (siteAppAddon && !selectedTier?.id?.startsWith("enterprise") ? SITE_APP_MENSAL_STARTPRO : 0)
  const economiaAnual = useMemo(() => {
    if (periodo !== "anual" || mensalBase == null || simulatedTotal == null) return 0
    const semDesconto = (mensalBase + mensalAddon) * 12
    return Math.max(0, semDesconto - simulatedTotal)
  }, [periodo, mensalBase, mensalAddon, simulatedTotal])

  // Preço por contrato (equivalente mensal)
  const perContract = useMemo(() => {
    if (!contracts || contracts <= 0 || simulatedTotal == null) return null
    const monthlyEq = periodo === "mensal" ? simulatedTotal : simulatedTotal / 12
    return monthlyEq / contracts
  }, [contracts, simulatedTotal, periodo])

  // Próximo degrau
  const nextBreakpoint = useMemo(() => {
    if (!selectedTier) return null
    if (selectedTier.id === "start") return 501
    if (selectedTier.id === "pro") return 1001
    if (selectedTier.id === "enterprise1") return 2001
    if (selectedTier.id === "enterprise2") return 3001
    return null
  }, [selectedTier])
  const nearNext = nextBreakpoint ? Math.max(0, nextBreakpoint - contracts) : null
  const showNearHint = nearNext != null && nearNext <= 100

  // events
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

  // copy link
  const [copied, setCopied] = useState(false)
  const copyLink = async () => {
    try{
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(()=>setCopied(false), 1600)
      track("pricing_share", { period: periodo, contracts, whatsappAddon, siteAppAddon })
    }catch(e){ /* ignore */ }
  }

  return (
    <div>
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

        {/* PROVA SOCIAL */}
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

        {/* Simulador */}
        <section className="card p-4 md:p-5 mb-6">
          <div className="grid lg:grid-cols-[1fr,360px] gap-6">
            {/* controles */}
            <div>
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
              <TierMarks max={sliderMax} />

              {/* Faixa / tier atual */}
              <div className="mt-1 text-xs text-[color:var(--c-muted)]">
                {selectedTier ? `Faixa atual: ${selectedTier.name} — ${selectedTier.rangeLabel}` : "—"}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
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

                {/* chips */}
                <div className="flex flex-wrap gap-2 ml-auto">
                  {PRESETS.filter(p => p.n <= sliderMax).map((p) => (
                    <Tooltip key={p.n} id={`preset-${p.n}`} content={p.tip}>
                      <button
                        type="button"
                        onClick={() => onPreset(p.n, p.label)}
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

              {/* Toggle WhatsApp ilimitado */}
              <div className="mt-4 flex items-center gap-2">
                <input
                  id="toggle-whatsapp"
                  type="checkbox"
                  className="rounded-md border border-[var(--c-border)]"
                  checked={whatsappAddon}
                  onChange={(e) => {
                    setWhatsappAddon(e.target.checked)
                    track("pricing_whatsapp_toggle", { enabled: e.target.checked, period: periodo })
                  }}
                />
                <label htmlFor="toggle-whatsapp" className="text-sm">
                  Incluir <strong>WhatsApp ilimitado</strong> (+{formatBRL(periodo === "mensal" ? WHATSAPP_MENSAL : WHATSAPP_MENSAL * 12 * (1 - descontoAnual))}{periodo === "mensal" ? "/mês" : "/ano"}).
                </label>
              </div>

              {/* Toggle Site + App do Associado */}
              <div className="mt-3 flex items-center gap-2">
                <input
                  id="toggle-siteapp"
                  type="checkbox"
                  className="rounded-md border border-[var(--c-border)]"
                  checked={siteAppAddon}
                  onChange={(e) => {
                    setSiteAppAddon(e.target.checked)
                    track("pricing_siteapp_toggle", { enabled: e.target.checked, period: periodo })
                  }}
                />
                <label htmlFor="toggle-siteapp" className="text-sm">
                  Incluir <strong>Site Premium + App do Associado</strong> (
                  {selectedTier?.id?.startsWith("enterprise")
                    ? <em>sob consulta</em>
                    : <>+{formatBRL(periodo === "mensal" ? SITE_APP_MENSAL_STARTPRO : SITE_APP_MENSAL_STARTPRO * 12 * (1 - descontoAnual))}{periodo === "mensal" ? "/mês" : "/ano"}</>
                  }
                  ).
                </label>
              </div>

              {/* dica próximo degrau */}
              {showNearHint && (
                <div className="mt-3 text-xs rounded-md border border-[var(--c-border)] bg-[var(--c-surface-2)] px-3 py-2">
                  Você está a <strong>{nearNext}</strong> contratos do próximo degrau de preço.
                </div>
              )}
            </div>

            {/* Resumo sticky */}
            <div className="relative lg:sticky lg:top-24">
              <div className="rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-4">
                {isSobConsulta && (
                  <span className="absolute -top-3 right-3 px-2 py-0.5 text-xs rounded-md border border-[var(--c-border)] bg-[var(--c-surface)]">
                    Sob consulta
                  </span>
                )}
                <div className="text-sm uppercase tracking-wide text-[color:var(--c-muted)]">Resumo</div>
                <div className="mt-1 font-semibold">
                  {selectedTier?.name || "—"} <span className="muted">({selectedTier?.rangeLabel || "—"})</span>
                </div>

                {/* Preços */}
                <div className="mt-3 space-y-1 text-sm" aria-live="polite">
                  <div className="flex items-center justify-between">
                    <span className="muted">Base</span>
                    <span className="font-medium">
                      {formatBRL(simulatedPrice)}
                      {simulatedPrice != null && <span className="muted"> {periodo === "mensal" ? "/mês" : "/ano"}</span>}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="muted">WhatsApp ilimitado</span>
                    <span className="font-medium">
                      {whatsappAddon ? (
                        <>
                          {formatBRL(whatsappPrice)}
                          <span className="muted"> {periodo === "mensal" ? "/mês" : "/ano"}</span>
                        </>
                      ) : "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="muted">Site + App do Associado</span>
                    <span className="font-medium">
                      {siteAppAddon ? (
                        siteAppPrice != null ? (
                          <>
                            {formatBRL(siteAppPrice)}
                            <span className="muted"> {periodo === "mensal" ? "/mês" : "/ano"}</span>
                          </>
                        ) : "Sob consulta"
                      ) : "—"}
                    </span>
                  </div>

                  <div className="h-px bg-[var(--c-border)] my-2" />
                  <div className="flex items-center justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>
                      {simulatedTotal != null ? (
                        <>
                          {formatBRL(simulatedTotal)}
                          <span className="muted text-sm"> {periodo === "mensal" ? "/mês" : "/ano"}</span>
                        </>
                      ) : (
                        "Sob consulta"
                      )}
                    </span>
                  </div>

                  {/* Economia no anual */}
                  {periodo === "anual" && economiaAnual > 0 && (
                    <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                      Economize {formatBRL(economiaAnual)}/ano (15% off). ≈ {formatBRL((simulatedTotal ?? 0)/12)} / mês.
                    </div>
                  )}

                  {/* preço por contrato */}
                  {perContract != null && (
                    <div className="mt-2 text-xs text-[color:var(--c-muted)]">
                      ≈ {formatBRL(perContract)} por contrato/mês
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Link
                    to="/demo"
                    data-cta="demo"
                    className="btn btn-primary btn-demo w-full text-center"
                    onClick={() => {
                      track("pricing_cta_click", {
                        origin: "simulator_card",
                        planId: selectedTier?.id || "unknown",
                        planName: selectedTier?.name || "unknown",
                        period: periodo,
                        contracts,
                        addons: { whatsapp: whatsappAddon, siteapp: siteAppAddon }
                      })
                    }}
                  >
                    Solicitar Demonstração
                  </Link>
                  <Link to="/contato" className="btn btn-ghost w-full text-center">Gerar proposta</Link>
                </div>

                {/* share link */}
                <button
                  type="button"
                  onClick={copyLink}
                  className="mt-3 inline-flex items-center gap-2 text-sm"
                >
                  <LinkIcon className="w-4 h-4 text-[color:var(--c-muted)]"/> {copied ? "Link copiado!" : "Copiar link da simulação"}
                </button>
              </div>
            </div>
          </div>

          {/* Nota curta */}
          <p className="mt-3 text-xs text-[color:var(--c-muted)]">
            Os valores acima referem-se à <strong>mensalidade do Progem</strong>. Impostos e tarifas de meios de pagamento não estão incluídos.
          </p>
        </section>

        {/* Cards de planos */}
        <section className="grid gap-6 md:grid-cols-3">
          {(loadingPlans ? FALLBACK : planosComPreco).map(pl=>(
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
                          aria-label="Informações da faixa"
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
                    {periodo === "anual" && pl.displayPrice != null && pl.mensal != null && (
                      <div className="text-xs muted mt-1">equivale a {formatBRL(pl.displayPrice/12)} / mês</div>
                    )}
                  </>
                ) : (
                  <div className="text-xl font-semibold">Tabelas por faixa</div>
                )}
              </div>

              {/* Inclui usuários */}
              <div className="mt-2 text-sm muted flex items-center gap-2">
                <Users className="w-4 h-4" />
                Inclui {usersIncludedFor(pl.id === "enterprise" ? "enterprise" : pl.id)} usuários.
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
                {pl.id === "enterprise" ? (
                  <Link
                    to="/contato"
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
                    Falar com Vendas
                  </Link>
                ) : (
                  <Link
                    to="/demo"
                    data-cta="demo"
                    className="btn btn-primary btn-demo w-full text-center"
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
                    Solicitar Demonstração
                  </Link>
                )}
              </div>
            </CardMotion>
          ))}
        </section>

        {/* APIs e integrações */}
        <section className="mt-10">
          <div className="card p-5">
            <h4 className="font-semibold">APIs e integrações</h4>
            <p className="muted mt-1 text-sm">
              Automatize seus fluxos com a API do Progem e integrações.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to="/developers"
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
              </Link>
              <Link
                to="/demo"
                data-cta="demo"
                className="btn btn-primary btn-demo text-sm"
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
              </Link>
            </div>
          </div>
        </section>

        {/* Comparativo operacional */}
        <section className="mt-10" ref={comparativoRef}>
          <h2 className="text-2xl font-semibold mb-4">Comparativo operacional</h2>
          <div className="overflow-x-auto border border-[var(--c-border)] rounded-xl">
            <table className="min-w-[760px] w-full text-sm">
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
          <div className="card p-5">
            <h4 className="font-semibold">Observações comerciais</h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex gap-2 items-start">
                <Info className="w-4 h-4 mt-0.5 text-[color:var(--c-muted)]"/>
                <span><strong>Faixa de contratos ativos</strong>: define o plano (Start, Pro, Enterprise).</span>
              </li>
              <li className="flex gap-2 items-start">
                <Info className="w-4 h-4 mt-0.5 text-[color:var(--c-muted)]"/>
                <span><strong>Período de pagamento</strong>: mensal ou anual (<strong>15% OFF</strong> no anual).</span>
              </li>
              <li className="flex gap-2 items-start">
                <Info className="w-4 h-4 mt-0.5 text-[color:var(--c-muted)]"/>
                <span><strong>Add-ons selecionados</strong>: WhatsApp ilimitado ({formatBRL(WHATSAPP_MENSAL)}/mês) e <strong>Site Premium + App do Associado</strong> ({formatBRL(SITE_APP_MENSAL_STARTPRO)}/mês em Start/Pro; <em>sob consulta</em> no Enterprise).</span>
              </li>
              <li className="flex gap-2 items-start">
                <Info className="w-4 h-4 mt-0.5 text-[color:var(--c-muted)]"/>
                <span><strong>Usuários</strong>: Start/Pro incluem 5; Enterprise inclui 10. Usuário adicional: {formatBRL(EXTRA_USER_PRICE)}/mês por usuário.</span>
              </li>
              <li className="flex gap-2 items-start">
                <Info className="w-4 h-4 mt-0.5 text-[color:var(--c-muted)]"/>
                <span><strong>Setup inicial</strong>: a partir de {formatBRL(600)} (varia por integrações solicitadas e nº de usuários).</span>
              </li>
              <li className="flex gap-2 items-start">
                <Info className="w-4 h-4 mt-0.5 text-[color:var(--c-muted)]"/>
                <span><strong>Migração de dados</strong>: orçamento conforme escopo (clientes, contratos, carnês/boletos e histórico).</span>
              </li>
            </ul>

            {/* Links úteis — discretos e em linha */}
            <div className="mt-3 text-xs text-[color:var(--c-muted)] flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-medium">Links úteis:</span>
              <Link to="/taxas" className="underline">Taxas &amp; Cobrança</Link>
              <span>•</span>
              <Link to="/migracao" className="underline">Migração de Dados</Link>
              <span>•</span>
              <Link to="/app-associado" className="underline">App do Associado</Link>
              <span>•</span>
              <Link to="/site-premium" className="underline">Site Premium</Link>
            </div>

            <div className="mt-3">
              <Link to="/contato" className="btn btn-ghost btn-sm">Tirar dúvidas com o time</Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-3">Perguntas frequentes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                q: "Como vocês contam contratos ativos?",
                a: "Consideramos contratos com status 'ativo' no mês de faturamento. Cancelados/pausados não entram no cálculo."
              },
              {
                q: "O WhatsApp ilimitado tem alguma taxa por mensagem?",
                a: "Não. É um add-on de custo fixo de R$ 150/mês para envios ilimitados, via integração com plataforma parceira oficial."
              },
              {
                q: "Posso migrar meus dados atuais?",
                a: "Sim. Ajudamos na importação de clientes, contratos, carnês/boletos e histórico básico."
              },
              {
                q: "Posso mudar de plano depois?",
                a: "Pode. O ajuste acompanha sua faixa de contratos ativos, sem fricção no uso da plataforma."
              },
              {
                q: "Posso contratar o WhatsApp ilimitado depois?",
                a: "Sim. O add-on de WhatsApp pode ser habilitado a qualquer momento e começa a ser faturado a partir da ativação."
              },
              {
                q: "Posso contratar o Site Premium + App do Associado depois?",
                a: "Sim. Você pode ativar esse pacote quando preferir. Em Start/Pro o valor é de R$ 199/mês; no Enterprise é sob consulta."
              },
            ].map((item, i) => (
              <details key={i} className="card p-4">
                <summary className="cursor-pointer font-medium">{item.q}</summary>
                <p className="muted text-sm mt-2">{item.a}</p>
              </details>
            ))}
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
