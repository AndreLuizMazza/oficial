// src/pages/IntegracaoWhatsapp.jsx
import React, { useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { setPageSEO } from "@/lib/seo"
import {
  MessageCircle, Filter, CalendarCheck2, ShieldCheck, ClipboardList,
  Tag, Link2, Plug, CheckCircle2
} from "lucide-react"
import BottomDockCTA from "@/components/BottomDockCTA"
import placeholder from "@/assets/img/app/whatsapp.png"

/**
 * Página: Integração com WhatsApp (Progem)
 * Versão atualizada:
 * – Sem custos.
 * – Sem agendamentos de campanhas.
 * – Sem métricas, sem testes A/B.
 * – Comunicação profissional alinhada ao que já existe no Progem.
 */

export default function IntegracaoWhatsapp(){
  useEffect(()=> {
    setPageSEO({
      title: "Progem • Integração WhatsApp",
      description:
        "Modelos aprovados, disparo por filtros e programação automática por gatilhos internos — integração via API oficial do WhatsApp totalmente conectada ao Progem."
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
      {/* HERO */}
      <section className="border-b border-[var(--c-border)] bg-[var(--c-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-14 grid md:grid-cols-[1fr,420px] gap-10 items-center">
          
          {/* Texto hero */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
              <MessageCircle className="w-4 h-4 text-[color:var(--c-muted)]"/>
              Integração com WhatsApp Business
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">
              WhatsApp para <span className="text-[color:var(--c-primary)]">conversar e converter</span>
            </h1>

            <p className={`mt-3 md:text-lg ${t.muted}`}>
              Configure <strong>modelos oficiais</strong>, envie mensagens usando <strong>filtros inteligentes</strong>
              e habilite <strong>programações automáticas</strong> baseadas em eventos internos do Progem.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/demo" data-cta="demo" className="btn btn-primary btn-demo">
                Falar com um especialista
              </Link>
              <a href="#recursos" className="btn btn-ghost">Ver recursos</a>
            </div>
          </div>

          {/* Imagem */}
          <div className="rounded-2xl overflow-hidden border border-[var(--c-border)] bg-[var(--c-surface-2)]">
            <img
              src={placeholder}
              alt="Smartphone com conversa/mensagens (WhatsApp)"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* CONTEÚDO */}
      <main className="mx-auto max-w-7xl px-4 py-10">

        {/* RECURSOS */}
        <section id="recursos" className="grid gap-6 lg:grid-cols-2">
          
          <article className="card p-6">
            <div className="flex items-center gap-3">
              <ClipboardList className={`w-6 h-6 ${t.primary}`}/>
              <h2 className="text-xl font-semibold">Modelos de mensagens</h2>
            </div>
            <p className={`mt-2 ${t.muted}`}>
              Padronize mensagens e utilize modelos aprovados com variáveis dinâmicas como nome, data,
              vencimento e links personalizados.
            </p>
          </article>

          <article className="card p-6">
            <div className="flex items-center gap-3">
              <Filter className={`w-6 h-6 ${t.primary}`}/>
              <h2 className="text-xl font-semibold">Envio segmentado por filtros</h2>
            </div>
            <p className={`mt-2 ${t.muted}`}>Escolha o público ideal diretamente dos filtros do Progem:</p>
            <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
              {[
                "Inadimplentes",
                "Adimplentes",
                "Confirmação de pagamento",
                "Aniversário",
                "Novos contratos",
                "Renovações"
              ].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <Tag className={`w-4 h-4 ${t.primary}`}/>
                  <span className={t.muted}>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="card p-6">
            <div className="flex items-center gap-3">
              <CalendarCheck2 className={`w-6 h-6 ${t.primary}`}/>
              <h2 className="text-xl font-semibold">Programação automática por gatilhos</h2>
            </div>
            <p className={`mt-2 ${t.muted}`}>
              Configure disparos automáticos baseados em eventos reais do Progem, como boleto emitido,
              vencimento próximo, atualização de status, cadastro e fluxos operacionais.
            </p>
          </article>

          <article className="card p-6">
            <div className="flex items-center gap-3">
              <Plug className={`w-6 h-6 ${t.primary}`}/>
              <h2 className="text-xl font-semibold">Integração via API parceira oficial</h2>
            </div>
            <p className={`mt-2 ${t.muted}`}>
              Comunicação realizada através de parceiro oficial do WhatsApp, garantindo conformidade,
              estabilidade e entregabilidade.
            </p>
          </article>

          <article className="card p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className={`w-6 h-6 ${t.primary}`}/>
              <h2 className="text-xl font-semibold">Compliance (LGPD & WhatsApp)</h2>
            </div>
            <p className={`mt-2 ${t.muted}`}>
              Gestão de consentimento, respeito às janelas de envio, políticas anti-spam e trilhas de auditoria,
              garantindo uso responsável e seguro.
            </p>
          </article>

        </section>

        {/* COMO FUNCIONA */}
        <section className="mt-10 grid lg:grid-cols-2 gap-6 items-start">
          
          <ol className="card p-6 space-y-4">
            {[
              { t:"Conecte sua conta", d:"Associe o número WhatsApp Business ao Progem." },
              { t:"Cadastre modelos", d:"Aprove modelos oficiais e configure variáveis dinâmicas." },
              { t:"Crie segmentos", d:"Selecione filtros internos para definir o público ideal." },
              { t:"Habilite automações", d:"Configure disparos automáticos com base em eventos do sistema." },
              { t:"Acompanhe o fluxo", d:"Toda interação fica registrada no histórico operacional." }
            ].map((s, i)=> (
              <li key={i} className="flex items-start gap-3">
                <span className={`grid place-content-center size-8 rounded-full ${t.primaryBg} text-white font-bold`}>
                  {i+1}
                </span>
                <div>
                  <p className="font-medium">{s.t}</p>
                  <p className={`text-sm ${t.muted}`}>{s.d}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="card p-6">
            <h3 className="text-lg font-semibold">Casos prontos</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                "Boleto emitido, vencimento próximo, confirmação de pagamento",
                "Boas-vindas, aniversário e atualização de cadastro",
                "Reengajamento de propostas e lembretes operacionais"
              ].map(b => (
                <li key={b} className="flex gap-2 items-start">
                  <CheckCircle2 className={`w-4 h-4 ${t.primary}`}/>
                  <span className={t.muted}>{b}</span>
                </li>
              ))}
            </ul>
          </div>

        </section>

        {/* CTA FINAL */}
        <section className="mt-10">
          <div className="card p-6 md:p-8 md:flex md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
                <Link2 className="w-4 h-4 text-[color:var(--c-muted)]"/> Integração assistida
              </div>
              <h3 className="text-2xl font-semibold mt-3">Ative o WhatsApp no seu Progem</h3>
              <p className={t.muted}>
                Nossa equipe acompanha a configuração, revisão de modelos e habilitação das automações.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/demo" data-cta="demo" className="btn btn-primary btn-demo">
                Falar com um especialista
              </Link>
              <Link to="/planos" className="btn btn-ghost">
                Ver planos
              </Link>
            </div>
          </div>
        </section>

      </main>

      <BottomDockCTA />
    </div>
  )
}
