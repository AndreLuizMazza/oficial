import { useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { setPageSEO } from "@/lib/seo"
import {
  Sparkles, Check, Clock, Users, ShieldCheck, CreditCard, Globe, Newspaper, BarChart3, Cable, MessageSquareText, Info
} from "lucide-react"
import { Link } from "react-router-dom"

const WHATSAPP_E164 = "554699011022" // usado apenas no link, não exibido

export default function Demo(){
  useEffect(()=>{
    setPageSEO({
      title: "Progem • O que você verá na demonstração",
      description: "Veja, passo a passo, como o Progem organiza contratos, cobranças recorrentes, whitelabel, memorial e analytics."
    })
  },[])

  return (
    <div>
      <Header/>

      {/* HERO */}
      <section className="border-b border-[var(--c-border)] bg-[var(--c-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
              <Sparkles className="w-4 h-4 text-[color:var(--c-muted)]"/>
              Tour guiado com especialista
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">
              O que você verá na <span className="text-[var(--c-primary)]">demonstração</span>
            </h1>
            <p className="muted mt-3 text-lg">
              Um roteiro objetivo para você avaliar o Progem com clareza — do cadastro ao recebimento, com
              site e apps whitelabel, memorial digital e analytics.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/contato" className="btn btn-primary">Solicitar demonstração</Link>
              <a href={`https://wa.me/${WHATSAPP_E164}`} target="_blank" rel="noreferrer" className="btn btn-ghost">
                Abrir conversa no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* AGENDA */}
      <main className="mx-auto max-w-7xl px-4 py-10">
        <section className="grid lg:grid-cols-[420px,1fr] gap-8">
          <div className="card p-6 h-max">
            <div className="font-semibold">Agenda da demo (aprox. 45–60 min)</div>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { t:"Panorama e objetivos", d:"Entendemos seu contexto e volume de contratos." },
                { t:"Fluxo de contratos", d:"Cadastro, planos, status e ciclo de vida (ativo/inadimplente)." },
                { t:"Cobrança recorrente", d:"Carnês/boletos, conciliação e baixa — passo a passo." },
                { t:"Experiências whitelabel", d:"Site Premium e App do Associado com sua identidade." },
                { t:"Memorial digital", d:"Publicação e captação de leads integrada ao Progem." },
                { t:"Analytics & KPIs", d:"Indicadores de inadimplência, MRR, cohort, crescimento." },
                { t:"Integrações & APIs", d:"Webhooks, BFF e exemplos de uso." },
                { t:"Próximos passos", d:"Onboarding, migração e estimativa de go-live." },
              ].map((i,idx)=>(
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-4 h-4 mt-0.5"/>
                  <div><div className="font-medium">{i.t}</div><div className="muted">{i.d}</div></div>
                </li>
              ))}
            </ul>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-[var(--c-border)] p-3">
                <Clock className="w-4 h-4 text-[color:var(--c-muted)]"/>
                <div className="font-medium mt-1">Duração</div>
                <div className="muted">45–60 minutos</div>
              </div>
              <div className="rounded-xl border border-[var(--c-border)] p-3">
                <Users className="w-4 h-4 text-[color:var(--c-muted)]"/>
                <div className="font-medium mt-1">Participantes</div>
                <div className="muted">Time comercial + você</div>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-xs">
              <Info className="inline-block w-4 h-4 mr-1 align-[-2px]"/>
              Podemos adaptar o roteiro para o seu segmento (associados, clubes, academias, imobiliárias e similares).
            </div>
          </div>

          {/* MÓDULOS QUE MOSTRAREMOS */}
          <div className="grid gap-6 md:grid-cols-2">
            <article className="card p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                  <ShieldCheck className="w-5 h-5 text-[color:var(--c-muted)]"/>
                </span>
                <div>
                  <div className="font-semibold">Contratos & Assinaturas</div>
                  <div className="muted text-sm">Planos, status, jornada do associado e auditoria.</div>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  "Cadastro e ativação de contratos",
                  "Regras de plano e upgrades",
                  "Gestão de inadimplência",
                ].map(s=>(
                  <li key={s} className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5"/><span className="muted">{s}</span></li>
                ))}
              </ul>
            </article>

            <article className="card p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                  <CreditCard className="w-5 h-5 text-[color:var(--c-muted)]"/>
                </span>
                <div>
                  <div className="font-semibold">Cobrança Recorrente</div>
                  <div className="muted text-sm">Carnês/boletos, conciliação e baixa automatizada.</div>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  "Geração de carnês e boletos",
                  "Conciliação e baixa",
                  "Rotinas anti-inadimplência",
                ].map(s=>(
                  <li key={s} className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5"/><span className="muted">{s}</span></li>
                ))}
              </ul>
            </article>

            <article className="card p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                  <Globe className="w-5 h-5 text-[color:var(--c-muted)]"/>
                </span>
                <div>
                  <div className="font-semibold">Whitelabel (Site & Apps)</div>
                  <div className="muted text-sm">Sua identidade: cores, ícones e domínio.</div>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  "Site Premium com SEO",
                  "App do Associado (2ª via, pagamentos)",
                  "Apps do Vendedor/Cobrador (online/offline)",
                ].map(s=>(
                  <li key={s} className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5"/><span className="muted">{s}</span></li>
                ))}
              </ul>
            </article>

            <article className="card p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                  <Newspaper className="w-5 h-5 text-[color:var(--c-muted)]"/>
                </span>
                <div>
                  <div className="font-semibold">Memorial Digital</div>
                  <div className="muted text-sm">Publicações, homenagens e captação de leads.</div>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  "Criação de páginas de memorial",
                  "Fluxo de aprovação e publicação",
                  "Leads integrados ao CRM",
                ].map(s=>(
                  <li key={s} className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5"/><span className="muted">{s}</span></li>
                ))}
              </ul>
            </article>

            <article className="card p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                  <BarChart3 className="w-5 h-5 text-[color:var(--c-muted)]"/>
                </span>
                <div>
                  <div className="font-semibold">Analytics & KPIs</div>
                  <div className="muted text-sm">Indicadores em tempo real para decisões.</div>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  "Taxa de inadimplência",
                  "MRR, cohort e crescimento",
                  "Relatórios operacionais",
                ].map(s=>(
                  <li key={s} className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5"/><span className="muted">{s}</span></li>
                ))}
              </ul>
            </article>

            <article className="card p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                  <Cable className="w-5 h-5 text-[color:var(--c-muted)]"/>
                </span>
                <div>
                  <div className="font-semibold">Integrações & APIs</div>
                  <div className="muted text-sm">Webhooks, BFF e exemplos práticos.</div>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  "Eventos de cobrança e contrato",
                  "Helpers/SDK e melhores práticas",
                  "Exemplos de integração com ERP/CRM",
                ].map(s=>(
                  <li key={s} className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5"/><span className="muted">{s}</span></li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        {/* PRÉ-REQUISITOS / PÓS-DEMO */}
        <section className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="font-semibold">Como aproveitar melhor a demo</div>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                "Tenha em mente seu volume de contratos ativos",
                "Liste integrações desejadas (ERP, gateways, site)",
                "Traga dúvidas de cobrança, whitelabel e memorial",
              ].map(s=>(
                <li key={s} className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5"/><span className="muted">{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <div className="font-semibold">Próximos passos</div>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                "Proposta com base no número de contratos ativos",
                "Onboarding assistido e migração básica",
                "Go-live com acompanhamento do time Progem",
              ].map(s=>(
                <li key={s} className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5"/><span className="muted">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="mt-10">
          <div className="card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-sm px-3 py-1.5 inline-flex items-center gap-2 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                <Sparkles className="w-4 h-4 text-[color:var(--c-muted)]"/>
                Pronto para ver na prática?
              </div>
              <h2 className="text-2xl font-semibold mt-3">Agende sua demonstração</h2>
              <p className="muted">Retorno rápido e confirmação por WhatsApp.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/contato" className="btn btn-primary">Solicitar demonstração</Link>
              <a href={`https://wa.me/${WHATSAPP_E164}`} target="_blank" rel="noreferrer" className="btn btn-ghost">
                Conversar no WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer/>
    </div>
  )
}
