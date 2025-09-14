import { useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { setPageSEO } from '@/lib/seo'

const Code = ({children}) => (
  <pre className="mt-3 rounded-xl border border-[var(--c-border)] p-4 overflow-x-auto text-sm"
       style={{background:'var(--c-surface-2)'}}><code>{children}</code></pre>
)

export default function Developers(){
  useEffect(()=>{
    setPageSEO({ title: 'Progem • Documentação para Desenvolvedores', description:'Integre com as APIs Progem e NaLápide: autenticação, endpoints, webhooks e exemplos.' })
  },[])

  return (
    <div>
      <Header/>
      <main className="mx-auto max-w-7xl px-4 py-12 grid lg:grid-cols-[260px,1fr] gap-8">
        <aside className="hidden lg:block sticky top-24 h-max">
          <nav className="text-sm">
            <div className="mb-3 font-semibold">Conteúdo</div>
            <ul className="space-y-2">
              <li><a href="#introducao" className="hover:underline">Introdução</a></li>
              <li><a href="#auth" className="hover:underline">Autenticação</a></li>
              <li><a href="#progem" className="hover:underline">API Progem</a></li>
              <li><a href="#nalapide" className="hover:underline">API NaLápide</a></li>
              <li><a href="#webhooks" className="hover:underline">Webhooks</a></li>
              <li><a href="#sdk" className="hover:underline">SDK/Helpers</a></li>
            </ul>
          </nav>
        </aside>

        <section className="min-w-0">
          <h1 className="text-3xl font-bold">Documentação para Desenvolvedores</h1>
          <p className="muted mt-2">Integre seus sistemas às APIs do Progem e da NaLápide para automatizar cadastros, planos, obituários e cobranças.</p>
        </section>
      </main>
      <Footer/>
    </div>
  )
}
