// src/pages/AppCobrador.jsx
import { useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import BottomDockCTA from "@/components/BottomDockCTA"
import { setPageSEO } from "@/lib/seo"
import { motion } from "framer-motion"
import placeholder from "@/assets/img/app/app-cobrador-recebimetno.jpeg"
import {
  Smartphone, Download, ShieldCheck, MapPin, QrCode, WifiOff,
  Wallet, Receipt, Users, Clock3, Signal, Sparkles, CheckCircle2,
  FileText, UploadCloud, BarChart3, RefreshCcw, PhoneCall, Info
} from "lucide-react"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const features = [
  { icon: QrCode,   title: "Cobrança por QR Code", desc: "Gere QR Code instantâneo para PIX e reduza atrito no recebimento." },
  { icon: Receipt,  title: "Baixa automática",     desc: "Pagou, baixou. Evite retrabalho e inconsistências nas carteiras." },
  { icon: WifiOff,  title: "Modo offline",         desc: "Funciona sem internet e sincroniza quando a conexão volta." },
  { icon: MapPin,   title: "Rotas e visitas",      desc: "Planeje rotas, registre presença e comprove visitas com geolocalização." },
  { icon: Wallet,   title: "Carteira do cobrador", desc: "Controle de recebimentos em tempo real, com conferência de caixa." },
  { icon: Users,    title: "Carteira por área",    desc: "Distribua carteiras por região, equipe ou rota — tudo multi-unidade." },
  { icon: FileText, title: "Comprovantes e recibos", desc: "Envio por WhatsApp/SMS e histórico acessível ao associado." },
  { icon: BarChart3,title: "Indicadores e metas",  desc: "Acompanhe PDD, inadimplência, conversão e produtividade por cobrador." },
]

const faqs = [
  { q: "O app funciona sem internet?", a: "Sim. Você consegue lançar recebimentos e visitas offline; quando a conexão retorna, tudo sincroniza automaticamente." },
  { q: "Como o associado recebe o comprovante?", a: "Por QR Code no ato, por WhatsApp/SMS/e-mail ou impresso. O recibo também aparece na área do associado." },
  { q: "É multi-tenant?", a: "Sim. Cada unidade/empresa opera isolada. Controles de acesso por perfil e por carteira de cobrança." },
  { q: "Quais meios de pagamento?", a: "PIX (QR), boleto e cartão quando integrado ao seu adquirente/PSP." },
]

function PlatformBadge(){
  return (
    <div className="mt-3 flex items-center gap-2 text-xs">
      <span className="inline-flex items-center gap-1 rounded-md border border-[var(--c-border)] bg-[var(--c-surface-2)] px-2 py-1">
        <Smartphone className="w-3.5 h-3.5" /> Android
      </span>
      <span className="inline-flex items-center gap-1 rounded-md border border-[var(--c-border)] bg-[var(--c-surface)] px-2 py-1">
        <ShieldCheck className="w-3.5 h-3.5" /> Sem taxa por recebimento ao Progem
      </span>
    </div>
  )
}

export default function AppCobrador(){
  useEffect(() => {
    setPageSEO({
      title: "Progem • App do Cobrador",
      description: "Cobrança em campo com rotas, QR Code PIX, modo offline, baixa automática e indicadores — integrado ao Progem e sem taxa por recebimento."
    })
  }, [])

  const tokens = useMemo(() => ({
    bg: "bg-[var(--c-surface)]",
    text: "text-[color:var(--c-text)]",
    muted: "text-[color:var(--c-muted)]",
    border: "border-[var(--c-border)]",
    primary: "text-[color:var(--c-primary)]",
    primaryBg: "bg-[color:var(--c-primary)]",
  }), [])

  return (
    <div>


      <div className={`min-h-dvh ${tokens.bg} ${tokens.text}`}>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 py-16 md:py-20 grid gap-10 md:grid-cols-[1fr,320px] items-center">
            <motion.div {...fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs md:text-sm font-medium border-[var(--c-border)]">
                <Sparkles className="size-4"/> Novo módulo Progem
              </span>
              <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
                App do Cobrador
                <span className={`block mt-1 ${tokens.primary}`}>cobrança em campo, sem fricção</span>
              </h1>
              <p className={`mt-4 md:text-lg ${tokens.muted}`}>
                Centralize rotas, recebimentos e comprovantes em um único app.
                Reduza inadimplência e acelere a baixa — online e offline.
              </p>

              <PlatformBadge/>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/demo" data-cta="demo" className="btn btn-primary btn-demo">
                  Solicitar demonstração
                </Link>
                <a href="#recursos" className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-medium border-[var(--c-border)]">
                  Ver recursos
                </a>
              </div>

              <ul className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <li className="inline-flex items-center gap-2"><CheckCircle2 className="size-4"/> Modo offline</li>
                <li className="inline-flex items-center gap-2"><CheckCircle2 className="size-4"/> QR Code PIX</li>
                <li className="inline-flex items-center gap-2"><CheckCircle2 className="size-4"/> Rotas e presença</li>
                <li className="inline-flex items-center gap-2"><CheckCircle2 className="size-4"/> Baixa automática</li>
              </ul>
            </motion.div>

            {/* Mockup compacto em formato de celular */}
            <motion.div {...fadeUp} className="relative mx-auto w-full max-w-[200px] md:max-w-[220px]">
              <div className="aspect-[9/19] w-full rounded-[1.5rem] border-4 md:border-8 border-black/90 shadow-2xl overflow-hidden bg-black">
                <img
                  src={placeholder}
                  alt="App do Cobrador — mockup"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Badge acessível no claro/escuro */}
              <div className="absolute -bottom-6 -right-6 hidden md:block">
                <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface-2)] shadow-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid place-content-center size-8 rounded-full border border-[var(--c-border)] bg-[var(--c-surface)]">
                      <ShieldCheck className={`size-4 ${tokens.primary}`} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--c-foreground)]">Dados protegidos</p>
                      <p className="text-xs text-[color:var(--c-muted)]">Criptografia em repouso e em trânsito</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* PROVAS RÁPIDAS */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard icon={Clock3} label="Recebimento mais rápido" value="-43%" hint="tempo médio de baixa" />
            <StatCard icon={Signal} label="Cobrança efetiva" value="+27%" hint="recorrências em dia" />
            <StatCard icon={PhoneCall} label="Suporte Progem" value="24/7" hint="onboarding guiado" />
          </div>
        </section>

        {/* RECURSOS */}
        <section id="recursos" className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold">Tudo o que o cobrador precisa em campo</h2>
            <p className={`mt-2 ${tokens.muted}`}>Produtividade, conferência e segurança — integrados ao Progem.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div key={i} {...fadeUp} className="rounded-2xl border p-5 hover:shadow-card transition border-[var(--c-border)]">
                <f.icon className={`size-6 ${tokens.primary}`}/>
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className={`mt-1 text-sm ${tokens.muted}`}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <motion.div {...fadeUp} className="rounded-2xl border p-6 border-[var(--c-border)]">
              <ol className="space-y-4">
                {[
                  { t: "Defina as carteiras", d: "Configure áreas, rotas e metas por cobrador." },
                  { t: "Sincronize contratos", d: "O app recebe a lista de clientes e parcelas a cobrar." },
                  { t: "Cobre em campo", d: "Registre visita, receba via QR/PIX, gere recibo." },
                  { t: "Baixa automática", d: "Sem planilhas: tudo já atualizado no Progem." },
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`grid place-content-center size-8 rounded-full ${tokens.primaryBg} text-white font-bold`}>{i+1}</span>
                    <div>
                      <p className="font-medium">{s.t}</p>
                      <p className={`text-sm ${tokens.muted}`}>{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </motion.div>
            <motion.div {...fadeUp} className="grid gap-4 sm:grid-cols-2">
              {[
                { k: "seg", t: "Segurança", d: "Perfis, auditoria e criptografia ponta a ponta.", icon: ShieldCheck },
                { k: "sync", t: "Sincronização", d: "Conflitos resolvidos automaticamente.", icon: RefreshCcw },
                { k: "docs", t: "Documentos", d: "Recibos e comprovantes organizados.", icon: UploadCloud },
                { k: "smart", t: "Rotas inteligentes", d: "Sugestões baseadas em proximidade.", icon: MapPin },
              ].map((b) => (
                <div key={b.k} className="rounded-2xl border p-5 border-[var(--c-border)]">
                  <b.icon className={`size-6 ${tokens.primary}`}/>
                  <p className="mt-2 font-semibold">{b.t}</p>
                  <p className={`text-sm ${tokens.muted}`}>{b.d}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Custos & Setup (discreto) */}
        <section className="mx-auto max-w-7xl px-4">
          <div className="rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)]">
                <Info className="w-5 h-5 text-[color:var(--c-muted)]"/>
              </span>
              <div className="text-sm">
                <p className="font-medium">Custos</p>
                <ul className="mt-1 space-y-1">
                  <li className="muted">App do Cobrador incluso no pacote Progem — <strong>sem custo adicional de licenciamento</strong>.</li>
                  <li className="muted"><strong>Sem taxa por recebimento</strong> ao Progem ao utilizar o app.</li>
                  <li className="muted">Setup único (<em>sob escopo</em>) pode ser aplicado conforme integrações e treinamentos setorizados necessários.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CHAMADA / CTA */}
        <section id="contato" className="relative">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="rounded-3xl border p-8 md:p-12 text-center bg-[var(--c-surface-2)] border-[var(--c-border)]">
              <h3 className="text-2xl md:text-3xl font-semibold text-[color:var(--c-foreground)]">
                Leve sua cobrança de campo para outro nível
              </h3>
              <p className="mt-2 text-[color:var(--c-muted)]">
                Disponível para Android. Integração nativa ao Progem.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/demo"
                  data-cta="demo"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 font-medium shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
                >
                  <Smartphone className="size-5" /> Falar com um especialista
                </Link>

                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-medium border-[var(--c-border)] text-[color:var(--c-foreground)]/90"
                >
                  <Download className="size-5" /> Baixar apresentação (PDF)
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-5xl px-4 py-14">
          <h3 className="text-xl md:text-2xl font-semibold text-center">Perguntas frequentes</h3>
          <div className="mt-6 divide-y border rounded-2xl border-[var(--c-border)]">
            {faqs.map((f, i) => (
              <details key={i} className="group">
                <summary className="list-none cursor-pointer select-none p-5 flex items-center justify-between">
                  <span className="font-medium">{f.q}</span>
                  <span className="text-sm opacity-70 group-open:rotate-180 transition">⌄</span>
                </summary>
                <div className="p-5 pt-0 text-sm text-[color:var(--c-muted)]">{f.a}</div>
              </details>
            ))}
          </div>
        </section>

        <footer className="mx-auto max-w-7xl px-4 pb-16">
          <p className="text-center text-xs text-[color:var(--c-muted)]">Progem • App do Cobrador — módulo adicional do ecossistema de gestão</p>
        </footer>
      </div>

      {/* CTA fixo (mobile) */}
      <BottomDockCTA/>

    </div>
  )
}

function StatCard({ icon: Icon, label, value, hint }){
  return (
    <div className="rounded-2xl border p-5 border-[var(--c-border)]">
      <div className="flex items-center gap-3">
        <Icon className="size-6 text-[color:var(--c-primary)]"/>
        <div>
          <p className="text-sm opacity-80">{label}</p>
          <p className="text-2xl font-bold leading-tight">{value}</p>
          <p className="text-xs text-[color:var(--c-muted)]">{hint}</p>
        </div>
      </div>
    </div>
  )
}
