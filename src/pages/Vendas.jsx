// src/pages/Vendas.jsx
import { Link, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { setPageSEO } from "@/lib/seo"
import PrivateGate from "@/components/PrivateGate"
import { Calculator, Link2, FileText, Lock, ShieldCheck } from "lucide-react"

export default function Vendas(){
  const navigate = useNavigate()

  useEffect(() => {
    setPageSEO({
      title: "Progem • Central de Vendas",
      description: "Hub interno de vendas: simulador, materiais e atalhos.",
      noindex: true,
      canonical: "https://progem.com.br/planos"
    })
  }, [])

  return (
    <PrivateGate>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold">Central de Vendas</h1>
        <p className="muted mt-2">Acesso rápido ao simulador, materiais e links internos.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <button
            onClick={()=>navigate('/planos/simulador')}
            className="card p-4 text-left hover:ring-2 ring-[var(--c-primary)] transition"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                <Calculator className="w-5 h-5 text-[color:var(--c-muted)]" />
              </span>
              <div>
                <div className="font-semibold">Abrir Simulador</div>
                <div className="muted text-sm">/planos/simulador</div>
              </div>
            </div>
          </button>

          <a
            href="https://progem.com.br/material/comercial.pdf"
            target="_blank"
            rel="noreferrer"
            className="card p-4 hover:ring-2 ring-[var(--c-primary)] transition"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                <FileText className="w-5 h-5 text-[color:var(--c-muted)]" />
              </span>
              <div>
                <div className="font-semibold">Material Comercial</div>
                <div className="muted text-sm">apresentações, one-pagers, etc.</div>
              </div>
            </div>
          </a>

          <Link
            to="/planos?sim=1"
            className="card p-4 hover:ring-2 ring-[var(--c-primary)] transition"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                <Link2 className="w-5 h-5 text-[color:var(--c-muted)]" />
              </span>
              <div>
                <div className="font-semibold">Atalho público → Simulador</div>
                <div className="muted text-sm">/planos?sim=1 (redireciona)</div>
              </div>
            </div>
          </Link>

          <div className="card p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                <Lock className="w-5 h-5 text-[color:var(--c-muted)]" />
              </span>
              <div>
                <div className="font-semibold">Proteção</div>
                <div className="muted text-sm">Rota noindex + passphrase no PrivateGate</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                <ShieldCheck className="w-5 h-5 text-[color:var(--c-muted)]" />
              </span>
              <div>
                <div className="font-semibold">Como abrir rápido</div>
                <div className="muted text-sm">Ctrl + Shift + S em qualquer página</div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-[color:var(--c-muted)] mt-6">
          Dica: compartilhe internamente o link direto <code>/planos/simulador</code> ou <code>/vendas</code>.
        </p>
      </div>
    </PrivateGate>
  )
}
