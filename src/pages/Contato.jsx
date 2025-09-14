import { useEffect, useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { setPageSEO } from "@/lib/seo"
import {
  Sparkles, Building2, FileText, Mail, Phone, Check, MessageSquareText, Info, MapPin, Clock
} from "lucide-react"

const WHATSAPP_E164 = "554699011022" // número usado apenas no link (não exibido)

export default function Contato(){
  const [form, setForm] = useState({
    empresa: "",
    responsavel: "",
    email: "",
    whatsapp: "",
    interesse: "Visão geral + dúvidas",
    mensagem: "",
  })

  useEffect(()=>{
    setPageSEO({
      title: "Progem • Contato",
      description: "Fale com a equipe Progem. Retorno rápido e confirmação por WhatsApp."
    })
  },[])

  function onChange(e){
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function enviarWhatsApp(e){
    e.preventDefault()
    const linhas = [
      "Olá, quero falar com a equipe Progem 👋",
      "",
      `Interesse: ${form.interesse}`,
      form.mensagem ? `Mensagem: ${form.mensagem}` : null,
      "",
      `Empresa/Entidade: ${form.empresa || "-"}`,
      `Responsável: ${form.responsavel || "-"}`,
      `E-mail: ${form.email || "-"}`,
      `WhatsApp (para retorno): ${form.whatsapp || "-"}`,
    ].filter(Boolean)
    const texto = encodeURIComponent(linhas.join("\n"))
    window.open(`https://wa.me/${WHATSAPP_E164}?text=${texto}`, "_blank", "noopener,noreferrer")
  }

  return (
    <div>
      <Header/>

      {/* Hero */}
      <section className="border-b border-[var(--c-border)] bg-[var(--c-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
              <Sparkles className="w-4 h-4 text-[color:var(--c-muted)]"/>
              Retorno rápido • confirmação por WhatsApp
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">
              Fale com a Progem
            </h1>
            <p className="muted mt-3 text-lg">
              Conte seu contexto e como podemos ajudar. Nosso time responde em pouco tempo.
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <main className="mx-auto max-w-7xl px-4 py-8 md:py-10 grid lg:grid-cols-[1fr,420px] gap-8">
        {/* Formulário */}
        <section className="card p-6">
          <form onSubmit={enviarWhatsApp} className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Empresa/Entidade</label>
                <div className="input-with-icon">
                  <Building2 className="icon"/>
                  <input
                    className="input"
                    name="empresa"
                    placeholder="Ex.: Pax Center Ltda"
                    value={form.empresa}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label">Responsável</label>
                <div className="input-with-icon">
                  <FileText className="icon"/>
                  <input
                    className="input"
                    name="responsavel"
                    placeholder="Nome completo"
                    value={form.responsavel}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">E-mail</label>
                <div className="input-with-icon">
                  <Mail className="icon"/>
                  <input
                    type="email"
                    className="input"
                    name="email"
                    placeholder="nome@empresa.com.br"
                    value={form.email}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label">WhatsApp para retorno</label>
                <div className="input-with-icon">
                  <Phone className="icon"/>
                  <input
                    className="input"
                    name="whatsapp"
                    placeholder="(DDD) 9xxxx-xxxx"
                    value={form.whatsapp}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Interesse</label>
                <select
                  className="input"
                  name="interesse"
                  value={form.interesse}
                  onChange={onChange}
                >
                  <option>Visão geral + dúvidas</option>
                  <option>Gestão recorrente (contratos & cobranças)</option>
                  <option>Site/App whitelabel</option>
                  <option>Memorial digital</option>
                  <option>Integrações & APIs</option>
                  <option>Comercial</option>
                  <option>Suporte</option>
                </select>
              </div>
              <div className="hidden md:block" />
            </div>

            <div>
              <label className="label">Mensagem (opcional)</label>
              <textarea
                className="input min-h-[120px]"
                name="mensagem"
                placeholder="Conte brevemente sua operação, volume de contratos e o objetivo…"
                value={form.mensagem}
                onChange={onChange}
              />
            </div>

            <div className="mt-2 flex flex-col sm:flex-row gap-3">
              <button type="submit" className="btn btn-primary">
                Enviar pelo WhatsApp
              </button>
              <div className="inline-flex items-center gap-2 text-sm text-[color:var(--c-muted)]">
                <Info className="w-4 h-4"/> Abriremos uma conversa no WhatsApp para confirmar.
              </div>
            </div>
          </form>
        </section>

        {/* Lateral: Resumo e atalhos */}
        <aside className="space-y-4">
          <section className="card p-6">
            <div className="font-semibold">Atendimento</div>
            <ul className="mt-3 text-sm space-y-2">
              {[
                "Comercial — Contratos, valores e migração",
                "Operacional — Onboarding e treinamento",
                "Suporte — Dúvidas e incidentes",
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5"/><span className="muted">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-[var(--c-border)] p-3">
                <Clock className="w-4 h-4 text-[color:var(--c-muted)]"/>
                <div className="font-medium mt-1">Horário</div>
                <div className="muted">Seg a Sex, 9h–18h</div>
              </div>
              <div className="rounded-xl border border-[var(--c-border)] p-3">
                <MapPin className="w-4 h-4 text-[color:var(--c-muted)]"/>
                <div className="font-medium mt-1">Brasil</div>
                <div className="muted">Atendimento nacional</div>
              </div>
            </div>
          </section>

          <section className="card p-6">
            <div className="flex items-start gap-3">
              <MessageSquareText className="w-5 h-5 text-[color:var(--c-muted)]"/>
              <div className="min-w-0">
                <div className="font-semibold">Prefere pular o formulário?</div>
                <p className="muted text-sm">
                  Inicie agora a conversa no WhatsApp e nos passe os dados por lá.
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_E164}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost mt-3"
                >
                  Abrir conversa direta
                </a>
              </div>
            </div>
          </section>
        </aside>
      </main>

      <section className="mx-auto max-w-7xl px-4 pb-12 grid md:grid-cols-3 gap-4">
        {[
          { title:"Todos os recursos incluídos", desc:"Site e apps whitelabel, memorial, analytics e APIs." },
          { title:"Onboarding assistido", desc:"Configuramos com você e apoiamos na migração básica." },
          { title:"Suporte ágil", desc:"SLA conforme o plano e canais claros de atendimento." },
        ].map(b=>(
          <div key={b.title} className="card p-5">
            <Check className="w-5 h-5 text-[color:var(--c-muted)]"/>
            <div className="font-semibold mt-2">{b.title}</div>
            <p className="muted text-sm mt-1">{b.desc}</p>
          </div>
        ))}
      </section>

      <Footer/>
    </div>
  )
}
