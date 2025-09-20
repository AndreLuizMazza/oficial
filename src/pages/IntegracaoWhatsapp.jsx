import React, { useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import Footer from "@/components/Footer"
import { setPageSEO } from "@/lib/seo"
import {
  MessageCircle, Filter, CalendarCheck2, ShieldCheck, ClipboardList,
  BarChart3, Tag, Link2, Plug, CheckCircle2, BadgeDollarSign
} from "lucide-react"
import BottomDockCTA from "@/components/BottomDockCTA"
import placeholder from "@/assets/img/app/whatsapp.png"
/**
 * Página: Integração com WhatsApp (Progem)
 * Ajustes:
 * - CTAs padronizados em laranja: `btn btn-primary btn-demo`
 * - Substituição do placeholder por imagem que remete a WhatsApp/smartphone
 */
const HERO_IMG =
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=80"

export default function IntegracaoWhatsapp(){
  useEffect(()=>{
    setPageSEO({
      title: "Progem • Integração WhatsApp",
      description: "Modelos de mensagens, disparo em massa com filtros, automações e métricas — via integração com plataforma parceira oficial (única). Custo adicional de R$ 150/mês com envios ilimitados."
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
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
              <MessageCircle className="w-4 h-4 text-[color:var(--c-muted)]"/>
              Integração com plataforma parceira oficial
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">
              WhatsApp para <span className="text-[color:var(--c-primary)]">conversar e converter</span>
            </h1>
            <p className={`mt-3 md:text-lg ${t.muted}`}>
              Crie <strong>modelos de mensagens</strong>, dispare campanhas em massa por <strong>filtros</strong> (inadimplentes, adimplentes,
              confirmação de pagamento, aniversário, etc.), programe <strong>mensagens automáticas</strong> e acompanhe resultados —
              tudo integrado ao Progem e à nossa plataforma parceira oficial do WhatsApp (integração única).
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {/* CTA principal padronizada (laranja) */}
              <Link to="/demo" data-cta="demo" className="btn btn-primary btn-demo">
                Falar com um especialista
              </Link>
              <a href="#recursos" className="btn btn-ghost">Ver recursos</a>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[var(--c-border)] bg-[var(--c-surface-2)]">
            <img
              src={placeholder}
              alt="Smartphone com conversa/mensagens (WhatsApp)"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="p-4 border-t border-[var(--c-border)] bg-[var(--c-surface-2)]">
              <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--c-border)] px-3 py-1.5 text-sm">
                <BadgeDollarSign className="w-4 h-4 text-[color:var(--c-muted)]"/> R$ 150/mês
                <span className="text-[color:var(--c-muted)]">envios ilimitados</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10">
        {/* RECURSOS */}
        <section id="recursos" className="grid gap-6 lg:grid-cols-2">
          <article className="card p-6">
            <div className="flex items-center gap-3">
              <ClipboardList className={`w-6 h-6 ${t.primary}`}/>
              <h2 className="text-xl font-semibold">Modelos de mensagens</h2>
            </div>
            <p className={`mt-2 ${t.muted}`}>
              Padronize textos para notificações, confirmações e campanhas. Utilize modelos aprovados pelo provedor oficial
              e personalize variáveis (nome, valor, vencimento, link de 2ª via, etc.).
            </p>
          </article>

          <article className="card p-6">
            <div className="flex items-center gap-3">
              <Filter className={`w-6 h-6 ${t.primary}`}/>
              <h2 className="text-xl font-semibold">Envio em massa por filtros</h2>
            </div>
            <p className={`mt-2 ${t.muted}`}>
              Selecione seu público com filtros do Progem:
            </p>
            <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
              {["Inadimplentes","Adimplentes","Confirmação de pagamento","Aniversário","Novos contratos","Renovações"].map(item => (
                <li key={item} className="flex items-center gap-2"><Tag className={`w-4 h-4 ${t.primary}`}/><span className={`${t.muted}`}>{item}</span></li>
              ))}
            </ul>
          </article>

          <article className="card p-6">
            <div className="flex items-center gap-3">
              <CalendarCheck2 className={`w-6 h-6 ${t.primary}`}/>
              <h2 className="text-xl font-semibold">Programação & automações</h2>
            </div>
            <p className={`mt-2 ${t.muted}`}>
              Agende campanhas e crie gatilhos automáticos (ex.: boleto gerado, vencimento em 3 dias, pagamento confirmado, aniversário).
              Defina janelas de envio, frequência e limites por período.
            </p>
          </article>

          <article className="card p-6">
            <div className="flex items-center gap-3">
              <BarChart3 className={`w-6 h-6 ${t.primary}`}/>
              <h2 className="text-xl font-semibold">Métricas & melhoria contínua</h2>
            </div>
            <p className={`mt-2 ${t.muted}`}>
              Acompanhe entregas, leituras, respostas, opt-outs e conversões. Teste A/B entre modelos e horários para iterar o resultado.
            </p>
          </article>

          <article className="card p-6">
            <div className="flex items-center gap-3">
              <Plug className={`w-6 h-6 ${t.primary}`}/>
              <h2 className="text-xl font-semibold">Plataforma parceira (oficial)</h2>
            </div>
            <p className={`mt-2 ${t.muted}`}>
              Integração com plataforma parceira oficial do WhatsApp. O Progem envia via essa plataforma, garantindo
              escalabilidade, confiabilidade e conformidade de canal.
            </p>
          </article>

          <article className="card p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className={`w-6 h-6 ${t.primary}`}/>
              <h2 className="text-xl font-semibold">Compliance (LGPD & WhatsApp)</h2>
            </div>
            <p className={`mt-2 ${t.muted}`}>
              Gestão de consentimento/opt-out, trilhas de auditoria e respeito às regras do WhatsApp (uso de modelos aprovados,
              janelas de mensagens, política anti-spam). Boas práticas para reputação de número e qualidade.
            </p>
          </article>
        </section>

        {/* COMO FUNCIONA */}
        <section className="mt-10 grid lg:grid-cols-2 gap-6 items-start">
          <ol className="card p-6 space-y-4">
            {[{t:"Conecte à plataforma parceira oficial", d:"Conecte a conta de WhatsApp Business ao BSP/Cloud API de sua preferência."},
              {t:"Cadastre modelos", d:"Crie/importe modelos, defina variáveis e solicite aprovação pelo provedor."},
              {t:"Monte segmentos", d:"Use filtros do Progem para criar públicos (inadimplentes, aniversariantes etc.)."},
              {t:"Programe ou dispare", d:"Envie na hora ou agende/automatize por gatilhos."},
              {t:"Meça e otimize", d:"Analise métricas e itere modelos/horários."}].map((s, i)=> (
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
            <h3 className="text-lg font-semibold">Casos prontos</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {["Cobrança: boleto emitido, vencimento próximo, confirmação de pagamento",
                "Relacionamento: boas-vindas, aniversário, pesquisa de satisfação",
                "Comercial: reengajar proposta parada, lembrete de visita/consulta"].map(b => (
                <li key={b} className="flex gap-2 items-start"><CheckCircle2 className={`w-4 h-4 ${t.primary}`}/><span className={`${t.muted}`}>{b}</span></li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-10">
          <div className="card p-6 md:p-8 md:flex md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
                <Link2 className="w-4 h-4 text-[color:var(--c-muted)]"/> Integração assistida
              </div>
              <h3 className="text-2xl font-semibold mt-3">Ative o WhatsApp no seu Progem</h3>
              <p className={`${t.muted}`}>Conectamos à plataforma parceira oficial, configuramos modelos e deixamos as automações rodando. Plano R$ 150/mês — envios ilimitados.</p>
            </div>
            <div className="flex gap-3">
              {/* CTA padronizada (laranja) */}
              <Link to="/demo" data-cta="demo" className="btn btn-primary btn-demo">
                Falar com um especialista
              </Link>
              <Link to="/integracoes#whatsapp" className="btn btn-ghost">Baixar documentação</Link>
            </div>
          </div>
        </section>
      </main>
     {/* CTA fixo (mobile) */}
      <BottomDockCTA />
      <Footer/>
    </div>
  )
}
