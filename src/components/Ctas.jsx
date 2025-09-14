import { Link } from "react-router-dom"
import { Sparkles } from "lucide-react"

export default function Ctas(){
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)]">
            <Sparkles className="w-4 h-4 text-[color:var(--c-muted)]"/> Experimente com um tour guiado
          </div>
          <h3 className="text-2xl font-semibold mt-3">Veja o Progem funcionando na sua realidade</h3>
          <p className="muted mt-1">Contratos, cobrança recorrente, memorial digital e apps whitelabel.</p>
        </div>
        <div className="flex gap-3">
          {/* 👇 CTA principal para /contrato */}
          <Link to="/contrato" className="btn btn-primary">Solicitar Demonstração</Link>
        </div>
      </div>
    </section>
  )
}
