import { useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { setPageSEO } from "@/lib/seo"
import {
  Smartphone, Sparkles, Wallet, FileDown, Bell, IdCard, CreditCard, ShieldCheck, Check, Rocket
} from "lucide-react"

export default function AppAssociado(){
  useEffect(()=>{
    setPageSEO({
      title: "Progem • App do Associado (Whitelabel)",
      description: "Aplicativo do associado com sua marca: 2ª via, pagamentos, extratos, notificações e carteirinha digital."
    })
  },[])

  const features = [
    {icon:FileDown,   title:"2ª via e extratos", desc:"Documentos e cobranças disponíveis direto no app."},
    {icon:CreditCard, title:"Pagamentos", desc:"Pix, cartão e boleto — integrado ao Progem."},
    {icon:IdCard,     title:"Carteirinha digital", desc:"Identificação do associado com QR Code."},
    {icon:Bell,       title:"Notificações", desc:"Lembretes de pagamento e avisos operacionais."},
    {icon:Wallet,     title:"Dados e dependentes", desc:"Cadastro, planos e dependentes atualizados."},
    {icon:ShieldCheck,title:"Whitelabel & segurança", desc:"Sua marca, autenticação segura e privacidade."},
  ]

  return (
    <div>
      <Header/>

      {/* HERO */}
      <section className="border-b border-[var(--c-border)] bg-[var(--c-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-14 grid md:grid-cols-[1fr,420px] gap-10 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
              <Smartphone className="w-4 h-4 text-[color:var(--c-muted)]"/>
              App do Associado • Whitelabel
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">
              Autoatendimento <span className="text-[var(--c-primary)]">com a sua marca</span>
            </h1>
            <p className="muted mt-3 text-lg">
              Um aplicativo completo para o associado resolver tudo no celular — pagamentos, 2ª via, notificações e carteirinha digital.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/contato" className="btn btn-primary">Solicitar demonstração</Link>
              <Link to="/demo" className="btn btn-ghost">O que verá na demo</Link>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[var(--c-border)] bg-[var(--c-surface-2)]">
            <img
              src="https://source.unsplash.com/900x1200/?mobile,app"
              alt="Mockup do app do associado"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <main className="mx-auto max-w-7xl px-4 py-10">
        <section className="grid md:grid-cols-3 gap-6">
          {features.map((f,i)=>{
            const Icon = f.icon
            return (
              <article className="card p-6" key={i}>
                <div className="flex items-center gap-3">
                  <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                    <Icon className="w-5 h-5 text-[color:var(--c-muted)]"/>
                  </span>
                  <div>
                    <div className="font-semibold">{f.title}</div>
                    <div className="muted text-sm">{f.desc}</div>
                  </div>
                </div>
              </article>
            )
          })}
        </section>

        {/* BENEFÍCIOS */}
        <section className="mt-10 grid lg:grid-cols-[1fr,520px] gap-8 items-center">
          <div>
            <h2 className="text-2xl font-semibold">Engajamento que reduz custos</h2>
            <p className="muted mt-2">
              Ao levar autoatendimento para o app, você diminui contatos operacionais e melhora a adimplência.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                "Experiência rápida e intuitiva (iOS/Android)",
                "Visão clara das cobranças e status",
                "Notificações que evitam atrasos",
                "Layout, ícones e cores com a sua identidade",
              ].map(b=>(
                <li key={b} className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5"/><span className="muted">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl overflow-hidden border border-[var(--c-border)] bg-[var(--c-surface-2)]">
            <img
              src="https://source.unsplash.com/1200x800/?ui,ux"
              alt="UI do aplicativo do associado"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </section>

        {/* CTA */}
        <section className="mt-10">
          <div className="card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
                <Rocket className="w-4 h-4 text-[color:var(--c-muted)]"/> Pronto para lançar
              </div>
              <h3 className="text-2xl font-semibold mt-3">Coloque seu app nas lojas com nossa ajuda</h3>
              <p className="muted">Onboarding e publicação assistidos, com revisão de identidade e textos.</p>
            </div>
            <Link to="/contato" className="btn btn-primary">Solicitar demonstração</Link>
          </div>
        </section>
      </main>

      <Footer/>
    </div>
  )
}
