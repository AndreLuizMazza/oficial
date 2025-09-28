// src/pages/Planos.jsx
import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import Footer from "@/components/Footer"
import { setPageSEO } from "@/lib/seo"
import clsx from "clsx"
import {
  Check, ShieldCheck, Globe, Handshake, Info, Cable,
  LineChart, Building2, Link2 as LinkIcon, Users,
  Calculator, Percent, Receipt, BadgeDollarSign, MessageCircle
} from "lucide-react"
import CardMotion from "@/components/CardMotion"
import { track } from "@/lib/analytics"

/* =========================================================================
   CONFIG — facilmente editável (pode usar .env Vite com as chaves VITE_PRICE_*)
   =======================================================================*/

// MODO DE COBRANÇA (HARDCODE)
// "pct" => percentual sobre o preço base
// "fix" => valor fixo (R$/mês) das variáveis .env
const ADDON_MODE = {
  site: "pct", // mude para "fix" para cobrar valor fixo por faixa
  app:  "pct", // mude para "fix" para cobrar valor fixo por faixa
}


const envNum = (key, fallback) => {
  const raw = import.meta.env?.[key]
  if (raw === "" || raw == null) return fallback
  const n = Number(raw)
  return Number.isFinite(n) ? n : fallback
}

// Percentual em DECIMAL (ex.: "0.2" => 0.2). Retorna null se vazio/inválido.
const envPct = (key) => {
  const raw = import.meta.env?.[key]
  if (raw === "" || raw == null) return null
  const n = Number(raw)
  if (!Number.isFinite(n)) return null
  return n
}

// Degraus (faixas)
const BREAKPOINTS = {
  start: 500,
  pro: 1000,
  ent1: 2000,
  ent2: 3000,
  ent3: 4000,  // 3.001–4.000
  ent4: 5000,  // 4.001–5.000
}

// Preços base por faixa (mensal)
const BASE_MONTHLY_PRICES = {
  start:        envNum("VITE_PRICE_BASE_START", 250),    // 0..500
  pro:          envNum("VITE_PRICE_BASE_PRO", 350),      // 501..1000
  enterprise1:  envNum("VITE_PRICE_BASE_ENT1", 500),     // 1001..2000
  enterprise2:  envNum("VITE_PRICE_BASE_ENT2", 700),     // 2001..3000
  enterprise3:  envNum("VITE_PRICE_BASE_ENT3", 900),     // 3001..4000
  enterprise4:  envNum("VITE_PRICE_BASE_ENT4", 1100),    // 4001..5000
  enterprisePlus: null,                                   // >5000: sob consulta
}

// Add-on WhatsApp por faixa (mensal) — valor fixo
const ADDON_WHATSAPP_MONTHLY = {
  start:           envNum("VITE_PRICE_WHATSAPP_START", 150),
  pro:             envNum("VITE_PRICE_WHATSAPP_PRO", 150),
  enterprise1:     envNum("VITE_PRICE_WHATSAPP_ENT1", 150),
  enterprise2:     envNum("VITE_PRICE_WHATSAPP_ENT2", 150),
  enterprise3:     envNum("VITE_PRICE_WHATSAPP_ENT3", 150),
  enterprise4:     envNum("VITE_PRICE_WHATSAPP_ENT4", 150),
  enterprisePlus:  envNum("VITE_PRICE_WHATSAPP_ENTPLUS", null), // null => Sob consulta
}

/* ========= Add-ons separados (Site e App) =========
   Percentual DECIMAL OU valor fixo por faixa (ambos vindos do .env).
   O que será aplicado é definido pelo ADDON_MODE acima (hardcode).
*/

// SITE PREMIUM
const ADDON_SITE_PCT = {
  start:          envPct("VITE_PRICE_SITE_PCT_START"),
  pro:            envPct("VITE_PRICE_SITE_PCT_PRO"),
  enterprise1:    envPct("VITE_PRICE_SITE_PCT_ENT1"),
  enterprise2:    envPct("VITE_PRICE_SITE_PCT_ENT2"),
  enterprise3:    envPct("VITE_PRICE_SITE_PCT_ENT3"),
  enterprise4:    envPct("VITE_PRICE_SITE_PCT_ENT4"),
  enterprisePlus: envPct("VITE_PRICE_SITE_PCT_ENTPLUS"),
}
const ADDON_SITE_FIX = {
  start:          envNum("VITE_PRICE_SITE_FIX_START", null),
  pro:            envNum("VITE_PRICE_SITE_FIX_PRO", null),
  enterprise1:    envNum("VITE_PRICE_SITE_FIX_ENT1", null),
  enterprise2:    envNum("VITE_PRICE_SITE_FIX_ENT2", null),
  enterprise3:    envNum("VITE_PRICE_SITE_FIX_ENT3", null),
  enterprise4:    envNum("VITE_PRICE_SITE_FIX_ENT4", null),
  enterprisePlus: envNum("VITE_PRICE_SITE_FIX_ENTPLUS", null),
}

// APP DO ASSOCIADO
const ADDON_APP_PCT = {
  start:          envPct("VITE_PRICE_APP_PCT_START"),
  pro:            envPct("VITE_PRICE_APP_PCT_PRO"),
  enterprise1:    envPct("VITE_PRICE_APP_PCT_ENT1"),
  enterprise2:    envPct("VITE_PRICE_APP_PCT_ENT2"),
  enterprise3:    envPct("VITE_PRICE_APP_PCT_ENT3"),
  enterprise4:    envPct("VITE_PRICE_APP_PCT_ENT4"),
  enterprisePlus: envPct("VITE_PRICE_APP_PCT_ENTPLUS"),
}
const ADDON_APP_FIX = {
  start:          envNum("VITE_PRICE_APP_FIX_START", null),
  pro:            envNum("VITE_PRICE_APP_FIX_PRO", null),
  enterprise1:    envNum("VITE_PRICE_APP_FIX_ENT1", null),
  enterprise2:    envNum("VITE_PRICE_APP_FIX_ENT2", null),
  enterprise3:    envNum("VITE_PRICE_APP_FIX_ENT3", null),
  enterprise4:    envNum("VITE_PRICE_APP_FIX_ENT4", null),
  enterprisePlus: envNum("VITE_PRICE_APP_FIX_ENTPLUS", null),
}

const INCLUDED_USERS = { start: 5, pro: 5, enterprise: 10 }
const EXTRA_USER_PRICE = 10 // R$/mês por usuário adicional

/* ========================================================================= */

function formatBRL(n){
  if (n == null) return "Sob consulta"
  try { return Number(n).toLocaleString("pt-BR",{style:"currency",currency:"BRL"}) }
  catch { return `R$ ${Number(n).toFixed(2)}` }
}

function Tooltip({ id, content, children, side="top" }){
  const pos = side==="top" ? "bottom-full mb-2 left-1/2 -translate-x-1/2"
    : side==="bottom" ? "top-full mt-2 left-1/2 -translate-x-1/2"
    : side==="left" ? "right-full mr-2 top-1/2 -translate-y-1/2"
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

const TIERS = [
  { id:"start", name:"Start", min:0, max:BREAKPOINTS.start, price:BASE_MONTHLY_PRICES.start, rangeLabel:`0 – ${BREAKPOINTS.start.toLocaleString("pt-BR")} contratos` },
  { id:"pro", name:"Pro", min:BREAKPOINTS.start+1, max:BREAKPOINTS.pro, price:BASE_MONTHLY_PRICES.pro, rangeLabel:`${(BREAKPOINTS.start+1).toLocaleString("pt-BR")} – ${BREAKPOINTS.pro.toLocaleString("pt-BR")} contratos` },
  { id:"enterprise1", name:"Enterprise", min:BREAKPOINTS.pro+1, max:BREAKPOINTS.ent1, price:BASE_MONTHLY_PRICES.enterprise1, rangeLabel:`${(BREAKPOINTS.pro+1).toLocaleString("pt-BR")} – ${BREAKPOINTS.ent1.toLocaleString("pt-BR")} contratos` },
  { id:"enterprise2", name:"Enterprise", min:BREAKPOINTS.ent1+1, max:BREAKPOINTS.ent2, price:BASE_MONTHLY_PRICES.enterprise2, rangeLabel:`${(BREAKPOINTS.ent1+1).toLocaleString("pt-BR")} – ${BREAKPOINTS.ent2.toLocaleString("pt-BR")} contratos` },
  { id:"enterprise3", name:"Enterprise", min:BREAKPOINTS.ent2+1, max:BREAKPOINTS.ent3, price:BASE_MONTHLY_PRICES.enterprise3, rangeLabel:`${(BREAKPOINTS.ent2+1).toLocaleString("pt-BR")} – ${BREAKPOINTS.ent3.toLocaleString("pt-BR")} contratos` },
  { id:"enterprise4", name:"Enterprise", min:BREAKPOINTS.ent3+1, max:BREAKPOINTS.ent4, price:BASE_MONTHLY_PRICES.enterprise4, rangeLabel:`${(BREAKPOINTS.ent3+1).toLocaleString("pt-BR")} – ${BREAKPOINTS.ent4.toLocaleString("pt-BR")} contratos` },
]
function findTierByContracts(qtd){
  if (qtd == null || Number.isNaN(qtd)) return null
  const n = Math.max(0, Math.floor(qtd))
  const tier = TIERS.find(t => n >= t.min && n <= t.max)
  if (tier) return tier
  if (n > BREAKPOINTS.ent4) return {
    id:"enterprisePlus",
    name:"Enterprise",
    min:BREAKPOINTS.ent4+1,
    max:Infinity,
    price:BASE_MONTHLY_PRICES.enterprisePlus,
    rangeLabel:`+${BREAKPOINTS.ent4.toLocaleString("pt-BR")} contratos`
  }
  return null
}

// Tabela Enterprise (para card)
const ENTERPRISE_BULLETS = [
  { range:`${(BREAKPOINTS.pro+1).toLocaleString("pt-BR")} – ${BREAKPOINTS.ent1.toLocaleString("pt-BR")} contratos`, price:BASE_MONTHLY_PRICES.enterprise1 },
  { range:`${(BREAKPOINTS.ent1+1).toLocaleString("pt-BR")} – ${BREAKPOINTS.ent2.toLocaleString("pt-BR")} contratos`, price:BASE_MONTHLY_PRICES.enterprise2 },
  { range:`${(BREAKPOINTS.ent2+1).toLocaleString("pt-BR")} – ${BREAKPOINTS.ent3.toLocaleString("pt-BR")} contratos`, price:BASE_MONTHLY_PRICES.enterprise3 },
  { range:`${(BREAKPOINTS.ent3+1).toLocaleString("pt-BR")} – ${BREAKPOINTS.ent4.toLocaleString("pt-BR")} contratos`, price:BASE_MONTHLY_PRICES.enterprise4 },
  { range:`+${BREAKPOINTS.ent4.toLocaleString("pt-BR")} contratos`, price:null },
]

// Fallback dos cards (sem BFF)
const FALLBACK = [
  { id:"start", name:"Start", price_month:BASE_MONTHLY_PRICES.start, cap:`até ${BREAKPOINTS.start.toLocaleString("pt-BR")} contratos ativos`, capNote:"Considera contratos com status 'ativo' no mês de faturamento.", icon:ShieldCheck },
  { id:"pro", name:"Pro", price_month:BASE_MONTHLY_PRICES.pro, cap:`até ${BREAKPOINTS.pro.toLocaleString("pt-BR")} contratos ativos`, capNote:`Ao ultrapassar ${BREAKPOINTS.pro.toLocaleString("pt-BR")}, migre para Enterprise.`, highlight:true, icon:Globe },
  { id:"enterprise", name:"Enterprise", price_month:null, cap:`acima de ${BREAKPOINTS.pro.toLocaleString("pt-BR")} contratos`, capNote:`Faixas ${(BREAKPOINTS.pro+1).toLocaleString("pt-BR")}–${BREAKPOINTS.ent1.toLocaleString("pt-BR")}, ${(BREAKPOINTS.ent1+1).toLocaleString("pt-BR")}–${BREAKPOINTS.ent2.toLocaleString("pt-BR")}, ${(BREAKPOINTS.ent2+1).toLocaleString("pt-BR")}–${BREAKPOINTS.ent3.toLocaleString("pt-BR")} e ${(BREAKPOINTS.ent3+1).toLocaleString("pt-BR")}–${BREAKPOINTS.ent4.toLocaleString("pt-BR")}. +${BREAKPOINTS.ent4.toLocaleString("pt-BR")}: sob consulta.`, icon:Handshake },
]
const ICONS = { start:ShieldCheck, pro:Globe, enterprise:Handshake }

// Marcas do slider
function TierMarks({ max=BREAKPOINTS.ent4+500 }){
  const marks = [
    { v: BREAKPOINTS.start, label: BREAKPOINTS.start.toLocaleString("pt-BR") },
    { v: BREAKPOINTS.pro,   label: BREAKPOINTS.pro.toLocaleString("pt-BR") },
    { v: BREAKPOINTS.ent1,  label: BREAKPOINTS.ent1.toLocaleString("pt-BR") },
    { v: BREAKPOINTS.ent2,  label: BREAKPOINTS.ent2.toLocaleString("pt-BR") },
    { v: BREAKPOINTS.ent3,  label: BREAKPOINTS.ent3.toLocaleString("pt-BR") },
    { v: BREAKPOINTS.ent4,  label: BREAKPOINTS.ent4.toLocaleString("pt-BR") },
  ].filter(m => m.v <= max)
  return (
    <div className="mt-1 relative h-5">
      <div className="absolute inset-x-0 top-2 h-0.5 bg-[var(--c-border)] rounded" />
      {marks.map(m => (
        <div key={m.v} className="absolute top-0 -translate-x-1/2" style={{ left: `${(m.v/max)*100}%` }}>
          <div className="w-px h-2.5 bg-[var(--c-border)] mx-auto" />
          <div className="text-[10px] text-[color:var(--c-muted)] mt-0.5">{m.label}</div>
        </div>
      ))}
    </div>
  )
}

// helpers de lookup por faixa
const tierKeyForContracts = (contracts) => {
  if (contracts <= BREAKPOINTS.start) return "start"
  if (contracts <= BREAKPOINTS.pro)   return "pro"
  if (contracts <= BREAKPOINTS.ent1)  return "enterprise1"
  if (contracts <= BREAKPOINTS.ent2)  return "enterprise2"
  if (contracts <= BREAKPOINTS.ent3)  return "enterprise3"
  if (contracts <= BREAKPOINTS.ent4)  return "enterprise4"
  return "enterprisePlus"
}
const priceFromTableForContracts = (table, contracts) => table[tierKeyForContracts(contracts)]

// Toggle de período (apenas no simulador e nos cards)
function TogglePeriodo({ periodo, setPeriodo }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl p-1 bg-[var(--c-surface)] border border-[var(--c-border)]">
      {["mensal","anual"].map(opt=>(
        <button
          key={opt} type="button" onClick={()=>setPeriodo(opt)} aria-pressed={periodo===opt}
          className={clsx("px-3 py-1.5 text-sm rounded-md transition",
            periodo===opt ? "bg-[var(--c-primary)] text-[var(--c-primary-contrast)]" : "hover:bg-[var(--c-surface-2)]")}
        >
          {opt==="mensal" ? "Mensal" : "Anual — 15% OFF"}
        </button>
      ))}
    </div>
  )
}

/* ===========================
   Cálculo respeitando ADDON_MODE
   =========================== */
function computeAddonMonthlyForContracts(contracts, mode, pctTable, fixTable){
  const key = tierKeyForContracts(contracts)
  const base = priceFromTableForContracts(BASE_MONTHLY_PRICES, contracts)
  if (mode === "pct") {
    const pct = pctTable[key]
    if (pct != null && base != null) return Math.round((base * pct) * 100) / 100
    return null
  }
  if (mode === "fix") {
    const fix = fixTable[key]
    if (fix != null) return fix
    return null
  }
  return null
}

// Texto para listagem de add-ons por faixa, respeitando o modo
function addonListItemText(mode, pct, fix){
  if (mode === "pct")  return pct != null ? `${(pct*100).toFixed(0)}% do preço base` : "Sob consulta"
  if (mode === "fix")  return fix != null ? `${formatBRL(fix)}/mês` : "Sob consulta"
  return "Sob consulta"
}

export default function Planos(){
  const [searchParams, setSearchParams] = useSearchParams()

  const [periodo, setPeriodo] = useState("mensal")
  const [plans] = useState(FALLBACK) // sem BFF
  const simuladorRef = useRef(null)

  const sliderMax = BREAKPOINTS.ent4 + 500
  const [contracts, setContracts] = useState(BREAKPOINTS.start)
  const selectedTier = useMemo(() => findTierByContracts(contracts), [contracts])

  const descontoAnual = 0.15
  const [whatsappAddon, setWhatsappAddon] = useState(false)
  const [siteAddon, setSiteAddon] = useState(false)
  const [appAddon, setAppAddon] = useState(false)
  const [ticketMedio, setTicketMedio] = useState(60)

  const clampContracts = (n) => Math.max(0, Math.min(sliderMax, Math.floor(Number(n) || 0)))
  const roundStep = (n, step = 50) => Math.round((Number(n)||0) / step) * step
  const setContractsSafe = (v, { emit=true } = {}) => {
    const newVal = clampContracts(v)
    setContracts(prev => { if (emit) track("pricing_contracts_input", { value: newVal, period: periodo }); return newVal })
  }

  // Query params — load
  useEffect(() => {
    const qContracts = searchParams.get("contracts")
    const qPeriodo = searchParams.get("periodo")
    const qWhats = searchParams.get("whatsapp")
    const qSite = searchParams.get("site")
    const qApp = searchParams.get("app")
    const qTicket = searchParams.get("ticket")
    if (qPeriodo === "mensal" || qPeriodo === "anual") setPeriodo(qPeriodo)
    if (qWhats === "1" || qWhats === "true") setWhatsappAddon(true)
    if (qSite === "1" || qSite === "true") setSiteAddon(true)
    if (qApp === "1" || qApp === "true") setAppAddon(true)
    if (qTicket != null && !Number.isNaN(Number(qTicket))) setTicketMedio(Number(qTicket))
    setTimeout(() => { if (qContracts != null) setContractsSafe(qContracts, { emit:false }) }, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Query params — sync
  useEffect(() => {
    const currContracts = Number(searchParams.get("contracts"))
    const currPeriodo = searchParams.get("periodo")
    const currWhats = searchParams.get("whatsapp")
    const currSite = searchParams.get("site")
    const currApp = searchParams.get("app")
    const currTicket = searchParams.get("ticket")
    const nextContracts = Math.max(0, Math.min(sliderMax, Math.floor(Number(contracts) || 0)))
    const nextPeriodo = periodo
    const nextWhats = whatsappAddon ? "1" : "0"
    const nextSite = siteAddon ? "1" : "0"
    const nextApp = appAddon ? "1" : "0"
    const nextTicket = String(ticketMedio || 0)
    const changed = currContracts!==nextContracts || currPeriodo!==nextPeriodo || currWhats!==nextWhats || currSite!==nextSite || currApp!==nextApp || currTicket!==nextTicket
    if (changed) {
      const next = new URLSearchParams(searchParams)
      next.set("contracts", String(nextContracts))
      next.set("periodo", nextPeriodo)
      next.set("whatsapp", nextWhats)
      next.set("site", nextSite)
      next.set("app", nextApp)
      next.set("ticket", nextTicket)
      setSearchParams(next, { replace: true })
    }
  }, [contracts, periodo, sliderMax, whatsappAddon, siteAddon, appAddon, ticketMedio, searchParams, setSearchParams])

  // SEO
  useEffect(()=>{ setPageSEO({ title:"Progem • Planos", description:"Simule o custo do Progem: escolha a faixa, informe o ticket médio e veja o investimento estimado." }) },[])

  // Cards com preço por período
  const planosComPreco = useMemo(()=> plans.map(p=>{
    const mensal = p.price_month
    const anual = mensal != null ? mensal * 12 * (1 - descontoAnual) : null
    return { ...p, displayPrice: periodo==="mensal" ? mensal : anual, suffix: periodo==="mensal" ? "/mês" : "/ano", badge: p.highlight ? "Recomendado" : null, mensal }
  }),[plans, periodo])

  const highlightedBySim = useMemo(()=>{
    if (!selectedTier) return null
    if (selectedTier.id === "start") return "start"
    if (selectedTier.id === "pro") return "pro"
    if (selectedTier.id.startsWith("enterprise")) return "enterprise"
    if (selectedTier.id === "enterprisePlus") return "enterprise"
    return null
  },[selectedTier])

  const simulatedPrice = useMemo(()=>{
    if (!selectedTier || selectedTier.price == null) return null
    const mensal = selectedTier.price
    return periodo === "mensal" ? mensal : mensal * 12 * (1 - descontoAnual)
  },[selectedTier, periodo])

  // Helpers de exibição de preços de add-on
  const addonPriceDisplay = (monthly) => {
    if (monthly == null) return "Sob consulta"
    return periodo === "mensal" ? formatBRL(monthly) + "/mês" : formatBRL(monthly*12*(1-descontoAnual)) + "/ano"
  }

  // Valores mensais dos add-ons para a quantidade atual de contratos (respeitando ADDON_MODE)
  const whatsappMonthly = priceFromTableForContracts(ADDON_WHATSAPP_MONTHLY, contracts)
  const siteMonthlyRaw = computeAddonMonthlyForContracts(contracts, ADDON_MODE.site, ADDON_SITE_PCT, ADDON_SITE_FIX)
  const appMonthlyRaw  = computeAddonMonthlyForContracts(contracts, ADDON_MODE.app,  ADDON_APP_PCT,  ADDON_APP_FIX)

  const whatsappPrice = useMemo(() => {
    if (!whatsappAddon) return 0
    if (whatsappMonthly == null) return null
    return periodo === "mensal" ? whatsappMonthly : whatsappMonthly * 12 * (1 - descontoAnual)
  }, [whatsappAddon, whatsappMonthly, periodo])

  const sitePrice = useMemo(() => {
    if (!siteAddon) return 0
    if (siteMonthlyRaw == null) return null
    return periodo === "mensal" ? siteMonthlyRaw : siteMonthlyRaw * 12 * (1 - descontoAnual)
  }, [siteAddon, siteMonthlyRaw, periodo])

  const appPrice = useMemo(() => {
    if (!appAddon) return 0
    if (appMonthlyRaw == null) return null
    return periodo === "mensal" ? appMonthlyRaw : appMonthlyRaw * 12 * (1 - descontoAnual)
  }, [appAddon, appMonthlyRaw, periodo])

  const simulatedTotal = useMemo(() => {
    if (simulatedPrice == null) return null
    if ((siteAddon && sitePrice == null) || (appAddon && appPrice == null) || (whatsappAddon && whatsappPrice == null)) return null
    return simulatedPrice + (whatsappPrice || 0) + (sitePrice || 0) + (appPrice || 0)
  }, [simulatedPrice, whatsappPrice, sitePrice, appPrice, siteAddon, appAddon, whatsappAddon])

  const mensalBase = selectedTier?.price ?? null
  const mensalAddon =
    (whatsappAddon ? (whatsappMonthly || 0) : 0) +
    (siteAddon ? (siteMonthlyRaw || 0) : 0) +
    (appAddon ? (appMonthlyRaw || 0) : 0)

  const economiaAnual = useMemo(() => {
    if (periodo !== "anual" || mensalBase == null || simulatedTotal == null) return 0
    const semDesconto = (mensalBase + mensalAddon) * 12
    return Math.max(0, semDesconto - simulatedTotal)
  }, [periodo, mensalBase, mensalAddon, simulatedTotal])

  const custoMensalEquivalente = useMemo(
    () => simulatedTotal == null ? null : (periodo === "mensal" ? simulatedTotal : simulatedTotal / 12),
    [simulatedTotal, periodo]
  )

  const receitaMensalEstim = useMemo(() => {
    const t = Number(ticketMedio) || 0
    if (!contracts || contracts <= 0 || t <= 0) return 0
    return contracts * t
  }, [contracts, ticketMedio])

  const custoSobreReceitaPct = useMemo(() => {
    if (!receitaMensalEstim || receitaMensalEstim <= 0 || custoMensalEquivalente == null) return null
    return (custoMensalEquivalente / receitaMensalEstim) * 100
  }, [receitaMensalEstim, custoMensalEquivalente])

  const perContract = useMemo(() => {
    if (!contracts || contracts <= 0 || custoMensalEquivalente == null) return null
    return custoMensalEquivalente / contracts
  }, [contracts, custoMensalEquivalente])

  const nextBreakpoint = useMemo(() => {
    if (!selectedTier) return null
    if (selectedTier.id === "start") return BREAKPOINTS.start + 1
    if (selectedTier.id === "pro") return BREAKPOINTS.pro + 1
    if (selectedTier.id === "enterprise1") return BREAKPOINTS.ent1 + 1
    if (selectedTier.id === "enterprise2") return BREAKPOINTS.ent2 + 1
    if (selectedTier.id === "enterprise3") return BREAKPOINTS.ent3 + 1
    if (selectedTier.id === "enterprise4") return BREAKPOINTS.ent4 + 1
    return null
  }, [selectedTier])
  const nearNext = nextBreakpoint ? Math.max(0, nextBreakpoint - contracts) : null
  const showNearHint = nearNext != null && nearNext <= 100

  const [copied, setCopied] = useState(false)
  const copyLink = async () => {
    try{
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(()=>setCopied(false), 1600)
      track("pricing_share", { period: periodo, contracts, whatsappAddon, siteAddon, appAddon, ticketMedio })
    }catch(e){ /* ignore */ }
  }

  return (
    <div>
      <main className="mx-auto max-w-7xl px-4 py-12">
        {/* Título */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Escolha o plano ideal <span className="text-[var(--c-primary)]">para a sua empresa</span>
          </h1>
          <p className="muted mt-2 text-lg">
            Todos os planos incluem os mesmos recursos. O valor varia conforme o <strong>número de contratos ativos</strong>.
          </p>
        </div>

        {/* Prova social */}
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

        {/* Cards de planos */}
        <section className="grid gap-6 md:grid-cols-3">
          {planosComPreco.map(pl=>(
            <CardMotion
              key={pl.id}
              className={clsx("card p-6 flex flex-col",(pl.highlight || (pl.id===highlightedBySim)) && "ring-2 ring-[var(--c-primary)]")}
              tabIndex={0}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                    {(() => { const Icon = ICONS[pl.id==="enterprise"?"enterprise":pl.id]; return <Icon className="w-6 h-6 text-[color:var(--c-muted)]" /> })()}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{pl.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="badge">
                        {pl.id === "start" ? `até ${BREAKPOINTS.start.toLocaleString("pt-BR")}`
                          : pl.id === "pro" ? `até ${BREAKPOINTS.pro.toLocaleString("pt-BR")}`
                          : `acima de ${BREAKPOINTS.pro.toLocaleString("pt-BR")}`} contratos
                      </span>
                      <Tooltip id={`tip-${pl.id}`} content={
                        pl.id === "enterprise"
                          ? [
                              `${(BREAKPOINTS.pro+1).toLocaleString("pt-BR")}–${BREAKPOINTS.ent1.toLocaleString("pt-BR")}: ${formatBRL(BASE_MONTHLY_PRICES.enterprise1)}/mês`,
                              `${(BREAKPOINTS.ent1+1).toLocaleString("pt-BR")}–${BREAKPOINTS.ent2.toLocaleString("pt-BR")}: ${formatBRL(BASE_MONTHLY_PRICES.enterprise2)}/mês`,
                              `${(BREAKPOINTS.ent2+1).toLocaleString("pt-BR")}–${BREAKPOINTS.ent3.toLocaleString("pt-BR")}: ${formatBRL(BASE_MONTHLY_PRICES.enterprise3)}/mês`,
                              `${(BREAKPOINTS.ent3+1).toLocaleString("pt-BR")}–${BREAKPOINTS.ent4.toLocaleString("pt-BR")}: ${formatBRL(BASE_MONTHLY_PRICES.enterprise4)}/mês`,
                              `+${BREAKPOINTS.ent4.toLocaleString("pt-BR")}: sob consulta`
                            ].join(" • ")
                          : "Contagem considera contratos com status 'ativo' no mês de faturamento."
                      }>
                        <button type="button" className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-[var(--c-border)]" aria-label="Informações da faixa">
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

              <ul className="mt-3 space-y-1.5 text-sm">
                <li className="muted flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Inclui {pl.id === "enterprise" ? INCLUDED_USERS.enterprise : INCLUDED_USERS[pl.id]} usuários
                </li>
                <li className="muted flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Todos os recursos inclusos
                </li>
              </ul>

              {pl.id === "enterprise" && (
                <ul className="mt-3 space-y-1.5 text-sm">
                  {ENTERPRISE_BULLETS.map((b, i) => {
                    const base = b.price
                    const price = base == null ? null : (periodo === "mensal" ? base : base * 12 * (1 - 0.15))
                    return (
                      <li key={i} className="flex items-center justify-between rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)] px-3 py-2">
                        <span className="muted">{b.range}</span>
                        <span className="font-medium">
                          {price != null ? `${formatBRL(price)}${periodo === "mensal" ? "/mês" : "/ano"}` : "Sob consulta"}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              )}

              <div className="mt-6 flex flex-col gap-2">
                {pl.id === "enterprise" ? (
                  <Link
                    to="/contato"
                    className="btn btn-primary w-full text-center"
                    onClick={()=>track("pricing_cta_click",{origin:"plan_card",planId:pl.id,planName:pl.name,period:periodo,contracts,ticketMedio})}
                  >
                    Falar com Vendas
                  </Link>
                ) : (
                  <Link
                    to="/demo"
                    className="btn btn-primary btn-demo w-full text-center"
                    onClick={()=>track("pricing_cta_click",{origin:"plan_card",planId:pl.id,planName:pl.name,period:periodo,contracts,ticketMedio})}
                  >
                    Solicitar Demonstração
                  </Link>
                )}
              </div>
            </CardMotion>
          ))}
        </section>

        {/* SIMULADOR — abaixo dos cards */}
        <section ref={simuladorRef} className="card p-4 md:p-6 mt-6 mb-6 ring-1 ring-[var(--c-primary)]/25" aria-labelledby="simulador-heading">
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                <Calculator className="w-5 h-5 text-[color:var(--c-muted)]" />
              </span>
              <div>
                <h2 id="simulador-heading" className="text-xl md:text-2xl font-semibold leading-tight">Simulador de custo do Progem</h2>
                <p className="muted text-sm">
                  Ajuste contratos e informe seu ticket médio. Veja o investimento estimado <strong>em R$</strong> e o percentual sobre sua receita.
                </p>
              </div>
            </div>
            <TogglePeriodo periodo={periodo} setPeriodo={setPeriodo} />
          </div>

          <div className="grid xl:grid-cols-[1fr,380px] gap-6">
            {/* Controles */}
            <div>
              <label htmlFor="contracts-range" className="text-sm font-medium">Quantidade de contratos ativos</label>
              <input
                id="contracts-range" type="range" min={0} max={sliderMax} step={50} value={contracts}
                onChange={(e)=>setContractsSafe(roundStep(e.target.value))} className="w-full mt-2"
                aria-valuemin={0} aria-valuemax={sliderMax} aria-valuenow={contracts}
              />
              <TierMarks max={sliderMax} />
              <div className="mt-1 text-xs text-[color:var(--c-muted)]">
                {selectedTier ? `Faixa atual: ${selectedTier.name} — ${selectedTier.rangeLabel}` : "—"}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <input
                  type="number" inputMode="numeric" min={0} max={sliderMax} step={50} value={contracts}
                  onChange={(e)=>setContractsSafe(e.target.value)} onBlur={(e)=>setContractsSafe(roundStep(e.target.value))}
                  className={clsx(
                    "w-36 px-3 py-2 rounded-lg border bg-[var(--c-surface)] border-[var(--c-border)]",
                    contracts>=sliderMax && "opacity-70 cursor-not-allowed"
                  )}
                  aria-label="Digite a quantidade de contratos" disabled={contracts>=sliderMax}
                />
                <span className="muted text-sm">contratos</span>

                {/* Pílulas sem tooltip */}
                <div className="flex flex-wrap gap-2 ml-auto">
                  {[
                    { n: BREAKPOINTS.start, label: BREAKPOINTS.start.toLocaleString("pt-BR") },
                    { n: BREAKPOINTS.pro,   label: BREAKPOINTS.pro.toLocaleString("pt-BR") },
                    { n: BREAKPOINTS.ent1,  label: BREAKPOINTS.ent1.toLocaleString("pt-BR") },
                    { n: BREAKPOINTS.ent2,  label: BREAKPOINTS.ent2.toLocaleString("pt-BR") },
                    { n: BREAKPOINTS.ent3,  label: BREAKPOINTS.ent3.toLocaleString("pt-BR") },
                    { n: BREAKPOINTS.ent4,  label: BREAKPOINTS.ent4.toLocaleString("pt-BR") },
                    { n: sliderMax,         label: `+${BREAKPOINTS.ent4.toLocaleString("pt-BR")}` },
                  ].map(p=>(
                    <button
                      key={p.n}
                      type="button"
                      onClick={()=>{
                        track("pricing_preset_click",{value:p.n,label:p.label,period:periodo})
                        setContractsSafe(p.n)
                      }}
                      className={clsx(
                        "px-3 py-1.5 rounded-lg border text-sm transition",
                        contracts===p.n ? "border-[var(--c-primary)] bg-[var(--c-surface-2)]" : "border-[var(--c-border)] hover:bg-[var(--c-surface-2)]"
                      )}
                      aria-pressed={contracts===p.n}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ticket médio */}
              <div className="mt-5">
                <label htmlFor="ticket-medio" className="text-sm font-medium">Ticket médio mensal (R$)</label>
                <div className="mt-2 flex items-center gap-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--c-muted)]">R$</span>
                    <input
                      id="ticket-medio" type="number" inputMode="decimal" step={1} min={0} value={ticketMedio}
                      onChange={(e)=>setTicketMedio(Number(e.target.value))}
                      className="w-44 pl-8 pr-3 py-2 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)]"
                      placeholder="ex.: 60"
                    />
                  </div>
                  <span className="muted text-sm">
                    Receita mensal estimada: <strong>{formatBRL(contracts * (Number(ticketMedio)||0))}</strong>
                  </span>
                </div>
                <p className="muted text-xs mt-1">Use o valor médio que seu cliente paga por mês.</p>
              </div>

              {/* Add-ons com valores na label */}
              <div className="mt-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <input
                    id="toggle-whatsapp" type="checkbox" className="rounded-md border border-[var(--c-border)]"
                    checked={whatsappAddon}
                    onChange={(e)=>{setWhatsappAddon(e.target.checked); track("pricing_whatsapp_toggle",{enabled:e.target.checked,period:periodo})}}
                  />
                  <label htmlFor="toggle-whatsapp" className="text-sm">
                    Incluir <strong>WhatsApp ilimitado</strong> ({addonPriceDisplay(whatsappMonthly)}).
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="toggle-site" type="checkbox" className="rounded-md border border-[var(--c-border)]"
                    checked={siteAddon}
                    onChange={(e)=>{setSiteAddon(e.target.checked); track("pricing_site_toggle",{enabled:e.target.checked,period:periodo})}}
                  />
                  <label htmlFor="toggle-site" className="text-sm">
                    Incluir <strong>Site Premium</strong> ({addonPriceDisplay(siteMonthlyRaw)}).
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="toggle-app" type="checkbox" className="rounded-md border border-[var(--c-border)]"
                    checked={appAddon}
                    onChange={(e)=>{setAppAddon(e.target.checked); track("pricing_app_toggle",{enabled:e.target.checked,period:periodo})}}
                  />
                  <label htmlFor="toggle-app" className="text-sm">
                    Incluir <strong>App do Associado</strong> ({addonPriceDisplay(appMonthlyRaw)}).
                  </label>
                </div>

                {showNearHint && (
                  <div className="text-xs rounded-md border border-[var(--c-border)] bg-[var(--c-surface-2)] px-3 py-2">
                    Você está a <strong>{nearNext}</strong> contratos do próximo degrau de preço.
                  </div>
                )}
              </div>
            </div>

            {/* Resumo */}
            <div className="relative xl:sticky xl:top-24">
              <div className="rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-4">
                {contracts>BREAKPOINTS.ent4 && (
                  <span className="absolute -top-3 right-3 px-2 py-0.5 text-xs rounded-md border border-[var(--c-border)] bg-[var(--c-surface)]">
                    Sob consulta
                  </span>
                )}

                <div className="text-sm uppercase tracking-wide text-[color:var(--c-muted)]">Resultado da simulação</div>
                <div className="mt-1 font-semibold">
                  {selectedTier?.name || "—"} <span className="muted">({selectedTier?.rangeLabel || "—"})</span>
                </div>

                <div className="mt-3 space-y-2" aria-live="polite">
                  <div className="rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] p-3">
                    <div className="text-xs uppercase tracking-wide muted">Custo Progem {periodo==="mensal"?"mensal":"anual"}</div>
                    <div className="mt-1 text-2xl font-bold">
                      {simulatedTotal != null ? formatBRL(simulatedTotal) : "Sob consulta"}
                      {simulatedTotal != null && <span className="text-sm font-medium muted"> {periodo==="mensal"?"/mês":"/ano"}</span>}
                    </div>
                    {periodo==="anual" && simulatedTotal!=null && (
                      <div className="text-xs muted mt-1">
                        Equivalente mensal: <strong>{formatBRL(custoMensalEquivalente)}</strong>
                        {economiaAnual>0 && <> • Economia anual: <strong>{formatBRL(economiaAnual)}</strong></>}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] p-3">
                      <div className="text-xs uppercase tracking-wide muted">Receita estimada (mês)</div>
                      <div className="mt-1 text-lg font-semibold">{formatBRL(receitaMensalEstim)}</div>
                    </div>
                    <div className="rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wide muted">% do custo na receita</span>
                        <Percent className="w-4 h-4 text-[color:var(--c-muted)]"/>
                      </div>
                      <div className="mt-1 text-lg font-semibold">
                        {custoMensalEquivalente!=null && receitaMensalEstim>0 ? `${(custoSobreReceitaPct ?? 0).toFixed(2)}%` : "—"}
                      </div>
                    </div>
                  </div>

                  {/* Quebra do total por item */}
                  <div className="mt-1 space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="muted">Base do plano</span>
                      <span className="font-medium">
                        {formatBRL(simulatedPrice)}
                        {simulatedPrice!=null && <span className="muted"> {periodo==="mensal"?"/mês":"/ano"}</span>}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="muted">WhatsApp ilimitado</span>
                      <span className="font-medium">
                        {whatsappAddon ? (whatsappPrice!=null ? <>{formatBRL(whatsappPrice)}<span className="muted"> {periodo==="mensal"?"/mês":"/ano"}</span></> : "Sob consulta") : "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="muted">Site Premium</span>
                      <span className="font-medium">
                        {siteAddon ? (sitePrice!=null ? <>{formatBRL(sitePrice)}<span className="muted"> {periodo==="mensal"?"/mês":"/ano"}</span></> : "Sob consulta") : "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="muted">App do Associado</span>
                      <span className="font-medium">
                        {appAddon ? (appPrice!=null ? <>{formatBRL(appPrice)}<span className="muted"> {periodo==="mensal"?"/mês":"/ano"}</span></> : "Sob consulta") : "—"}
                      </span>
                    </div>

                    <div className="h-px bg-[var(--c-border)] my-2" />
                    <div className="flex items-center justify-between text-base font-semibold">
                      <span>Total</span>
                      <span>
                        {simulatedTotal != null ? <>{formatBRL(simulatedTotal)}<span className="muted text-sm"> {periodo==="mensal"?"/mês":"/ano"}</span></> : "Sob consulta"}
                      </span>
                    </div>

                    {perContract != null && (
                      <div className="mt-2 text-xs text-[color:var(--c-muted)]">
                        ≈ {formatBRL(perContract)} por contrato/mês
                      </div>
                    )}
                  </div>
                </div>

                {/* Ações */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Link
                    to="/demo"
                    className="btn btn-primary btn-demo w-full text-center"
                    onClick={()=>track("pricing_cta_click",{
                      origin:"simulator_card",
                      planId:selectedTier?.id||"unknown",
                      planName:selectedTier?.name||"unknown",
                      period:periodo, contracts,
                      addons:{ whatsapp: whatsappAddon, site: siteAddon, app: appAddon },
                      ticketMedio
                    })}
                  >
                    Solicitar Demonstração
                  </Link>
                  <Link to="/contato" className="btn btn-ghost w-full text-center">Gerar proposta</Link>
                </div>

                {/* share */}
                <button type="button" onClick={copyLink} className="mt-3 inline-flex items-center gap-2 text-sm">
                  <LinkIcon className="w-4 h-4 text-[color:var(--c-muted)]"/> {copied ? "Link copiado!" : "Copiar link da simulação"}
                </button>
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-[color:var(--c-muted)]">
            Os valores referem-se à <strong>mensalidade do Progem</strong>. Impostos e tarifas de meios de pagamento não estão incluídos.
          </p>
        </section>

        {/* APIs e integrações */}
        <section className="mt-10">
          <div className="card p-5">
            <h4 className="font-semibold">APIs e integrações</h4>
            <p className="muted mt-1 text-sm">Automatize seus fluxos com a API do Progem e integrações.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="https://sandbox-api.progem.com.br/docs/index.html"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost text-sm inline-flex items-center gap-2"
                onClick={()=>track("pricing_cta_click",{origin:"integrations_card",planId:"integrations_docs",planName:"APIs e Integrações — Docs (Sandbox)",period:periodo,contracts,ticketMedio})}
              >
                <Cable className="w-4 h-4"/> Ver documentação
              </a>
              <Link to="/gestao-web" className="btn btn-ghost text-sm">Gestão Web</Link>
              <Link
                to="/demo"
                className="btn btn-primary btn-demo text-sm"
                onClick={()=>track("pricing_cta_click",{origin:"integrations_card",planId:"integrations_contact",planName:"APIs e Integrações — Contato",period:periodo,contracts,ticketMedio})}
              >
                Falar com especialista
              </Link>
            </div>
          </div>
        </section>

        {/* Comparativo operacional */}
        <section className="mt-10">
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
                  <td className="px-4 py-3">até {BREAKPOINTS.start.toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3">até {BREAKPOINTS.pro.toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3">a partir de {(BREAKPOINTS.pro+1).toLocaleString("pt-BR")}</td>
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
          <div className="card p-5 space-y-6">
            <h4 className="font-semibold">Observações comerciais</h4>

            {/* Preço & período */}
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
                  <dd className="mt-1">Start/Pro: <strong>5</strong> • Enterprise: <strong>10</strong><br/>Usuário adicional: <strong>{formatBRL(EXTRA_USER_PRICE)}/mês</strong>.</dd>
                </div>
                <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-3">
                  <dt className="muted">Setup inicial</dt>
                  <dd className="mt-1">
                    A partir de <strong>{formatBRL(600)}</strong> — <em>pode variar</em> conforme integrações,
                    <em> número de usuários</em> e <em>escopo de migração de dados</em>.
                  </dd>
                </div>
              </dl>
            </div>

            {/* Add-ons — listas por faixa (compacto) */}
            <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Cable className="w-5 h-5 text-[color:var(--c-muted)]" />
                <span className="font-medium">Add-ons</span>
              </div>
              <div className="grid md:grid-cols-3 gap-3 text-sm">
                {/* WhatsApp */}
                <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-3">
                  <div className="font-medium mb-1">WhatsApp ilimitado</div>
                  <ul className="list-disc ml-4 space-y-1">
                    <li>Até 500: <strong>{formatBRL(ADDON_WHATSAPP_MONTHLY.start)}/mês</strong></li>
                    <li>501–1.000: <strong>{formatBRL(ADDON_WHATSAPP_MONTHLY.pro)}/mês</strong></li>
                    <li>1.001–2.000: <strong>{formatBRL(ADDON_WHATSAPP_MONTHLY.enterprise1)}/mês</strong></li>
                    <li>2.001–3.000: <strong>{formatBRL(ADDON_WHATSAPP_MONTHLY.enterprise2)}/mês</strong></li>
                    <li>3.001–4.000: <strong>{formatBRL(ADDON_WHATSAPP_MONTHLY.enterprise3)}/mês</strong></li>
                    <li>4.001–5.000: <strong>{formatBRL(ADDON_WHATSAPP_MONTHLY.enterprise4)}/mês</strong></li>
                    <li>Acima de 5.000: <strong>{ADDON_WHATSAPP_MONTHLY.enterprisePlus==null ? "Sob consulta" : `${formatBRL(ADDON_WHATSAPP_MONTHLY.enterprisePlus)}/mês`}</strong></li>
                  </ul>
                </div>

                {/* Site Premium */}
                <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-3">
                  <div className="font-medium mb-1">Site Premium</div>
                  <ul className="list-disc ml-4 space-y-1">
                    <li>Até 500: <strong>{addonListItemText(ADDON_MODE.site, ADDON_SITE_PCT.start, ADDON_SITE_FIX.start)}</strong></li>
                    <li>501–1.000: <strong>{addonListItemText(ADDON_MODE.site, ADDON_SITE_PCT.pro, ADDON_SITE_FIX.pro)}</strong></li>
                    <li>1.001–2.000: <strong>{addonListItemText(ADDON_MODE.site, ADDON_SITE_PCT.enterprise1, ADDON_SITE_FIX.enterprise1)}</strong></li>
                    <li>2.001–3.000: <strong>{addonListItemText(ADDON_MODE.site, ADDON_SITE_PCT.enterprise2, ADDON_SITE_FIX.enterprise2)}</strong></li>
                    <li>3.001–4.000: <strong>{addonListItemText(ADDON_MODE.site, ADDON_SITE_PCT.enterprise3, ADDON_SITE_FIX.enterprise3)}</strong></li>
                    <li>4.001–5.000: <strong>{addonListItemText(ADDON_MODE.site, ADDON_SITE_PCT.enterprise4, ADDON_SITE_FIX.enterprise4)}</strong></li>
                    <li>Acima de 5.000: <strong>{addonListItemText(ADDON_MODE.site, ADDON_SITE_PCT.enterprisePlus, ADDON_SITE_FIX.enterprisePlus)}</strong></li>
                  </ul>
                </div>

                {/* App do Associado */}
                <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-3">
                  <div className="font-medium mb-1">App do Associado</div>
                  <ul className="list-disc ml-4 space-y-1">
                    <li>Até 500: <strong>{addonListItemText(ADDON_MODE.app, ADDON_APP_PCT.start, ADDON_APP_FIX.start)}</strong></li>
                    <li>501–1.000: <strong>{addonListItemText(ADDON_MODE.app, ADDON_APP_PCT.pro, ADDON_APP_FIX.pro)}</strong></li>
                    <li>1.001–2.000: <strong>{addonListItemText(ADDON_MODE.app, ADDON_APP_PCT.enterprise1, ADDON_APP_FIX.enterprise1)}</strong></li>
                    <li>2.001–3.000: <strong>{addonListItemText(ADDON_MODE.app, ADDON_APP_PCT.enterprise2, ADDON_APP_FIX.enterprise2)}</strong></li>
                    <li>3.001–4.000: <strong>{addonListItemText(ADDON_MODE.app, ADDON_APP_PCT.enterprise3, ADDON_APP_FIX.enterprise3)}</strong></li>
                    <li>4.001–5.000: <strong>{addonListItemText(ADDON_MODE.app, ADDON_APP_PCT.enterprise4, ADDON_APP_FIX.enterprise4)}</strong></li>
                    <li>Acima de 5.000: <strong>{addonListItemText(ADDON_MODE.app, ADDON_APP_PCT.enterprisePlus, ADDON_APP_FIX.enterprisePlus)}</strong></li>
                  </ul>
                </div>
              </div>
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
                    Você pode <strong>gerar cobranças sem registro bancário</strong> para <strong>recebimento manual</strong> <em>sem custo</em>.
                    A <strong>baixa manual</strong> de <strong>PIX</strong> ou <strong>boletos</strong> também <em>não tem custo</em>.
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
                a: <>Não. É um add-on de custo fixo mensal (por faixa), via integração com plataforma parceira oficial.
                    Veja detalhes em <Link to="/zap" className="underline">WhatsApp ilimitado</Link>.</>
              },
              {
                q: "Posso migrar meus dados atuais?",
                a: <>Sim. Ajudamos na importação de clientes, contratos, carnês/boletos e histórico básico. Veja mais em <Link to="/migracao" className="underline">Migração de Dados</Link>.</>
              },
              {
                q: "Posso mudar de plano depois?",
                a: "Pode. O ajuste acompanha sua faixa de contratos ativos, sem fricção no uso da plataforma."
              },
              {
                q: "A baixa manual tem algum custo?",
                a: "Não. A baixa manual de PIX ou boletos não tem custo. Só há cobrança quando o pagamento acontece pelo banco."
              },
              {
                q: "Quais são as taxas quando o cliente paga pelo banco?",
                a: <>As tarifas dependem do meio de pagamento. Consulte a página <Link to="/taxas" className="underline">Taxas &amp; Cobrança</Link>.</>
              },
              {
                q: "Posso contratar o Site Premium ou o App do Associado depois?",
                a: <>Sim. Você pode contratar qualquer um separadamente. As faixas seguem esta página. Saiba mais em <Link to="/site-premium" className="underline">Site Premium</Link> e <Link to="/app-associado" className="underline">App do Associado</Link>.</>
              },
              {
                q: "Vocês oferecem API?",
                a: <>Sim. Disponibilizamos <strong>API</strong> para integrações. Confira em{" "}
                    <a href="https://sandbox-api.progem.com.br/docs/index.html" target="_blank" rel="noreferrer" className="underline">
                      documentação da sandbox
                    </a>.
                </>
              },
              {
                q: "Existe fidelidade?",
                a: "Trabalhamos com fidelidade de 1 ano, assim você conta com suporte dedicado, melhorias constantes e toda a estrutura necessária para obter o melhor resultado com nosso sistema."
              },
              {
                q: "Como funciona o suporte?",
                a: "Atendimento por canais digitais, com SLA conforme plano: Start até 24h úteis, Pro até 8h úteis e Enterprise até 4h úteis."
              },
            ].map((item, i) => (
              <details key={i} className="card p-4">
                <summary className="cursor-pointer font-medium">{item.q}</summary>
                <p className="muted text-sm mt-2">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer/>
    </div>
  )
}
