import { ShieldCheck, CreditCard, BarChart3, Users, Newspaper, Globe } from 'lucide-react'
const features = [
  {icon:ShieldCheck, title:'Contratos & Cobranças', desc:'Gestão completa de contratos, carnês, boletos e recorrência, com visão de inadimplência.'},
  {icon:CreditCard, title:'Vendas Online', desc:'Checkout de planos com cálculo automático e políticas de dependentes.'},
  {icon:Newspaper, title:'Obituário Digital', desc:'Memorial com homenagens, flores/velas e captura de leads integrada.'},
  {icon:Users, title:'Área do Associado', desc:'2ª via, pagamentos, extratos e atualização cadastral.'},
  {icon:BarChart3, title:'Analytics', desc:'KPIs, receita, churn e relatórios executivos.'},
  {icon:Globe, title:'Integrações', desc:'APIs Progem Oficial + NaLápide e Clubes de Descontos'}
]
export default function FeatureGrid(){
  return (
    <section id="funcionalidades" className="py-8 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({icon:Icon,title,desc})=> (
            <div key={title} className="card p-6">
              <Icon className="w-6 h-6 text-[color:var(--c-muted)] mb-3"/>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="muted mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
