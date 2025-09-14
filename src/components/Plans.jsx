import clsx from "clsx"
import { Link } from "react-router-dom"

function formatBRL(v){
  try{
    return Number(v).toLocaleString("pt-BR", { style:"currency", currency:"BRL" })
  }catch{
    return `R$ ${Number(v).toFixed(2)}`
  }
}

export default function Plans({ items = [] }){
  const normalized = (items || []).map(p => ({
    id: p.id,
    name: p.nome || p.name || "Plano",
    price: p.valor_unitario ?? p.price ?? null,
    features: p.recursos || p.features || [
      "Gestão de contratos e assinaturas",
      "Cobrança recorrente (boletos/carnês)",
      "Suporte e acesso ao portal"
    ],
    highlight: Boolean(p.destaque)
  }))

  return (
    <section id="planos" className="py-8 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Planos</h2>
            <p className="muted">Escolha a melhor solução para o seu negócio.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {normalized.map((pl, idx) => (
            <div
              key={pl.id || idx}
              className={clsx(
                "card p-6 flex flex-col",
                pl.highlight && "ring-2 ring-[var(--c-primary)]"
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{pl.name}</h3>
                {pl.highlight && <span className="badge">Recomendado</span>}
              </div>

              <div className="mt-3">
                {pl.price
                  ? (
                    <div className="text-3xl font-bold">
                      {formatBRL(pl.price)}
                      <span className="text-sm font-medium muted"> /mês</span>
                    </div>
                  )
                  : <div className="text-xl font-semibold">Sob consulta</div>
                }
              </div>

              <ul className="mt-4 space-y-2 text-sm">
                {(pl.features || []).map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-[6px] inline-block w-1.5 h-1.5 rounded-full bg-[var(--c-primary)]"></span>
                    <span className="muted">{f}</span>
                  </li>
                ))}
              </ul>

              {/* ✅ Chamada ajustada para /contrato */}
              <Link to="/contrato" className="btn btn-primary mt-6 w-full text-center" aria-label="Solicitar demonstração">
                Solicitar Demonstração
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
