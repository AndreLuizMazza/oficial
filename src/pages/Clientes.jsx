import { useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { setPageSEO } from '@/lib/seo'
import { HeartHandshake, Users, Dumbbell, Building2, Landmark } from 'lucide-react'

const segmentos = [
  {
    id: 'assistencia',
    icon: HeartHandshake,
    title: "Planos de Assistência",
    desc: "Gestão completa de planos familiares, assinaturas e cobranças recorrentes.",
    tag: "Público principal"
  },
  {
    id: 'clubes',
    icon: Users,
    title: "Clubes de Associados",
    desc: "Automatize mensalidades e ofereça benefícios contínuos aos membros.",
    tag: "Clubes"
  },
  {
    id: 'academias',
    icon: Dumbbell,
    title: "Academias",
    desc: "Controle planos, renovações e inadimplência com relatórios claros.",
    tag: "Fitness"
  },
  {
    id: 'imobiliarias',
    icon: Building2,
    title: "Imobiliárias",
    desc: "Organize cobranças recorrentes de aluguéis e contratos de serviços.",
    tag: "Real Estate"
  },
  {
    id: 'clubes-entidades',
    icon: Landmark,
    title: "Clubes & Entidades",
    desc: "Soluções flexíveis para clubes sociais, recreativos e similares.",
    tag: "Instituições"
  },
]

const Pill = ({children}) => (
  <span className="badge">{children}</span>
)

export default function Clientes(){
  useEffect(()=>{
    setPageSEO({
      title: 'Progem • Clientes e Segmentos',
      description: 'Plataforma para gestão de contratos e pagamentos recorrentes — de planos de assistência a clubes de benefícios.'
    })
  },[])

  return (
    <div>
      <Header/>
      <main className="mx-auto max-w-7xl px-4 py-12 grid lg:grid-cols-[260px,1fr] gap-8">
        {/* Sidebar com âncoras (igual ao estilo de Developers) */}
        <aside className="hidden lg:block sticky top-24 h-max">
          <nav className="text-sm">
            <div className="mb-3 font-semibold">Segmentos</div>
            <ul className="space-y-2">
              <li><a href="#visao-geral" className="hover:underline">Visão geral</a></li>
              {segmentos.map(s=>(
                <li key={s.id}><a href={`#${s.id}`} className="hover:underline">{s.title}</a></li>
              ))}
              <li><a href="#proxima-etapa" className="hover:underline">Próxima etapa</a></li>
            </ul>
          </nav>
        </aside>

        {/* Conteúdo */}
        <section className="min-w-0">
          {/* Visão geral */}
          <div id="visao-geral" className="mb-8">
            <h1 className="text-3xl font-bold">Clientes que confiam no Progem</h1>
            <p className="muted mt-2 text-lg">
              Atendemos negócios que precisam de <strong>gestão de contratos e pagamentos recorrentes</strong>.
              Nosso ecossistema reduz inadimplência, acelera vendas e eleva a experiência digital.
            </p>
          </div>

          {/* Cards de segmentos */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {segmentos.map(({id, icon:Icon, title, desc, tag})=>(
              <article key={id} id={id} className="card p-6">
                <div className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                    <Icon className="w-6 h-6 text-[color:var(--c-muted)]"/>
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <div className="mt-1"><Pill>{tag}</Pill></div>
                  </div>
                </div>
                <p className="muted mt-4">{desc}</p>
              </article>
            ))}
          </div>

          {/* Chamada final */}
          <div id="proxima-etapa" className="mt-12 card p-8">
            <h2 className="text-2xl font-semibold">Seu setor também pode ser Progem</h2>
            <p className="muted mt-2">
              Se sua operação envolve <strong>assinaturas, mensalidades ou carnês</strong>, nós integramos tudo:
              site, apps, cobranças e analytics — com a identidade da sua marca.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="/contato" className="btn btn-primary">Solicitar Demonstração</a>
              <a href="/developers" className="btn btn-ghost">Ver docs & APIs</a>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  )
}
