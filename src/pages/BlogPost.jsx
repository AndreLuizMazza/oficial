// src/pages/BlogPost.jsx
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { setPageSEO } from "@/lib/seo"
import { BFF } from "@/lib/bff"
import { Calendar, Clock, ArrowLeft, Mail, Phone, Check, Info, Sparkles } from "lucide-react"

import ph from "@/assets/blog/placeholder.png"

const FALLBACK = {
  title: "Título do post",
  html: "<p>Este é um exemplo de conteúdo do post. Publique pelo BFF para ver o conteúdo real aqui.</p>",
  date: "2025-07-01",
  readTime: 5,
  cover: ph,
}

const WHATSAPP_E164 = "554699011022"

function formatDate(iso){
  try{
    return new Date(iso+"T00:00:00").toLocaleDateString("pt-BR", {
      day:"2-digit", month:"long", year:"numeric"
    })
  }catch{ return iso }
}

/** Banner inscrição */
function SubscribeBanner({ postTitle }){
  const [email, setEmail] = useState("")
  const [whats, setWhats] = useState("")
  const [status, setStatus] = useState("idle") // idle | loading | ok | error
  const [msg, setMsg] = useState("")

  function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }
  function sanitizePhone(v){ return (v || "").replace(/\D/g,"") }

  async function onSubmit(e){
    e.preventDefault()
    if (!email && !whats){ setStatus("error"); setMsg("Informe e-mail e/ou WhatsApp."); return }
    if (email && !validEmail(email)){ setStatus("error"); setMsg("E-mail inválido."); return }
    const phone = sanitizePhone(whats)
    setStatus("loading"); setMsg("Enviando…")
    try{
      await BFF.newsletterSubscribe({
        email: email || null,
        whatsapp: phone || null,
        source: "blog_post",
        context: { postTitle }
      })
      setStatus("ok"); setMsg("Inscrição realizada! Em breve enviaremos novidades.")
      setEmail(""); setWhats("")
    }catch{
      const linhas = [
        "Olá, quero receber novidades do Blog Progem 👋",
        email ? `Meu e-mail: ${email}` : null,
        phone ? `Meu WhatsApp: ${phone}` : null,
        postTitle ? `Li o post: ${postTitle}` : null,
      ].filter(Boolean)
      const texto = encodeURIComponent(linhas.join("\n"))
      window.open(`https://wa.me/${WHATSAPP_E164}?text=${texto}`, "_blank", "noopener,noreferrer")
      setStatus("idle"); setMsg("")
    }
  }

  return (
    <section className="card p-6 md:p-8 mt-10">
      <div className="flex items-start gap-3">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
          <Sparkles className="w-5 h-5 text-[color:var(--c-muted)]"/>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-semibold">Receba conteúdos como este</h3>
          <p className="muted mt-1 text-sm">
            Enviamos novidades sobre gestão recorrente, whitelabel, memorial digital e analytics.
          </p>

          <form onSubmit={onSubmit} className="mt-4 grid gap-3 md:grid-cols-[1fr,1fr,auto]">
            <label className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--c-muted)]"/>
              <input
                type="email"
                className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-[var(--c-primary)]"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                aria-label="Seu e-mail"
              />
            </label>

            <label className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--c-muted)]"/>
              <input
                className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-[var(--c-primary)]"
                placeholder="WhatsApp (opcional)"
                value={whats}
                onChange={(e)=>setWhats(e.target.value)}
                aria-label="WhatsApp"
              />
            </label>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={status==="loading"}
              aria-live="polite"
            >
              {status==="loading" ? "Enviando…" : "Quero receber"}
            </button>
          </form>

          {status==="ok" && (
            <div className="mt-3 inline-flex items-center gap-2 text-sm text-emerald-500">
              <Check className="w-4 h-4"/>{msg}
            </div>
          )}
          {status==="error" && (
            <div className="mt-3 inline-flex items-center gap-2 text-sm text-amber-500">
              <Info className="w-4 h-4"/>{msg}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default function BlogPost(){
  const { id } = useParams()
  const [post, setPost] = useState(FALLBACK)

  useEffect(()=>{
    (async ()=>{
      try{
        const data = await BFF.blogGet(id) // {title, html, date, readTime, cover, excerpt?}
        if (data && data.title){
          setPost({ ...data, cover: data.cover || ph })
          setPageSEO({ title: `Progem • ${data.title}`, description: data.excerpt || data.subtitle || "" })
          return
        }
      }catch(e){
        console.warn("BFF.blogGet falhou — usando fallback", e)
      }
      setPageSEO({ title:`Progem • ${FALLBACK.title}`, description:"Post do blog Progem" })
    })()
  },[id])

  return (
    <div>


      {post.cover && (
        <div className="w-full h-64 md:h-80 overflow-hidden border-b border-[var(--c-border)] bg-[var(--c-surface)]">
          <img
            src={post.cover}
            alt=""
            className="w-full h-full object-cover"
            onError={(e)=>{ e.currentTarget.src = ph }}
          />
        </div>
      )}

      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm hover:underline">
          <ArrowLeft className="w-4 h-4"/> Voltar ao blog
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-3">{post.title}</h1>

        <div className="mt-2 flex items-center gap-4 text-sm text-[color:var(--c-muted)]">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-4 h-4"/>{formatDate(post.date)}
          </span>
          {post.readTime && (
            <span className="inline-flex items-center gap-1">
              <Clock className="w-4 h-4"/>{post.readTime} min
            </span>
          )}
        </div>

        <article
          className="prose max-w-none mt-6 dark:prose-invert prose-img:rounded-xl prose-headings:scroll-mt-24"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <SubscribeBanner postTitle={post.title} />
      </main>
    </div>
  )
}
