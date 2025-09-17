import { Link } from "react-router-dom"
import { CreditCard, Globe, Smartphone, Handshake, Wand2, BarChart3 } from "lucide-react"
import CardMotion from "@/components/CardMotion"

const items = [
  {
    id:'gestao', icon: CreditCard,
    title: "Software Web de Gestão",
    subtitle: "Contratos e pagamentos recorrentes",
    desc: "Gestão completa de assinaturas de planos, boletos, carnês e recorrência, com inadimplência e cobranças.",
    tag: "SaaS"
  },
  {
    id:'site', icon: Globe,
    title: "Site Premium",
    subtitle: "Whitelabel",
    desc: "Website institucional premium preparado para SEO, domínio próprio e identidade visual do seu negócio.",
    tag: "Whitelabel"
  },
  {
    id:'app-associado', icon: Smartphone,
    title: "Aplicativo do Associado",
    subtitle: "Whitelabel",
    desc: "2ª via, pagamentos, extratos e atualização cadastral. Sua marca, seus ícones e cores.",
    tag: "Whitelabel"
  },
  {
    id:'clubes', icon: Handshake,
    title: "Clubes de Benefícios",
    subtitle: "Rede de parceiros & descontos",
    desc: "Crie sua rede de parceiros locais ou integre com plataformas de clubes de descontos para dar valor contínuo ao associado.",
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
    subtitle: "Whitelabels",
    desc: "Temas, telas e integrações sob medida. SDK e componentes para acelerar o go-to-market.",
    tag: "Sob medida"
  }
]

// mapeia para rotas internas
function getCtaLink(id){
  switch(id){
    case "gestao": return "/gestao-web"
    case "site": return "/site-premium"
    case "app-associado": return "/app-associado"
    // ajuste aqui se criar outras páginas específicas:
    // case "analytics": return "/analytics"
    // case "clubes": return "/clubes"
    default: return "/contato"
  }
}

export default function Solutions(){
  return (
    <section id="solucoes" className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold">Soluções Progem</h2>
          <p className="muted mt-2">Tudo que você precisa — do site ao app do associado — com gestão recorrente no centro.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map(({id,icon:Icon, title, subtitle, desc, tag}) => (
            <CardMotion key={id} className="card p-6" tabIndex={0} id={id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--c-border)]">
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
                <Link to={getCtaLink(id)} className="btn btn-primary">Quero saber mais</Link>
              </div>
            </CardMotion>
          ))}
        </div>
      </div>
    </section>
  )
}
