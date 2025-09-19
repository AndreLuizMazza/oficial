import { useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import Footer from "@/components/Footer"
import { setPageSEO } from "@/lib/seo"
import pet from "@/assets/img/pet.png"
import {
  PawPrint, HeartHandshake, ShieldCheck, CreditCard, FileText,
  QrCode, Smartphone, Bell, MapPin, CalendarCheck2, Layers,
  Percent, CheckCircle2, ClipboardList
} from "lucide-react"
import BottomDockCTA from "@/components/BottomDockCTA"

/**
 * Página: Gestão de Planos Pet (Progem)
 * Conceito: O Progem permite oferecer **planos híbridos** (pet como parte do plano família)
 * e **planos exclusivos para pets**. Tudo integrado à gestão de contratos, cobranças e benefícios.
 * - Herda as cores do tenant (tokens CSS)
 * - Mesma estrutura de AppAssociado (Header/Footer/SEO)
 */

export default function PlanosPet(){
  useEffect(()=>{
    setPageSEO({
      title: "Progem • Gestão de Planos Pet",
      description: "Ofereça planos híbridos (família + pet) e planos exclusivos para pets, com cobrança recorrente, carteirinha e benefícios integrados."
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
              <PawPrint className="w-4 h-4 text-[color:var(--c-muted)]"/>
              Planos Pet • Gestão completa
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">
              Seu pet <span className="text-[color:var(--c-primary)]">no centro do cuidado</span>
            </h1>
            <p className={`mt-3 md:text-lg ${t.muted}`}>
              Crie ofertas flexíveis: inclua o amiguinho no plano da família (híbrido) ou ofereça
              um plano exclusivo para pets — com carteirinha, benefícios e cobranças recorrentes integradas ao Progem.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {/* CTA laranja */}
              <Link to="/demo" data-cta="demo" className="btn btn-primary btn-demo">
                Solicitar demonstração
              </Link>
              <a href="#modelos" className="btn btn-ghost">Modelos de plano</a>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[var(--c-border)] bg-[var(--c-surface-2)]">
            <img
              src={pet}
              alt="Mockup Planos Pet"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10">
        {/* MODELOS DE OFERTA */}
        <section id="modelos" className="grid lg:grid-cols-2 gap-6">
          <article className="card p-6">
            <div className="flex items-center gap-3">
              <HeartHandshake className={`w-6 h-6 ${t.primary}`}/>
              <h2 className="text-xl font-semibold">Plano híbrido (Família + Pet)</h2>
            </div>
            <p className={`mt-2 ${t.muted}`}>
              O pet entra como **dependente especial** no plano familiar. Você define regras de elegibilidade,
              valor incremental e coberturas específicas para o pet.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {["Cadastro do pet vinculado ao titular da família",
                "Elegibilidade por espécie/idade/raça (opcional)",
                "Valor adicional configurável e carências próprias",
                "Carteirinha digital com QR Code para identificação"].map(item => (
                <li key={item} className="flex gap-2 items-start"><CheckCircle2 className={`w-4 h-4 ${t.primary}`}/><span className={`${t.muted}`}>{item}</span></li>
              ))}
            </ul>
          </article>

          <article className="card p-6">
            <div className="flex items-center gap-3">
              <PawPrint className={`w-6 h-6 ${t.primary}`}/>
              <h2 className="text-xl font-semibold">Plano exclusivo para Pets</h2>
            </div>
            <p className={`mt-2 ${t.muted}`}>
              Um produto dedicado aos animais, no qual o tutor é o responsável financeiro
              e o pet é o beneficiário principal.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {["Contrato com tutor como titular e pet como beneficiário",
                "Regras de preço por faixa/espécie (opcional)",
                "Benefícios próprios (rede pet parceira, descontos, serviços)",
                "Mensalidade recorrente via PIX/Cartão/Boleto"].map(item => (
                <li key={item} className="flex gap-2 items-start"><CheckCircle2 className={`w-4 h-4 ${t.primary}`}/><span className={`${t.muted}`}>{item}</span></li>
              ))}
            </ul>
          </article>
        </section>

        {/* RECURSOS OPERACIONAIS */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Recursos operacionais</h2>
          <p className={`mt-1 ${t.muted}`}>Ferramentas do Progem que sustentam a operação dos seus planos pet.</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[{icon:ClipboardList, t:"Cadastro do Pet", d:"Dados do pet, tutor, anexos e observações de saúde."},
              {icon:FileText, t:"Contrato & anexos", d:"Documentos, termos e histórico do plano."},
              {icon:QrCode, t:"Carteirinha c/ QR Code", d:"Identificação do pet e validação rápida de elegibilidade."},
              {icon:Bell, t:"Lembretes", d:"Agenda de vacinas/exames e avisos operacionais."},
              {icon:CreditCard, t:"Cobrança recorrente", d:"PIX, cartão e boleto integrados."},
              {icon:Layers, t:"Multiunidade", d:"Regras e catálogos por unidade/região."},
              {icon:Percent, t:"Benefícios pet", d:"Rede de parceiros (banho/tosa, clínicas, lojas)."},
              {icon:ShieldCheck, t:"Governança", d:"Perfis, auditoria e consentimento do tutor."}].map((f, i)=> (
                <article key={i} className="rounded-2xl border p-5 hover:shadow-card transition border-[var(--c-border)]">
                  <f.icon className={`w-6 h-6 ${t.primary}`}/>
                  <h3 className="mt-3 font-semibold">{f.t}</h3>
                  <p className={`mt-1 text-sm ${t.muted}`}>{f.d}</p>
                </article>
            ))}
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="mt-10 grid lg:grid-cols-2 gap-6 items-start">
          <ol className="card p-6 space-y-4">
            {[{t:"Modele seus produtos", d:"Defina plano híbrido e/ou exclusivo, coberturas, regras e preços."},
              {t:"Publique o catálogo", d:"Site e app do associado com visual do seu tenant."},
              {t:"Venda e cobre", d:"Fluxo digital com assinatura/aceite e cobrança recorrente."},
              {t:"Monitore e otimize", d:"Acompanhe adesão, inadimplência e uso de benefícios."}].map((s, i)=> (
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
            <h3 className="text-lg font-semibold">Integração com Parcerias</h3>
            <p className={`mt-1 ${t.muted}`}>
              Conecte seu catálogo pet a **Parcerias & Benefícios** do Progem para ampliar vantagens (rede local e conectores nacionais),
              mantendo regras e governança centralizadas.
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {["Publicação no app do associado",
                "Cupons/QR para parceiros pet",
                "Relatórios de uso e ROI por parceiro"].map(b => (
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
                <CalendarCheck2 className="w-4 h-4 text-[color:var(--c-muted)]"/> Lançamento assistido
              </div>
              <h3 className="text-2xl font-semibold mt-3">Vamos tirar seus planos pet do papel</h3>
              <p className={`${t.muted}`}>Definimos juntos os modelos (híbrido e/ou exclusivo), regras e comunicação.</p>
            </div>
            {/* CTA laranja */}
            <Link to="/demo" data-cta="demo" className="btn btn-primary btn-demo">
              Falar com um especialista
            </Link>
          </div>
        </section>
      </main>
     {/* CTA fixo (mobile) */}
      <BottomDockCTA />
      <Footer/>
    </div>
  )
}
