import { useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { setPageSEO } from "@/lib/seo"
import {
  Link2, Building2, Network, BadgePercent, ShieldCheck, Layers,
  Wrench, Globe, UploadCloud, BarChart3, CheckCircle2
} from "lucide-react"

/**
 * Página: Parcerias & Benefícios (Ferramenta Progem)
 * Conceito atualizado: o Progem oferece uma FERRAMENTA para que
 * cada cliente crie sua REDE de PARCERIAS (local e/ou nacional) e,
 * opcionalmente, integre conectores de plataformas especializadas
 * como RedeParcerias, Clube da Hora e LeCupom.
 * Esta é uma página de produto (marketing) dentro do site.
 */

export default function ParceriasBeneficios(){
  useEffect(()=>{
    setPageSEO({
      title: "Progem • Parcerias & Benefícios",
      description: "Ferramenta do Progem para formar redes de parcerias locais ou nacionais e integrar plataformas como RedeParcerias, Clube da Hora e LeCupom."
    })
  },[])

  const t = useMemo(() => ({
    text: "text-[color:var(--c-text)]",
    muted: "text-[color:var(--c-muted)]",
    border: "border-[var(--c-border)]",
    primary: "text-[color:var(--c-primary)]",
    primaryBg: "bg-[color:var(--c-primary)]",
  }), [])

  return (
    <div className={t.text}>
      <Header/>

      {/* HERO */}
      <section className="border-b border-[var(--c-border)] bg-[var(--c-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16 grid md:grid-cols-[1fr,460px] gap-10 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
              <Network className="w-4 h-4 text-[color:var(--c-muted)]"/>
              Ferramenta de Parcerias & Benefícios
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">
              Crie sua <span className="text-[color:var(--c-primary)]">rede de parcerias</span> — local e nacional
            </h1>
            <p className={`mt-3 md:text-lg ${t.muted}`}>
              O Progem permite que sua empresa estruture um clube próprio de benefícios com parceiros locais
              e conecte plataformas nacionais como <strong>RedeParcerias</strong>, <strong>Clube da Hora</strong> e <strong>LeCupom</strong>.
              Você define regras, publica ofertas e mede o resultado.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/contato" className="btn btn-primary">Quero ativar no meu Progem</Link>
              <a href="#conectores" className="btn btn-ghost">Ver conectores</a>
            </div>
          </div>

          {/* Card de valor rápido */}
          <div className="rounded-2xl overflow-hidden border border-[var(--c-border)] bg-[var(--c-surface-2)] p-6">
            <div className="flex items-start gap-3">
              <BadgePercent className={`w-6 h-6 ${t.primary}`}/>
              <div>
                <div className="font-semibold">Benefícios com sua marca</div>
                <div className={`${t.muted} text-sm`}>Controle de elegibilidade, regras e exposição por unidade.</div>
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {["Parceiros locais e nacionais","Publicação no site/app do associado","Métricas de uso e economia estimada"].map(i=> (
                <li key={i} className={`${t.muted}`}>• {i}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CONECTORES */}
      <section id="conectores" className="mx-auto max-w-7xl px-4 py-10">
        <div className="card p-6 md:p-8">
          <h2 className="text-2xl font-semibold">Conecte plataformas nacionais</h2>
          <p className={`mt-2 ${t.muted}`}>
            Ative conectores para ampliar imediatamente o alcance de benefícios do seu associado. Integrações opcionais e independentes.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { nome: "RedeParcerias", desc: "Catálogo nacional de descontos", url: "#" },
              { nome: "Clube da Hora", desc: "Benefícios e vantagens em diversas categorias", url: "#" },
              { nome: "LeCupom", desc: "Cupons e ofertas com abrangência Brasil", url: "#" },
            ].map((c)=> (
              <article key={c.nome} className="rounded-2xl border p-5 border-[var(--c-border)]">
                <div className="flex items-center gap-3">
                  <Globe className={`w-5 h-5 ${t.primary}`}/>
                  <div>
                    <div className="font-semibold">{c.nome}</div>
                    <div className={`text-sm ${t.muted}`}>{c.desc}</div>
                  </div>
                </div>
                <div className="mt-4 text-sm ${t.muted}">Integração via conector Progem</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* RECURSOS (para sua equipe) */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold">Recursos para montar e operar seu clube</h2>
          <p className={`mt-2 ${t.muted}`}>Ferramentas administrativas no Progem para cadastro, publicação e medição.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[{icon:Building2, t:"Cadastro de parceiros", d:"Fluxo para convênio local com documentos e vigência."},
            {icon:Layers, t:"Categorias e regras", d:"Defina segmentos, elegibilidade, unidades e visibilidade."},
            {icon:UploadCloud, t:"Publicação multicanal", d:"Site, app do associado e QR Code na recepção."},
            {icon:BarChart3, t:"Métricas & relatórios", d:"Uso, cupons, economia estimada e parceiros top."},
            {icon:ShieldCheck, t:"Governança", d:"Aprovação, auditoria e histórico de alterações."},
            {icon:Wrench, t:"API & Webhooks", d:"Sincronize com CRM e automações de marketing."},
            {icon:Link2, t:"Conectores nacionais", d:"Ative/pausa integrações como RedeParcerias/Clube da Hora/LeCupom."},
            {icon:Globe, t:"Cobertura local+nacional", d:"Misture acordos locais com catálogos nacionais."}].map((f, i)=> (
              <article key={i} className="rounded-2xl border p-5 hover:shadow-card transition border-[var(--c-border)]">
                <f.icon className={`w-6 h-6 ${t.primary}`}/>
                <h3 className="mt-3 font-semibold">{f.t}</h3>
                <p className={`mt-1 text-sm ${t.muted}`}>{f.d}</p>
              </article>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-2 items-start">
          <ol className="card p-6 space-y-4">
            {[{t:"Ative os conectores (opcional)", d:"Escolha RedeParcerias, Clube da Hora e/ou LeCupom conforme seu plano."},
              {t:"Cadastre parceiros locais", d:"Proposta, documentos, regras e prazo de vigência."},
              {t:"Publique os benefícios", d:"Catálogo visível no site/app do associado com pesquisa e filtros."},
              {t:"Meça e otimize", d:"Acompanhe uso, feedback e ROI para renovar ou ampliar a rede."}].map((s, i)=> (
              <li key={i} className="flex items-start gap-3">
                <span className={`grid place-content-center size-8 rounded-full ${t.primaryBg} text-white font-bold`}>{i+1}</span>
                <div>
                  <p className="font-medium">{s.t}</p>
                  <p className={`text-sm ${t.muted}`}>{s.d}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="card p-6">
            <h3 className="text-lg font-semibold">Para o associado</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {["Busca por categoria e cidade","Detalhes do parceiro e regras claras","Identificação do associado e elegibilidade","Cupom/QR Code e registro de uso"].map(b=> (
                <li key={b} className="flex gap-2 items-start"><CheckCircle2 className={`w-4 h-4 ${t.primary}`}/><span className={`${t.muted}`}>{b}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="card p-6 md:p-8 md:flex md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
              <Link2 className="w-4 h-4 text-[color:var(--c-muted)]"/> Integra com sua operação
            </div>
            <h3 className="text-2xl font-semibold mt-3">Ative Parcerias & Benefícios no seu Progem</h3>
            <p className={`${t.muted}`}>Onboarding assistido, conectores opcionais e publicação rápida.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/demo" className="btn btn-primary">Quero ativar</Link>
            <a href="#" className="btn btn-ghost">Baixar one‑pager (PDF)</a>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  )
}
