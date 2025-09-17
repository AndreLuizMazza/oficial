import { useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { setPageSEO } from "@/lib/seo"
import { motion } from "framer-motion"
import {
  Smartphone, Download, ShieldCheck, MapPin, Share2,
  Clock3, Signal, Sparkles, CheckCircle2, MessageSquare,
  FileSignature, ShoppingCart, CalendarCheck2, BellRing,
  Images, FilePieChart
} from "lucide-react"

/**
 * CONTEÚDO ORIGINAL MANTIDO — apenas envelopado por Header/Footer e SEO.
 */

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const features = [
  { icon: ClipboardList, title: "Leads & Funil", desc: "Capture, qualifique e acompanhe cada oportunidade por estágio." },
  { icon: MessageSquare, title: "WhatsApp nativo", desc: "Templates, disparos e histórico acoplado ao lead." },
  { icon: FileSignature, title: "Propostas & Assinatura", desc: "Gere proposta com 1 clique e assine digitalmente." },
  { icon: ShoppingCart, title: "Catálogo & Planos", desc: "Tabela de preços dinâmica e upsell com add-ons." },
  { icon: CalendarCheck2, title: "Agenda inteligente", desc: "Visitas e reuniões com lembretes automáticos." },
  { icon: BellRing, title: "Follow-ups", desc: "Alertas quando o lead esfria e tarefas pendentes." },
  { icon: Images, title: "Apresentações & Mídias", desc: "Pitch deck, PDF e vídeos salvos por lead." },
  { icon: FilePieChart, title: "Metas & Indicadores", desc: "Taxa de conversão, ticket médio e funil por vendedor." },
]

// Import faltante acima
import { ClipboardList, UploadCloud, RefreshCcw, Target, PhoneCall } from "lucide-react"

const faqs = [
  { q: "Como capturo leads?", a: "Via site, QR Code, formulários, importação de planilhas ou integração com campanhas." },
  { q: "É possível assinar no celular?", a: "Sim. Envie para assinatura com validade, acompanhe status e receba notificação ao assinar." },
  { q: "Como ficam as regras de preço?", a: "O app lê as regras do Progem (planos, faixas, add-ons) e aplica automaticamente na proposta." },
  { q: "Funciona offline?", a: "Cadastro e notas funcionam offline; propostas/assinatura requerem conexão no envio." },
]

export default function AppVendedor(){
  useEffect(() => {
    setPageSEO({
      title: "Progem • App do Vendedor",
      description: "Leads, propostas, assinatura digital, agenda e follow-ups — feche mais vendas com previsibilidade."
    })
  }, [])

  const tokens = useMemo(() => ({
    bg: "bg-[var(--c-surface)]",
    text: "text-[color:var(--c-text)]",
    muted: "text-[color:var(--c-muted)]",
    border: "border-[var(--c-border)]",
    primary: "text-[color:var(--c-primary)]",
    primaryBg: "bg-[color:var(--c-primary)]",
    primaryHover: "hover:bg-[color:var(--c-primary-600, var(--c-primary))]",
  }), [])

  return (
    <div>
      <Header/>

      <div className={`min-h-dvh ${tokens.bg} ${tokens.text}`}>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 py-20 md:py-24 grid gap-10 md:grid-cols-2 items-center">
            <motion.div {...fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs md:text-sm font-medium border-[var(--c-border)]">
                <Sparkles className="size-4"/> Novo módulo Progem
              </span>
              <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
                App do Vendedor
                <span className={`block mt-1 ${tokens.primary}`}>vendas mais rápidas, funil mais previsível</span>
              </h1>
              <p className={`mt-4 md:text-lg ${tokens.muted}`}>
                Centralize leads, propostas, agenda e follow-ups. Assine contratos no celular e
                entregue uma experiência moderna ao seu cliente.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/contato" className={`inline-flex items-center gap-2 rounded-xl ${tokens.primaryBg} ${tokens.primaryHover} text-white px-5 py-3 font-medium shadow-sm transition`}>
                  <Download className="size-5"/> Solicitar demonstração
                </Link>
                <a href="#recursos" className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-medium border-[var(--c-border)]">
                  Ver recursos
                </a>
              </div>
              <ul className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <li className="inline-flex items-center gap-2"><CheckCircle2 className="size-4"/> Propostas em 1 clique</li>
                <li className="inline-flex items-center gap-2"><CheckCircle2 className="size-4"/> Assinatura digital</li>
                <li className="inline-flex items-center gap-2"><CheckCircle2 className="size-4"/> WhatsApp integrado</li>
                <li className="inline-flex items-center gap-2"><CheckCircle2 className="size-4"/> Metas & indicadores</li>
              </ul>
            </motion.div>

            <motion.div {...fadeUp} className="relative">
              <div className="relative mx-auto max-w-sm">
                <div className="aspect-[9/19] w-full rounded-[2rem] border-8 border-black/90 shadow-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1200&auto=format&fit=crop"
                    alt="App do Vendedor — mockup"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 hidden md:block rounded-2xl border bg-white/70 backdrop-blur px-4 py-3 border-[var(--c-border)]">
                  <div className="flex items-center gap-3">
                    <Target className={`size-5 ${tokens.primary}`}/>
                    <div>
                      <p className="text-sm font-semibold">Foco em conversão</p>
                      <p className={`text-xs ${tokens.muted}`}>Playbook guiado e etapas do funil</p>
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
            <StatCard icon={Clock3} label="Proposta enviada" value="em 90s" hint="tempo médio" />
            <StatCard icon={Signal} label="Previsibilidade" value="+34%" hint="precisão de forecast" />
            <StatCard icon={PhoneCall} label="Respostas no WhatsApp" value="3x" hint="mais retorno em 24h" />
          </div>
        </section>

        {/* RECURSOS */}
        <section id="recursos" className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold">Ferramentas certas para fechar mais</h2>
            <p className={`mt-2 ${tokens.muted}`}>Do lead à assinatura, tudo integrado ao Progem.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div key={i} {...fadeUp} className="rounded-2xl border p-5 hover:shadow-card transition border-[var(--c-border)]">
                <f.icon className={`size-6 text-[color:var(--c-primary)]`}/>
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
                  { t: "Capture e qualifique", d: "Origem, interesse e potencial — sem atrito." },
                  { t: "Monte a proposta", d: "Planos, add-ons e regras de preço do Progem." },
                  { t: "Envie & acompanhe", d: "WhatsApp/e-mail, status e lembretes automáticos." },
                  { t: "Assine e ative", d: "Assinatura digital e contrato ativo no mesmo dia." },
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
                { k: "zap", t: "WhatsApp oficial", d: "Modelos aprovados e histórico por lead.", icon: MessageSquare },
                { k: "assin", t: "Assinatura", d: "Fluxo com validade e trilhas de auditoria.", icon: FileSignature },
                { k: "share", t: "Compartilhamento", d: "Proposta via link, QR ou PDF.", icon: Share2 },
                { k: "geo", t: "Geo & visitas", d: "Check-in e rota para reuniões.", icon: MapPin },
              ].map((b) => (
                <div key={b.k} className="rounded-2xl border p-5 border-[var(--c-border)]">
                  <b.icon className={`size-6 text-[color:var(--c-primary)]`}/>
                  <p className="mt-2 font-semibold">{b.t}</p>
                  <p className={`text-sm ${tokens.muted}`}>{b.d}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CHAMADA / CTA */}
        <section id="contato" className="relative">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="rounded-3xl border p-8 md:p-12 text-center bg-[color:var(--c-muted-bg,#f8fafc)] border-[var(--c-border)]">
              <h3 className="text-2xl md:text-3xl font-semibold">Acelere seu funil de vendas</h3>
              <p className={`mt-2 ${tokens.muted}`}>Disponível para Android. Integração nativa ao Progem.</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link to="/demo" className={`inline-flex items-center gap-2 rounded-xl ${tokens.primaryBg} ${tokens.primaryHover} text-white px-5 py-3 font-medium shadow-sm transition`}>
                  <Smartphone className="size-5"/> Falar com um especialista
                </Link>
                <a href="#" className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-medium border-[var(--c-border)]">
                  <Download className="size-5"/> Baixar apresentação (PDF)
                </a>
              </div>
            </div>
          </div>
        </section>

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
          <p className="text-center text-xs text-[color:var(--c-muted)]">Progem • App do Vendedor — módulo adicional do ecossistema de gestão</p>
        </footer>
      </div>

      <Footer/>
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
