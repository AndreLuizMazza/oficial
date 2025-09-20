// src/pages/Clientes.jsx
import { useEffect } from 'react'
import Footer from '@/components/Footer'
import { setPageSEO } from '@/lib/seo'
import { HeartHandshake, Building2, MapPin, Quote, CheckCircle2, CalendarClock, ClipboardList, Wallet, Globe } from 'lucide-react'
import BottomDockCTA from '@/components/BottomDockCTA'

/** ================= Nicho funerário ================= **/
const segmentos = [
  {
    id: 'funerarias',
    icon: Building2,
    title: 'Funerárias',
    desc:
      'Gestão completa de contratos, vendas de planos, carnês/boletos, conciliação e reduções de inadimplência. ' +
      'Integrações com site e apps para acelerar a jornada do cliente.',
    tag: 'Setor funerário'
  },
  {
    id: 'planos-assistencia',
    icon: HeartHandshake,
    title: 'Planos de Assistência Familiar',
    desc:
      'Controle de assinaturas, mensalidades, reajustes e dependentes. Checkout online, 2ª via e pagamentos no App do Associado.',
    tag: 'Assistência familiar'
  },
]

const cases = [
  {
    nome: 'Funerária Bom Jesus',
    cargo: 'Diretoria',
    depo: 'Com o Progem, reduzimos a inadimplência e aceleramos a venda de planos em poucos dias.',
    detalhe: 'Integração de cobranças e área do associado.'
  },
  {
    nome: 'Funerária Patense',
    cargo: 'Gestão',
    depo: 'Os relatórios e automações deram previsibilidade ao financeiro e à cobrança.',
    detalhe: 'Automação de Pix, boleto e cartão.'
  },
  {
    nome: 'Plano São Bento',
    cargo: 'Comercial',
    depo: 'Checkout online e app impulsionaram novas adesões com auditoria simples.',
    detalhe: 'Onboarding em 7 dias com multiunidades.'
  },
]

const steps7dias = [
  { icon: ClipboardList, title: 'Dia 1 — Kickoff & escopo', desc: 'Reunião de alinhamento, coleta de logotipos, cores e dados do negócio.' },
  { icon: Globe,         title: 'Dia 2 — Site & identidade', desc: 'Configuração do site whitelabel e páginas essenciais (Home, Planos, Contato).' },
  { icon: Wallet,        title: 'Dia 3 — Cobranças', desc: 'Integração dos meios de pagamento (Pix, boleto, cartão) e conciliação.' },
  { icon: CalendarClock, title: 'Dia 4 — Regras & planos', desc: 'Parametrização de planos, dependentes, reajustes e fluxos de vendas.' },
  { icon: CheckCircle2,  title: 'Dia 5 — Testes guiados', desc: 'Roteiro de ponta a ponta: simulação de venda, cobrança e 2ª via.' },
  { icon: Building2,     title: 'Dia 6 — Multiunidades', desc: 'Ajustes por filial, acessos de equipe e permissões.' },
  { icon: HeartHandshake,title: 'Dia 7 — Go-live & treinamento', desc: 'Publicação, treinamento do time e acompanhamento inicial.' },
]

const Pill = ({ children }) => <span className="badge">{children}</span>

export default function Clientes() {
  useEffect(() => {
    setPageSEO({
      title: 'Progem • Clientes do Setor Funerário',
      description:
        'Progem é a plataforma para funerárias e empresas de planos de assistência familiar — gestão de contratos, assinaturas e cobranças recorrentes. Presente em 24 estados do Brasil.'
    })
  }, [])

  return (
    <div>
      <main className="mx-auto max-w-7xl px-4 py-12 grid lg:grid-cols-[260px,1fr] gap-8">
        {/* Sidebar com âncoras */}
        <aside className="hidden lg:block sticky top-24 h-max">
          <nav className="text-sm">
            <div className="mb-3 font-semibold">Setor funerário</div>
            <ul className="space-y-2">
              <li><a href="#visao-geral" className="hover:underline">Visão geral</a></li>
              {segmentos.map(s => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="hover:underline">{s.title}</a>
                </li>
              ))}
              <li><a href="#alcance" className="hover:underline">Alcance</a></li>
              <li><a href="#cases" className="hover:underline">Cases</a></li>
              <li><a href="#onboarding-7-dias" className="hover:underline">Como começamos em 7 dias</a></li>
              <li><a href="#proxima-etapa" className="hover:underline">Próxima etapa</a></li>
            </ul>
          </nav>
        </aside>

        {/* Conteúdo */}
        <section className="min-w-0">
          {/* Visão geral */}
          <div id="visao-geral" className="mb-8">
            <h1 className="text-3xl font-bold">Feito para o mercado funerário</h1>
            <p className="muted mt-2 text-lg">
              O Progem atende <strong>funerárias</strong> e <strong>empresas de planos de assistência familiar</strong>,
              unificando <strong>contratos, assinaturas e cobranças recorrentes</strong> com uma experiência digital moderna.
            </p>

            {/* Destaque de presença nacional */}
            <div className="mt-6 card p-5 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                <MapPin className="w-5 h-5 text-[color:var(--c-muted)]" />
              </span>
              <div>
                <div className="text-sm uppercase tracking-wide text-[color:var(--c-muted)]">Alcance</div>
                <div className="font-medium">Atuação em <strong>24 estados do Brasil</strong></div>
              </div>
            </div>
          </div>

          {/* Cards de segmentos */}
          <div className="grid gap-6 md:grid-cols-2">
            {segmentos.map(({ id, icon: Icon, title, desc, tag }) => (
              <article key={id} id={id} className="card p-6">
                <div className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                    <Icon className="w-6 h-6 text-[color:var(--c-muted)]" />
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

          {/* Alcance / Prova social leve */}
          <div id="alcance" className="mt-12 card p-8">
            <h2 className="text-2xl font-semibold">Por que o Progem para funerárias?</h2>
            <ul className="mt-4 grid gap-3 text-[color:var(--c-muted)]">
              <li>• Redução de inadimplência com automações de cobrança (Pix, boleto, cartão).</li>
              <li>• Vendas mais rápidas: site e apps integrados ao seu backoffice.</li>
              <li>• Área do associado para 2ª via, pagamentos e atualização cadastral.</li>
              <li>• Pronto para crescer: multiunidades, multiusuários e relatórios gerenciais.</li>
            </ul>
          </div>

          {/* === CASES (Depoimentos) === */}
          <div id="cases" className="mt-12">
            <h2 className="text-2xl font-semibold">Cases</h2>
            <p className="muted mt-2">Resultados reais de clientes do setor funerário utilizando o Progem.</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {cases.map((c, i) => (
                <article key={i} className="card p-6">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                      <Quote className="w-5 h-5 text-[color:var(--c-muted)]" />
                    </span>
                    <div>
                      <h3 className="font-semibold">{c.nome}</h3>
                      <div className="text-sm text-[color:var(--c-muted)]">{c.cargo}</div>
                    </div>
                  </div>
                  <p className="mt-4">“{c.depo}”</p>
                  <div className="mt-3 text-sm text-[color:var(--c-muted)]">{c.detalhe}</div>
                </article>
              ))}
            </div>
          </div>

          {/* === Onboarding em 7 dias === */}
          <div id="onboarding-7-dias" className="mt-12 card p-8">
            <h2 className="text-2xl font-semibold">Como começamos em 7 dias</h2>
            <p className="muted mt-2">Um roteiro simples para colocar sua operação no ar com segurança e velocidade.</p>
            <ol className="mt-6 grid gap-4">
              {steps7dias.map(({ icon: Icon, title, desc }, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                    <Icon className="w-5 h-5 text-[color:var(--c-muted)]" />
                  </span>
                  <div>
                    <div className="font-medium">{title}</div>
                    <div className="text-[color:var(--c-muted)]">{desc}</div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="badge">Implantação guiada</span>
              <span className="badge">Treinamento da equipe</span>
              <span className="badge">Suporte próximo</span>
            </div>
          </div>

          {/* CTA principal */}
          <div id="proxima-etapa" className="mt-12 card p-8">
            <h2 className="text-2xl font-semibold">Vamos profissionalizar sua operação</h2>
            <p className="muted mt-2">
              Mostramos como <strong>funerárias</strong> e <strong>planos de assistência</strong> têm escalado
              suas receitas usando o Progem em 24 estados.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="/demo" data-cta="demo" className="btn btn-primary btn-demo">
                Solicitar Demonstração
              </a>
              <a href="/planos" className="btn btn-ghost">Ver planos</a>
            </div>
          </div>
        </section>
      </main>

      {/* CTA fixo (mobile) */}
      <BottomDockCTA />

      <Footer />
    </div>
  )
}
