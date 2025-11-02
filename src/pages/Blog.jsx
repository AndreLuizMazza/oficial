// src/pages/Blog.jsx
import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { setPageSEO } from "@/lib/seo"
import { BFF } from "@/lib/bff"
import { Search, Tag, Calendar, Clock, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"

// importa o placeholder direto do src
import ph from "@/assets/blog/placeholder.png"

const FALLBACK_POSTS = [
  {
    id: "operacao-recorrente",
    title: "Operação recorrente sem fricção: do contrato ao recebimento",
    excerpt: "Como organizar contratos, carnês/boletos e conciliação para reduzir inadimplência.",
    cover: ph,
    date: "2025-08-10",
    readTime: 6,
    category: "Gestão Recorrente",
    tags: ["Contratos", "Inadimplência", "Conciliação"],
  },
  {
    id: "whitelabel-experiencias",
    title: "Whitelabel que converte: Site Premium e App do Associado",
    excerpt: "Identidade visual, SEO e autoatendimento para elevar percepção de valor.",
    cover: ph,
    date: "2025-07-22",
    readTime: 5,
    category: "Whitelabel",
    tags: ["SEO", "Mobile", "Experiência"],
  },
  {
    id: "memorial-digital",
    title: "Memorial Digital integrado: respeito, alcance e novos leads",
    excerpt: "Fluxo de publicação, aprovação e captação de leads conectado ao Progem.",
    cover: ph,
    date: "2025-06-28",
    readTime: 7,
    category: "Memorial Digital",
    tags: ["Leads", "Conteúdo", "Integração"],
  },
  {
    id: "analytics-kpis",
    title: "Analytics & KPIs para recorrência: o painel que importa",
    excerpt: "Indicadores práticos para gestão: inadimplência, MRR e crescimento.",
    cover: ph,
    date: "2025-05-30",
    readTime: 4,
    category: "Analytics",
    tags: ["KPIs", "MRR", "Relatórios"],
  },
]

function formatDate(iso){
  try{
    return new Date(iso+"T00:00:00").toLocaleDateString("pt-BR", { day:"2-digit", month:"short", year:"numeric" })
  }catch{ return iso }
}

export default function Blog(){
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState(FALLBACK_POSTS)
  const [q, setQ] = useState(searchParams.get("q") ?? "")
  const [cat, setCat] = useState(searchParams.get("cat") ?? "todas")
  const [page, setPage] = useState(Number(searchParams.get("p") || 1))
  const pageSize = 6

  useEffect(()=>{
    setPageSEO({
      title: "Progem • Blog",
      description: "Conteúdos sobre gestão recorrente, whitelabel, memorial digital, analytics e integrações."
    })
  },[])

  // tenta carregar do BFF; se falhar, mantém fallback
  useEffect(()=>{
    (async ()=>{
      try{
        const data = await BFF.blogList() 
        if (Array.isArray(data) && data.length){
          setPosts(data)
        }
      }catch(e){
        console.warn("BFF.blogList falhou — usando fallback", e)
      }
    })()
  },[])

  const categories = useMemo(()=>{
    const set = new Set(posts.map(p=>p.category).filter(Boolean))
    return ["todas", ...Array.from(set)]
  },[posts])

  const filtered = useMemo(()=>{
    const qlc = q.trim().toLowerCase()
    return posts.filter(p=>{
      const okCat = (cat==="todas") || (p.category===cat)
      const okQ = !qlc || [p.title, p.excerpt, ...(p.tags||[])].join(" ").toLowerCase().includes(qlc)
      return okCat && okQ
    })
  },[posts, q, cat])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = Math.min(page, totalPages)
  const slice = filtered.slice((current-1)*pageSize, current*pageSize)

  useEffect(()=>{
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (cat && cat!=="todas") params.set("cat", cat)
    if (current>1) params.set("p", String(current))
    setSearchParams(params, { replace:true })
  },[q, cat, current, setSearchParams])

  function changePage(dir){
    const next = Math.min(Math.max(1, current + dir), totalPages)
    setPage(next)
  }

  return (
    <div>
  

      {/* Hero */}
      <section className="border-b border-[var(--c-border)] bg-[var(--c-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
              <Sparkles className="w-4 h-4 text-[color:var(--c-muted)]"/>
              Insights sobre gestão recorrente
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">Blog Progem</h1>
            <p className="muted mt-3 text-lg">
              Boas práticas, guias e novidades sobre contratos recorrentes, whitelabel, memorial, analytics e integrações.
            </p>
          </div>
        </div>
      </section>

      {/* Filtro & Lista */}
      <main className="mx-auto max-w-7xl px-4 py-10">
        {/* Barra de filtro */}
        <div className="card p-4 md:p-5 mb-8 grid md:grid-cols-[1fr,260px] gap-3">
          <label className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--c-muted)]" />
            <input
              className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-[var(--c-primary)]"
              placeholder="Buscar por título, tag ou assunto…"
              value={q}
              onChange={e=>{ setQ(e.target.value); setPage(1) }}
            />
          </label>
          <label className="relative">
            <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--c-muted)]" />
            <select
              className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] pl-9 pr-8 py-2 outline-none focus:ring-2 focus:ring-[var(--c-primary)]"
              value={cat}
              onChange={e=>{ setCat(e.target.value); setPage(1) }}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>

        {/* Grid de cards */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {slice.map(post=>{
            const cover = post.cover || ph
            return (
              <article key={post.id} className="card overflow-hidden flex flex-col">
                <Link to={`/blog/${post.id}`} className="block">
                  <img
                    src={cover}
                    alt=""
                    className="w-full h-44 object-cover"
                    loading="lazy"
                    onError={(e)=>{ e.currentTarget.src = ph }}
                  />
                </Link>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-xs uppercase tracking-wide text-[color:var(--c-muted)]">{post.category}</div>
                  <Link to={`/blog/${post.id}`} className="mt-1 font-semibold text-lg leading-snug line-clamp-2 hover:underline">
                    {post.title}
                  </Link>
                  <p className="muted text-sm mt-2 line-clamp-3">{post.excerpt}</p>

                  <div className="mt-auto pt-4 flex items-center justify-between text-xs text-[color:var(--c-muted)]">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-4 h-4"/>{formatDate(post.date)}
                    </span>
                    {post.readTime && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-4 h-4"/>{post.readTime} min
                      </span>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </section>

        {/* Paginação */}
        {totalPages>1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button className="btn btn-ghost btn-sm" onClick={()=>changePage(-1)} disabled={current===1}>
              <ChevronLeft className="w-4 h-4"/> Anterior
            </button>
            <div className="text-sm muted">Página {current} de {totalPages}</div>
            <button className="btn btn-ghost btn-sm" onClick={()=>changePage(1)} disabled={current===totalPages}>
              Próxima <ChevronRight className="w-4 h-4"/>
            </button>
          </div>
        )}
      </main>

    </div>
  )
}
