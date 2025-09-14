import { useEffect, useMemo, useRef, useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { setPageSEO } from "@/lib/seo"
import { BFF } from "@/lib/bff"
import clsx from "clsx"
import {
  Check, ShieldCheck, Globe, Handshake, Info, Cable, HelpCircle, X, MessageCircle
} from "lucide-react"

function formatBRL(n){
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
    price_month: 390,
    cap: "até 1000 contratos ativos",
    capNote: "Contagem considera contratos com status 'ativo'. Ao atingir o limite, contrate add-ons ou migre de plano.",
    icon: ShieldCheck,
  },
  {
    id: "pro",
    name: "Pro",
    price_month: 890,
    cap: "até 5000 contratos",
    capNote: "A contagem é por CNPJs/CPFs com contrato ativo. Excedeu 5000? Aplicamos add-on por faixa ou upgrade p/ Enterprise.",
    highlight: true,
    icon: Globe,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price_month: 1990,
    cap: "acima de 5000",
    capNote: "Faixas progressivas para alto volume, com SLA e onboarding especiais.",
    icon: Handshake,
  },
]

const ICONS = {
  start: ShieldCheck,
  pro: Globe,
  enterprise: Handshake,
}

/** CTA flutuante sem "Ver Docs" */
function FloatingCTA({ visible, onClose }){
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
              <a href="/contato" className="btn btn-primary btn-sm w-full">
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
  const [periodo, setPeriodo] = useState("mensal")
  const [plans, setPlans] = useState(FALLBACK)
  const [ctaOpen, setCtaOpen] = useState(false)
  const comparativoRef = useRef(null)

  useEffect(()=>{
    setPageSEO({
      title: "Progem • Planos",
      description: "Todos os planos incluem os mesmos recursos. O valor varia pelo número de contratos ativos."
    })
  },[])

  useEffect(()=>{
    ;(async()=>{
      try{
        const apiPlans = await BFF.planos()
        if (Array.isArray(apiPlans) && apiPlans.length){
          const normalized = apiPlans.slice(0,3).map((p, idx)=>({
            id: p.id?.toString() || `pl-${idx}`,
            name: p.nome || ["Start","Pro","Enterprise"][idx],
            price_month: Number(p.valor_unitario ?? 0) || FALLBACK[idx]?.price_month,
            cap: p.cap || FALLBACK[idx]?.cap,
            capNote: p.capNote || FALLBACK[idx]?.capNote,
            highlight: Boolean(p.destaque ?? FALLBACK[idx]?.highlight),
            icon: ICONS[["start","pro","enterprise"][idx]]
          }))
          setPlans(normalized)
        }
      }catch(e){
        console.warn("BFF.planos falhou, usando fallback", e)
      }
    })()
  },[])

  useEffect(()=>{
    const el = comparativoRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setCtaOpen(true) }),
      { threshold: 0.2 }
    )
    obs.observe(el)
    return ()=> obs.disconnect()
  },[])

  const planosComPreco = useMemo(()=>{
    const descontoAnual = 0.15
    return plans.map(p=>{
      const mensal = Number(p.price_month || 0)
      const anual = mensal * 12 * (1 - descontoAnual)
      return {
        ...p,
        displayPrice: periodo === "mensal" ? mensal : anual,
        suffix: periodo === "mensal" ? "/mês" : "/ano",
        badge: p.highlight ? "Recomendado" : null
      }
    })
  },[plans, periodo])

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
            periodo===opt
              ? "bg-[var(--c-primary)] text-[var(--c-primary-contrast)]"
              : "hover:bg-[var(--c-surface-2)]"
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

  return (
    <div>
      <Header/>
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">Escolha o plano ideal</h1>
            <p className="muted mt-2 text-lg">
              Todos os planos incluem os mesmos recursos. O valor varia conforme o <strong>número de contratos ativos</strong>.
            </p>
          </div>
          <TogglePeriodo />
        </div>

        <section className="grid gap-6 md:grid-cols-3">
          {planosComPreco.map(pl=>(
            <article key={pl.id} className={clsx("card p-6 flex flex-col", pl.highlight && "ring-2 ring-[var(--c-primary)]")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconePlano icon={pl.icon}/>
                  <div>
                    <h3 className="text-lg font-semibold">{pl.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="badge">{pl.cap}</span>
                      <Tooltip id={`tip-${pl.id}`} content={pl.capNote}>
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
                {pl.badge && <span className="badge">{pl.badge}</span>}
              </div>
              <div className="mt-4 text-3xl font-bold">
                {formatBRL(pl.displayPrice)} <span className="text-sm font-medium muted">{pl.suffix}</span>
              </div>
              <div className="mt-4 text-sm muted flex items-center gap-2">
                <Check className="w-4 h-4" /> Todos os recursos incluídos
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <a href="/demo" className="btn btn-primary w-full text-center">Solicitar Demonstração</a>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-2">Todos os planos incluem</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {COMMON_FEATURES.map(f=>(
              <div key={f} className="card p-4 flex items-start gap-3">
                <Check className="w-4 h-4 mt-1" /> <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
          <div className="card p-5 mt-6">
            <h4 className="font-semibold">APIs e integrações</h4>
            <p className="muted mt-1 text-sm">Conecte seu ERP, site ou CRM às APIs do Progem e à NaLápide.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href="/developers" className="btn btn-ghost text-sm inline-flex items-center gap-2">
                <Cable className="w-4 h-4"/> Ver documentação
              </a>
              <a href="/demo" className="btn btn-primary text-sm">Falar com especialista</a>
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
                  <td className="px-4 py-3">até 1000</td>
                  <td className="px-4 py-3">até 5000</td>
                  <td className="px-4 py-3">acima de 5000</td>
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

        <FloatingCTA visible={ctaOpen} onClose={()=>setCtaOpen(false)} />
      </main>
      <Footer/>
    </div>
  )
}
