// src/pages/Apps.jsx
import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { setPageSEO } from "@/lib/seo"
import CardMotion from "@/components/CardMotion"
import BottomDockCTA from "@/components/BottomDockCTA"
import placeholder from "@/assets/img/placeholder.png"
import appsGeral from "@/assets/img/app/apps-geral.png"

import {
  Sparkles, Smartphone, UserRound, BadgeDollarSign, Wallet2, ShieldCheck,
  Check, QrCode, FileText, BellRing, MapPin, CloudOff, Download, LineChart, Info,
  ArrowRight, Apple
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

// === IMPORTS DAS TELAS (coloque os 9 PNGs em src/assets/img/app/) ===
import a1 from "@/assets/img/app/associado-1.png"
import a2 from "@/assets/img/app/associado-2.png"
import a3 from "@/assets/img/app/associado-3.png"
import v1 from "@/assets/img/app/vendedor-1.png"
import v2 from "@/assets/img/app/vendedor-2.png"
import v3 from "@/assets/img/app/vendedor-3.png"
import c1 from "@/assets/img/app/cobrador-1.png"
import c2 from "@/assets/img/app/cobrador-2.png"
import c3 from "@/assets/img/app/cobrador-3.png"

export default function Apps(){
  const [search, setSearch] = useSearchParams()
  const initialTab = ["associado","vendedor","cobrador"].includes(search.get("app")) ? search.get("app") : "associado"
  const [tab, setTab] = useState(initialTab)

  useEffect(()=>{
    setPageSEO({
      title: "Progem • Apps móveis (Associado, Vendedor e Cobrador)",
      description:
        "App do Associado (iOS/Android) whitelabel como add-on; Apps do Vendedor e Cobrador (Android) inclusos no Progem. Sem taxa por recebimento/venda. Setup único sob escopo."
    })
  },[])

  useEffect(()=>{
    const next = new URLSearchParams(search)
    next.set("app", tab)
    setSearch(next, { replace:true })
  }, [tab]) // eslint-disable-line react-hooks/exhaustive-deps

  const tabs = useMemo(()=>[
    { id:"associado", label:"App do Associado", icon: UserRound },
    { id:"vendedor",  label:"App do Vendedor",  icon: BadgeDollarSign },
    { id:"cobrador",  label:"App do Cobrador",  icon: Wallet2 },
  ],[])

  const detailsPath = (t) =>
    t === "associado" ? "/app-associado" :
    t === "vendedor"  ? "/app-vendedor"  :
    "/app-cobrador"

  const platform = {
    associado: { ios:true, android:true, note:"Whitelabel" },
    vendedor:  { ios:false, android:true },
    cobrador:  { ios:false, android:true },
  }

  // Imagens reais
  const SCREENS = {
    associado: [a1, a2, a3],
    vendedor:  [v1, v2, v3],
    cobrador:  [c1, c2, c3],
  }

  const FEATURES = {
    associado: [
      { icon: FileText,  t:"2ª via e pagamentos", d:"Boleto/Pix, histórico e comprovantes." },
      { icon: QrCode,    t:"Carteirinha digital", d:"Identificação do associado e dependentes." },
      { icon: BellRing,  t:"Notificações úteis",  d:"Lembretes de vencimento e avisos." },
      { icon: UserRound, t:"Autoatendimento",     d:"Atualização cadastral e solicitações." },
      { icon: Sparkles,  t:"Memorial & homenagens", d:"Integração com memorial digital." },
      { icon: ShieldCheck, t:"App com sua marca", d:"Cores, ícones e domínio da sua empresa." },
    ],
    vendedor: [
      { icon: BadgeDollarSign, t:"Propostas e cadastros", d:"Fluxo guiado e assinatura no app." },
      { icon: FileText,        t:"Checklist de documentos", d:"Fotos, anexos e validação básica." },
      { icon: MapPin,          t:"Roteiros e endereços", d:"Organize visitas e oportunidades." },
      { icon: CloudOff,        t:"Modo offline", d:"Cadastro mesmo sem internet; sincroniza depois." },
      { icon: LineChart,       t:"Funil simples", d:"Acompanhe conversões por etapa." },
      { icon: ShieldCheck,     t:"Perfis e permissões", d:"Acesso por papel e trilhas básicas." },
      { icon: BadgeDollarSign, t:"Sem taxa por venda no app", d:"Nenhuma taxa adicional ao Progem por venda realizada no app." },
    ],
    cobrador: [
      { icon: Wallet2,   t:"Carteira de cobrança", d:"Agenda diária e filtros por rota/bairro." },
      { icon: QrCode,    t:"PIX/2ª via na hora",  d:"Gere QR/linha digitável no local." },
      { icon: Download,  t:"Comprovante imediato", d:"Envio por WhatsApp/SMS/e-mail." },
      { icon: MapPin,    t:"Mapa e rotas",         d:"Otimização de trajeto e status das visitas." },
      { icon: CloudOff,  t:"Modo offline",         d:"Baixa provisória e sync posterior." },
      { icon: ShieldCheck, t:"Auditoria básica",   d:"Quem cobrou, quando e onde." },
      { icon: Wallet2,   t:"Sem taxa por recebimento", d:"Nenhuma taxa adicional ao Progem por recebimento no app." },
    ],
  }

  function PlatformBadge({ ios=false, android=false, note }) {
    return (
      <div className="mt-2 flex items-center gap-2 text-xs">
        {ios && (
          <span className="inline-flex items-center gap-1 rounded-md border border-[var(--c-border)] bg-[var(--c-surface-2)] px-2 py-1">
            <Apple className="w-3.5 h-3.5" /> iOS
          </span>
        )}
        {android && (
          <span className="inline-flex items-center gap-1 rounded-md border border-[var(--c-border)] bg-[var(--c-surface-2)] px-2 py-1">
            <Smartphone className="w-3.5 h-3.5" /> Android
          </span>
        )}
        {note && (
          <span className="inline-flex items-center gap-1 rounded-md border border-[var(--c-border)] bg-[var(--c-surface)] px-2 py-1">
            <ShieldCheck className="w-3.5 h-3.5" /> {note}
          </span>
        )}
      </div>
    )
  }

  // ==== animações (tabs) ====
  const reduce = useReducedMotion()
  const swapVariants = {
    initial: { opacity: 0, y: reduce ? 0 : 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
    exit:    { opacity: 0, y: reduce ? 0 : -6, transition: { duration: 0.18, ease: "easeIn" } },
  }
  const itemVariants = {
    initial: { opacity: 0, y: 8 },
    animate: (i=0) => ({
      opacity: 1, y: 0,
      transition: { delay: 0.04 * i, duration: 0.22, ease: "easeOut" }
    }),
    exit: { opacity: 0, y: -4, transition: { duration: 0.15 } }
  }

  return (
    <div>
      {/* HERO */}
      <section className="border-b border-[var(--c-border)] bg-[var(--c-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16 grid md:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
              <Smartphone className="w-4 h-4 text-[color:var(--c-muted)]"/> Apps móveis — Associado Whitelabel
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">
              Três apps, <span className="text-[var(--c-primary)]">uma experiência única</span>
            </h1>
            <p className="muted mt-3 text-lg">
              Soluções que reduzem fricção, aceleram cadastros e reforçam a cobrança — com o App do Associado na sua marca (whitelabel).
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/contato" data-cta="demo" className="btn btn-primary btn-demo" title="Solicitar demonstração" aria-label="Solicitar demonstração">Solicitar demonstração</Link>
              <Link to="/planos" className="btn btn-ghost" title="Ver planos" aria-label="Ver planos">Ver planos</Link>
            </div>

            {/* Prova social */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { Icon: LineChart, title: "R$ 5 mi+ / mês", sub: "Pagamentos recorrentes com escala" },
                { Icon: ShieldCheck, title: "Associado whitelabel", sub: "Sua marca no app do associado" },
                { Icon: Smartphone, title: "iOS (Associado) & Android", sub: "Publicação em lojas oficiais" },
              ].map(({Icon,title,sub},i)=>(
                <div key={i} className="card p-4 flex items-center gap-3">
                  <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                    <Icon className="w-5 h-5 text-[color:var(--c-muted)]"/>
                  </span>
                  <div>
                    <div className="font-semibold leading-tight">{title}</div>
                    <div className="muted text-[13px]">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[var(--c-border)] bg-[var(--c-surface-2)]">
            <img src={appsGeral} alt="Mockup dos apps Progem" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* TABS */}
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="w-full overflow-x-auto">
          <div className="inline-flex items-center gap-2 rounded-xl p-1 border border-[var(--c-border)] bg-[var(--c-surface)]">
            {tabs.map(({id,label,icon:Icon})=>(
              <button
                key={id}
                type="button"
                onClick={()=>setTab(id)}
                aria-pressed={tab===id}
                className={`px-3 py-1.5 rounded-lg text-sm inline-flex items-center gap-2 transition focus:outline-none focus:ring-2 focus:ring-[var(--c-primary)] ${
                  tab===id ? "bg-[var(--c-primary)] text-[var(--c-primary-contrast)] shadow-sm" : "hover:bg-[var(--c-surface-2)]"
                }`}
              >
                <Icon className="w-4 h-4"/>{label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTEÚDO POR ABA */}
        <section
          className="mt-8 grid lg:grid-cols-[1fr,0.9fr] gap-8 items-start"
          aria-live="polite" aria-busy="false"
        >
          {/* Coluna esquerda */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`col-left-${tab}`}
              variants={swapVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {tab === "associado" && "App do Associado"}
                    {tab === "vendedor"  && "App do Vendedor"}
                    {tab === "cobrador"  && "App do Cobrador"}
                  </h2>
                  <p className="muted mt-1">
                    {tab === "associado" && "Autoatendimento, pagamentos e notificações que reduzem a inadimplência e desafogam o atendimento."}
                    {tab === "vendedor"  && "Prospecção, cadastro guiado e assinatura — inclusive em campo e com modo offline."}
                    {tab === "cobrador"  && "Carteira de cobrança com PIX/2ª via na hora, rotas e baixa imediata — mesmo sem internet."}
                  </p>
                  {platform?.[tab] && (
                    <div className="mt-2">
                      <PlatformBadge {...platform[tab]} note={platform[tab].note}/>
                    </div>
                  )}
                </div>

                {/* Ações rápidas */}
                <div className="hidden md:flex flex-col gap-2 min-w-[220px]">
                  <Link
                    to={detailsPath(tab)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] px-3 py-2 text-sm hover:bg-[var(--c-surface-2)] transition"
                    aria-label="Ver detalhes do app"
                    title="Ver detalhes do app"
                  >
                    Ver detalhes do app <ArrowRight className="w-4 h-4"/>
                  </Link>
                  <Link to="/contato" data-cta="demo" className="btn btn-primary btn-demo text-sm" aria-label="Solicitar demonstração" title="Solicitar demonstração">
                    Solicitar demonstração
                  </Link>
                </div>
              </div>

              {/* Features com stagger */}
              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                {FEATURES[tab].map(({icon:Icon, t, d}, i)=>(
                  <motion.div
                    key={t}
                    custom={i}
                    variants={itemVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <CardMotion className="card p-4 flex items-start gap-3 min-h-[96px]" tabIndex={0}>
                      <span className="inline-flex w-9 h-9 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                        <Icon className="w-4 h-4 text-[color:var(--c-muted)]"/>
                      </span>
                      <div>
                        <div className="font-medium">{t}</div>
                        <p className="muted text-sm">{d}</p>
                      </div>
                    </CardMotion>
                  </motion.div>
                ))}
              </div>

              {/* Ações (mobile) */}
              <div className="mt-6 flex flex-wrap gap-3 md:hidden">
                <Link
                  to={detailsPath(tab)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] px-3 py-2 text-sm"
                >
                  Ver detalhes do app <ArrowRight className="w-4 h-4"/>
                </Link>
                <Link to="/contato" data-cta="demo" className="btn btn-primary btn-demo">
                  Ver demonstração do {tab === "associado" ? "App do Associado" : tab === "vendedor" ? "App do Vendedor" : "App do Cobrador"}
                </Link>
                <Link to="/planos" className="btn btn-ghost">Planos & valores</Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Coluna direita (telas) */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`col-right-${tab}`}
              variants={swapVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="text-sm uppercase tracking-wide text-[color:var(--c-muted)]">Algumas telas</div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {SCREENS[tab].map((src,i)=>(
                  <motion.div
                    key={`${tab}-screen-${i}`}
                    custom={i}
                    variants={itemVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Link to={detailsPath(tab)} className="group focus:outline-none">
                      <CardMotion className="rounded-xl overflow-hidden border border-[var(--c-border)] bg-[var(--c-surface-2)] ring-0 group-focus:ring-2 ring-[var(--c-primary)]" tabIndex={0}>
                        <img
                          src={src}
                          alt={`Tela do ${tab} ${i+1}`}
                          className="w-full h-56 object-contain bg-transparent group-hover:opacity-95 transition"
                          loading="lazy"
                          width="360"
                          height="224"
                          onError={(e)=>{ e.currentTarget.src = placeholder; e.currentTarget.alt = "Prévia indisponível"; }}
                        />
                      </CardMotion>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-3">
                <Link
                  to={detailsPath(tab)}
                  className="inline-flex items-center gap-2 text-sm underline underline-offset-4"
                >
                  Ver página completa do {tab === "associado" ? "App do Associado" : tab === "vendedor" ? "App do Vendedor" : "App do Cobrador"}
                  <ArrowRight className="w-4 h-4"/>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Custos & Setup */}
        <section className="mt-8">
          <div className="rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)]">
                <Info className="w-5 h-5 text-[color:var(--c-muted)]"/>
              </span>
              <div className="text-sm">
                <p className="font-medium">Custos, modelos de cobrança & setup</p>
                <ul className="mt-1 space-y-1">
                  <li className="muted">
                    Apps <strong>Vendedor</strong> e <strong>Cobrador</strong> inclusos no pacote Progem — sem licenciamento adicional.
                  </li>
                  <li className="muted">
                    <strong>App do Associado (whitelabel)</strong> e <strong>Site Premium</strong> são <strong>add-ons</strong>. O valor mensal
                    acompanha sua <strong>faixa de contratos</strong> (Start, Pro ou Enterprise) e pode ser definido como
                    <strong> percentual sobre o preço base</strong> da faixa (ex.: Site 50% • App 50%) ou como
                    <strong> valor fixo por faixa</strong> — conforme a política vigente.
                  </li>
                  <li className="muted">
                    Consulte o valor exato para sua faixa no simulador de <Link to="/planos" className="underline">Planos</Link>.
                    No anual, há <strong>15% OFF</strong> sobre o total (base + add-ons).
                  </li>
                  <li className="muted">App do Cobrador: <strong>sem taxa por recebimento</strong> ao Progem.</li>
                  <li className="muted">App do Vendedor: <strong>sem taxa por venda</strong> ao Progem.</li>
                  <li className="muted">
                    <strong>Setup único</strong> (<em>sob escopo</em>): depende das integrações necessárias e da quantidade de usuários a treinar (setorizado).
                  </li>
                </ul>

                <div className="mt-3">
                  <Link to="/planos" className="btn btn-ghost btn-sm">Ver planos e simular</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARATIVO */}
        <section className="mt-12">
          <h3 className="text-xl font-semibold mb-2">Comparativo rápido</h3>
          <div className="overflow-x-auto border border-[var(--c-border)] rounded-xl">
            <table className="min-w-[760px] w-full text-sm">
              <thead className="bg-[var(--c-surface-2)]">
                <tr>
                  <th className="text-left px-4 py-3">Recurso</th>
                  <th className="text-left px-4 py-3">Associado</th>
                  <th className="text-left px-4 py-3">Vendedor</th>
                  <th className="text-left px-4 py-3">Cobrador</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { k:"2ª via / pagamentos", a:true, v:false, c:true },
                  { k:"Cadastro / propostas", a:false, v:true,  c:false },
                  { k:"Carteira de cobrança", a:false, v:false, c:true },
                  { k:"Mapa / rotas",        a:false, v:true,  c:true },
                  { k:"Modo offline",        a:false, v:true,  c:true },
                  { k:"Notificações",        a:true,  v:true,  c:true },
                  { k:"Whitelabel (apenas Associado)", a:true,  v:false, c:false },
                ].map((row)=>(
                  <tr key={row.k} className="border-t border-[var(--c-border)]">
                    <td className="px-4 py-3 font-medium">{row.k}</td>
                    <td className="px-4 py-3">{row.a ? <Check className="w-4 h-4" aria-label="Disponível"/> : "—"}</td>
                    <td className="px-4 py-3">{row.v ? <Check className="w-4 h-4" aria-label="Disponível"/> : "—"}</td>
                    <td className="px-4 py-3">{row.c ? <Check className="w-4 h-4" aria-label="Disponível"/> : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="mt-12">
          <div className="card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-sm px-3 py-1.5 inline-flex items-center gap-2 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                <Sparkles className="w-4 h-4 text-[color:var(--c-muted)]"/>
                Pronto para ver na prática?
              </div>
              <h2 className="text-2xl font-semibold mt-3">Agende uma demo dos apps</h2>
              <p className="muted">Mostramos o fluxo no seu contexto e volume.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/contato" data-cta="demo" className="btn btn-primary btn-demo">
                Solicitar demonstração
              </Link>
              <Link to="/planos" className="btn btn-ghost">Ver planos</Link>
            </div>
          </div>
        </section>
      </main>

      {/* CTA flutuante (mobile) */}
      <BottomDockCTA/>

      
    </div>
  )
}
