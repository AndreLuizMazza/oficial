// src/components/Solutions.jsx
import { Link } from "react-router-dom"
import {
  CreditCard, Globe, Smartphone, Handshake, Wand2, BarChart3,
  MessageCircle, Database, PawPrint
} from "lucide-react"
import CardMotion from "@/components/CardMotion"

const items = [
  {
    id:'gestao', icon: CreditCard,
    title: "Software Web de Gestão",
    subtitle: "Contratos e pagamentos recorrentes",
    desc: "Gestão completa de assinaturas, carnês/boletos, conciliação, inadimplência e cobranças.",
    tag: "SaaS"
  },
  {
    id:'site', icon: Globe,
    title: "Site Premium",
    subtitle: "Whitelabel",
    desc: "Website institucional premium com SEO, domínio próprio e identidade da sua marca.",
    tag: "Whitelabel"
  },
  {
    id:'app-associado', icon: Smartphone,
    title: "Aplicativo do Associado",
    subtitle: "Whitelabel (iOS/Android)",
    desc: "2ª via, pagamentos, extratos, notificações e carteirinha digital • com sua identidade.",
    tag: "Whitelabel"
  },
  {
    id:'clube', icon: Handshake,
    title: "Clubes de Benefícios",
    subtitle: "Parcerias & descontos",
    desc: "Monte rede local de parceiros ou conecte plataformas de descontos para fidelizar.",
    tag: "Fidelização"
  },
  {
    id:'analytics', icon: BarChart3,
    title: "Analytics",
    subtitle: "Indicadores e relatórios",
    desc: "KPIs em tempo real, inadimplência, vendas e relatórios para decisões rápidas.",
    tag: "Gestão"
  },
  {
    id:'custom', icon: Wand2,
    title: "Personalizações",
    subtitle: "Tiles, temas e integrações",
    desc: "Telas e integrações sob medida. SDK e componentes para acelerar seu go-to-market.",
    tag: "Sob medida"
  },
  // ✅ Novos
  {
    id:'zap', icon: MessageCircle,
    title: "WhatsApp (Automação)",
    subtitle: "Campanhas & fluxos",
    desc: "Modelos aprovados, disparo por filtros (inadimplentes, aniversários etc.) e métricas.",
    tag: "Add-on"
  },
  {
    id:'pet', icon: PawPrint,
    title: "Gestão de Planos Pet",
    subtitle: "Híbridos e exclusivos",
    desc: "Inclua pets no plano família ou crie planos exclusivos com carteirinha e benefícios.",
    tag: "Novidade"
  },
  {
    id:'migracao', icon: Database,
    title: "Migração de Dados",
    subtitle: "Onboarding assistido",
    desc: "Importe clientes, contratos, boletos/carnês e histórico com time especialista.",
    tag: "Setup"
  },
]

// mapeia para rotas internas
function getCtaLink(id){
  switch(id){
    case "gestao": return "/gestao-web"
    case "site": return "/site-premium"
    case "app-associado": return "/app-associado"
    case "clube": return "/clube"
    case "analytics": return "/funcionalidades#analytics"
    case "custom": return "/solucoes#custom"
    case "zap": return "/zap"
    case "pet": return "/pet"
    case "migracao": return "/migracao"
    default: return "/contato"
  }
}

export default function Solutions(){
  return (
    <section id="solucoes" className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
            Soluções do ecossistema Progem
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold mt-3">  Tudo que você precisa, do software de gestão ao site e app</h2>
          <p className="muted mt-2">
            Gestão recorrente no centro, com whitelabel, automações e integrações para sua operação.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map(({id,icon:Icon, title, subtitle, desc, tag}) => (
            <CardMotion key={id} className="card p-6 focus-within:ring-2 focus-within:ring-[var(--c-primary)]" tabIndex={-1} id={id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                    <Icon className="w-5 h-5 text-[color:var(--c-muted)]" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <div className="text-sm text-[color:var(--c-muted)]">{subtitle}</div>
                  </div>
                </div>
                <span className="badge">{tag}</span>
              </div>

              <p className="mt-4 muted">{desc}</p>

              <div className="mt-5">
                <Link
                  to={getCtaLink(id)}
                 className="btn btn-primary"
                  aria-label={`Abrir detalhes de ${title}`}
                >
                  Quero saber mais
                </Link>
              </div>
            </CardMotion>
          ))}
        </div>

        {/* banner discreto para migração (reforço) */}
        <div className="mt-8 p-4 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)]">
          Precisa trazer seus dados atuais? Veja nossa <Link to="/migracao" className="link">Migração de Dados</Link> com onboarding assistido.
        </div>
      </div>
    </section>
  )
}
