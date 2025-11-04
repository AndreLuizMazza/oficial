// src/pages/SitePremium.jsx
import { useEffect } from "react"

import BottomDockCTA from "@/components/BottomDockCTA"
import { Link } from "react-router-dom"
import { setPageSEO } from "@/lib/seo"
import {
  Globe, Sparkles, ShieldCheck, Palette, Fingerprint, Search,
  Layout, Smartphone, Link2, Rocket, Check, Info
} from "lucide-react"
import placeholder from "@/assets/img/app/site.png"
import site2 from "@/assets/img/app/site2.png"

export default function SitePremium(){
  useEffect(()=>{
    setPageSEO({
      title: "Progem • Site Premium (Whitelabel)",
      description: "Website institucional premium com sua identidade, SEO, domínio próprio e integrações com o ecossistema Progem."
    })
  },[])

  const bullets = [
    "Identidade visual completa (cores, logo, tipografia)",
    "Páginas institucionais e landing pages de alta conversão",
    "SEO técnico e conteúdos estruturados",
    "Formulários e captação conectados ao Progem",
    "Blog e áreas de conteúdo opcionais",
    "Hospedagem gerenciada e monitorada",
  ]

  return (
    <div>
      {/* HERO */}
      <section className="border-b border-[var(--c-border)] bg-[var(--c-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-14 grid md:grid-cols-[1fr,520px] gap-10 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
              <Globe className="w-4 h-4 text-[color:var(--c-muted)]"/>
              Site Premium • Whitelabel
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">
              Seu site institucional, <span className="text-[var(--c-primary)]">com a sua marca</span>
            </h1>
            <p className="muted mt-3 text-lg">
              Uma presença digital de alto nível, otimizada para SEO e preparada para integrar captação de leads ao Progem.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {/* CTA laranja */}
              <Link to="/demo" data-cta="demo" className="btn btn-primary btn-demo">
                Solicitar demonstração
              </Link>
             <a
  href="https://demo.progem.com.br/"
  target="_blank"
  rel="noopener noreferrer"
  className="btn btn-ghost"
>
  Ver Site Exemplo
</a>

              {/* Link para planos/simulador */}
              <Link to="/planos" className="btn btn-ghost">Ver planos e simular</Link>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[var(--c-border)] bg-[var(--c-surface-2)]">
            <img
              src={site2}
              alt="Mockup de website premium"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <main className="mx-auto max-w-7xl px-4 py-10">
        <section className="grid md:grid-cols-3 gap-6">
          {[
            {icon:Palette, title:"Identidade whitelabel", desc:"Cores, logos, tipografia e componentes com a sua marca."},
            {icon:Search,  title:"SEO técnico", desc:"Estrutura, performance, meta tags, sitemap e schema."},
            {icon:Layout,  title:"Páginas premium", desc:"Home, Institucional, Soluções, Planos, Blog e Contato."},
            {icon:Link2,   title:"Integrações", desc:"Formulários conectados ao Progem e webhooks."},
            {icon:Smartphone, title:"Responsivo & Acessível", desc:"Design mobile-first, acessibilidade e boas práticas."},
            {icon:ShieldCheck, title:"Hospedagem gerenciada", desc:"Monitoramento, TLS e atualizações contínuas."},
          ].map((c,i)=>{
            const Icon = c.icon
            return (
              <article key={i} className="card p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                    <Icon className="w-5 h-5 text-[color:var(--c-muted)]"/>
                  </span>
                  <div>
                    <div className="font-semibold">{c.title}</div>
                    <div className="muted text-sm">{c.desc}</div>
                  </div>
                </div>
              </article>
            )
          })}
        </section>

        {/* LISTA */}
        <section className="mt-10 grid lg:grid-cols-[1fr,520px] gap-8 items-center">
          <div>
            <h2 className="text-2xl font-semibold">Construído para conversão</h2>
            <p className="muted mt-2">Pronto para campanhas, com páginas rápidas, formulários e tracking.</p>
            <ul className="mt-4 space-y-2 text-sm">
              {bullets.map(b=>(
                <li key={b} className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5"/><span className="muted">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl overflow-hidden border border-[var(--c-border)] bg-[var(--c-surface-2)]">
            <img
              src={placeholder}
              alt="Mockup de website premium"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </section>

        {/* Custos & Setup (ajustado) */}
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
                    O <strong>Site Premium</strong> é contratado como <strong>add-on</strong> do Progem. O valor mensal
                    acompanha a sua <strong>faixa de contratos ativos</strong> (Start, Pro ou Enterprise).
                  </li>
                  <li className="muted">
                    O preço pode ser definido como <strong>percentual sobre o preço base da faixa</strong> (ex.: 50%)
                    ou como <strong>valor fixo por faixa</strong> — conforme a política vigente.
                  </li>
                  <li className="muted">
                    Consulte o valor exato para sua faixa no simulador de <Link to="/planos" className="underline">Planos</Link>. No anual,
                    há <strong>15% OFF</strong> sobre o total (base + add-ons).
                  </li>
                  <li className="muted">
                    <strong>Setup único</strong> (sob escopo): varia conforme integrações e conteúdo inicial (páginas, blog, formulários).
                  </li>
                </ul>

                {/* Ação secundária para planos */}
                <div className="mt-3">
                  <Link to="/planos" className="btn btn-ghost btn-sm">Ver planos e simular</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-10">
          <div className="card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
                <Rocket className="w-4 h-4 text-[color:var(--c-muted)]"/> Pronto para decolar
              </div>
              <h3 className="text-2xl font-semibold mt-3">Vamos publicar o seu novo site</h3>
              <p className="muted">Time de onboarding acompanha do design ao go-live.</p>
            </div>
            {/* CTA laranja */}
            <Link to="/demo" data-cta="demo" className="btn btn-primary btn-demo">
              Solicitar demonstração
            </Link>
          </div>
        </section>
      </main>

      {/* CTA fixo (mobile) */}
      <BottomDockCTA />

    </div>
  )
}
